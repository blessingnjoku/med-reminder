// Component prop types
import { TextInputProps } from 'react-native';
import { Reminder } from './reminder';

// Header Components
export interface AppHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  title?: string;
}

// Form Components
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export interface MedicationFormValues {
  medicationName?: string;
  dosage?: string;
  dosageUnit?: string;
  medicationForm?: string;
  quantity?: string;
  frequencyType?: string;
  timesPerDay?: string;
  times?: string[];
  selectedDays?: string[];
  weeklyTime?: string;
  scheduledDate?: string;
  notificationsEnabled?: boolean;
  notes?: string;
  clinicName?: string;
  doctorName?: string;
}

export interface MedicationFormProps {
  onSubmit: (values: any) => void;
  isLoading?: boolean;
  initialValues?: MedicationFormValues;
  submitButtonText?: string;
}

// Card Components
export interface ReminderCardProps {
  item: any;
  isPriority?: boolean;
  onPress?: () => void;
  onCheck?: (id: string) => void;
  isCompleted?: boolean;
}

export interface MedicationDetailsBottomSheetProps {
  visible: boolean;
  medication: Reminder | null;
  onClose: () => void;
  onEdit: (medication: Reminder) => void;
  onMarkAsTaken: (medicationId: string) => void;
}

// Modal Components
export interface QuickTakenModalProps {
  visible: boolean;
  medicationName: string | null;
  onClose: () => void;
  onMarkAsTaken: () => void;
}

// Adherence Components
export interface AdherenceStatsCardProps {
  reminders: any[];
}

export interface AdherenceQuickStatsProps {
  reminders: any[];
}
