
import { StaticProductenService } from '../StaticProductenService';

describe('StaticProductenService', () => {
  it('should return static product', async () => {
    const service = new StaticProductenService();
    const product = await service.getProduct('any-uuid');

    expect(product).toBeDefined();
    expect(product.uuid).toBeDefined();
    expect(product.naam).toBeDefined();
    expect(product.producttype).toBeDefined();
  });
});
