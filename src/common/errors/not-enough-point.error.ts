export class NotEnoughPointError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotEnoughPointError';
  }
}
