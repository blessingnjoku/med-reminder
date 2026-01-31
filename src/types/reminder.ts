export interface Reminder {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  scheduledDate: Date;
  notes?: string;
  clinicName?: string;
  doctorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderAdherence {
  reminderId: string;
  date: Date;
  taken: boolean;
  missedReason?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
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
