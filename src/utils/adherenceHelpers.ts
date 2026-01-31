import dayjs, { Dayjs } from 'dayjs';

export interface AdherenceRecord {
  reminderId: string;
  date: string;
  taken: boolean;
  missedReason?: string;
}

export interface DailyStats {
  date: string;
  total: number;
  taken: number;
  percentage: number;
}

export interface WeeklyStats {
  week: string;
  percentage: number;
  dayStats: DailyStats[];
}

export interface AdherenceSummary {
  today: DailyStats;
  week: WeeklyStats;
  month: { percentage: number; daysTracked: number };
  currentStreak: number;
  bestStreak: number;
}

/**
 * Calculate daily adherence percentage
 */
export const calculateDailyAdherence = (
  reminders: any[],
  adherenceRecords: AdherenceRecord[],
  date: Dayjs
): DailyStats => {
  const dateStr = date.format('YYYY-MM-DD');
  
  const dayReminders = reminders.filter(
    (r) => dayjs(r.scheduledDate).format('YYYY-MM-DD') === dateStr
  );
  
  const takenCount = adherenceRecords.filter(
    (record) => record.date === dateStr && record.taken
  ).length;

  const total = dayReminders.length || 1;
  const percentage = total > 0 ? Math.round((takenCount / total) * 100) : 0;

  return {
    date: dateStr,
    total,
    taken: takenCount,
    percentage: Math.min(percentage, 100),
  };
};

/**
 * Calculate weekly adherence
 */
export const calculateWeeklyAdherence = (
  reminders: any[],
  adherenceRecords: AdherenceRecord[],
  endDate: Dayjs = dayjs()
): WeeklyStats => {
  const days: DailyStats[] = [];
  let totalPercentage = 0;

  for (let i = 6; i >= 0; i--) {
    const date = endDate.subtract(i, 'day');
    const dailyStats = calculateDailyAdherence(reminders, adherenceRecords, date);
    days.push(dailyStats);
    totalPercentage += dailyStats.percentage;
  }

  return {
    week: `${endDate.subtract(6, 'day').format('MMM DD')} - ${endDate.format('MMM DD')}`,
    percentage: Math.round(totalPercentage / 7),
    dayStats: days,
  };
};

/**
 * Calculate monthly adherence
 */
export const calculateMonthlyAdherence = (
  reminders: any[],
  adherenceRecords: AdherenceRecord[],
  date: Dayjs = dayjs()
): { percentage: number; daysTracked: number } => {
  const startOfMonth = date.startOf('month');
  const endOfMonth = date.endOf('month');
  const daysInMonth = endOfMonth.date();

  let totalTaken = 0;
  let totalScheduled = 0;

  for (let i = 0; i < daysInMonth; i++) {
    const currentDate = startOfMonth.add(i, 'day');
    const dateStr = currentDate.format('YYYY-MM-DD');

    const dayReminders = reminders.filter(
      (r) => dayjs(r.scheduledDate).format('YYYY-MM-DD') === dateStr
    );

    const takenCount = adherenceRecords.filter(
      (record) => record.date === dateStr && record.taken
    ).length;

    totalScheduled += dayReminders.length;
    totalTaken += takenCount;
  }

  const percentage =
    totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;

  return {
    percentage: Math.min(percentage, 100),
    daysTracked: daysInMonth,
  };
};

/**
 * Calculate current streak (consecutive days with 100% adherence)
 */
export const calculateCurrentStreak = (
  reminders: any[],
  adherenceRecords: AdherenceRecord[]
): number => {
  let streak = 0;
  let currentDate = dayjs();

  while (true) {
    const dateStr = currentDate.format('YYYY-MM-DD');
    const dailyStats = calculateDailyAdherence(reminders, adherenceRecords, currentDate);

    if (dailyStats.percentage === 100 && dailyStats.total > 0) {
      streak++;
      currentDate = currentDate.subtract(1, 'day');
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculate best streak ever
 */
export const calculateBestStreak = (
  reminders: any[],
  adherenceRecords: AdherenceRecord[]
): number => {
  const allDates = new Set(adherenceRecords.map((r) => r.date));
  if (allDates.size === 0) return 0;

  const sortedDates = Array.from(allDates).sort();
  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: string | null = null;

  for (const date of sortedDates) {
    const dailyStats = calculateDailyAdherence(
      reminders,
      adherenceRecords,
      dayjs(date)
    );

    if (dailyStats.percentage === 100 && dailyStats.total > 0) {
      if (!lastDate || dayjs(date).diff(dayjs(lastDate), 'day') === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    lastDate = date;
  }

  return maxStreak;
};

/**
 * Get comprehensive adherence summary
 */
export const getAdherenceSummary = (
  reminders: any[],
  adherenceRecords: AdherenceRecord[]
): AdherenceSummary => {
  const today = dayjs();

  return {
    today: calculateDailyAdherence(reminders, adherenceRecords, today),
    week: calculateWeeklyAdherence(reminders, adherenceRecords, today),
    month: calculateMonthlyAdherence(reminders, adherenceRecords, today),
    currentStreak: calculateCurrentStreak(reminders, adherenceRecords),
    bestStreak: calculateBestStreak(reminders, adherenceRecords),
  };
};
