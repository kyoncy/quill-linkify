import Quill from 'quill';
import Delta from 'quill-delta';

import { AbstractType } from './linkTypes/AbstractType';

export class QuillLinkify {
  typeList: AbstractType[];

  constructor(typeList: AbstractType[]) {
    this.typeList = typeList;
  }

  searchLink(delta: Delta, text: string): Delta {
    let isMatchedOnce: boolean = false;
    this.typeList.forEach(type => {
      const matches = text.match(type.regexp) as RegExpMatchArray | null;
      if (!isMatchedOnce && matches && matches.length > 0) {
        isMatchedOnce = true;
        const match = matches[0];
        const split = text.split(match);

        const beforeLink = split.shift();
        if (beforeLink && beforeLink !== "") {
          this.searchLink(delta, beforeLink);
        }
        delta.insert(match, { link: type.normalize(match) });
        const afterLink = split.join(match);
        if (afterLink !== "") {
          this.searchLink(delta, afterLink);
        }
      }
    });
    if (!isMatchedOnce && text !== "\n") delta.insert(text)
    return delta;
  }

  linkifyCurrentLine(quill: Quill): void {
    const sel = quill.getSelection();
    if (!sel) return;

    const [leaf] = quill.getLeaf(sel.index);
    if (!leaf.text || leaf.parent.domNode.localName === 'a') return;
    const leafIndex = quill.getIndex(leaf);

    this.typeList.forEach(type => {
      const match = (leaf.text as string).match(type.regexp);
      if (match && match.index !== undefined) {
        const delta = new Delta()
          .retain(leafIndex + match.index)
          .retain(match[0].length, { link: type.normalize(match[0]) });
        quill.updateContents(delta);
      }
    });
  }
}
