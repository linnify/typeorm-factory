import { FactoryClass } from './types';
import { Factory } from './factory';

export class SubFactory<T> {
  factory: Factory<T>;

  constructor(factory: FactoryClass<T>) {
    this.factory = new factory();
  }
}
