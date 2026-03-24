import { Attestation } from './core/Attestation';
import { Provider } from './core/Provider';
import { Session } from './core/Session';
import { Source } from './core/Source';
import { Store } from './core/Store';
import { ConfigurationError, UnknownAttestationError, UnknownSourceError } from './errors';
import {
  EventHandler, EventMap,
  IssueParams, IssueParamsSchema, IssueResult,
  RevokeParams, RevokeParamsSchema, RevokeResult,
  StatusParams, StatusParamsSchema, StatusResult,
} from './schemas';

export interface ARCOptions<TProvider extends Provider<any, any> = Provider> {
  provider: TProvider;
  store: Store<any>;
  sources: Source<any, any>[];
  attestations: Attestation[];
}

export class ARC<TProvider extends Provider<any, any> = Provider> {
  readonly provider: TProvider;

  private sourceMap: Map<string, Source<any, any>>;
  private attestationMap: Map<string, Attestation>;
  private session: Session;

  constructor(private readonly options: ARCOptions<TProvider>) {
    this.provider = options.provider;
    this.session = new Session({ store: options.store });
    this.sourceMap = new Map(options.sources.map(s => [s.name, s]));
    this.attestationMap = new Map(
      options.attestations.map(a => [`${a.sourceName}:${a.name}`, a]),
    );

    for (const attestation of options.attestations) {
      if (!this.sourceMap.has(attestation.sourceName)) {
        throw new ConfigurationError(`Attestation "${attestation.name}" references unknown source "${attestation.sourceName}"`);
      }
    }

    this.provider.setSession(this.session);
  }

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    this.provider.on(event, handler);
  }

  async issue(params: IssueParams): Promise<IssueResult> {
    const validated = IssueParamsSchema.parse(params);

    const source = this.sourceMap.get(validated.source);
    if (!source) throw new UnknownSourceError(validated.source);

    const attestation = this.attestationMap.get(`${validated.source}:${validated.attestation}`);
    if (!attestation) throw new UnknownAttestationError(validated.source, validated.attestation);

    const context = { source: validated.source, id: validated.id, attestation: validated.attestation };

    const sourceData = await source.fetch(validated.id);
    const mappingResult = attestation.map(sourceData);
    const providerResult = await this.options.provider.issue(validated.attestation, mappingResult);

    await this.session.save(providerResult.sessionId, context);

    if (providerResult.callbackState) {
      await this.session.saveCallback(providerResult.callbackState, providerResult.sessionId, context);
    }

    await this.provider.emit('issuance', {
      sessionId: providerResult.sessionId,
      status: 'pending',
      context,
    });

    return {
      url: providerResult.url,
      sessionId: providerResult.sessionId,
    };
  }

  async status(params: StatusParams): Promise<StatusResult> {
    const validated = StatusParamsSchema.parse(params);
    const status = await this.options.provider.status(validated.sessionId);
    return { sessionId: validated.sessionId, status };
  }

  async revoke(params: RevokeParams): Promise<RevokeResult> {
    const validated = RevokeParamsSchema.parse(params);
    await this.options.provider.revoke(validated.sessionId);
    return { sessionId: validated.sessionId };
  }
}
