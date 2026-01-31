/**
 * API Service Index
 * Central export point for all API services
 */

export { httpClient } from './httpClient';
export { authApi } from './authApi';
export { remindersApi } from './remindersApi';
export { adherenceApi } from './adherenceApi';

export type { ApiResponse, ApiError } from './httpClient';
export type { LoginRequest, RegisterRequest, AuthResponse } from './authApi';
export type { 
  CreateReminderRequest, 
  UpdateReminderRequest 
} from './remindersApi';
export type { 
  RecordAdherenceRequest, 
  AdherenceStats 
} from './adherenceApi';
