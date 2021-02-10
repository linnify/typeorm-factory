import { Factory } from './factory';

export type FactoryClass<T> = new (...args: any[]) => Factory<T>;
export type Constructable<T> = new () => T;
export type SequenceFn = (i: number) => any;
