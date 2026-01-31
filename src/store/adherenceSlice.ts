import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

interface AdherenceRecord {
  reminderId: string;
  date: string;
  taken: boolean;
  missedReason?: string;
}

interface AdherenceState {
  completed: string[];
  adherence: AdherenceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: AdherenceState = {
  completed: [],
  adherence: [],
  loading: false,
  error: null,
};

const adherenceSlice = createSlice({
  name: "adherence",
  initialState,
  reducers: {
    markReminderAsTaken: (state, action: PayloadAction<string>) => {
      const reminderId = action.payload;
      if (!state.completed.includes(reminderId)) {
        state.completed.push(reminderId);
      }
      
      // Also add to adherence records for today
      const today = dayjs().format('YYYY-MM-DD');
      const existingRecord = state.adherence.find(
        (record) => record.reminderId === reminderId && record.date === today
      );
      
      if (!existingRecord) {
        state.adherence.push({
          reminderId,
          date: today,
          taken: true,
        });
      } else {
        existingRecord.taken = true;
      }
    },

    unmarkReminder: (state, action: PayloadAction<string>) => {
      const reminderId = action.payload;
      state.completed = state.completed.filter((id) => id !== reminderId);
      
      // Remove or mark as not taken in adherence records for today
      const today = dayjs().format('YYYY-MM-DD');
      const record = state.adherence.find(
        (r) => r.reminderId === reminderId && r.date === today
      );
      if (record) {
        record.taken = false;
      }
    },

    recordAdherence: (
      state,
      action: PayloadAction<{
        reminderId: string;
        date: string;
        taken: boolean;
        missedReason?: string;
      }>
    ) => {
      const { reminderId, date, taken, missedReason } = action.payload;
      const existingIndex = state.adherence.findIndex(
        (record) => record.reminderId === reminderId && record.date === date
      );
      
      if (existingIndex >= 0) {
        state.adherence[existingIndex] = {
          ...state.adherence[existingIndex],
          taken,
          missedReason,
        };
      } else {
        state.adherence.push({
          reminderId,
          date,
          taken,
          missedReason,
        });
      }

      // Update completed list if taken today
      if (taken && date === dayjs().format('YYYY-MM-DD')) {
        if (!state.completed.includes(reminderId)) {
          state.completed.push(reminderId);
        }
      }
    },

    resetDailyAdherence: (state) => {
      state.completed = [];
    },

    loadAdherence: (
      state,
      action: PayloadAction<{
        completed: string[];
        adherence: AdherenceRecord[];
      }>
    ) => {
      state.completed = action.payload.completed;
      state.adherence = action.payload.adherence;
    },
  },
});

export const {
  markReminderAsTaken,
  unmarkReminder,
  recordAdherence,
  resetDailyAdherence,
  loadAdherence,
} = adherenceSlice.actions;

export default adherenceSlice.reducer;
