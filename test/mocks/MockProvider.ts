import { Provider, ProviderConfig, AttestationConfig } from '../../src/core/Provider';
import { SessionContext } from '../../src/core/Session';
import { MappingResult, ProviderIssueResult, SessionStatus } from '../../src/schemas';

export interface MockProviderConfig extends ProviderConfig {}
export interface MockAttestationConfig extends AttestationConfig {}

interface IssueCall {
  attestationName: string;
  payload: MappingResult;
}

interface RevokeCall {
  sessionId: string;
}

export class MockProvider extends Provider<MockProviderConfig, MockAttestationConfig> {
  public issueCalls: IssueCall[] = [];
  public revokeCalls: RevokeCall[] = [];
  public statusCalls: string[] = [];

  private nextIssueResult: ProviderIssueResult = {
    type: 'oauth',
    url: 'https://verid.example.com/issuance/mock',
    sessionId: 'mock-session-id',
    callbackState: 'mock-state',
  };

  private nextStatus: SessionStatus = 'pending';

  constructor() {
    super({ config: {}, attestations: {} });
  }

  setNextIssueResult(result: ProviderIssueResult): void {
    this.nextIssueResult = result;
  }

  setNextStatus(status: SessionStatus): void {
    this.nextStatus = status;
  }

  async issue(context: SessionContext, payload: MappingResult): Promise<ProviderIssueResult> {
    this.issueCalls.push({ attestationName: context.attestation, payload });
    await this.emitIssuanceEvent({
      sessionId: this.nextIssueResult.sessionId,
      status: 'pending',
      context,
    });
    return this.nextIssueResult;
  }

  async status(sessionId: string): Promise<SessionStatus> {
    this.statusCalls.push(sessionId);
    return this.nextStatus;
  }

  async revoke(sessionId: string): Promise<void> {
    this.revokeCalls.push({ sessionId });
  }
}
