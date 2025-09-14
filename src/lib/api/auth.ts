import { AuthApi } from '@chengkoon/mathpet-api-types';
import type { LoginRequest, UserResponse } from '@chengkoon/mathpet-api-types';
import { getApiConfig, createCustomApiClient } from './config';

// Initialize AuthApi
const authApi = new AuthApi(getApiConfig());
const customApiClient = createCustomApiClient();

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

  async getMe(): Promise<UserResponse> {
    try {
      return await customApiClient.get<UserResponse>('/api/auth/me');
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await customApiClient.post<void>('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};
