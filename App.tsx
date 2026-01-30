import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import { RootNavigator } from './src/app/navigation/RootNavigator';

export default function App() {
  // TODO: Replace with actual auth state from Redux
  const [isAuthenticated] = useState(true);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator isAuthenticated={isAuthenticated} />
      </NavigationContainer>
    </Provider>
  );
}
