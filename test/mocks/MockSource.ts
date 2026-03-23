import { Source, SourceConfig } from '../../src/core/Source';

export interface MockSourceConfig extends SourceConfig {}

export class MockSource<T = unknown> extends Source<T, MockSourceConfig> {
  public fetchCalls: string[] = [];
  private data: Map<string, T> = new Map();

  constructor(name: string = 'mock-source') {
    super({ name, config: {} });
  }

  addData(id: string, data: T): void {
    this.data.set(id, data);
  }

  async fetch(id: string): Promise<T> {
    this.fetchCalls.push(id);
    const item = this.data.get(id);
    if (!item) {
      throw new Error(`MockSource: no data for id "${id}"`);
    }
    return item;
  }
}
