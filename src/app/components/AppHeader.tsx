import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { RootState } from '../../store';
import { colors } from '../theme/colors';

/**
 * AppHeader Component
 * 
 * Displays a greeting with the user's name based on the current time of day.
 * Pulls user data from Redux state.
 * 
 * Time-based greetings:
 * - 5:00 - 11:59: "Good morning"
 * - 12:00 - 17:59: "Good afternoon"
 * - 18:00 - 21:59: "Good evening"
 * - 22:00 - 4:59: "Good night"
 */
export const AppHeader: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
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

  const greeting = getGreeting();
  const userFullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen or show notification panel
    console.log('Notification icon pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Left side: Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
        </View>

        {/* Center: Greeting and Name */}
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.name}>{userFullName}</Text>
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
            {/* Optional: Badge for notification count */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
