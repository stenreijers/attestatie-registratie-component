
import { OpenProductApiService } from '../OpenProductApiService';

global.fetch = jest.fn() as jest.Mock;

describe('OpenProductApiService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch product from API', async () => {
    const mockProduct = {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://example.com/product',
      naam: 'Test Product',
      aanmaak_datum: '2024-01-01T00:00:00.000Z',
      update_datum: '2024-01-01T00:00:00.000Z',
      producttype: {
        uuid: 'e9522583-d61f-4232-8268-d1596a94bf2d',
        code: 'TEST',
        uniforme_product_naam: 'Test',
      },
      dataobject: { location: 'Test Location' },
      eind_datum: '2024-12-31',
      start_datum: '2024-01-01',
      eigenaren: [{
        uuid: '1dbe98d5-118e-4143-8e24-f5c866efc799',
        bsn: '123456789',
      }],
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
