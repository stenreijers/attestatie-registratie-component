import { MijnProductenClient } from "./MijnProductenClient";


export interface AttestatieAttribute {
  en: string;
  nl: string;
}

export interface ProductAttestatie {
  credentialNaam: AttestatieAttribute;
  attributes: {
    "geldig_van": AttestatieAttribute;
    "geldig_tot": AttestatieAttribute;
    "locatie": AttestatieAttribute;
    "typeLocatie": AttestatieAttribute;
    "kenmerk": AttestatieAttribute;
    "bsn": AttestatieAttribute;
    "uniforme_product_naam": AttestatieAttribute;
    "product_code": AttestatieAttribute;
    "product_naam": AttestatieAttribute;
  }
}


export class ProductenAttestor {


  constructor(private readonly client: MijnProductenClient) {
  }

  async createProductAttestation(productUuid: string): Promise<ProductAttestatie> {
    const product = await this.client.getProduct(productUuid);
    const producttype = product.producttype;

    return {
      attributes: {
        bsn: {
          en: product.eigenaren[0].bsn,
          nl: product.eigenaren[0].bsn,
        }
      }
    }

  }
}