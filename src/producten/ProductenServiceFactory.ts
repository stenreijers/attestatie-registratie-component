import { OpenProductApiService, OpenProductApiConfig } from './OpenProductApiService';
import { ProductenService } from './ProductenService';
import { StaticProductenService } from './StaticProductenService';

export type ProductenServiceType = 'static' | 'api';

export interface ProductenServiceFactoryConfig {
  type: ProductenServiceType;
  apiConfig?: OpenProductApiConfig;
}

export class ProductenServiceFactory {
  static create(config: ProductenServiceFactoryConfig): ProductenService {
    switch (config.type) {
      case 'static':
        return new StaticProductenService();
      case 'api':
        if (!config.apiConfig) {
          throw new Error('API config is required for API service type');
        }
        return new OpenProductApiService(config.apiConfig);
      default:
        throw new Error(`Unknown service type: ${config.type}`);
    }
  }
}
