import { AbstractType } from './AbstractType';

export const UrlRegularExpression = /(https?:\/\/|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?/i;

export class UrlType extends AbstractType {
  constructor(regexp?: RegExp) {
    super(regexp || UrlRegularExpression);
  }

  normalize = (text: string): string => text;
}
