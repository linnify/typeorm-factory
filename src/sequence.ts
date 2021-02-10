import { SequenceFn } from './types';

export class Sequence {
  fn: SequenceFn;

  private currentIndex: number;

  constructor(fn: SequenceFn) {
    this.currentIndex = 0;
    this.fn = fn;
  }

  get nextValue() {
    const value = this.fn(this.currentIndex);
    this.currentIndex++;

    return value;
  }
}
