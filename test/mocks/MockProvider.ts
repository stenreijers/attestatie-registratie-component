import { Provider, ProviderConfig, AttestationConfig } from '../../src/core/Provider';
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

  async issue(attestationName: string, payload: MappingResult): Promise<ProviderIssueResult> {
    this.issueCalls.push({ attestationName, payload });
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
