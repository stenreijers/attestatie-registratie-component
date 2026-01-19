import * as product from '../test/resources/product.json';
import * as productType from '../test/resources/producttype.json';

export class MijnProductenClient {

  async getProduct(_productUuid: string) {
    return product;
  }
  async getProductMetadata(_productTypeUuid: string) {
    return productType;
  }

}