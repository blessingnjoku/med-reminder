import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reminder } from "../types/reminder";

interface ReminderState {
  items: Reminder[];
  loading: boolean;
  error: string | null;
}

const initialState: ReminderState = {
  items: [],
  loading: false,
  error: null,
};

const reminderSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Create a new reminder
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.items.push(action.payload);
      state.error = null;
    },

    // Update an existing reminder
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.items.findIndex(
        (r) => r.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
        state.error = null;
      }
    },

    // Delete a reminder
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (r) => r.id !== action.payload
      );
      state.error = null;
    },

    // Set all reminders (when loading from storage)
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.items = action.payload;
      state.error = null;
    },

    // Clear all reminders
    clearReminders: (state) => {
      state.items = [];
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  addReminder,
  updateReminder,
  deleteReminder,
  setReminders,
  clearReminders,
} = reminderSlice.actions;

export default reminderSlice.reducer;
