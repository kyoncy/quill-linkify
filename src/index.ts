import Quill from 'quill';
import Delta from 'quill-delta';

import { MailType, PhoneNumberType, UrlType } from './linkTypes';
import { QuillLinkify } from './quillLinkify';

export class Linkify {
  quill: Quill;

  quillLinkify: QuillLinkify;

  constructor(quill: Quill) {
    this.quill = quill;
    this.quillLinkify = new QuillLinkify([
      new UrlType(),
      new MailType(),
      new PhoneNumberType()
    ]);
    this.pasteListener();
    this.typeListener();
  }

  pasteListener(): void {
    this.quill.clipboard.addMatcher(Node.TEXT_NODE, (node: Text, delta) => {
      if (typeof node.data !== 'string') return delta;
      const text = node.data;
      const newDelta = this.quillLinkify.searchLink(new Delta(), text);

      if (newDelta.ops.length !== 0) {
        delta.ops = newDelta.ops;
      }
      return delta;
    });
  }

  typeListener(): void {
    this.quill.on('text-change', delta => {
      const { ops } = delta;
      if (!ops || ops.length < 1 || ops.length > 2) return;

      const lastOp = ops[ops.length - 1];
      if (
        !lastOp.insert ||
        typeof lastOp.insert !== 'string' ||
        !lastOp.insert.match(/\s/)
      ) {
        return;
      }

      this.quillLinkify.linkifyCurrentLine(this.quill);
    });
  }
}
