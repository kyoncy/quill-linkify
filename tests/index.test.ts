import Quill from "quill";
import Delta from "quill-delta";
import { Linkify } from "../src/index";

describe("Linkify", () => {
  describe("PasteListener", () => {
    let matcherCallback: (node: Text, delta: Delta) => Delta;

    beforeEach(() => {
      const quillMock = {
        clipboard: {
          addMatcher: (_nodeType: string | number, callback: (node: Text, delta: Delta) => Delta) => {
            matcherCallback = callback;
          }
        },
        on: () => {},
        getSelection: () => {},
        getLeaf: () => {},
        getIndex: () => {},
        updateContents: () => {},
      } as unknown as Quill;

      new Linkify(quillMock);
    });

    test('should not alter plain text', () => {
      const text = "text"
      const node = new Text(text);
      const delta = new Delta({ ops: [{ insert: text }] });

      expect(matcherCallback(node, delta)).toEqual({
        ops: [{ insert: 'text' }],
      })
    })

    test('should ignore newline', () => {
      const node = new Text();
      const delta = new Delta({ ops: [] });

      expect(matcherCallback(node, delta)).toEqual({ ops: [] })
    })

    test('should parse email', () => {
      const text = 'Hello hello@example.com';
      const node = new Text(text);
      const delta = new Delta({ ops: [{ insert: text }] });

      expect(matcherCallback(node, delta)).toEqual({
        ops: [
          { insert: 'Hello ' },
          {
            insert: 'hello@example.com',
            attributes: { link: 'mailto:hello@example.com' },
          },
        ],
      })
    })

    test('should parse url', () => {
      const text = 'Hello http://example.com';
      const node = new Text(text);
      const delta = new Delta({ ops: [{ insert: text }] });

      expect(matcherCallback(node, delta)).toEqual({
        ops: [
          { insert: 'Hello ' },
          {
            insert: 'http://example.com',
            attributes: { link: 'http://example.com' },
          },
        ],
      })
    })

    test('should parse phone-number', () => {
      const text = 'Hello 090-1234-5678';
      const node = new Text(text);
      const delta = new Delta({ ops: [{ insert: text }] });

      expect(matcherCallback(node, delta)).toEqual({
        ops: [
          { insert: 'Hello ' },
          {
            insert: '090-1234-5678',
            attributes: { link: 'tel:090-1234-5678' },
          },
        ],
      })
    })

    test('should parse multiple urls', () => {
      const text = 'Hello https://example.com world http://google.com !';
      const node = new Text(text);
      const delta = new Delta({ ops: [{ insert: text }] });

      expect(matcherCallback(node, delta)).toEqual({
        ops: [
          { insert: 'Hello ' },
          {
            insert: 'https://example.com',
            attributes: { link: 'https://example.com' },
          },
          { insert: ' world ' },
          {
            insert: 'http://google.com',
            attributes: { link: 'http://google.com' },
          },
          { insert: ' !' },
        ],
      })
    })

    test('should parse url and mail and phone number', () => {
      const text = ' https://example.com hoge@example.com 090-1234-5678 ';
      const node = new Text(text);
      const delta = new Delta({ ops: [{ insert: text }] });

      expect(matcherCallback(node, delta)).toEqual({
        ops: [
          { insert: ' ' },
          {
            insert: 'https://example.com',
            attributes: { link: 'https://example.com' },
          },
          { insert: ' ' },
          {
            insert: 'hoge@example.com',
            attributes: { link: 'mailto:hoge@example.com' },
          },
          { insert: ' ' },
          {
            insert: '090-1234-5678',
            attributes: { link: 'tel:090-1234-5678' },
          },
          { insert: ' ' }
        ],
      })
    })
  })
})
