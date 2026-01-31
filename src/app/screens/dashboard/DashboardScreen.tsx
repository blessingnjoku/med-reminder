import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';

export const DashboardScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          <Text style={styles.placeholder}>No reminders today</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adherence Summary</Text>
          <Text style={styles.placeholder}>Track your medication compliance</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
