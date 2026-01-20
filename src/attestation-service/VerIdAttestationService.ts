import { IssuanceClientConfig, IssuanceIntentPayload, VeridIssuanceClient } from '@ver-id/node-client';
import { CredentialAttribute } from './AttestationService';

export interface VerIdAttestationServiceConfig {
  /**
   * VerID url?
   */
  issuerUri: string;
  /**
   * Probably mijn.nijmgen.nl
   */
  redirectUri: string;
  /**
   * Client id
   */
  client_id: string;
  /**
   * Client secret
   */
  client_secret: string;
}

export class VerIdAttestationService {

  constructor(private readonly config: VerIdAttestationServiceConfig) {
  }

  async intent(payload: CredentialAttribute[]) {

    const config: IssuanceClientConfig = {
      issuerUri: this.config.issuerUri,
      client_id: this.config.client_id,
      redirectUri: this.config.redirectUri,
    };

    // Initialize the issuance client
    const issuanceClient = new VeridIssuanceClient(config);

    const codeChallenge = await issuanceClient.generateCodeChallenge();

    // Build intent payload
    const intentPayload: IssuanceIntentPayload = {
      payload: {
        // data: [
        //   { attributeUuid: '1ac22d17-9c8a-493f-8a27-20f89fcec2c1', value: '<First names>' },
        //   { attributeUuid: '3d3e898a-4122-45d8-b42f-4d74c8143116', value: '<Surname>' },
        // ],
        data: payload,
      },
    };

    // Create intent with client authentication
    const intentId = await issuanceClient.createIssuanceIntent(
      intentPayload,
      codeChallenge.codeChallenge,
      { client_secret: this.config.client_secret },
    );

    // Generate URL with intent
    const userUrl = await issuanceClient.generateIssuanceUrl({
      intent_id: intentId,
      state: codeChallenge.state,
      codeChallenge: codeChallenge.codeChallenge,
    });

    return userUrl.issuanceUrl;
  }

  async authorize(code: string) {
    console.debug('Calling VerID to obtain the access_token using', code);
  }

}