import { ARCHooks, MappingResult, ProviderIssueResult, SessionStatus, SessionEvent } from '../schemas';
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
  protected hooks: ARCHooks = {};
  protected session?: Session;

  constructor(protected readonly options: ProviderOptions<TConfig, TAttestation>) {}

  setHooks(hooks: ARCHooks): void {
    this.hooks = hooks;
  }

  setSession(session: Session): void {
    this.session = session;
  }

  protected getAttestationConfig(attestationName: string): TAttestation {
    const config = this.options.attestations[attestationName];
    if (!config) {
      throw new Error(`No configuration for attestation "${attestationName}"`);
    }
    return config;
  }

  protected async emitSessionEvent(event: SessionEvent): Promise<void> {
    if (this.hooks.onSessionEvent) {
      try {
        await this.hooks.onSessionEvent(event);
      } catch {
        // Hook failure should not break the provider flow
      }
    }
  }

  abstract issue(attestationName: string, payload: MappingResult): Promise<ProviderIssueResult>;
  abstract status(sessionId: string): Promise<SessionStatus>;
  abstract revoke(sessionId: string): Promise<void>;
}
