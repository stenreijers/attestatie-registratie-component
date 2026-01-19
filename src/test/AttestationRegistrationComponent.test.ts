import { AttestatieRegestratieComponent } from '../AttestationRegistrationComponent';
import { HttpRequest } from '../HttpRequest';

jest.mock('@ver-id/node-client', () => ({
  VeridIssuanceClient: jest.fn().mockImplementation(() => ({
    createIssuanceIntent: jest.fn(),
    generateIssuanceUrl: jest.fn(),
    generateCodeChallenge: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        codeChallenge: 'codeChallenge',
        state: 'state',
      });
    }),
  })),
}));

describe('AttestatieRegestratieComponent', () => {
  let component: AttestatieRegestratieComponent;

  beforeEach(() => {
    component = new AttestatieRegestratieComponent();
  });

  describe('start', () => {
    it('should handle request', async () => {
      const request = {} as HttpRequest;
      await expect(component.start(request)).resolves.toBeUndefined();
    });
  });

  describe('callback', () => {
    it('should handle request', async () => {
      const request = {} as HttpRequest;
      await expect(component.callback(request)).resolves.toBeUndefined();
    });
  });
});
