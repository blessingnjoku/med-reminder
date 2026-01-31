// Mock data for medication reminders and adherence
// Uses types from src/types/reminder.ts

import { ReminderAdherence, User } from '../types/reminder';

// Define MedType locally since it's not exported from reminder types
export type MedType = 'Pills' | 'Capsules' | 'Liquid' | 'Injection' | 'Drops';

// Define a local Reminder type for mock data
export interface MockReminder {
  id: string;
  medicationName: string;
  dosage: number;
  mg: number;
  medicationForm: MedType;
  frequency: string;
  time: string;
  scheduledDate: Date;
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
    scheduledDate: new Date('2026-01-31T00:00:00Z'),
    notes: 'Take with food',
    createdAt: new Date('2026-01-31T08:00:00Z'),
    updatedAt: new Date('2026-01-31T08:00:00Z'),
  },
  {
    id: 'reminder_2',
    medicationName: 'Metformin',
    dosage: 2,
    mg: 500,
    medicationForm: 'Capsules',
    frequency: 'once a day',
    time: '20:00',
    scheduledDate: new Date('2026-01-31T00:00:00Z'),
    notes: '',
    createdAt: new Date('2026-01-31T20:00:00Z'),
    updatedAt: new Date('2026-01-31T20:00:00Z'),
  },
  {
    id: 'reminder_3',
    medicationName: 'Vitamin D',
    dosage: 3,
    mg: 2000,
    medicationForm: 'Liquid',
    frequency: 'weekly',
    time: '09:00',
    scheduledDate: new Date('2026-02-01T00:00:00Z'),
    notes: 'Sunday only',
    createdAt: new Date('2026-02-01T09:00:00Z'),
    updatedAt: new Date('2026-02-01T09:00:00Z'),
  },
  {
    id: 'reminder_4',
    medicationName: 'Amoxicillin',
    dosage: 1,
    mg: 500,
    medicationForm: 'Capsules',
    frequency: 'three times a day',
    time: '12:00',
    scheduledDate: new Date('2026-01-31T00:00:00Z'),
    notes: 'Take with water',
    createdAt: new Date('2026-01-31T12:00:00Z'),
    updatedAt: new Date('2026-01-31T12:00:00Z'),
  },
  {
    id: 'reminder_5',
    medicationName: 'Cough Syrup',
    dosage: 2,
    mg: 5,
    medicationForm: 'Liquid',
    frequency: 'twice a day',
    time: '18:00',
    scheduledDate: new Date('2026-01-31T00:00:00Z'),
    notes: 'Shake well before use',
    createdAt: new Date('2026-01-31T18:00:00Z'),
    updatedAt: new Date('2026-01-31T18:00:00Z'),
  },
  {
    id: 'reminder_6',
    medicationName: 'Eye Drops',
    dosage: 1,
    mg: 1,
    medicationForm: 'Drops',
    frequency: 'as needed',
    time: '22:00',
    scheduledDate: new Date('2026-02-01T00:00:00Z'),
    notes: '',
    createdAt: new Date('2026-02-01T10:00:00Z'),
    updatedAt: new Date('2026-02-01T10:00:00Z'),
  },
];

export const mockAdherence: ReminderAdherence[] = [
  {
    reminderId: 'reminder_1',
    date: new Date('2026-01-31T08:00:00Z'),
    taken: true,
  },
  {
    reminderId: 'reminder_2',
    date: new Date('2026-01-31T20:00:00Z'),
    taken: false,
    missedReason: 'Forgot',
  },
  {
    reminderId: 'reminder_3',
    date: new Date('2026-02-01T09:00:00Z'),
    taken: false,
  },
  {
    reminderId: 'reminder_4',
    date: new Date('2026-01-31T12:00:00Z'),
    taken: true,
  },
  {
    reminderId: 'reminder_5',
    date: new Date('2026-01-31T18:00:00Z'),
    taken: false,
  },
  {
    reminderId: 'reminder_6',
    date: new Date('2026-02-01T10:00:00Z'),
    taken: false,
  },
];

