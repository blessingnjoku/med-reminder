import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { AppInitializer } from "./src/app/components/AppInitializer";

/**
 * Main App Component
 * Sets up Redux Provider and app initialization
 */
export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}
