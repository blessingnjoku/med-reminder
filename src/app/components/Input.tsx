import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { colors } from '../theme/colors';

interface InputProps extends TextInputProps {
  placeholder?: string;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ placeholder, error = false, ...props }) => {
  return (
    <View>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.editable === false && styles.inputDisabled,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '08',
  },
  inputDisabled: {
    backgroundColor: colors.background,
    color: colors.disabled,
  },
});
