export class FactoryStorage {
  private static instance: FactoryStorage;
  factoryPostGenerators: { [factoryName: string]: string[] } = {};

  private constructor() {}

  static get storage(): FactoryStorage {
    if (!this.instance) {
      this.instance = new FactoryStorage();
    }

    return this.instance;
  }

  addFactoryPostGenerator(factoryName: string, fnName: string): void {
    if (!this.factoryPostGenerators[factoryName]) {
      this.factoryPostGenerators[factoryName] = [fnName];
    } else {
      this.factoryPostGenerators[factoryName].push(fnName);
    }
  }

  getPostGenerators(factoryName: string): string[] {
    return this.factoryPostGenerators[factoryName];
  }
}
