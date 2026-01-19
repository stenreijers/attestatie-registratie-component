import { MijnProductenClient } from './MijnProductenClient';

export interface AttestatieAttribute {
  en: string;
  nl: string;
}

export interface ProductAttestatie {
  credentialNaam: AttestatieAttribute;
  attributes: {
    geldig_van: AttestatieAttribute;
    geldig_tot: AttestatieAttribute;
    locatie: AttestatieAttribute;
    typeLocatie: AttestatieAttribute;
    kenmerk: AttestatieAttribute;
    bsn: AttestatieAttribute;
    uniforme_product_naam: AttestatieAttribute;
    product_code: AttestatieAttribute;
    product_naam: AttestatieAttribute;
  };
}


export class ProductenAttestor {

  constructor(private readonly client: MijnProductenClient) {
  }

  async createProductAttestation(productUuid: string): Promise<ProductAttestatie> {
    const product = await this.client.getProduct(productUuid);
    const producttype = product.producttype;

    return {
      credentialNaam: {
        en: 'test',
        nl: 'test',
      },
      attributes: {
        bsn: {
          en: product.eigenaren[0].bsn,
          nl: product.eigenaren[0].bsn,
        },
        geldig_van: {
          en: product.eigenaren[0].bsn,
          nl: product.eigenaren[0].bsn,
        },
        geldig_tot: {
          en: product.eigenaren[0].bsn,
          nl: product.eigenaren[0].bsn,
        },
        locatie: {
          en: product.eigenaren[0].bsn,
          nl: product.eigenaren[0].bsn,
        },
        typeLocatie: {
          en: product.eigenaren[0].bsn,
          nl: product.eigenaren[0].bsn,
        },
        kenmerk: {
          en: product.eigenaren[0].bsn,
          nl: product.eigenaren[0].bsn,
        },
        uniforme_product_naam: {
          en: producttype.uniforme_product_naam,
          nl: producttype.uniforme_product_naam,
        },
        product_code: {
          en: producttype.code,
          nl: producttype.code,
        },
        product_naam: {
          en: product.naam,
          nl: product.naam,
        },
      },
    };

  }
}