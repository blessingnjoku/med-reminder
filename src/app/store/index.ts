import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import reminderReducer from './reminderSlice';
import adherenceReducer from './adherenceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reminder: reminderReducer,
    adherence: adherenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
