import { FactoryClass } from './types';
import { Factory } from './factory';

export class SubFactory<T> {
  factory: Factory<T>;
  values: Partial<T> | undefined;

  constructor(factory: FactoryClass<T>, values?: Partial<T>) {
    this.factory = new factory();
    this.values = values;
  }
}
