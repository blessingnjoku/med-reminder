import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async registerForPushNotifications(): Promise<string | null> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  },

  async scheduleReminder(
    medicationName: string,
    time: string,
    reminderId: string
  ): Promise<void> {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Medication Reminder',
          body: `Time to take ${medicationName}`,
          data: { reminderId },
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        } as any,
      });
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  },

  async cancelReminder(reminderId: string): Promise<void> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const notification = notifications.find((n) => n.content.data?.reminderId === reminderId);
      if (notification) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error canceling reminder:', error);
      throw error;
    }
  },

  async cancelAllReminders(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all reminders:', error);
      throw error;
    }
  },
};
