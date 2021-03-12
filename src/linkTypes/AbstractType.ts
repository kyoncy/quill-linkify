export abstract class AbstractType {
  regexp: RegExp;

  constructor(regexp: RegExp) {
    this.regexp = regexp;
  }

  abstract normalize(text: string): string;
}
