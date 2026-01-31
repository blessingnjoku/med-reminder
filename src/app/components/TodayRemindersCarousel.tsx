import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colors } from '../theme/colors';
import { Reminder } from '../../types/reminder';

interface TodayRemindersCarouselProps {
  reminders: Reminder[];
  onReminderPress: (reminder: Reminder) => void;
  onMarkAsTaken: (reminderId: string) => void;
}

export const TodayRemindersCarousel: React.FC<TodayRemindersCarouselProps> = ({
  reminders,
  onReminderPress,
  onMarkAsTaken,
}) => {
  // Get today's taken reminders from Redux
  const takenReminders = useSelector((state: RootState) => state.adherence.completed);

  // Filter only today's reminders that haven't been taken AND time has been reached
  const today = dayjs().startOf('day');
  const now = dayjs();
  const todayReminders = reminders.filter((reminder) => {
    const reminderDate = dayjs(reminder.scheduledDate).startOf('day');
    const isTodayReminder = reminderDate.isSame(today);
    const notTaken = !takenReminders.includes(reminder.id);
    
    // Check if current time has reached or passed the reminder time
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderTime = dayjs().hour(hours).minute(minutes);
    const timeReached = now.isAfter(reminderTime) || now.isSame(reminderTime);
    
    return isTodayReminder && notTaken && timeReached;
  });

  if (todayReminders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Reminders</Text>
      </View>
    );
  }

  // Sort all today's reminders by time
  const sortedReminders = [...todayReminders].sort((a, b) => {
    const timeA = parseInt(a.time.replace(':', ''));
    const timeB = parseInt(b.time.replace(':', ''));
    return timeA - timeB;
  });

  // Calculate reminder status
  const getReminderStatus = (reminder: Reminder) => {
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderTime = dayjs().hour(hours).minute(minutes);
    const now = dayjs();
    const diffInMinutes = now.diff(reminderTime, 'minute');

    if (diffInMinutes < 0) {
      return { status: 'now?', minutesLate: null, statusColor: colors.accentWarning };
    } else if (diffInMinutes === 0) {
      return { status: 'now?', minutesLate: null, statusColor: colors.accentWarning };
    } else {
      return { status: 'late', minutesLate: diffInMinutes, statusColor: colors.error };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reminders</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {sortedReminders.map((reminder) => {
          const { status, minutesLate, statusColor } = getReminderStatus(reminder);
          const isSingleReminder = sortedReminders.length === 1;
          const screenWidth = Dimensions.get('window').width;
          const cardWidth = isSingleReminder ? screenWidth - 40 : 280;

          return (
            <TouchableOpacity
              key={reminder.id}
              style={[
                styles.reminderCard,
                { width: cardWidth },
              ]}
              onPress={() => onReminderPress(reminder)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                {/* Icon and Medication Name */}
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          reminder.frequency === 'daily'
                            ? colors.primary + '20'
                            : colors.primary + '15',
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="pill"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.medicationInfo}>
                    <Text style={styles.medicationName} numberOfLines={1}>
                      {reminder.medicationName}
                    </Text>
                    <Text style={styles.dosage} numberOfLines={1}>
                      {reminder.dosage}
                    </Text>
                  </View>
                  {/* Status Indicator Circle */}
                  <TouchableOpacity
                    style={styles.statusIndicatorContainer}
                    onPress={() => onMarkAsTaken(reminder.id)}
                  >
                    <View
                      style={[
                        styles.statusIndicator,
                        { borderColor: statusColor, backgroundColor: statusColor },
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                {/* Time */}
                <View style={styles.timeContainer}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.timeText}>{reminder.time}</Text>
                  <Text style={styles.statusText}>
                    {status === 'now?'
                      ? '• now?'
                      : minutesLate
                      ? `• ${minutesLate}m late`
                      : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  reminderCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dosage: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusIndicatorContainer: {
    alignItems: 'center',
    gap: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.error,
  },
});
