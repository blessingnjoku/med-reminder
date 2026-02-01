export interface Reminder {
  id: string;
  medicationName: string;
  dosage: string;
  medicationForm?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  scheduledDate: string; // ISO string
  notificationsEnabled: boolean;
  notes?: string;
  clinicName?: string;
  doctorName?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ReminderAdherence {
  reminderId: string;
  date: string; // ISO string
  taken: boolean;
  missedReason?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string; // ISO string
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ReminderState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
}

export interface AdherenceState {
  adherenceRecords: ReminderAdherence[];
  loading: boolean;
  error: string | null;
}
