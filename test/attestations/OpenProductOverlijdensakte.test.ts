import { OpenProductOverlijdensakte } from '../../src/attestations/openproduct/OpenProductOverlijdensakte';
import { productMinimal, productMissingBsn, productMissingUuid } from '../fixtures/products';

describe('OpenProductOverlijdensakte', () => {
  const attestation = new OpenProductOverlijdensakte();

  it('should have correct name and sourceName', () => {
    expect(attestation.name).toBe('overlijdensakte');
    expect(attestation.sourceName).toBe('openproduct');
  });

  it('should map a valid product', () => {
    const result = attestation.map(productMinimal);
    expect(result).toEqual({});
  });

  it('should throw when bsn is missing', () => {
    expect(() => attestation.map(productMissingBsn)).toThrow('Invalid product: missing required fields');
  });

  it('should throw when uuid is missing', () => {
    expect(() => attestation.map(productMissingUuid)).toThrow('Invalid product: missing required fields');
  });
});
