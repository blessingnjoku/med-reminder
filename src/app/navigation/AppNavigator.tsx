import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Platform, View } from "react-native";
import { MaterialCommunityIcons, Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import { colors } from "../theme/colors";


const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconBase}>
              <MaterialCommunityIcons
                name="pill"
                color={color}
                size={size ?? 24}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AddReminder"
        component={() => <View />} // Placeholder
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconBase}>
              <Ionicons name="add-circle" color={color} size={size ?? 24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={() => <View />} // Placeholder
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconBase}>
              <Feather name="calendar" color={color} size={size ?? 24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={() => <View />} // Placeholder
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconBase}>
              <FontAwesome5 name="file-alt" color={color} size={size ?? 24} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 88 : 65,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    position: 'absolute',
    left: 16,
    right: 16,
    // Optional: shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  iconBase: {
    width: 24,
    height: 24,

  },
});
