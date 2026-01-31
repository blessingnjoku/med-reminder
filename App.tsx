import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import { store, AppDispatch, RootState } from "./src/store";
import { RootNavigator } from "./src/app/navigation/RootNavigator";
import { restoreUser, setLoading } from "./src/store/authSlice";
import { setReminders } from "./src/store/reminderSlice";
import { markReminderAsTaken } from "./src/store/adherenceSlice";
import { storageService } from "./src/app/services/storage";
import { QuickTakenModal } from "./src/app/components/QuickTakenModal";
import { colors } from "./src/app/theme/colors";

/**
 * Request notification permissions from the user
 */
async function requestNotificationPermissions() {
  try {
    // Set up notification channel for Android first
    if (require('react-native').Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get notification permissions');
    } else {
      console.log('Notification permissions granted');
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
  }
}

/**
 * App Initialization Component
 * Handles loading persisted user data on app startup
 */
function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector((state: RootState) => state.reminders.items);
  const [isReady, setIsReady] = useState(false);
  const [quickModalVisible, setQuickModalVisible] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));

        // Request notification permissions on app startup
        await requestNotificationPermissions();

        // Try to load persisted user from AsyncStorage
        const persistedUser = await storageService.getUser();

        if (persistedUser) {
          // User was previously logged in, restore their session
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

  // Handle notification tap
  useEffect(() => {
    // Check if app was opened from notification
    const checkNotificationResponse = async () => {
      try {
        const response = await Notifications.getLastNotificationResponseAsync();
        console.log('Last notification response:', response);
        if (response?.notification) {
          const reminderId = response.notification.request.content.data?.reminderId as string;
          console.log('Reminder ID from notification response:', reminderId);
          if (reminderId) {
            setSelectedReminderId(reminderId);
            setQuickModalVisible(true);
          }
        }
      } catch (error) {
        console.error('Error checking notification response:', error);
      }
    };

    checkNotificationResponse();

    // Listen for notification taps while app is running
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('📢 Notification response received:', response);
        console.log('Notification data:', response.notification.request.content.data);
        const reminderId = response.notification.request.content.data?.reminderId as string;
        if (reminderId) {
          console.log('✅ Opening quick modal for reminder:', reminderId);
          setSelectedReminderId(reminderId);
          setQuickModalVisible(true);
        }
      }
    );

    // Also listen for notifications received in foreground
    const notificationSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📬 Notification received in foreground:', notification);
      }
    );

    return () => {
      responseSubscription.remove();
      notificationSubscription.remove();
    };
  }, []);

  const selectedReminder = selectedReminderId
    ? reminders.find((r) => r.id === selectedReminderId)
    : null;

  const handleMarkAsTaken = () => {
    if (selectedReminderId) {
      dispatch(markReminderAsTaken(selectedReminderId));
    }
  };

  if (!isReady) {
    return null; // Or return a splash screen
  }

  return (
    <>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <RootNavigator />
      </NavigationContainer>

      {/* Quick Taken Modal for Notifications */}
      <QuickTakenModal
        visible={quickModalVisible}
        medicationName={selectedReminder?.medicationName || null}
        onClose={() => setQuickModalVisible(false)}
        onMarkAsTaken={handleMarkAsTaken}
      />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}
