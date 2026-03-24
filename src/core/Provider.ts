import { AttestationNotConfiguredError } from '../errors';
import { EventHandler, EventMap, IssuanceEvent, MappingResult, ProviderIssueResult, SessionStatus } from '../schemas';
import { Session } from './Session';

export interface ProviderConfig {}

export interface AttestationConfig {}

export interface ProviderOptions<
  TConfig extends ProviderConfig = ProviderConfig,
  TAttestation extends AttestationConfig = AttestationConfig,
> {
  config: TConfig;
  attestations: Record<string, TAttestation>;
}

export abstract class Provider<
  TConfig extends ProviderConfig = ProviderConfig,
  TAttestation extends AttestationConfig = AttestationConfig,
> {
  private listeners: { [K in keyof EventMap]?: EventHandler<EventMap[K]>[] } = {};
  protected session?: Session;

  constructor(protected readonly options: ProviderOptions<TConfig, TAttestation>) {}

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }

  setSession(session: Session): void {
    this.session = session;
  }

  protected getAttestationConfig(attestationName: string): TAttestation {
    const config = this.options.attestations[attestationName];
    if (!config) {
      throw new AttestationNotConfiguredError(attestationName);
    }
    return config;
  }

  async emit<K extends keyof EventMap>(event: K, data: EventMap[K]): Promise<void> {
    const handlers = this.listeners[event];
    if (handlers) {
      for (const handler of handlers) {
        try {
          await handler(data);
        } catch {
          // Event handler failure should not break the provider flow
        }
      }
    }
  }

  protected async emitIssuanceEvent(event: IssuanceEvent): Promise<void> {
    await this.emit('issuance', event);
  }

  abstract issue(attestationName: string, payload: MappingResult): Promise<ProviderIssueResult>;
  abstract status(sessionId: string): Promise<SessionStatus>;
  abstract revoke(sessionId: string): Promise<void>;
}
