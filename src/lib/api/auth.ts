import { AuthApi, Configuration } from '@chengkoon/mathpet-api-types';
import type { LoginRequest, UserResponse } from '@chengkoon/mathpet-api-types';

// API Configuration
const getApiConfig = () => {
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Initialize AuthApi
const authApi = new AuthApi(getApiConfig());

// Auth API functions
export const authService = {
  async login(credentials: LoginRequest): Promise<UserResponse> {
    try {
      const response = await authApi.loginUser({
        loginRequest: credentials,
      });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};