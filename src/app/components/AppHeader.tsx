import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { RootState } from '../../store';
import { colors } from '../theme/colors';

interface AppHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  title?: string;
}

/**
 * AppHeader Component
 * 
 * Displays a greeting with the user's name based on the current time of day.
 * Pulls user data from Redux state.
 * Shows badge with count of today's pending reminders.
 * 
 * Time-based greetings:
 * - 5:00 - 11:59: "Good morning"
 * - 12:00 - 17:59: "Good afternoon"
 * - 18:00 - 21:59: "Good evening"
 * - 22:00 - 4:59: "Good night"
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ 
  showBackButton = false, 
  onBackPress,
  title 
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const reminders = useSelector((state: RootState) => state.reminders.items);
  
  // Get current hour
  const hour = dayjs().hour();
  
  // Determine greeting based on time of day
  const getGreeting = () => {
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good afternoon';
    } else if (hour >= 18 && hour < 22) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  };

  /**
   * Calculate count of reminders that are overdue (past their time) and not taken
   * Only counts reminders whose scheduled time has passed
   */
  const getPendingRemindersCount = () => {
    const now = dayjs();
    const today = now.format('YYYY-MM-DD');
    const completedToday = useSelector((state: RootState) => state.adherence.completed);
    
    const overdueReminders = reminders.filter((reminder: any) => {
      const reminderDate = dayjs(reminder.scheduledDate).format('YYYY-MM-DD');
      const isTodayReminder = reminderDate === today;
      
      if (!isTodayReminder) return false;
      
      // Check if reminder time has passed
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderTime = now.clone().hour(hours).minute(minutes).second(0);
      const isOverdue = now.isAfter(reminderTime);
      const notTaken = !completedToday.includes(reminder.id);
      
      return isOverdue && notTaken;
    });
    
    return overdueReminders.length;
  };

  const greeting = getGreeting();
  const userFullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const pendingCount = getPendingRemindersCount();
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen or show notification panel
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left side: Back Button or Avatar */}
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
          </View>
        )}

        {/* Center: Greeting/Title and Name */}
        <View style={styles.textContainer}>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.name}>{userFullName}</Text>
            </>
          )}
        </View>

        {/* Right side: Notification Icon */}
        <TouchableOpacity 
          style={styles.notificationContainer}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <View style={styles.notificationIcon}>
            <MaterialCommunityIcons
              name="bell"
              size={24}
              color={colors.primary}
            />
            {/* Badge showing count of today's pending reminders */}
            {pendingCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {pendingCount > 9 ? '9+' : pendingCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  avatarContainer: {
    marginRight: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textInverse,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  notificationContainer: {
    padding: 8,
  },
  notificationIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
