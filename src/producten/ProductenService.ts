import { Product } from './ProductSchema';

export interface ProductenService {
  getProduct(productUuid: string): Promise<Product>;
}
