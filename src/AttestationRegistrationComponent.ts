import { AttestationRequest } from './AttestationRequest';
import { AttestationService } from './AttestationService';

export interface AttestatieRegestratieComponentOptions {
  readonly attestationService: AttestationService;
}

export class AttestatieRegestratieComponent {

  constructor(private readonly options: AttestatieRegestratieComponentOptions) { }

  /**
   * Note: requested by the portal backend (should be protected)
   * @param _request
   * @returns
   */
  async start(_request: AttestationRequest) {
    // Call open-product to get prodcut
    // Verify ownership of product
    // Map to attestation
    // call Ver.ID and return the url
    return this.options.attestationService.intent({
      attribute1: { en: 'test', nl: test },
    });
  }

  /**
   * Note: requested by the user's browser
   * @param _request
   */
  async callback(_request: AttestationRequest) {
    // Get jwt token from Ver.ID using auth code
    // Parse JWT and store revocation key
    // Redirect user to mijn-nijmegen.
  }

}