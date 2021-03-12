import { AbstractType } from './AbstractType';

export const MailRegularExpression = /([\w-\.]+@[\w-\.]+\.[\w-\.]+)/i;

export class MailType extends AbstractType {
  constructor(regexp?: RegExp) {
    super(regexp || MailRegularExpression);
  }

  normalize = (text: string): string => `mailto:${text}`;
}
