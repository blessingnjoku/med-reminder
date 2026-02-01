import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { RootNavigator } from '../navigation/RootNavigator';
import { QuickTakenModal } from '../components/QuickTakenModal';
import { useAppInitialization } from '../hooks/useAppInitialization';
import { useNotificationHandler } from '../hooks/useNotificationHandler';
import { colors } from '../theme/colors';

/**
 * App Initializer Component
 * Handles app initialization and notification handling
 */
export const AppInitializer: React.FC = () => {
  const { isReady } = useAppInitialization();
  const { 
    quickModalVisible, 
    selectedReminder, 
    handleMarkAsTaken, 
    closeModal 
  } = useNotificationHandler();

  if (!isReady) {
    return null; // Or return a splash screen component
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
        onClose={closeModal}
        onMarkAsTaken={handleMarkAsTaken}
      />
    </>
  );
};