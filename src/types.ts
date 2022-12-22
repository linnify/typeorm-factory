import { ObjectLiteral } from 'typeorm';
import { Factory } from './factory';

export type FactoryClass<T extends ObjectLiteral> = new () => Factory<T>;
export type Constructable<T> = new (...args: any[]) => T;
export type SequenceFn = (i: number) => any;
