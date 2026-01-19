import { HttpRequest } from './HttpRequest';

export class AttestatieRegestratieComponent {

  async start(_request: HttpRequest) {
    // Call open-product to get prodcut

    // Verify ownership of product

    // Map to attestation

    // call Ver.ID
  }

  async callback(_request: HttpRequest) {
    // Get jwt token from Ver.ID using auth code

    // Parse JWT and store revocation key

    // Redirect user to mijn-nijmegen.
  }

}