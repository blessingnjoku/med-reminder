import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { AppHeader } from '../../components/AppHeader';
import { AdherenceQuickStats } from '../../components/AdherenceQuickStats';
import { ReminderCard } from '../../components/ReminderCard';
import { MedicationDetailsBottomSheet } from '../../components/MedicationDetailsBottomSheet';
import { colors } from '../../theme/colors';
import { RootState, AppDispatch } from '../../../store';
import { setReminders } from '../../../store/reminderSlice';
import { markReminderAsTaken } from '../../../store/adherenceSlice';
import { adherenceApi } from '../../services/api';
import { config } from '../../../config/environment';
import { storageService } from '../../services/storage';
import { Reminder } from '../../../types/reminder';
import { TabType, DashboardScreenProps } from '../../../types/screens';
import { useMockData } from '../../hooks/useMockData';

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const { reminders: displayReminders, isMockData } = useMockData();
  const completedReminders = useSelector((state: RootState) => state.adherence.completed);

  // Reload reminders when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadReminders = async () => {
        const persistedReminders = await storageService.getReminders();
        if (persistedReminders && persistedReminders.length > 0) {
          dispatch(setReminders(persistedReminders));
        }
      };
      
      // Only load from storage if not using mock data
      if (!isMockData) {
        loadReminders();
      }
    }, [dispatch, isMockData])
  );

  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');

  const filterRemindersByTab = (tab: TabType) => {
    const filtered = displayReminders.filter((reminder) => {
      const reminderDate = dayjs(reminder.scheduledDate).startOf('day');

      if (tab === 'today') return reminderDate.isSame(today);
      if (tab === 'tomorrow') return reminderDate.isSame(tomorrow);
      if (tab === 'other') return reminderDate.isAfter(tomorrow);

      return false;
    });
    
    // Reverse to show newest first
    return filtered.reverse();
  };

  const isReminderCompleted = (reminderId: string) =>
    completedReminders.includes(reminderId);

  const filteredReminders = filterRemindersByTab(activeTab).filter(
    (reminder) => !isReminderCompleted(reminder.id)
  );

  const handleMarkAsTaken = async (reminderId: string) => {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock mode: just update Redux
        dispatch(markReminderAsTaken(reminderId));
      } else {
        // API mode: call backend
        await adherenceApi.markAsTaken(reminderId);
        
        // Update Redux after successful API call
        dispatch(markReminderAsTaken(reminderId));
      }
    } catch (error: any) {
      console.error('Error marking reminder as taken:', error);
      Alert.alert('Error', error.message || 'Failed to mark as taken');
    }
  };

  const getTodayText = () => {
    return `Today • ${today.format('ddd, MMM DD')}`;
  };

  const getTomorrowText = () => {
    return `Tomorrow • ${tomorrow.format('ddd, MMM DD')}`;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateIcon}>💊</Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'today'
          ? 'All medications taken'
          : activeTab === 'tomorrow'
            ? 'No medications scheduled'
            : 'No upcoming medications'}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {activeTab === 'today'
          ? 'Keep up the great work with your health routine!'
          : 'Add a medication reminder to stay on track with your health.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      {/* Adherence Quick Stats */}
      <AdherenceQuickStats reminders={displayReminders} />

      {/* Reminder Label */}
      <View style={styles.reminderLabelContainer}>
        <Text style={styles.reminderLabel}>Reminders</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.tabActive]}
          onPress={() => setActiveTab('today')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'today' && styles.tabTextActive,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'tomorrow' && styles.tabActive]}
          onPress={() => setActiveTab('tomorrow')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'tomorrow' && styles.tabTextActive,
            ]}
          >
            Tomorrow
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'other' && styles.tabActive]}
          onPress={() => setActiveTab('other')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'other' && styles.tabTextActive,
            ]}
          >
            Other
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Label */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {activeTab === 'today'
            ? getTodayText()
            : activeTab === 'tomorrow'
              ? getTomorrowText()
              : 'Upcoming Dates'}
        </Text>
      </View>

      {/* Reminders List */}
      <FlatList
        data={filteredReminders}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <ReminderCard
            item={item as any}
            isPriority={activeTab === 'today'}
            onPress={() => {
              setSelectedReminder(item as Reminder);
              setShowDetailsSheet(true);
            }}
            onCheck={() => handleMarkAsTaken(item.id)}
            isCompleted={isReminderCompleted(item.id)}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          filteredReminders.length === 0 ? styles.emptyListContent : styles.listContentContainer
        }
      />

      {/* Medication Details Bottom Sheet */}
      <MedicationDetailsBottomSheet
        visible={showDetailsSheet}
        medication={selectedReminder}
        onClose={() => {
          setShowDetailsSheet(false);
          setSelectedReminder(null);
        }}
        onEdit={(medication) => {
          // Navigate to edit screen with medication data
          navigation.navigate('EditReminder', { reminder: medication });
        }}
        onMarkAsTaken={(medicationId) => {
          handleMarkAsTaken(medicationId);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textInverse,
  },
  dateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  reminderLabelContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  reminderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
