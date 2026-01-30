import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Reminder } from '../../types/reminder';

interface ReminderCardProps {
  reminder: Reminder;
  onPress?: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <Text style={styles.title}>{reminder.medicationName}</Text>
        <Text style={styles.subtitle}>{reminder.dosage}</Text>
        <Text style={styles.detail}>Time: {reminder.time}</Text>
        <Text style={styles.detail}>Frequency: {reminder.frequency}</Text>
        {reminder.notes && <Text style={styles.notes}>{reminder.notes}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  detail: {
    fontSize: 12,
    color: '#999999',
    marginVertical: 2,
  },
  notes: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
