// Screen prop types

// Dashboard
export type TabType = 'today' | 'tomorrow' | 'other';

export interface DashboardScreenProps {
  navigation: any;
}

// History
export interface HistoryScreenProps {
  navigation?: any;
}

// Adherence
export interface AdherenceStatsScreenProps {
  navigation: any;
}

// Auth
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SplashScreenProps {
  navigation: any;
}

// Settings
export interface SettingsScreenProps {
  navigation: any;
}

// Reminders
export interface AddReminderScreenProps {
  navigation: any;
}

export interface EditReminderScreenProps {
  navigation: any;
  route: {
    params: {
      reminder: any;
    };
  };
}
