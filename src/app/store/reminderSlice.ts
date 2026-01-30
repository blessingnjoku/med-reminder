import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReminderState, Reminder } from '../../types/reminder';

const initialState: ReminderState = {
  reminders: [],
  loading: false,
  error: null,
};

export const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
      state.loading = false;
      state.error = null;
    },
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter((r) => r.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setReminders,
  addReminder,
  updateReminder,
  deleteReminder,
  setError,
  clearError,
} = reminderSlice.actions;

export default reminderSlice.reducer;
