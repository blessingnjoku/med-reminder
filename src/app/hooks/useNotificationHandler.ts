import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { RootState, AppDispatch } from '../../store';
import { markReminderAsTaken } from '../../store/adherenceSlice';

/**
 * Custom hook to handle notification taps and quick modal logic
 */
export const useNotificationHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reminders = useSelector((state: RootState) => state.reminders.items);
  const [quickModalVisible, setQuickModalVisible] = useState(false);
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);

  useEffect(() => {
    // Check if app was opened from notification
    const checkNotificationResponse = async () => {
      try {
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response?.notification) {
          const reminderId = response.notification.request.content.data?.reminderId as string;
          if (reminderId) {
            setSelectedReminderId(reminderId);
            setQuickModalVisible(true);
          }
        }
      } catch (error) {
        console.error('Error checking notification response:', error);
      }
    };

    checkNotificationResponse();

    // Listen for notification taps while app is running
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const reminderId = response.notification.request.content.data?.reminderId as string;
        if (reminderId) {
          setSelectedReminderId(reminderId);
          setQuickModalVisible(true);
        }
      }
    );

    // Also listen for notifications received in foreground
    const notificationSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📬 Notification received in foreground:', notification);
      }
    );

    return () => {
      responseSubscription.remove();
      notificationSubscription.remove();
    };
  }, []);

  const selectedReminder = selectedReminderId
    ? reminders.find((r) => r.id === selectedReminderId)
    : null;

  const handleMarkAsTaken = () => {
    if (selectedReminderId) {
      dispatch(markReminderAsTaken(selectedReminderId));
    }
  };

  const closeModal = () => setQuickModalVisible(false);

  return {
    quickModalVisible,
    selectedReminder,
    handleMarkAsTaken,
    closeModal,
  };
};