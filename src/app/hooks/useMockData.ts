/**
 * Mock Data Provider Hook
 * Handles conditional use of mock data based on environment configuration
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { mockReminders, mockAdherence } from '../../utils/mockReminders';
import { config } from '../../config/environment';

export const useMockData = () => {
  const reminders = useSelector((state: RootState) => state.reminders.items);
  const adherence = useSelector((state: RootState) => state.adherence.adherence);

  const displayReminders = useMemo(() => {
    // If in development and USE_MOCK_DATA is true, use mock data when no real data exists
    if (config.USE_MOCK_DATA && reminders.length === 0) {
      return mockReminders;
    }
    // Otherwise use real data only
    return reminders;
  }, [reminders]);

  const displayAdherence = useMemo(() => {
    // If in development and USE_MOCK_DATA is true, use mock data when no real data exists
    if (config.USE_MOCK_DATA && (!adherence || adherence.length === 0)) {
      return mockAdherence;
    }
    // Otherwise use real data only
    return adherence || [];
  }, [adherence]);

  return {
    reminders: displayReminders,
    adherence: displayAdherence,
    isMockData: config.USE_MOCK_DATA && reminders.length === 0,
  };
};
