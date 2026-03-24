import { ProductSchema } from '../../src/sources/OpenProduct';
import { validProduct } from '../fixtures/products';

describe('ProductSchema', () => {
  it('should validate a valid product', () => {
    const result = ProductSchema.parse(validProduct);
    expect(result.uuid).toBe(validProduct.uuid);
    expect(result.naam).toBe(validProduct.naam);
    expect(result.eigenaren[0].bsn).toBe('999999333');
  });

  it('should reject invalid uuid', () => {
    const invalid = { ...validProduct, uuid: 'not-a-uuid' };
    expect(() => ProductSchema.parse(invalid)).toThrow();
  });

  it('should reject missing required fields', () => {
    expect(() => ProductSchema.parse({})).toThrow();
  });

  it('should handle empty string BSN as undefined', () => {
    const productEmptyBsn = {
      ...validProduct,
      eigenaren: [{ uuid: '1dbe98d5-118e-4143-8e24-f5c866efc799', bsn: '' }],
    };
    const result = ProductSchema.parse(productEmptyBsn);
    expect(result.eigenaren[0].bsn).toBeUndefined();
  });

  it('should accept optional fields', () => {
    const productWithOptionals = {
      ...validProduct,
      status: 'actief',
      prijs: '10.50',
      frequentie: 'maandelijks',
    };
    const result = ProductSchema.parse(productWithOptionals);
    expect(result.status).toBe('actief');
    expect(result.prijs).toBe('10.50');
    expect(result.frequentie).toBe('maandelijks');
  });

  it('should reject invalid status', () => {
    const invalid = { ...validProduct, status: 'invalid-status' };
    expect(() => ProductSchema.parse(invalid)).toThrow();
  });

  it('should accept null optional fields', () => {
    const productWithNulls = {
      ...validProduct,
      start_datum: null,
      eind_datum: null,
      prijs: null,
      verbruiksobject: null,
      dataobject: null,
    };
    const result = ProductSchema.parse(productWithNulls);
    expect(result.start_datum).toBeNull();
    expect(result.dataobject).toBeNull();
  });
});
