import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { colors } from '../theme/colors';
import { getAdherenceSummary } from '../../utils/adherenceHelpers';

interface AdherenceStatsCardProps {
  reminders: any[];
}

const screenWidth = Dimensions.get('window').width;

export const AdherenceStatsCard: React.FC<AdherenceStatsCardProps> = ({
  reminders,
}) => {
  const adherenceRecords = useSelector(
    (state: any) => state.adherence.adherence
  );

  const summary = useMemo(() => {
    return getAdherenceSummary(reminders, adherenceRecords);
  }, [reminders, adherenceRecords]);

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => `rgba(47, 128, 237, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 11,
      fill: colors.textSecondary,
    },
  };

  // Weekly bar chart data
  const weeklyData = {
    labels: summary.week.dayStats.map((d) =>
      dayjs(d.date).format('ddd').substring(0, 1)
    ),
    datasets: [
      {
        data: summary.week.dayStats.map((d) => d.percentage),
        strokeWidth: 2,
        color: (opacity = 1) => colors.primary,
      },
    ],
  };

  // Progress data for today, week, month
  const progressData = {
    labels: ['Today', 'Week', 'Month'],
    data: [
      summary.today.percentage / 100,
      summary.week.percentage / 100,
      summary.month.percentage / 100,
    ],
  };

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Full Overview</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
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

      {/* Progress Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📈 Adherence Progress</Text>
        <ProgressChart
          data={progressData}
          width={screenWidth - 40}
          height={220}
          strokeWidth={12}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </View>

      {/* Weekly Bar Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📊 Weekly Breakdown</Text>
        <BarChart
          data={weeklyData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          fromZero={true}
          showValuesOnTopOfBars={true}
          yAxisLabel=""
          yAxisSuffix="%"
        />
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>This Week Average:</Text>
          <Text style={styles.summaryValue}>{summary.week.percentage}%</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>This Month Average:</Text>
          <Text style={styles.summaryValue}>{summary.month.percentage}%</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 12,
    justifyContent: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  chartSection: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
