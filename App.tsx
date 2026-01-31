import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch } from "react-redux";
import { StatusBar } from "react-native";
import { store, AppDispatch } from "./src/store";
import { RootNavigator } from "./src/app/navigation/RootNavigator";
import { restoreUser, setLoading } from "./src/store/authSlice";
import { setReminders } from "./src/store/reminderSlice";
import { storageService } from "./src/app/services/storage";
import { colors } from "./src/app/theme/colors";

/**
 * App Initialization Component
 * Handles loading persisted user data on app startup
 */
function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));

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

  if (!isReady) {
    return null; // Or return a splash screen
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}
