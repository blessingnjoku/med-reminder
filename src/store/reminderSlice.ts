import { createSlice } from "@reduxjs/toolkit";
import { ReminderState } from "../../types/reminder";

const initialState: ReminderState = {
  reminders: [],
  loading: false,
  error: null,
};

const reminderSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    // Add reducers as needed
  },
});

export default reminderSlice.reducer;
