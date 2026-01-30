import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AppTabs } from "./AppNavigator";
import { AddReminderScreen } from "../screens/reminders/AddReminderScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";

const RootStack = createStackNavigator();

export const RootNavigator = () => {
  const isAuthenticated = true; // Replace with logic from your authSlice

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <>
          {/* Main App with Tabs */}
          <RootStack.Screen name="MainTabs" component={AppTabs} />

          {/* Full-screen Modals (No Bottom Nav visible here) */}
          <RootStack.Screen
            name="AddReminder"
            component={AddReminderScreen}
            options={{ presentation: "modal" }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};
