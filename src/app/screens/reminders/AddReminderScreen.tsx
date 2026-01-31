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
import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { RootState, AppDispatch } from '../../../store';
import { addReminder, setLoading, setError } from '../../../store/reminderSlice';
import { MedicationForm } from '../../components/MedicationForm';
import { storageService } from '../../services/storage';
import { notificationService } from '../../services/notifications';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';
import { Reminder } from '../../../types/reminder';

export const AddReminderScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.reminders.loading);
  const reminders = useSelector((state: RootState) => state.reminders.items);

  const handleGoBack = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to go back? Your medication will not be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Go Back',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Form submitted with values:', values);
      dispatch(setLoading(true));

      // Create reminder object
      const newReminder: Reminder = {
        id: Date.now().toString(),
        medicationName: values.medicationName,
        dosage: values.dosage, // Keep as string as per Reminder interface
        frequency: values.frequencyType as 'daily' | 'weekly' | 'monthly',
        time: values.frequencyType === 'weekly' 
          ? values.weeklyTime 
          : (values.times && values.times[0]) || '08:00',
        scheduledDate: dayjs(values.scheduledDate).toDate(),
        notificationsEnabled: values.notificationsEnabled ?? true,
        notes: values.notes || undefined,
        clinicName: values.clinicName || undefined,
        doctorName: values.doctorName || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Created reminder:', newReminder);

      // Add to Redux
      dispatch(addReminder(newReminder));

      // Persist to AsyncStorage
      const updatedReminders = [...reminders, newReminder];
      await storageService.saveReminders(updatedReminders);

      // Schedule notification for the reminder
      try {
        if (newReminder.notificationsEnabled) {
          await notificationService.scheduleReminder(
            newReminder.medicationName,
            newReminder.time,
            newReminder.id
          );
          console.log('Notification scheduled for:', newReminder.medicationName);
        } else {
          console.log('Notifications disabled for:', newReminder.medicationName);
        }
      } catch (notificationError) {
        console.error('Error scheduling notification:', notificationError);
        // Don't fail the reminder creation if notification scheduling fails
      }

      dispatch(setLoading(false));

      Alert.alert('Success', 'Medication reminder added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Dashboard');
          },
        },
      ]);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add medication';
      console.error('Error adding reminder:', error);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        showBackButton={true}
        onBackPress={handleGoBack}
        title="Add Medication"
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <MedicationForm
          onSubmit={handleSubmit}
          isLoading={loading}
          initialValues={{
            medicationName: '',
            dosage: '',
            dosageUnit: 'mg',
            medicationForm: 'Pills',
            quantity: '1',
            frequencyType: 'daily',
            timesPerDay: '1',
            times: ['08:00'],
            selectedDays: ['Monday'],
            weeklyTime: '09:00',
            notes: '',
          }}
          submitButtonText="Add Medication"
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
