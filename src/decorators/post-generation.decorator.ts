import { FactoryStorage } from '../factory-storage';

export function PostGeneration() {
  return function (target: any, propertyKey: string): void {
    FactoryStorage.storage.addFactoryPostGenerator(target.constructor.name, propertyKey);
  };
}
