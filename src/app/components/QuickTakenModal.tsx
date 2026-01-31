import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { QuickTakenModalProps } from '../../types/components';

export const QuickTakenModal: React.FC<QuickTakenModalProps> = ({
  visible,
  medicationName,
  onClose,
  onMarkAsTaken,
}) => {
  const handleTaken = () => {
    onMarkAsTaken();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={styles.modal}>
          {/* Medication Name */}
          <Text style={styles.medicationName}>{medicationName}</Text>

          {/* Taken Button */}
          <TouchableOpacity
            style={styles.takenButton}
            onPress={handleTaken}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={24}
              color={colors.surface}
            />
            <Text style={styles.takenButtonText}>Taken</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
    width: '100%',
  },
  modal: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  takenButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  takenButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface,
  },
  closeButton: {
    paddingVertical: 10,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
