import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { AddReminderScreen } from '../screens/reminders/AddReminderScreen';
import { EditReminderScreen } from '../screens/reminders/EditReminderScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator with 4 tabs (Pills, +, History, Settings)
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Reminder',
          tabBarIcon: () => null, // TODO: Add pills icon
        }}
      />
      <Tab.Screen
        name="AddTab"
        component={DashboardScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('AddReminderModal');
          },
        })}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null, // TODO: Add + icon with custom styling
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: () => null, // TODO: Add history icon
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: () => null, // TODO: Add settings icon
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator with modals for Add/Edit Reminder
export const AppNavigator: React.FC = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="AddReminderModal"
        component={AddReminderScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Schedule your medicine',
        }}
      />
      <RootStack.Screen
        name="EditReminderModal"
        component={EditReminderScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Edit Reminder',
        }}
      />
    </RootStack.Navigator>
  );
};
