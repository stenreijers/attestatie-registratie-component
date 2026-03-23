import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Store, StoreConfig } from '../core/Store';

export interface DynamoDbConfig extends StoreConfig {
  tableName: string;
  partitionKey?: string;
  ttlAttribute?: string;
  region?: string;
  endpoint?: string;
}

export class DynamoDb extends Store<DynamoDbConfig> {
  private client: DynamoDBClient;
  private partitionKey: string;
  private ttlAttribute: string;

  constructor(config: DynamoDbConfig) {
    super({ config });
    this.partitionKey = config.partitionKey ?? 'id';
    this.ttlAttribute = config.ttlAttribute ?? 'ttl';
    this.client = new DynamoDBClient({
      region: config.region ?? 'eu-west-1',
      ...(config.endpoint && { endpoint: config.endpoint }),
    });
  }

  async put(id: string, payload: Record<string, string>, options?: { ttlSeconds?: number }): Promise<void> {
    const ttl = options?.ttlSeconds ?? this.defaultTtlSeconds;
    const expiresAt = Math.floor(Date.now() / 1000) + ttl;

    const item = marshall({
      [this.partitionKey]: id,
      [this.ttlAttribute]: expiresAt,
      ...payload,
    });

    await this.client.send(new PutItemCommand({
      TableName: this.options.config.tableName,
      Item: item,
    }));
  }

  async get(id: string): Promise<Record<string, string>> {
    const response = await this.client.send(new GetItemCommand({
      TableName: this.options.config.tableName,
      Key: marshall({ [this.partitionKey]: id }),
    }));

    if (!response.Item) {
      throw new Error(`Item with id "${id}" not found`);
    }

    const unmarshalled = unmarshall(response.Item) as Record<string, string>;
    const { [this.partitionKey]: _pk, [this.ttlAttribute]: _ttl, ...rest } = unmarshalled;
    return rest;
  }

  async delete(id: string): Promise<void> {
    await this.client.send(new DeleteItemCommand({
      TableName: this.options.config.tableName,
      Key: marshall({ [this.partitionKey]: id }),
    }));
  }
}
