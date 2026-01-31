import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { AppDispatch, RootState } from '../../store';
import { deleteReminder } from '../../store/reminderSlice';
import { remindersApi } from '../services/api';
import { config } from '../../config/environment';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';
import { colors } from '../theme/colors';
import { Reminder } from '../../types/reminder';
import { MedicationDetailsBottomSheetProps } from '../../types/components';

export const MedicationDetailsBottomSheet: React.FC<
  MedicationDetailsBottomSheetProps
> = ({ visible, medication, onClose, onEdit, onMarkAsTaken }) => {
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector((state: RootState) => state.reminders.items);
  const [isMarkedAsTaken, setIsMarkedAsTaken] = useState(false);

  const handleMarkAsTabAction = () => {
    setIsMarkedAsTaken(!isMarkedAsTaken);
    if (!isMarkedAsTaken) {
      onMarkAsTaken(medication?.id || '');
    }
  };

  const handleEdit = () => {
    if (medication) {
      onEdit(medication);
      onClose();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication reminder?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (medication) {
                // Cancel scheduled notification
                try {
                  await notificationService.cancelReminder(medication.id);
                } catch (notificationError) {
                  // Ignore notification errors, continue with deletion
                }

                if (config.USE_MOCK_DATA) {
                  // Mock mode: delete from Redux and AsyncStorage
                  dispatch(deleteReminder(medication.id));
                  const updatedReminders = reminders.filter((r: Reminder) => r.id !== medication.id);
                  await storageService.saveReminders(updatedReminders);
                } else {
                  // API mode: call backend
                  await remindersApi.deleteReminder(medication.id);
                  
                  // Update Redux after successful API call
                  dispatch(deleteReminder(medication.id));
                }

                onClose();
                Alert.alert('Success', 'Medication deleted successfully!');
              }
            } catch (error: any) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', error.message || 'Failed to delete medication');
            }
          },
        },
      ]
    );
  };

  const handleMarkAsTaken = () => {
    if (medication) {
      onMarkAsTaken(medication.id);
      onClose();
    }
  };

  if (!medication) return null;

  const nextDoseTime = dayjs(medication.time, 'HH:mm');
  const isUpcoming = nextDoseTime.isAfter(dayjs());

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={styles.bottomSheet}>
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{medication.medicationName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Status Badge and Mark as Taken */}
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  isUpcoming
                    ? styles.statusUpcoming
                    : styles.statusScheduled,
                ]}
              >
                <MaterialCommunityIcons
                  name={isUpcoming ? 'clock-outline' : 'check-circle'}
                  size={16}
                  color={isUpcoming ? colors.accentWarning : colors.accentSuccess}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: isUpcoming
                        ? colors.accentWarning
                        : colors.accentSuccess,
                    },
                  ]}
                >
                  {isUpcoming ? 'Upcoming' : 'Scheduled'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.radioWrapper}
                onPress={handleMarkAsTabAction}
              >
                <View style={[styles.radioButton, isMarkedAsTaken && styles.radioButtonChecked]}>
                  {isMarkedAsTaken && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>Taken</Text>
              </TouchableOpacity>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Dosage</Text>
                <Text style={styles.detailValue}>{medication.dosage} ml</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Frequency</Text>
                <Text style={styles.detailValue}>
                  {medication.frequency.charAt(0).toUpperCase() +
                    medication.frequency.slice(1)}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{medication.time}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Created</Text>
                <Text style={styles.detailValue}>
                  {dayjs(medication.createdAt).format('MMM D, YYYY')}
                </Text>
              </View>

              {medication.clinicName && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Clinic</Text>
                  <Text style={styles.detailValue}>{medication.clinicName}</Text>
                </View>
              )}

              {medication.doctorName && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Doctor</Text>
                  <Text style={styles.detailValue}>{medication.doctorName}</Text>
                </View>
              )}
            </View>

            {/* Notes */}
            {medication.notes && (
              <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesText}>{medication.notes}</Text>
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <MaterialCommunityIcons
                name="delete"
                size={20}
                color={colors.error}
              />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    paddingBottom: 20,
  },
  handleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  statusUpcoming: {
    backgroundColor: colors.accentWarning + '20',
  },
  statusScheduled: {
    backgroundColor: colors.accentSuccess + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  notesSection: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: colors.primary + '20',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.accentSuccess,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonChecked: {
    backgroundColor: 'transparent',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentSuccess,
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
