import { describe, it, expect } from 'vitest';
import { AttestatieFormatter } from '../ProductenFormatter';
import { Product } from '../ProductSchema';

describe('AttestatieFormatter', () => {
  const mockProduct: Product = {
    uuid: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
    url: 'https://example.com/product',
    naam: 'Vergunning langs de 4-daagse route',
    start_datum: '2026-01-20',
    eind_datum: '2026-01-31',
    aanmaak_datum: '2026-01-19T14:51:20.505685+01:00',
    update_datum: '2026-01-19T14:51:20.505699+01:00',
    producttype: {
      uuid: 'e9522583-d61f-4232-8268-d1596a94bf2d',
      code: 'TEST-4D',
      uniforme_product_naam: 'standplaatsvergunning',
    },
    eigenaren: [
      {
        uuid: '1dbe98d5-118e-4143-8e24-f5c866efc799',
        bsn: '999999333',
      },
    ],
    dataobject: {
      location: 'St. Annastraat 250 6525 HA NIJMEGEN',
    },
  };

  it('should format standplaatsvergunning product correctly', () => {
    const formatter = new AttestatieFormatter();
    const result = formatter.format('standplaatsvergunning', mockProduct);

    expect(result).toHaveLength(9);
    expect(result[0]).toEqual({
      attributeUuid: '6cd4ef9f-9c37-4c38-be02-10ac886e4a4e',
      value: '999999333',
    });
    expect(result[1]).toEqual({
      attributeUuid: '0a0c7028-e55f-492d-a2ab-851e20c1293f',
      value: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
    });
  });

  it('should throw error for unknown template', () => {
    const formatter = new AttestatieFormatter();
    expect(() => formatter.format('unknown', mockProduct)).toThrow('Unknown template: unknown');
  });

  it('should throw error when bsn is missing', () => {
    const formatter = new AttestatieFormatter();
    const invalidProduct = { ...mockProduct, eigenaren: [] };
    expect(() => formatter.format('standplaatsvergunning', invalidProduct)).toThrow('Invalid product: missing required fields');
  });

  it('should throw error when uuid is missing', () => {
    const formatter = new AttestatieFormatter();
    const invalidProduct = { ...mockProduct, uuid: '' };
    expect(() => formatter.format('standplaatsvergunning', invalidProduct)).toThrow('Invalid product: missing required fields');
  });
});
