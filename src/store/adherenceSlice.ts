import { createSlice } from "@reduxjs/toolkit";
import { AdherenceState } from "../../types/reminder";

const initialState: AdherenceState = {
  adherenceRecords: [],
  loading: false,
  error: null,
};

const adherenceSlice = createSlice({
  name: "adherence",
  initialState,
  reducers: {
    // Add reducers as needed
  },
});

export default adherenceSlice.reducer;
