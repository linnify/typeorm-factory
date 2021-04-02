import { getRepository } from 'typeorm';
import { SubFactory } from './subfactory';
import { Constructable } from './types';
import { Sequence } from './sequence';
import { FactoryStorage } from './factory-storage';

export abstract class Factory<T> {
  abstract get entity(): Constructable<T>;

  constructor() {}

  async create(values: Partial<T> = {}): Promise<T> {
    if (this.getOrCreate().length !== 0) {
      const existingEntity = await this.getExistingEntity(values);
      if (existingEntity) {
        return existingEntity;
      }
    }

    const entity: T = await this.createEntity(values);
    const savedEntity = getRepository(this.entity).save(entity);

    const storage = FactoryStorage.storage;
    const postGenerators = storage.getPostGenerators(this.constructor.name);
    if (postGenerators && postGenerators.length !== 0) {
      await Promise.all(postGenerators.map(async (fnName: string) => (this as any)[fnName](entity)));
    }

    return savedEntity;
  }

  async createMany(count: number, values: Partial<T> = {}): Promise<T[]> {
    const entities: T[] = await Promise.all(Array.from({ length: count }).map(() => this.createEntity(values)));

    return getRepository(this.entity).save(entities);
  }

  protected getOrCreate(): string[] {
    return [];
  }

  private async getExistingEntity(values: Partial<T>) {
    const whereClauses: { [key: string]: any } = {};

    this.getOrCreate().forEach((key) => {
      whereClauses[key] = values[key as keyof T] ? values[key as keyof T] : (this as any)[key];
    });

    return getRepository(this.entity).findOne({ where: whereClauses });
  }

  private async createEntity(values: Partial<T>): Promise<T> {
    const entity: T = new this.entity();

    await Promise.all(
      Object.entries(this).map(async ([key, value]) => {
        const _value = Object.prototype.hasOwnProperty.call(values, key) ? values[key as keyof T] : value;
        const entityValue = await Factory.getEntityValue(_value);
        Object.assign(entity, { [key]: entityValue });
      }),
    );

    return entity;
  }

  private static async getEntityValue(value: unknown) {
    if (value instanceof SubFactory) {
      return value.factory.create(value.values);
    } else if (value instanceof Sequence) {
      return value.nextValue;
    } else {
      return value;
    }
  }
}
