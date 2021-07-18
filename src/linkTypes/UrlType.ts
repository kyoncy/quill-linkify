import { AbstractType } from './AbstractType';

export const UrlRegularExpression = /(https?:\/\/|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?/i;

export class UrlType extends AbstractType {
  constructor(regexp: RegExp | true) {
    super(regexp === true ? UrlRegularExpression : regexp);
  }

  normalize = (text: string): string => text;
}
