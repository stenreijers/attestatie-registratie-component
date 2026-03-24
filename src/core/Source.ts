export interface SourceConfig {}

export interface SourceOptions<TConfig extends SourceConfig = SourceConfig> {
  name: string;
  config: TConfig;
}

export abstract class Source<T = unknown, TConfig extends SourceConfig = SourceConfig> {
  readonly name: string;

  constructor(protected readonly options: SourceOptions<TConfig>) {
    this.name = options.name;
  }

  abstract fetch(id: string): Promise<T>;
}
