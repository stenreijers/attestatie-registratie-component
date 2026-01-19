import { AttestatieRegestratieComponent } from '../AttestationRegistrationComponent';
import { AttestationRequest } from '../AttestationRequest';
import { VerIdAttestationService } from '../AttestationService';

// Keep this for later use as it works...
// jest.mock('@ver-id/node-client', () => ({
//   VeridIssuanceClient: jest.fn().mockImplementation(() => ({
//     createIssuanceIntent: jest.fn(),
//     generateIssuanceUrl: jest.fn(),
//     generateCodeChallenge: jest.fn().mockImplementation(() => {
//       return Promise.resolve({
//         codeChallenge: 'codeChallenge',
//         state: 'state',
//       });
//     }),
//   })),
// }));

jest.mock('../AttestationService', () => ({
  VerIdAttestationService: jest.fn().mockImplementation(() => {
    return {
      intent: jest.fn().mockImplementation(() => {
        return Promise.resolve('http://example.com');
      }),
    };
  }),
}));

describe('AttestatieRegestratieComponent', () => {
  let component: AttestatieRegestratieComponent;

  beforeEach(() => {
    const mocked = new VerIdAttestationService();
    component = new AttestatieRegestratieComponent({
      attestationService: mocked,
    });
  });

  describe('start', () => {
    it('should handle request', async () => {
      const request = {} as AttestationRequest;
      await expect(component.start(request)).resolves.not.toBeUndefined();
    });
  });

  describe('callback', () => {
    it('should handle request', async () => {
      const request = {} as AttestationRequest;
      await expect(component.callback(request)).resolves.toBeUndefined();
    });
  });
});
