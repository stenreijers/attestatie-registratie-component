import { ProductSchema } from '../ProductSchema';

describe('ProductSchema', () => {
  it('should validate a valid product', () => {
    const validProduct = {
      uuid: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
      url: 'https://example.com/product/123',
      naam: 'Test Product',
      aanmaak_datum: '2024-01-01T00:00:00Z',
      update_datum: '2024-01-01T00:00:00Z',
      producttype: {
        uuid: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
        code: 'TEST',
        uniforme_product_naam: 'Test Product',
      },
      eigenaren: [
        {
          uuid: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
          bsn: '123456789',
        },
      ],
    };

    const result = ProductSchema.parse(validProduct);
    expect(result).toEqual(validProduct);
  });

  it('should throw error for invalid product', () => {
    const invalidProduct = {
      uuid: 'invalid-uuid',
      naam: 'Test Product',
    };

    expect(() => ProductSchema.parse(invalidProduct)).toThrow();
  });

  it('should validate product with optional fields', () => {
    const productWithOptionals = {
      uuid: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
      url: 'https://example.com/product/123',
      naam: 'Test Product',
      start_datum: '2024-01-01',
      eind_datum: '2024-12-31',
      aanmaak_datum: '2024-01-01T00:00:00Z',
      update_datum: '2024-01-01T00:00:00Z',
      producttype: {
        uuid: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
        code: 'TEST',
        uniforme_product_naam: 'Test Product',
      },
      eigenaren: [
        {
          uuid: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
          bsn: '123456789',
        },
      ],
      status: 'actief',
      prijs: '10.50',
      frequentie: 'maandelijks',
      dataobject: { location: 'Test Location' },
    };

    const result = ProductSchema.parse(productWithOptionals);
    expect(result.status).toBe('actief');
    expect(result.dataobject).toEqual({ location: 'Test Location' });
  });
});
