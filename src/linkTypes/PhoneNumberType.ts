import { AbstractType } from './AbstractType';

export const PhoneNumberRegularExpression = /(((0(\d{1}[-(]?\d{4}|\d{2}[-(]?\d{3}|\d{3}[-(]?\d{2}|\d{4}[-(]?\d{1}|[5789]0[-(]?\d{4})[-)]?)|\d{1,4}-?)\d{4}|0120[-(]?\d{3}[-)]?\d{3})/i;

export class PhoneNumberType extends AbstractType {
  constructor(regexp: RegExp | true) {
    super(regexp === true ? PhoneNumberRegularExpression : regexp);
  }

  normalize = (text: string): string => `tel:${text}`;
}
