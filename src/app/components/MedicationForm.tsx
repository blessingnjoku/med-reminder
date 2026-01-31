import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import { medicationValidationSchema } from '../../utils/validators';
import { getUnitsForType, getDefaultUnitForType } from '../../utils/medicationUnits';
import { colors } from '../theme/colors';
import { Input } from './Input';
import { Button } from './Button';
import dayjs from 'dayjs';

interface MedicationFormProps {
  onSubmit: (values: any) => void;
  isLoading?: boolean;
  initialValues?: {
    medicationName?: string;
    dosage?: string;
    dosageUnit?: string;
    medicationForm?: string;
    quantity?: string;
    frequencyType?: string;
    timesPerDay?: string;
    times?: string[];
    selectedDays?: string[];
    weeklyTime?: string;
    scheduledDate?: string;
    notes?: string;
    clinicName?: string;
    doctorName?: string;
  };
  submitButtonText?: string;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({
  onSubmit,
  isLoading = false,
  initialValues = {
    medicationName: '',
    dosage: '',
    dosageUnit: 'mg',
    medicationForm: 'Pills',
    quantity: '1',
    frequencyType: 'daily',
    timesPerDay: '1',
    times: ['08:00'],
    selectedDays: ['Monday'],
    weeklyTime: '09:00',
    scheduledDate: dayjs().format('YYYY-MM-DD'),
    notes: '',
    clinicName: '',
    doctorName: '',
  },
  submitButtonText = 'Add Medication',
}) => {
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedField, setSelectedField] = React.useState<string | null>(null);
  const [pickerTime, setPickerTime] = React.useState<Date>(new Date());

