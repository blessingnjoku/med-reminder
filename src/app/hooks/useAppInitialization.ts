import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { restoreUser, setLoading } from '../../store/authSlice';
import { setReminders } from '../../store/reminderSlice';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';

/**
 * Custom hook to handle app initialization logic
 */
export const useAppInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));

        // Request notification permissions on app startup
        await notificationService.requestPermissions();

        // Try to load persisted user from AsyncStorage
        const persistedUser = await storageService.getUser();
        if (persistedUser) {
          dispatch(restoreUser(persistedUser));
        }

        // Load persisted reminders from AsyncStorage
        const persistedReminders = await storageService.getReminders();
        if (persistedReminders && persistedReminders.length > 0) {
          dispatch(setReminders(persistedReminders));
        }

        dispatch(setLoading(false));
        setIsReady(true);
      } catch (error) {
        console.error("Error initializing app:", error);
        dispatch(setLoading(false));
        setIsReady(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  return { isReady };
};