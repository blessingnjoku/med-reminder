/**
 * Authentication API Service
 * Handles all auth-related API calls
 */

import { httpClient, ApiResponse } from './httpClient';
import { User } from '../../../types/reminder';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    
    // Set auth token for subsequent requests
    if (response.success && response.data.token) {
      httpClient.setAuthToken(response.data.token);
    }
    
    return response;
  },

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>('/auth/register', userData);
    
    // Set auth token for subsequent requests
    if (response.success && response.data.token) {
      httpClient.setAuthToken(response.data.token);
    }
    
    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await httpClient.post<void>('/auth/logout');
    
    // Clear auth token
    httpClient.setAuthToken(null);
    
    return response;
  },

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return await httpClient.post<{ token: string }>('/auth/refresh');
  },

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    return await httpClient.get<{ valid: boolean }>('/auth/verify');
  },
};
