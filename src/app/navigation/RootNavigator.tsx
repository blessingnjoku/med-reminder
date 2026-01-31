import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AppTabs } from "./AppNavigator";
import { AddReminderScreen } from "../screens/reminders/AddReminderScreen";
import { EditReminderScreen } from "../screens/reminders/EditReminderScreen";
import { AuthNavigator } from "./AuthNavigator";

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <RootStack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <RootStack.Screen 
          name="AuthStack" 
          component={AuthNavigator}
        />
      ) : (
        <>
          {/* Main App with Tabs */}
          <RootStack.Screen 
            name="MainTabs" 
            component={AppTabs}
          />

          {/* Full-screen Modals (No Bottom Nav visible here) */}
          <RootStack.Screen
            name="AddReminder"
            component={AddReminderScreen}
            options={{
              presentation: 'card',
            }}
          />

          <RootStack.Screen
            name="EditReminder"
            component={EditReminderScreen}
            options={{
              presentation: 'card',
            }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};