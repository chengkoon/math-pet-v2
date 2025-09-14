import { Configuration } from '@chengkoon/mathpet-api-types';

export const getApiConfig = () => {
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Enable cookies for authentication
  });
};

// Custom fetch client for endpoints not yet available in generated API types
export const createCustomApiClient = () => {
  const basePath =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  return {
    async get<T>(endpoint: string): Promise<T> {
      const response = await fetch(`${basePath}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    },

    async post<T>(endpoint: string, body?: unknown): Promise<T> {
      const requestInit: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      };

      if (body) {
        requestInit.body = JSON.stringify(body);
      }

      const response = await fetch(`${basePath}${endpoint}`, requestInit);

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Handle responses with no content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      return {} as T;
    },
  };
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
