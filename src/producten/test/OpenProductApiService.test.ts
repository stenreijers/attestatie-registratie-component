
import { OpenProductApiService } from '../OpenProductApiService';

global.fetch = jest.fn() as jest.Mock;

describe('OpenProductApiService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch product from API', async () => {
    const mockProduct = {
      uuid: '123',
      naam: 'Test Product',
      producttype: { code: 'TEST', uniforme_product_naam: 'Test' },
      dataobject: { location: 'Test Location' },
      eind_datum: '2024-12-31',
      start_datum: '2024-01-01',
      eigenaren: [{ bsn: '123456789' }],
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    const service = new OpenProductApiService({
      baseUrl: 'https://example.com/api',
      apiToken: 'test-token',
    });

    const product = await service.getProduct('123');

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/api/producten/123',
      {
        headers: {
          Authorization: 'Token test-token',
          Accept: 'application/json',
        },
      },
    );
    expect(product).toEqual(mockProduct);
  });

  it('should throw error when API returns error', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const service = new OpenProductApiService({
      baseUrl: 'https://example.com/api',
      apiToken: 'test-token',
    });

    await expect(service.getProduct('123')).rejects.toThrow('Failed to fetch product: 404 Not Found');
  });
});
