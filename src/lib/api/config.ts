import { Configuration } from '@chengkoon/mathpet-api-types';

export const getApiConfig = () => {
  let token = '';
  if (typeof window !== 'undefined') {
    token =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1] || '';
  }
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// Optional: Create typed API client factory for consistency
export const createApiClient = <T>(
  ApiClass: new (config: Configuration) => T
): T => {
  return new ApiClass(getApiConfig());
};

import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof Response) {
    throw new ApiError(
      error.status,
      `API Error: ${error.status} ${error.statusText}`,
      error
    );
  }

  if (error instanceof Error) {
    toast.error(error.message);
    throw new ApiError(500, error.message, error);
  }

  toast.error('An unexpected error occurred');
  throw new ApiError(500, 'Unknown error', error);
};
