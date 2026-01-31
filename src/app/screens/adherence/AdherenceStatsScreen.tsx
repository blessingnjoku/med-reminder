import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AdherenceStatsCard } from '../../components/AdherenceStatsCard';
import { colors } from '../../theme/colors';
import { RootState } from '../../../store';
import { mockReminders } from '../../../utils/mockReminders';
import { storageService } from '../../services/storage';

interface AdherenceStatsScreenProps {
  navigation: any;
}

export const AdherenceStatsScreen: React.FC<AdherenceStatsScreenProps> = ({
  navigation,
}) => {
  const reminders = useSelector((state: RootState) => state.reminders.items);

  const displayReminders = useMemo(() => {
    return reminders.length > 0
      ? [...(mockReminders as any[]), ...reminders]
      : (mockReminders as any[]);
  }, [reminders]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <AdherenceStatsCard reminders={displayReminders} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
});
