import { Factory } from './factory';

export type FactoryClass<T> = new () => Factory<T>;
export type Constructable<T> = new (...args: any[]) => T;
export type SequenceFn = (i: number) => any;
