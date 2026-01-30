import { Reminder, ReminderAdherence } from '../../types/reminder';
import { storageService } from './storage';
import { notificationService } from './notifications';

export const reminderService = {
  async createReminder(reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reminder> {
    try {
      const newReminder: Reminder = {
        ...reminder,
        id: `reminder_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const reminders = await storageService.getReminders();
      reminders.push(newReminder);
      await storageService.saveReminders(reminders);

      await notificationService.scheduleReminder(
        reminder.medicationName,
        reminder.time,
        newReminder.id
      );

      return newReminder;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  },

  async updateReminder(id: string, updates: Partial<Reminder>): Promise<Reminder> {
    try {
      const reminders = await storageService.getReminders();
      const index = reminders.findIndex((r) => r.id === id);

      if (index === -1) throw new Error('Reminder not found');

      const updatedReminder = {
        ...reminders[index],
        ...updates,
        updatedAt: new Date(),
      };

      reminders[index] = updatedReminder;
      await storageService.saveReminders(reminders);

      await notificationService.cancelReminder(id);
      await notificationService.scheduleReminder(
        updatedReminder.medicationName,
        updatedReminder.time,
        id
      );

      return updatedReminder;
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  },

  async deleteReminder(id: string): Promise<void> {
    try {
      const reminders = await storageService.getReminders();
      const filtered = reminders.filter((r) => r.id !== id);
      await storageService.saveReminders(filtered);

      await notificationService.cancelReminder(id);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  },

  async getAllReminders(): Promise<Reminder[]> {
    try {
      return await storageService.getReminders();
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }
  },

  async recordAdherence(reminderId: string, taken: boolean, missedReason?: string): Promise<void> {
    try {
      const adherence = await storageService.getAdherence();
      adherence.push({
        reminderId,
        date: new Date(),
        taken,
        missedReason,
      });
      await storageService.saveAdherence(adherence);
    } catch (error) {
      console.error('Error recording adherence:', error);
      throw error;
    }
  },

  async getAdherenceRecord(): Promise<ReminderAdherence[]> {
    try {
      return await storageService.getAdherence();
    } catch (error) {
      console.error('Error fetching adherence records:', error);
      throw error;
    }
  },
};
