import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { MockReminder } from "../data/mockData";

interface ReminderCardProps {
  item: MockReminder;
  isPriority?: boolean;
  onPress?: () => void;
  onCheck?: (id: string) => void;
  isCompleted?: boolean;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  item,
  isPriority,
  onPress,
  onCheck,
  isCompleted,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        isPriority ? styles.priorityCard : styles.standardCard,
        isCompleted && styles.completedCard,
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.medName,
              isPriority ? styles.textInverse : styles.textPrimary,
              isCompleted && styles.textCompleted,
            ]}
          >
            {item.medicationName}, {item.mg}mg
          </Text>
          <Text
            style={[
              styles.medDetails,
              isPriority ? styles.textInverseDim : styles.textSecondary,
            ]}
          >
            {item.medicationForm} • {item.frequency}
          </Text>
          {isPriority && (
            <Text style={styles.priorityTime}>{item.time} am</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onCheck?.(item.id)}
          style={[
            styles.checkbox,
            isPriority ? styles.checkboxInverse : styles.checkboxStandard,
            isCompleted && styles.checkboxActive,
          ]}
        >
          {isCompleted && <View style={styles.innerCheck} />}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  standardCard: { backgroundColor: colors.surface },
  priorityCard: { backgroundColor: colors.primary },
  completedCard: { opacity: 0.6, backgroundColor: colors.surfaceAlt },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: { flex: 1 },
  medName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  textPrimary: { color: colors.textPrimary },
  textSecondary: { color: colors.textSecondary },
  textInverse: { color: colors.textInverse },
  textInverseDim: { color: "rgba(255,255,255,0.7)" },
  textCompleted: { textDecorationLine: "line-through" },
  priorityTime: {
    color: colors.textInverse,
    marginTop: 12,
    fontWeight: "600",
    fontSize: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxStandard: { borderColor: colors.divider },
  checkboxInverse: { borderColor: "rgba(255,255,255,0.4)" },
  checkboxActive: {
    backgroundColor: colors.accentSuccess,
    borderColor: colors.accentSuccess,
  },
  innerCheck: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surface,
  },
});
