import { ARC } from '../src/ARC';
import { InMemory } from '../src/adapters/InMemory';
import { OpenProductStandplaatsvergunning } from '../src/attestations/openproduct/OpenProductStandplaatsvergunning';
import { SessionEvent } from '../src/schemas';
import { validProduct } from './fixtures/products';
import { MockSource } from './mocks/MockSource';
import { MockProvider } from './mocks/MockProvider';
import { Product } from '../src/sources/OpenProduct';

describe('ARC', () => {
  let source: MockSource<Product>;
  let provider: MockProvider;
  let store: InMemory;
  let sessionEvents: SessionEvent[];

  function createARC() {
    return new ARC({
      provider,
      store,
      sources: [source],
      attestations: [new OpenProductStandplaatsvergunning()],
      hooks: {
        onSessionEvent: async (event) => {
          sessionEvents.push(event);
        },
      },
    });
  }

  beforeEach(() => {
    source = new MockSource<Product>('openproduct');
    source.addData(validProduct.uuid, validProduct);
    provider = new MockProvider();
    store = new InMemory();
    sessionEvents = [];
  });

  describe('constructor', () => {
    it('should validate that attestations reference registered sources', () => {
      const badSource = new MockSource('wrong-source');
      expect(() => new ARC({
        provider,
        store,
        sources: [badSource],
        attestations: [new OpenProductStandplaatsvergunning()],
      })).toThrow('Attestation "standplaatsvergunning" references unknown source "openproduct"');
    });
  });

  describe('issue', () => {
    it('should fetch source data, map it, and call provider', async () => {
      const arc = createARC();

      const result = await arc.issue({
        source: 'openproduct',
        id: validProduct.uuid,
        attestation: 'standplaatsvergunning',
      });

      expect(result.url).toBe('https://verid.example.com/issuance/mock');
      expect(result.sessionId).toBe('mock-session-id');
      expect(source.fetchCalls).toEqual([validProduct.uuid]);
      expect(provider.issueCalls).toHaveLength(1);
      expect(provider.issueCalls[0].attestationName).toBe('standplaatsvergunning');
      expect(provider.issueCalls[0].payload).toHaveProperty('bsn', '999999333');
    });

    it('should fire onSessionEvent with pending status', async () => {
      const arc = createARC();

      await arc.issue({
        source: 'openproduct',
        id: validProduct.uuid,
        attestation: 'standplaatsvergunning',
      });

      expect(sessionEvents).toHaveLength(1);
      expect(sessionEvents[0].status).toBe('pending');
      expect(sessionEvents[0].sessionId).toBe('mock-session-id');
      expect(sessionEvents[0].context).toEqual({
        source: 'openproduct',
        id: validProduct.uuid,
        attestation: 'standplaatsvergunning',
      });
    });

    it('should store session and callback state', async () => {
      const arc = createARC();

      await arc.issue({
        source: 'openproduct',
        id: validProduct.uuid,
        attestation: 'standplaatsvergunning',
      });

      const session = await store.get('mock-session-id');
      expect(session.attestation).toBe('standplaatsvergunning');
      expect(session.source).toBe('openproduct');

      const callbackState = await store.get('callback:mock-state');
      expect(callbackState.sessionId).toBe('mock-session-id');
    });

    it('should throw for unknown source', async () => {
      const arc = createARC();

      await expect(arc.issue({
        source: 'unknown',
        id: '123',
        attestation: 'standplaatsvergunning',
      })).rejects.toThrow('Unknown source: unknown');
    });

    it('should throw for unknown attestation', async () => {
      const arc = createARC();

      await expect(arc.issue({
        source: 'openproduct',
        id: '123',
        attestation: 'unknown',
      })).rejects.toThrow('No attestation for openproduct → unknown');
    });

    it('should not fail if hook throws', async () => {
      const arc = new ARC({
        provider,
        store,
        sources: [source],
        attestations: [new OpenProductStandplaatsvergunning()],
        hooks: {
          onSessionEvent: async () => { throw new Error('hook failed'); },
        },
      });

      const result = await arc.issue({
        source: 'openproduct',
        id: validProduct.uuid,
        attestation: 'standplaatsvergunning',
      });

      expect(result.sessionId).toBe('mock-session-id');
    });
  });

  describe('status', () => {
    it('should delegate to provider', async () => {
      const arc = createARC();
      provider.setNextStatus('issued');

      const result = await arc.status({ sessionId: 'some-session' });

      expect(result.sessionId).toBe('some-session');
      expect(result.status).toBe('issued');
      expect(provider.statusCalls).toEqual(['some-session']);
    });
  });

  describe('revoke', () => {
    it('should delegate to provider and fire onSessionEvent', async () => {
      const arc = createARC();

      await arc.issue({
        source: 'openproduct',
        id: validProduct.uuid,
        attestation: 'standplaatsvergunning',
      });

      sessionEvents = [];

      const result = await arc.revoke({
        sessionId: 'mock-session-id',
        source: 'openproduct',
        id: validProduct.uuid,
        attestation: 'standplaatsvergunning',
      });

      expect(result.sessionId).toBe('mock-session-id');
      expect(provider.revokeCalls).toEqual([{ sessionId: 'mock-session-id' }]);
      expect(sessionEvents).toHaveLength(1);
      expect(sessionEvents[0].status).toBe('revoked');
    });

    it('should not fail if store record already expired', async () => {
      const arc = createARC();

      const result = await arc.revoke({
        sessionId: 'expired-session',
        source: 'openproduct',
        id: '123',
        attestation: 'standplaatsvergunning',
      });

      expect(result.sessionId).toBe('expired-session');
    });
  });
});
