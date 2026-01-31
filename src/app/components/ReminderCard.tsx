import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import { colors } from '../theme/colors';
import { MockReminder } from '../../utils/mockReminders';
import { getMedicationIcon } from '../../utils/iconMapper';
import { ReminderCardProps } from '../../types/components';

export const ReminderCard: React.FC<ReminderCardProps> = ({
  item,
  isPriority,
  onPress,
  onCheck,
  isCompleted,
}) => {
  // Parse time correctly by combining with today's date
  const now = dayjs();
  const reminderTimeStr = item.time; // Format: "HH:mm"
  const [hours, minutes] = reminderTimeStr.split(':');
  const reminderTime = now.clone().set('hour', parseInt(hours)).set('minute', parseInt(minutes)).set('second', 0);
  
  const isUpcoming = reminderTime.isAfter(now);
  const timeUntil = reminderTime.diff(now, 'minute');
  
  const medicationIcon = isCompleted 
    ? { name: 'check-circle', iconLibrary: 'MaterialCommunityIcons' as const }
    : getMedicationIcon(item.medicationForm);

  const getTimeStatusText = () => {
    if (isCompleted) return 'Taken';
    if (timeUntil < 0) return `${Math.abs(timeUntil)}m ago`;
    if (timeUntil === 0) return 'Now';
    if (timeUntil < 60) return `In ${timeUntil}m`;
    const hours = Math.floor(timeUntil / 60);
    return `In ${hours}h`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        isPriority ? styles.priorityCard : styles.standardCard,
        isCompleted && styles.completedCard,
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.icon,
              isPriority ? styles.iconPriority : styles.iconStandard,
              isCompleted && styles.iconCompleted,
            ]}
          >
            {medicationIcon.iconLibrary === 'MaterialIcons' ? (
              <MaterialIcons
                name={medicationIcon.name as any}
                size={20}
                color={
                  isCompleted
                    ? colors.accentSuccess
                    : colors.primary
                }
              />
            ) : (
              <MaterialCommunityIcons
                name={medicationIcon.name as any}
                size={20}
                color={
                  isCompleted
                    ? colors.accentSuccess
                    : colors.primary
                }
              />
            )}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.medName,
              styles.textPrimary,
              isCompleted && styles.textCompleted,
            ]}
          >
            {item.medicationName}
          </Text>
          <Text
            style={[
              styles.medDetails,
              styles.textSecondary,
            ]}
          >
            {item.dosage} x {item.mg}mg • {item.medicationForm}
          </Text>
          <Text
            style={[
              styles.frequency,
              styles.textSecondary,
            ]}
          >
            {item.frequency}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text
            style={[
              styles.timeText,
              styles.textPrimary,
            ]}
          >
            {item.time}
          </Text>
          <Text
            style={[
              styles.statusText,
              isCompleted && styles.statusTaken,
              !isCompleted && isUpcoming && styles.statusUpcoming,
              !isCompleted && !isUpcoming && styles.statusPast,
            ]}
          >
            {getTimeStatusText()}
          </Text>
          <TouchableOpacity
            onPress={() => onCheck?.(item.id)}
            style={[
              styles.checkbox,
              styles.checkboxStandard,
              isCompleted && styles.checkboxActive,
            ]}
          >
            {isCompleted && <View style={styles.innerCheck} />}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  standardCard: { backgroundColor: colors.surface },
  priorityCard: { backgroundColor: colors.surface },
  completedCard: { opacity: 0.6 },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    marginRight: 4,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  iconStandard: { 
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary + '40',
  },
  iconPriority: { 
    backgroundColor: colors.primary + '25',
    borderColor: colors.primary + '50',
  },
  iconCompleted: { 
    backgroundColor: colors.accentSuccess + '20',
    borderColor: colors.accentSuccess + '40',
  },
  infoContainer: { flex: 1 },
  medName: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  textPrimary: { color: colors.textPrimary },
  textSecondary: { color: colors.textSecondary },
  textInverse: { color: colors.textInverse },
  textInverseDim: { color: 'rgba(255,255,255,0.7)' },
  textCompleted: { textDecorationLine: 'line-through' },
  medDetails: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  frequency: { fontSize: 12, fontWeight: '400' },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTaken: { color: colors.accentSuccess },
  statusUpcoming: { color: colors.accentWarning },
  statusPast: { color: colors.error },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxStandard: { borderColor: colors.divider },
  checkboxInverse: { borderColor: 'rgba(255,255,255,0.4)' },
  checkboxActive: {
    backgroundColor: colors.accentSuccess,
    borderColor: colors.accentSuccess,
  },
  innerCheck: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
});
