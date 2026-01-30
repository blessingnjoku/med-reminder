import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdherenceState, ReminderAdherence } from '../../types/reminder';

const initialState: AdherenceState = {
  adherenceRecords: [],
  loading: false,
  error: null,
};

export const adherenceSlice = createSlice({
  name: 'adherence',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAdherence: (state, action: PayloadAction<ReminderAdherence[]>) => {
      state.adherenceRecords = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAdherence: (state, action: PayloadAction<ReminderAdherence>) => {
      state.adherenceRecords.push(action.payload);
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
  setAdherence,
  addAdherence,
  setError,
  clearError,
} = adherenceSlice.actions;

export default adherenceSlice.reducer;
