import { Store, StoreConfig } from '../core/Store';

interface StoredItem {
  payload: Record<string, string>;
  expiresAt: number;
}

export interface InMemoryConfig extends StoreConfig {}

export class InMemory extends Store<InMemoryConfig> {
  private data = new Map<string, StoredItem>();

  constructor(config: InMemoryConfig = {}) {
    super({ config });
  }

  async put(id: string, payload: Record<string, string>, options?: { ttlSeconds?: number }): Promise<void> {
    const ttl = options?.ttlSeconds ?? this.defaultTtlSeconds;
    this.data.set(id, {
      payload,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  async get(id: string): Promise<Record<string, string>> {
    const item = this.data.get(id);
    if (!item) {
      throw new Error(`Item with id "${id}" not found`);
    }
    if (Date.now() > item.expiresAt) {
      this.data.delete(id);
      throw new Error(`Item with id "${id}" has expired`);
    }
    return item.payload;
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id);
  }
}
