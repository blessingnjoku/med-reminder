import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { RootState, AppDispatch } from '../../../store';
import { updateReminder, setLoading, setError } from '../../../store/reminderSlice';
import { MedicationForm } from '../../components/MedicationForm';
import { remindersApi } from '../../services/api';
import { config } from '../../../config/environment';
import { storageService } from '../../services/storage';
import { notificationService } from '../../services/notifications';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';
import { Reminder } from '../../../types/reminder';

export const EditReminderScreen: React.FC<any> = ({
  navigation,
  route,
}) => {
  const { reminder } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.reminders.loading);
  const reminders = useSelector((state: RootState) => state.reminders.items);

  // Convert reminder data to form initial values
  const getInitialValues = () => ({
    medicationName: reminder.medicationName || '',
    dosage: reminder.dosage || '',
    dosageUnit: 'mg', // Default or extract from dosage
    medicationForm: 'Pills', // Default or get from reminder
    quantity: '1', // Default or extract
    frequencyType: reminder.frequency || 'daily',
    timesPerDay: '1',
    times: [reminder.time || '08:00'],
    selectedDays: ['Monday'],
    weeklyTime: reminder.time || '09:00',
    scheduledDate: dayjs(reminder.scheduledDate || new Date()).format('YYYY-MM-DD'),
    notificationsEnabled: reminder.notificationsEnabled ?? true,
    notes: reminder.notes || '',
    clinicName: reminder.clinicName || '',
    doctorName: reminder.doctorName || '',
  });

  const handleSubmit = async (values: any) => {
    try {
      dispatch(setLoading(true));

      // Create updated reminder object
      const updatedReminder: Reminder = {
        ...reminder,
        medicationName: values.medicationName,
        dosage: values.dosage,
        frequency: values.frequencyType as 'daily' | 'weekly' | 'monthly',
        time: values.frequencyType === 'weekly' 
          ? values.weeklyTime 
          : (values.times && values.times[0]) || '08:00',
        scheduledDate: dayjs(values.scheduledDate).toDate(),
        notificationsEnabled: values.notificationsEnabled ?? true,
        notes: values.notes || undefined,
        clinicName: values.clinicName || undefined,
        doctorName: values.doctorName || undefined,
        updatedAt: new Date(),
      };

      if (config.USE_MOCK_DATA) {
        // Mock mode: update Redux and AsyncStorage
        dispatch(updateReminder(updatedReminder));
        const updatedReminders = reminders.map(r => 
          r.id === reminder.id ? updatedReminder : r
        );
        await storageService.saveReminders(updatedReminders);
      } else {
        // API mode: call backend
        const response = await remindersApi.updateReminder({
          id: reminder.id,
          medicationName: updatedReminder.medicationName,
          dosage: updatedReminder.dosage,
          frequency: updatedReminder.frequency,
          time: updatedReminder.time,
          scheduledDate: updatedReminder.scheduledDate,
          notificationsEnabled: updatedReminder.notificationsEnabled,
          notes: updatedReminder.notes,
          clinicName: updatedReminder.clinicName,
          doctorName: updatedReminder.doctorName,
        });

        if (!response.data) {
          throw new Error('Failed to update reminder - no data returned');
        }

        // Update Redux with server response
        dispatch(updateReminder(response.data));
      }

      // Reschedule notification with updated time
      try {
        // Cancel old notification
        await notificationService.cancelReminder(updatedReminder.id);
        
        // Schedule new notification if enabled
        if (updatedReminder.notificationsEnabled) {
          await notificationService.scheduleReminder(
            updatedReminder.medicationName,
            updatedReminder.time,
            updatedReminder.id
          );
          console.log('Notification rescheduled for:', updatedReminder.medicationName);
        } else {
          console.log('Notifications disabled for:', updatedReminder.medicationName);
        }
      } catch (notificationError) {
        console.error('Error rescheduling notification:', notificationError);
        // Don't fail the update if notification scheduling fails
      }

      dispatch(setLoading(false));

      Alert.alert('Success', 'Medication reminder updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update medication';
      console.error('Error updating reminder:', error);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        title="Edit Medication"
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <MedicationForm
          onSubmit={handleSubmit}
          isLoading={loading}
          initialValues={getInitialValues()}
          submitButtonText="Update Medication"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
});
