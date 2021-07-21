import Quill from 'quill';
import Delta from 'quill-delta';

import { MailType, PhoneNumberType, UrlType } from './linkTypes';
import { AbstractType } from './linkTypes/AbstractType';
import { QuillLinkify } from './quillLinkify';

export type Options = {
  url?: RegExp | boolean;
  mail?: RegExp | boolean;
  phoneNumber?: RegExp | boolean;
};

export class Linkify {
  quill: Quill;

  quillLinkify: QuillLinkify;

  constructor(quill: Quill, options: Options) {
    const typeList: AbstractType[] = [];

    if (!Object.keys(options).length) {
      typeList.push(new UrlType(true))
      typeList.push(new MailType(true))
      typeList.push(new PhoneNumberType(true))
    } else if (options) {
      options.url && typeList.push(new UrlType(options.url))
      options.mail && typeList.push(new MailType(options.mail))
      options.phoneNumber && typeList.push(new PhoneNumberType(options.phoneNumber))
    }

    this.quill = quill;
    this.quillLinkify = new QuillLinkify(typeList)
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
