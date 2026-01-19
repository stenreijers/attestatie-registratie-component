import { IssuanceClientConfig, IssuanceIntentPayload, VeridIssuanceClient } from '@ver-id/node-client';
import { HttpRequest } from './HttpRequest';

export class AttestatieRegestratieComponent {

  async start(_request: HttpRequest) {


    // Call open-product to get prodcut

    // Verify ownership of product

    // Map to attestation

    // call Ver.ID

    const config: IssuanceClientConfig = {
      issuerUri: process.env.VER_ID_ISSUER_URL!,
      client_id: process.env.VER_ID_CLIENT_ID!,
      redirectUri: process.env.VER_ID_REDIRECT_URI!,
    };

    // Initialize the issuance client
    const issuanceClient = new VeridIssuanceClient(config);

    const codeChallenge = await issuanceClient.generateCodeChallenge();

    // Get client secret from environment
    const clientSecret = process.env.VER_ID_CLIENT_SECRET!;

    // Build intent payload
    const intentPayload: IssuanceIntentPayload = {
      payload: {
        data: [
          { "attributeUuid": "1ac22d17-9c8a-493f-8a27-20f89fcec2c1", "value": "<First names>" },
          { "attributeUuid": "3d3e898a-4122-45d8-b42f-4d74c8143116", "value": "<Surname>" }
        ]
      }
    };

    // Create intent with client authentication
    const intentId = await issuanceClient.createIssuanceIntent(
      intentPayload,
      codeChallenge.codeChallenge,
      { client_secret: clientSecret }
    );

    // Generate URL with intent
    const userUrl = await issuanceClient.generateIssuanceUrl({
      intent_id: intentId,
      state: codeChallenge.state,
      codeChallenge: codeChallenge.codeChallenge,
    });

    return userUrl;

  }

  async callback(_request: HttpRequest) {
    // Get jwt token from Ver.ID using auth code

    // Parse JWT and store revocation key

    // Redirect user to mijn-nijmegen.
  }

}