import * as product from './test/product.json';
import * as productType from './test/producttype.json';

export class MijnProductenClient {

  async getProduct(_productUuid: string) {
    return product;
  }
  async getProductMetadata(_productTypeUuid: string) {
    return productType;
  }

}