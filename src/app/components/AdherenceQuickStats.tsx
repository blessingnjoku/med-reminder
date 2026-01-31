import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { getAdherenceSummary } from '../../utils/adherenceHelpers';

interface AdherenceQuickStatsProps {
  reminders: any[];
}

export const AdherenceQuickStats: React.FC<AdherenceQuickStatsProps> = ({
  reminders,
}) => {
  const adherenceRecords = useSelector(
    (state: any) => state.adherence.adherence
  );

  const summary = useMemo(() => {
    return getAdherenceSummary(reminders, adherenceRecords);
  }, [reminders, adherenceRecords]);

  const StatCard = ({
    title,
    value,
    subtitle,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="trending-up" color={colors.primary} size={25} />
          <Text style={styles.title}>Today Streak</Text>
        </View>
      </View>

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Today"
          value={`${summary.today.percentage}%`}
          subtitle={`${summary.today.taken}/${summary.today.total} taken`}
          color={colors.primary}
        />
        <StatCard
          title="Current Streak"
          value={summary.currentStreak}
          subtitle="days"
          color={colors.success}
        />
        <StatCard
          title="Best Streak"
          value={summary.bestStreak}
          subtitle="days"
          color={colors.accentWarning}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statsGrid: {
    gap: 12,
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderLeftWidth: 5,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});
