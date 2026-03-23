import { MappingResult } from '../schemas';

export interface AttestationOptions {
  name: string;
  sourceName: string;
}

export abstract class Attestation<TSource = unknown> {
  readonly name: string;
  readonly sourceName: string;

  constructor(protected readonly options: AttestationOptions) {
    this.name = options.name;
    this.sourceName = options.sourceName;
  }

  abstract map(input: TSource): MappingResult;
}
