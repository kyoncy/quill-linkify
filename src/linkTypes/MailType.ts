import { AbstractType } from './AbstractType';

export const MailRegularExpression = /([\w-\.]+@[\w-\.]+\.[\w-\.]+)/i;

export class MailType extends AbstractType {
  constructor(regexp: RegExp | true) {
    super(regexp === true ? MailRegularExpression : regexp);
  }

  normalize = (text: string): string => `mailto:${text}`;
}
