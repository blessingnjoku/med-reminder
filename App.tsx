import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./src/app/navigation/AppNavigator";
import { StatusBar } from "react-native";
import { colors } from "./src/app/theme/colors";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AppNavigator />
    </NavigationContainer>
  );
}
