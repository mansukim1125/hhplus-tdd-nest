export class NegativePointError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NegativePointError';
  }
}
