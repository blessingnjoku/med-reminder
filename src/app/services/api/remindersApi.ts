/**
 * Reminders API Service
 * Handles all reminder-related API calls
 */

import { httpClient, ApiResponse } from './httpClient';
import { Reminder } from '../../../types/reminder';

export interface CreateReminderRequest {
  medicationName: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  scheduledDate: Date;
  notificationsEnabled?: boolean;
  notes?: string;
  clinicName?: string;
  doctorName?: string;
}

export interface UpdateReminderRequest extends Partial<CreateReminderRequest> {
  id: string;
}

export const remindersApi = {
  /**
   * Get all reminders for the authenticated user
   */
  async getReminders(): Promise<ApiResponse<Reminder[]>> {
    return await httpClient.get<Reminder[]>('/reminders');
  },

  /**
   * Get a single reminder by ID
   */
  async getReminder(id: string): Promise<ApiResponse<Reminder>> {
    return await httpClient.get<Reminder>(`/reminders/${id}`);
  },

  /**
   * Create a new reminder
   */
  async createReminder(data: CreateReminderRequest): Promise<ApiResponse<Reminder>> {
    return await httpClient.post<Reminder>('/reminders', data);
  },

  /**
   * Update an existing reminder
   */
  async updateReminder(data: UpdateReminderRequest): Promise<ApiResponse<Reminder>> {
    const { id, ...updateData } = data;
    return await httpClient.put<Reminder>(`/reminders/${id}`, updateData);
  },

  /**
   * Delete a reminder
   */
  async deleteReminder(id: string): Promise<ApiResponse<void>> {
    return await httpClient.delete<void>(`/reminders/${id}`);
  },

  /**
   * Get reminders for a specific date
   */
  async getRemindersByDate(date: string): Promise<ApiResponse<Reminder[]>> {
    return await httpClient.get<Reminder[]>(`/reminders/date/${date}`);
  },
};
