/**
 * Adherence API Service
 * Handles all adherence-related API calls
 */

import { httpClient, ApiResponse } from './httpClient';
import { AdherenceRecord } from '../../../utils/adherenceHelpers';

export interface RecordAdherenceRequest {
  reminderId: string;
  date: string;
  taken: boolean;
  missedReason?: string;
}

export interface AdherenceStats {
  totalReminders: number;
  takenCount: number;
  missedCount: number;
  adherenceRate: number;
}

export const adherenceApi = {
  /**
   * Get all adherence records for the authenticated user
   */
  async getAdherenceRecords(): Promise<ApiResponse<AdherenceRecord[]>> {
    return await httpClient.get<AdherenceRecord[]>('/adherence');
  },

  /**
   * Get adherence records for a specific date range
   */
  async getAdherenceByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<AdherenceRecord[]>> {
    return await httpClient.get<AdherenceRecord[]>(
      `/adherence?startDate=${startDate}&endDate=${endDate}`
    );
  },

  /**
   * Record adherence for a reminder
   */
  async recordAdherence(data: RecordAdherenceRequest): Promise<ApiResponse<AdherenceRecord>> {
    return await httpClient.post<AdherenceRecord>('/adherence', data);
  },

  /**
   * Get adherence statistics
   */
  async getAdherenceStats(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<AdherenceStats>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString();
    return await httpClient.get<AdherenceStats>(
      `/adherence/stats${query ? `?${query}` : ''}`
    );
  },

  /**
   * Mark a reminder as taken for today
   */
  async markAsTaken(reminderId: string): Promise<ApiResponse<AdherenceRecord>> {
    return await httpClient.post<AdherenceRecord>('/adherence/mark-taken', {
      reminderId,
      date: new Date().toISOString().split('T')[0],
      taken: true,
    });
  },
};
