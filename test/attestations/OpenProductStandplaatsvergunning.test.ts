import { OpenProductStandplaatsvergunning } from '../../src/attestations/openproduct/OpenProductStandplaatsvergunning';
import { validProduct, productMissingBsn, productMissingUuid } from '../fixtures/products';

describe('OpenProductStandplaatsvergunning', () => {
  const attestation = new OpenProductStandplaatsvergunning();

  it('should have correct name and sourceName', () => {
    expect(attestation.name).toBe('standplaatsvergunning');
    expect(attestation.sourceName).toBe('openproduct');
  });

  it('should map a valid product to credential attributes', () => {
    const result = attestation.map(validProduct);

    expect(result.bsn).toBe('999999333');
    expect(result.kenmerk).toBe('12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4');
    expect(result.product_naam).toBe('Vergunning langs de 4-daagse route');
    expect(result.uniforme_product_naam).toBe('standplaatsvergunning');
    expect(result.product_code).toBe('TEST-4D');
    expect(result.locatie).toBe('St. Annastraat 250 6525 HA NIJMEGEN');
    expect(result.geldig_van).toBe('2026-01-20');
    expect(result.geldig_tot).toBe('2026-01-31');
  });

  it('should throw when bsn is missing', () => {
    expect(() => attestation.map(productMissingBsn)).toThrow('Invalid product: missing required fields');
  });

  it('should throw when uuid is missing', () => {
    expect(() => attestation.map(productMissingUuid)).toThrow('Invalid product: missing required fields');
  });

  it('should default locatie when dataobject has no location', () => {
    const productNoLocation = { ...validProduct, dataobject: {} };
    const result = attestation.map(productNoLocation);
    expect(result.locatie).toBe('locatie onbekend');
  });

  it('should handle missing start_datum and eind_datum', () => {
    const productNoDates = { ...validProduct, start_datum: null, eind_datum: null };
    const result = attestation.map(productNoDates);
    expect(result.geldig_van).toBe('');
    expect(result.geldig_tot).toBe('');
  });
});
