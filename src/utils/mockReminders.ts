// Mock data for medication reminders and adherence
// Uses types from src/types/reminder.ts

import { ReminderAdherence, User } from '../types/reminder';

// Define MedType locally since it's not exported from reminder types
export type MedType = 'Pills' | 'Capsules' | 'Liquid';

// Define a local Reminder type for mock data
export interface MockReminder {
  id: string;
  medicationName: string;
  dosage: number;
  mg: number;
  medicationForm: MedType;
  frequency: string;
  time: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mockReminders: MockReminder[] = [
  {
    id: 'reminder_1',
    medicationName: 'Aspirin',
    dosage: 1,
    mg: 100,
    medicationForm: 'Pills',
    frequency: 'twice a day',
    time: '08:00',
    notes: 'Take with food',
    createdAt: new Date('2026-01-01T08:00:00Z'),
    updatedAt: new Date('2026-01-01T08:00:00Z'),
  },
  {
    id: 'reminder_2',
    medicationName: 'Metformin',
    dosage: 2,
    mg: 500,
    medicationForm: 'Capsules',
    frequency: 'once a day',
    time: '20:00',
    notes: '',
    createdAt: new Date('2026-01-02T20:00:00Z'),
    updatedAt: new Date('2026-01-02T20:00:00Z'),
  },
  {
    id: 'reminder_3',
    medicationName: 'Vitamin D',
    dosage: 3,
    mg: 2000,
    medicationForm: 'Liquid',
    frequency: 'weekly',
    time: '09:00',
    notes: 'Sunday only',
    createdAt: new Date('2026-01-03T09:00:00Z'),
    updatedAt: new Date('2026-01-03T09:00:00Z'),
  },
];

export const mockAdherence: ReminderAdherence[] = [
  {
    reminderId: 'reminder_1',
    date: new Date('2026-01-29T08:00:00Z'),
    taken: true,
  },
  {
    reminderId: 'reminder_2',
    date: new Date('2026-01-29T20:00:00Z'),
    taken: false,
    missedReason: 'Forgot',
  },
  {
    reminderId: 'reminder_3',
    date: new Date('2026-01-25T09:00:00Z'),
    taken: true,
  },
];

export const mockUser: User = {
  id: 'user_1',
  email: 'testuser@example.com',
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date('2026-01-01T00:00:00Z'),
};
