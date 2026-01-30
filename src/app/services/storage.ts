import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@med_reminder:user',
  REMINDERS: '@med_reminder:reminders',
  ADHERENCE: '@med_reminder:adherence',
};

export const storageService = {
  async saveUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async getUser(): Promise<any> {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error;
    }
  },

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user:', error);
      throw error;
    }
  },

  async saveReminders(reminders: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
      throw error;
    }
  },

  async getReminders(): Promise<any[]> {
    try {
      const reminders = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
      return reminders ? JSON.parse(reminders) : [];
    } catch (error) {
      console.error('Error retrieving reminders:', error);
      throw error;
    }
  },

  async saveAdherence(adherence: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ADHERENCE, JSON.stringify(adherence));
    } catch (error) {
      console.error('Error saving adherence:', error);
      throw error;
    }
  },

  async getAdherence(): Promise<any[]> {
    try {
      const adherence = await AsyncStorage.getItem(STORAGE_KEYS.ADHERENCE);
      return adherence ? JSON.parse(adherence) : [];
    } catch (error) {
      console.error('Error retrieving adherence:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.REMINDERS,
        STORAGE_KEYS.ADHERENCE,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
