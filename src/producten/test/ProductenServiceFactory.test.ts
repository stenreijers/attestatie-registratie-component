
import { OpenProductApiService } from '../OpenProductApiService';
import { ProductenServiceFactory } from '../ProductenServiceFactory';
import { StaticProductenService } from '../StaticProductenService';

describe('ProductenServiceFactory', () => {
  it('should create StaticProductenService', () => {
    const service = ProductenServiceFactory.create({ type: 'static' });
    expect(service).toBeInstanceOf(StaticProductenService);
  });

  it('should create OpenProductApiService with config', () => {
    const service = ProductenServiceFactory.create({
      type: 'api',
      apiConfig: {
        baseUrl: 'https://example.com',
        apiToken: 'test-token',
      },
    });
    expect(service).toBeInstanceOf(OpenProductApiService);
  });

  it('should throw error when API config is missing', () => {
    expect(() => {
      ProductenServiceFactory.create({ type: 'api' });
    }).toThrow('API config is required for API service type');
  });

  it('should throw error for unknown service type', () => {
    expect(() => {
      ProductenServiceFactory.create({ type: 'unknown' as any });
    }).toThrow('Unknown service type: unknown');
  });
});
