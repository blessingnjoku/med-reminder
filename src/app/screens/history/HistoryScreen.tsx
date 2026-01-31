import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '../../components/AppHeader';
import { ReminderCard } from '../../components/ReminderCard';
import { colors } from '../../theme/colors';
import { RootState } from '../../../store';
import { mockReminders, mockAdherence } from '../../../utils/mockReminders';

interface HistoryScreenProps {
  navigation?: any;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const reminders = useSelector((state: RootState) => state.reminders.items);
  const adherence = useSelector((state: RootState) => state.adherence.adherence);

  // Use mock data if no reminders in Redux
  const displayReminders = reminders.length > 0 ? reminders : mockReminders;
  const displayAdherence = adherence && adherence.length > 0 ? adherence : mockAdherence;

  // Get reminders for selected date
  const getRemindersForDate = (date: Dayjs) => {
    return displayReminders.filter((reminder) =>
      dayjs(reminder.scheduledDate).isSame(date, 'day')
    );
  };

  // Get adherence data for selected date
  const getAdherenceForDate = (reminderId: string, date: Dayjs) => {
    return displayAdherence.find(
      (a) =>
        a.reminderId === reminderId && dayjs(a.date).isSame(date, 'day')
    );
  };

  const remindersForDate = getRemindersForDate(selectedDate);

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const month = selectedDate.startOf('month');
    const daysInMonth = month.daysInMonth();
    const startingDay = month.day();
    const days = [];

    // Add empty days before month starts
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(month.date(i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = dayjs();

  const renderCalendarDay = (day: Dayjs | null) => {
    if (!day) {
      return (
        <View key={`empty-${Math.random()}`} style={styles.calendarDayEmpty} />
      );
    }

    const isSelected = day.isSame(selectedDate, 'day');
    const isToday = day.isSame(today, 'day');
    const isBeforeToday = day.isBefore(today, 'day');
    const dayReminders = getRemindersForDate(day);

    return (
      <Pressable
        key={day.format('YYYY-MM-DD')}
        style={[
          styles.calendarDay,
          isSelected && styles.calendarDaySelected,
          isToday && styles.calendarDayToday,
          isBeforeToday && !isSelected && styles.calendarDayPast,
        ]}
        onPress={() => setSelectedDate(day)}
      >
        <Text
          style={[
            styles.calendarDayText,
            isSelected && styles.calendarDayTextSelected,
            isToday && !isSelected && styles.calendarDayTextToday,
          ]}
        >
          {day.format('D')}
        </Text>
        {dayReminders.length > 0 && (
          <View style={styles.calendarDayIndicator} />
        )}
      </Pressable>
    );
  };

  // Calculate adherence statistics for selected date
  const calculateAdherence = () => {
    if (remindersForDate.length === 0) return { total: 0, taken: 0 };

    const taken = remindersForDate.filter((reminder) => {
      const adherenceData = getAdherenceForDate(reminder.id, selectedDate);
      return adherenceData?.taken;
    }).length;

    return {
      total: remindersForDate.length,
      taken,
    };
  };

  const adherenceStats = calculateAdherence();
  const adherencePercentage =
    adherenceStats.total > 0
      ? Math.round((adherenceStats.taken / adherenceStats.total) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        showBackButton={navigation ? true : false}
        onBackPress={() => navigation?.goBack()}
        title={navigation ? "History" : undefined}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity
              onPress={() => setSelectedDate(selectedDate.subtract(1, 'month'))}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            <Text style={styles.calendarMonth}>
              {selectedDate.format('MMMM YYYY')}
            </Text>

            <TouchableOpacity
              onPress={() => setSelectedDate(selectedDate.add(1, 'month'))}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Weekday Headers */}
          <View style={styles.weekdayHeaders}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day) => renderCalendarDay(day))}
          </View>

          {/* Today Button */}
          {!selectedDate.isSame(today, 'day') && (
            <TouchableOpacity
              style={styles.todayButton}
              onPress={() => setSelectedDate(today)}
            >
              <Text style={styles.todayButtonText}>Go to Today</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Adherence Summary */}
        {remindersForDate.length > 0 && (
          <View style={styles.adherenceCard}>
            <View style={styles.adheranceDetails}>
              <View style={styles.adheranceRow}>
                <Text style={styles.adheranceLabel}>Taken:</Text>
                <Text style={[styles.adheranceValue, { color: colors.success }]}>
                  {adherenceStats.taken}
                </Text>
              </View>
              <View style={styles.adheranceRow}>
                <Text style={styles.adheranceLabel}>Not Taken:</Text>
                <Text style={[styles.adheranceValue, { color: colors.error }]}>
                  {adherenceStats.total - adherenceStats.taken}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Reminders for Selected Date */}
        <View style={styles.remindersSection}>
          <Text style={styles.sectionTitle}>Medications</Text>
          {remindersForDate.length > 0 ? (
            <View style={styles.medicationsListContainer}>
              <FlatList
                data={remindersForDate}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const adherenceData = getAdherenceForDate(
                    item.id,
                    selectedDate
                  );
                  return (
                    <ReminderCard
                      item={item as any}
                      isPriority={false}
                      isCompleted={adherenceData?.taken}
                    />
                  );
                }}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateText}>
                No medications scheduled for this date
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  calendarSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  weekdayHeaders: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  calendarDayEmpty: {
    width: '14.28%',
    aspectRatio: 1,
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary,
  },
  calendarDayPast: {
    opacity: 0.5,
  },
  calendarDayText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
    padding: 0,
    paddingBottom: 10,
  },
  calendarDayTextSelected: {
    color: colors.textInverse,
  },
  calendarDayTextToday: {
    color: colors.primary,
  },
  calendarDayIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accentSuccess,
  },
  todayButton: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  selectedDateSection: {
    marginBottom: 12,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  adherenceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  adheranceDetails: {
    gap: 12,
  },
  adheranceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adheranceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  adheranceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  remindersSection: {
    marginBottom: 20,
  },
  medicationsListContainer: {
    maxHeight: 400,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

