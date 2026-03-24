import { Product } from '../../src/sources/OpenProduct';

export const validProduct: Product = {
  uuid: '12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
  url: 'https://mijn-services-dev.csp-nijmegen.nl/open-product/producten/api/v1/producten/12126e1e-9bc1-4a30-b73e-5b5aa4ce8bc4',
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

export const productMissingBsn: Product = {
  ...validProduct,
  eigenaren: [],
};

export const productMissingUuid: Product = {
  ...validProduct,
  uuid: '',
};

export const productMinimal: Product = {
  uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  url: 'https://example.com/product/minimal',
  naam: 'Minimal Product',
  aanmaak_datum: '2026-01-01T00:00:00Z',
  update_datum: '2026-01-01T00:00:00Z',
  producttype: {
    uuid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    code: 'MIN',
    uniforme_product_naam: 'overlijdensakte',
  },
  eigenaren: [
    {
      uuid: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      bsn: '123456789',
    },
  ],
};
