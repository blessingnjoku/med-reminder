import React from 'react';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

interface RootNavigatorProps {
  isAuthenticated: boolean;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({ isAuthenticated }) => {
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};