  // Helper function to safely convert time string to Date
  const getDateFromTimeString = (timeString: string): Date => {
    try {
      if (!timeString || typeof timeString !== 'string') {
        return new Date();
      }
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours || 0, minutes || 0, 0, 0);
      return date;
    } catch (error) {
      console.error('Error parsing time string:', timeString, error);
      return new Date();
    }
  };

  const handleTimeChange = (
    event: any,
    selectedDate: Date | undefined,
    setFieldValue: any
  ) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedDate) {
      const timeString = dayjs(selectedDate).format('HH:mm');
      setFieldValue('time', timeString);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined, setFieldValue: any) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const dateString = dayjs(selectedDate).format('YYYY-MM-DD');
      setFieldValue('scheduledDate', dateString);
    }
  };

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.formTitle}>Schedule your medication</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={medicationValidationSchema}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          isSubmitting,
        }) => (
          <>
            {/* Medication Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Medication Name *</Text>
              <Input
                placeholder="e.g., Aspirin, Ibuprofen"
                value={values.medicationName}
                onChangeText={handleChange('medicationName')}
                onBlur={handleBlur('medicationName')}
                editable={!isSubmitting}
                error={touched.medicationName && errors.medicationName ? true : false}
              />
              {touched.medicationName && errors.medicationName && (
                <Text style={styles.errorText}>{errors.medicationName}</Text>
              )}
            </View>

            {/* Medication Form Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Medication Form *</Text>
              <View style={styles.formTypeContainer}>
                {['Pills', 'Capsules', 'Liquid', 'Injection', 'Drops'].map((form) => (
                  <TouchableOpacity
                    key={form}
                    style={[
                      styles.formTypeButton,
                      values.medicationForm === form && styles.formTypeButtonActive,
                    ]}
                    onPress={() => {
                      setFieldValue('medicationForm', form);
                      // Auto-set dosage unit based on medication type
                      setFieldValue('dosageUnit', getDefaultUnitForType(form));
                    }}
                    disabled={isSubmitting}
                  >
                    <Text
                      style={[
                        styles.formTypeButtonText,
                        values.medicationForm === form && styles.formTypeButtonTextActive,
                      ]}
                    >
                      {form}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Dosage */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Dosage *</Text>
              <View style={styles.dosageContainer}>
                <View style={styles.dosageInputWrapper}>
                  <Input
                    placeholder="e.g., 500"
                    value={values.dosage}
                    onChangeText={handleChange('dosage')}
                    onBlur={handleBlur('dosage')}
                    editable={!isSubmitting}
                    error={touched.dosage && errors.dosage ? true : false}
                    keyboardType="number-pad"
                  />
                </View>
                
                {/* Dosage Unit Selector */}
                <View style={styles.unitSelector}>
                  {getUnitsForType(values.medicationForm || 'Pills').map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitButton,
                        values.dosageUnit === unit && styles.unitButtonActive,
                      ]}
                      onPress={() => setFieldValue('dosageUnit', unit)}
                      disabled={isSubmitting}
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          values.dosageUnit === unit && styles.unitButtonTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {touched.dosage && errors.dosage && (
                <Text style={styles.errorText}>{errors.dosage}</Text>
              )}
              
              {/* Quantity Input */}
              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>Quantity per dose:</Text>
                <Input
                  placeholder="e.g., 1, 2, 3"
                  value={values.quantity}
                  onChangeText={handleChange('quantity')}
                  onBlur={handleBlur('quantity')}
                  editable={!isSubmitting}
                  error={touched.quantity && errors.quantity ? true : false}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Frequency Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
                disabled={isSubmitting}
              >
                <Text style={styles.datePickerButtonText}>
                  {dayjs(values.scheduledDate).format('MMM DD, YYYY')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Frequency Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>How often? *</Text>
              <View style={styles.frequencyContainer}>
                {[
                  { label: 'Daily', value: 'daily' },
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Monthly', value: 'monthly' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.frequencyButton,
                      values.frequencyType === option.value &&
                        styles.frequencyButtonActive,
                    ]}
                    onPress={() => setFieldValue('frequencyType', option.value)}
                    disabled={isSubmitting}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        values.frequencyType === option.value &&
                          styles.frequencyButtonTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Daily: Times per day selector */}
            {values.frequencyType === 'daily' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Times per day *</Text>
                <View style={styles.quantityButtons}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.quantityButton,
                        values.timesPerDay === num.toString() &&
                          styles.quantityButtonActive,
                      ]}
                      onPress={() => {
                        setFieldValue('timesPerDay', num.toString());
                        // Initialize times array if needed
                        const newTimes = Array(num)
                          .fill(null)
                          .map((_, i) => values.times?.[i] || `0${i + 1}:00`);
                        setFieldValue('times', newTimes);
                      }}
                      disabled={isSubmitting}
                    >
                      <Text
                        style={[
                          styles.quantityButtonText,
                          values.timesPerDay === num.toString() &&
                            styles.quantityButtonTextActive,
                        ]}
                      >
                        {num}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Time pickers for daily */}
                {values.times &&
                  values.times.map((time: string, index: number) => (
                    <View key={index} style={styles.timePickerSection}>
                      <Text style={styles.timePickerLabel}>
                        Time {index + 1}
                      </Text>
                      <TouchableOpacity
                        style={styles.timePickerButton}
                        onPress={() => {
                          setSelectedField(`time-${index}`);
                          setShowTimePicker(true);
                        }}
                        disabled={isSubmitting}
                      >
                        <Text style={styles.timePickerButtonText}>{time}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}

            {/* Weekly: Day selector and time */}
            {values.frequencyType === 'weekly' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Select days *</Text>
                <View style={styles.daysContainer}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                    (day, idx) => {
                      const dayFull = [
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ][idx];
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayButton,
                            values.selectedDays?.includes(dayFull) &&
                              styles.dayButtonActive,
                          ]}
                          onPress={() => {
                            const newDays = values.selectedDays?.includes(dayFull)
                              ? values.selectedDays.filter((d: string) => d !== dayFull)
                              : [...(values.selectedDays || []), dayFull];
                            setFieldValue('selectedDays', newDays);
                          }}
                          disabled={isSubmitting}
                        >
                          <Text
                            style={[
                              styles.dayButtonText,
                              values.selectedDays?.includes(dayFull) &&
                                styles.dayButtonTextActive,
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>

                <View style={styles.timePickerSection}>
                  <Text style={styles.label}>Time *</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => {
                      setSelectedField('weekly-time');
                      setShowTimePicker(true);
                    }}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.timePickerButtonText}>
                      {values.weeklyTime}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Time Picker Modal */}
            {showTimePicker && selectedField && (
              <DateTimePicker
                value={
                  selectedField.startsWith('time-')
                    ? getDateFromTimeString(
                        values.times?.[parseInt(selectedField.split('-')[1])] || '08:00'
                      )
                    : getDateFromTimeString(values.weeklyTime || '09:00')
                }
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowTimePicker(false);
                    setSelectedField(null);
                  }

                  if (selectedDate) {
                    const timeString = dayjs(selectedDate).format('HH:mm');
                    if (selectedField?.startsWith('time-')) {
                      const index = parseInt(selectedField.split('-')[1]);
                      const newTimes = [...(values.times || [])];
                      newTimes[index] = timeString;
                      setFieldValue('times', newTimes);
                    } else if (selectedField === 'weekly-time') {
                      setFieldValue('weeklyTime', timeString);
                    }
                  }
                }}
              />
            )}

            {Platform.OS === 'ios' && showTimePicker && (
              <View style={styles.timePickerActions}>
                <TouchableOpacity
                  onPress={() => {
                    setShowTimePicker(false);
                    setSelectedField(null);
                  }}
                  style={styles.timePickerDone}
                >
                  <Text style={styles.timePickerDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Date Picker Modal */}
            {showDatePicker && (
              <DateTimePicker
                value={dayjs(values.scheduledDate).toDate()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, setFieldValue)
                }
              />
            )}

            {Platform.OS === 'ios' && showDatePicker && (
              <View style={styles.timePickerActions}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.timePickerActionButton}
                >
                  <Text style={styles.timePickerActionText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Clinic Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Clinic Name (Optional)</Text>
              <Input
                placeholder="e.g., City Medical Center"
                value={values.clinicName}
                onChangeText={handleChange('clinicName')}
                onBlur={handleBlur('clinicName')}
                editable={!isSubmitting}
                error={touched.clinicName && errors.clinicName ? true : false}
              />
              {touched.clinicName && errors.clinicName && (
                <Text style={styles.errorText}>{errors.clinicName}</Text>
              )}
            </View>

            {/* Doctor Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Doctor Name (Optional)</Text>
              <Input
                placeholder="e.g., Dr. John Smith"
                value={values.doctorName}
                onChangeText={handleChange('doctorName')}
                onBlur={handleBlur('doctorName')}
                editable={!isSubmitting}
                error={touched.doctorName && errors.doctorName ? true : false}
              />
              {touched.doctorName && errors.doctorName && (
                <Text style={styles.errorText}>{errors.doctorName}</Text>
              )}
            </View>

            {/* Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <Input
                placeholder="e.g., Take with food, side effects..."
                value={values.notes}
                onChangeText={handleChange('notes')}
                onBlur={handleBlur('notes')}
                editable={!isSubmitting}
                multiline
                numberOfLines={4}
                error={touched.notes && errors.notes ? true : false}
              />
              {touched.notes && errors.notes && (
                <Text style={styles.errorText}>{errors.notes}</Text>
              )}
            </View>

            {/* Submit Button */}
            <Button
              title={isSubmitting ? `${submitButtonText}...` : submitButtonText}
              onPress={() => {
                console.log('Submit button pressed');
                console.log('Form values:', values);
                console.log('Form errors:', errors);
                handleSubmit();
              }}
              disabled={isSubmitting || isLoading}
              style={styles.submitButton}
            />
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  dosageContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  dosageInputWrapper: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  unitButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  unitButtonTextActive: {
    color: colors.textInverse,
  },
  formTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formTypeButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  formTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  formTypeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  formTypeButtonTextActive: {
    color: colors.textInverse,
  },
  quantitySection: {
    marginTop: 12,
  },
  quantityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quantityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  quantityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quantityButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quantityButtonTextActive: {
    color: colors.textInverse,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  frequencyButtonTextActive: {
    color: colors.textInverse,
  },
  timePickerSection: {
    marginTop: 12,
  },
  timePickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  dayButton: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dayButtonTextActive: {
    color: colors.textInverse,
  },
  timePickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  timePickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  datePickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  timePickerDone: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  timePickerDoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textInverse,
  },
  timePickerActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  timePickerActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textInverse,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 20,
  },
});
