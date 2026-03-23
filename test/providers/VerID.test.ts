import { VeridIssuanceClient } from '@ver-id/node-client';
import { VerID } from '../../src/providers/VerID';
import { InMemory } from '../../src/adapters/InMemory';
import { Session } from '../../src/core/Session';
import { SessionEvent } from '../../src/schemas';

function createMockClient(): VeridIssuanceClient {
  return {
    generateCodeChallenge: jest.fn().mockResolvedValue({
      codeChallenge: 'mock-code-challenge',
      state: 'mock-state',
    }),
    createIssuanceIntent: jest.fn().mockResolvedValue({
      intent_id: 'mock-intent-id',
      issuance_run_uuid: 'mock-run-uuid',
    }),
    generateIssuanceUrl: jest.fn().mockResolvedValue({
      issuanceUrl: 'https://verid.example.com/issuance/start',
    }),
  } as unknown as VeridIssuanceClient;
}

describe('VerID', () => {
  let provider: VerID;
  let mockClient: VeridIssuanceClient;
  let store: InMemory;
  let sessionEvents: SessionEvent[];

  beforeEach(() => {
    mockClient = createMockClient();
    store = new InMemory();
    sessionEvents = [];

    provider = new VerID(
      {
        issuerUri: 'https://verid.example.com',
        redirectUri: 'https://mijn.nijmegen.nl/callback',
        clientSecret: 'test-secret',
      },
      {
        'standplaatsvergunning': { flowUuid: 'flow-uuid-standplaats' },
      },
      mockClient,
    );

    provider.setSession(new Session({ store }));
    provider.setHooks({
      onSessionEvent: async (event) => { sessionEvents.push(event); },
    });
  });

  describe('issue', () => {
    it('should create intent and return issuance URL', async () => {
      const result = await provider.issue('standplaatsvergunning', { bsn: '999999333' });

      expect(result.url).toBe('https://verid.example.com/issuance/start');
      expect(result.sessionId).toBe('mock-run-uuid');
      expect(result.callbackState).toBe('mock-state');
    });

    it('should pass mapping result as payload to Ver.ID client', async () => {
      const mappingResult = { bsn: '999999333', kenmerk: 'abc' };
      await provider.issue('standplaatsvergunning', mappingResult);

      expect(mockClient.createIssuanceIntent).toHaveBeenCalledWith(
        { payload: { mapping: mappingResult } },
        'mock-code-challenge',
        { client_secret: 'test-secret' },
      );
    });

    it('should throw for unconfigured attestation', async () => {
      await expect(provider.issue('unknown', {})).rejects.toThrow(
        'No configuration for attestation "unknown"',
      );
    });
  });

  describe('callback', () => {
    beforeEach(async () => {
      // Simulate a prior issue() that stored callback state
      await store.put('callback:mock-state', {
        sessionId: 'mock-run-uuid',
        source: 'openproduct',
        id: 'product-123',
        attestation: 'standplaatsvergunning',
      });
    });

    it('should resolve callback state and return success', async () => {
      const params = new URLSearchParams({ state: 'mock-state', code: 'auth-code' });
      const result = await provider.callback(params);

      expect(result.success).toBe(true);
      expect(result.sessionId).toBe('mock-run-uuid');
    });

    it('should fire onSessionEvent with issued status on success', async () => {
      const params = new URLSearchParams({ state: 'mock-state', code: 'auth-code' });
      await provider.callback(params);

      expect(sessionEvents).toHaveLength(1);
      expect(sessionEvents[0].status).toBe('issued');
      expect(sessionEvents[0].context.attestation).toBe('standplaatsvergunning');
    });

    it('should detect error in callback params', async () => {
      const params = new URLSearchParams({ state: 'mock-state', error: 'access_denied' });
      const result = await provider.callback(params);

      expect(result.success).toBe(false);
      expect(sessionEvents).toHaveLength(0);
    });

    it('should throw for unknown state', async () => {
      const params = new URLSearchParams({ state: 'unknown-state' });
      await expect(provider.callback(params)).rejects.toThrow('Unknown or expired callback state');
    });

    it('should throw when state parameter is missing', async () => {
      const params = new URLSearchParams({});
      await expect(provider.callback(params)).rejects.toThrow('Missing state parameter');
    });

    it('should cleanup callback state after processing', async () => {
      const params = new URLSearchParams({ state: 'mock-state', code: 'auth-code' });
      await provider.callback(params);

      await expect(store.get('callback:mock-state')).rejects.toThrow();
    });
  });

  describe('status', () => {
    it('should throw not implemented', async () => {
      await expect(provider.status('some-session')).rejects.toThrow('not yet implemented');
    });
  });

  describe('revoke', () => {
    it('should throw not implemented', async () => {
      await expect(provider.revoke('some-session')).rejects.toThrow('not yet implemented');
    });
  });
});
