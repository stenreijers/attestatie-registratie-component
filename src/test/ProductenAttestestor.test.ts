import { ProductenAttestor } from '../ProductenAttestestor';

describe('ProductenAttestor', () => {
  const mockProduct = {
    naam: 'Test product',
    eigenaren: [{ bsn: '999999333' }],
    producttype: {
      code: 'TEST-4D',
      uniforme_product_naam: 'standplaatsvergunning',
    },
  };

  it('should create product attestation with all attributes', async () => {
    const mockClient = {
      getProduct: jest.fn().mockResolvedValue(mockProduct),
    } as any;

    const attestor = new ProductenAttestor(mockClient);
    const result = await attestor.createProductAttestation('test-uuid');

    expect(result.credentialNaam).toEqual({ en: 'test', nl: 'test' });
    expect(result.attributes.bsn).toEqual({ en: '999999333', nl: '999999333' });
    expect(result.attributes.uniforme_product_naam).toEqual({ en: 'standplaatsvergunning', nl: 'standplaatsvergunning' });
    expect(result.attributes.product_code).toEqual({ en: 'TEST-4D', nl: 'TEST-4D' });
    expect(result.attributes.product_naam).toEqual({ en: 'Test product', nl: 'Test product' });
    expect(mockClient.getProduct).toHaveBeenCalledWith('test-uuid');
  });

  it('should map producttype fields correctly', async () => {
    const mockClient = {
      getProduct: jest.fn().mockResolvedValue(mockProduct),
    } as any;

    const attestor = new ProductenAttestor(mockClient);
    const result = await attestor.createProductAttestation('uuid-123');

    expect(result.attributes.product_code.en).toBe('TEST-4D');
    expect(result.attributes.uniforme_product_naam.en).toBe('standplaatsvergunning');
  });
});
