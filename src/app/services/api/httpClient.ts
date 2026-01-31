/**
 * Base HTTP Client for API requests
 * Handles common request/response logic, headers, and error handling
 */

import { config } from '../../../config/environment';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

class HttpClient {
  private baseURL: string;
  private timeout: number;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = config.API_URL;
    this.timeout = config.TIMEOUT;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const error: ApiError = isJson
        ? await response.json()
        : { message: response.statusText, statusCode: response.status };

      throw error;
    }

    if (isJson) {
      return await response.json();
    }

    return {
      data: null as T,
      success: true,
    };
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw { message: 'Request timeout', statusCode: 408 } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw { message: 'Request timeout', statusCode: 408 } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw { message: 'Request timeout', statusCode: 408 } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw { message: 'Request timeout', statusCode: 408 } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const httpClient = new HttpClient();
