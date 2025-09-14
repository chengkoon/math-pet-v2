import { AuthApi } from '@chengkoon/mathpet-api-types';
import type {
  LoginRequest,
  UserResponse,
  LogoutResponse,
} from '@chengkoon/mathpet-api-types';
import { getApiConfig } from './config';

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

  async getMe(): Promise<UserResponse> {
    try {
      return await authApi.getCurrentUser();
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  },

  async logout(): Promise<LogoutResponse> {
    try {
      return await authApi.logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};
