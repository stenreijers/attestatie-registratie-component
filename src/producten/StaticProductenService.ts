import * as productTemplate from '../test/resources/product.json';
import { ProductenService } from './ProductenService';
import { Product } from './ProductSchema';

export class StaticProductenService implements ProductenService {
  async getProduct(productUuid: string): Promise<Product> {
    return {
      ...productTemplate,
      uuid: productUuid,
    } as Product;
  }
}
