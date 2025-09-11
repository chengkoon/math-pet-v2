import { Configuration } from '@chengkoon/mathpet-api-types';

export const getApiConfig = () => {
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Optional: Create typed API client factory for consistency
export const createApiClient = <T>(
  ApiClass: new (config: Configuration) => T
): T => {
  return new ApiClass(getApiConfig());
};
