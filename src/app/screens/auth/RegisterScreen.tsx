import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { setLoading, setError } from '../../../store/authSlice';
import { authApi } from '../../services/api';
import { config } from '../../../config/environment';
import { storageService } from '../../services/storage';
import { registerValidationSchema } from '../../../utils/validators';
import { colors } from '../../theme/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { RegisterFormValues } from '../../../types/screens';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      dispatch(setLoading(true));
      setApiError(null);

      if (config.USE_MOCK_DATA) {
        // Mock mode: save to AsyncStorage
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = {
          id: Date.now().toString(),
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          createdAt: new Date(),
        };
        await storageService.registerUser(user);
      } else {
        // API mode: call backend
        await authApi.register({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        });
        // Token is automatically set in httpClient by authApi
      }

      dispatch(setLoading(false));
      
      // Show success message and navigate to login
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please log in with your credentials.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to Login screen
              navigation.navigate('Login');
            },
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setApiError(errorMessage);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      Alert.alert('Registration Error', errorMessage);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.innerContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to manage your medications</Text>
        </View>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerValidationSchema}
          onSubmit={handleRegister}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <View style={styles.form}>
              {apiError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{apiError}</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <Input
                  placeholder="Enter your first name"
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  editable={!isSubmitting}
                  error={touched.firstName && errors.firstName ? true : false}
                />
                {touched.firstName && errors.firstName && (
                  <Text style={styles.fieldError}>{errors.firstName}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <Input
                  placeholder="Enter your last name"
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  editable={!isSubmitting}
                  error={touched.lastName && errors.lastName ? true : false}
                />
                {touched.lastName && errors.lastName && (
                  <Text style={styles.fieldError}>{errors.lastName}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <Input
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  editable={!isSubmitting}
                  error={touched.email && errors.email ? true : false}
                />
                {touched.email && errors.email && (
                  <Text style={styles.fieldError}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <Input
                  placeholder="Enter your password (8+ characters)"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  editable={!isSubmitting}
                  error={touched.password && errors.password ? true : false}
                />
                {touched.password && errors.password && (
                  <Text style={styles.fieldError}>{errors.password}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <Input
                  placeholder="Re-enter your password"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  editable={!isSubmitting}
                  error={touched.confirmPassword && errors.confirmPassword ? true : false}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
                )}
              </View>

              <Button
                title={isSubmitting ? 'Creating Account...' : 'Create Account'}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.spacer} />

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  spacer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 16 : 24,
  },
  headerSection: {
    marginBottom: isSmallScreen ? 20 : 32,
    marginTop: isSmallScreen ? 12 : 24,
  },
  title: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: colors.textSecondary,
    lineHeight: isSmallScreen ? 20 : 24,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingVertical: isSmallScreen ? 12 : 20,
  },
  inputGroup: {
    marginBottom: isSmallScreen ? 12 : 16,
  },
  label: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
  },
  errorContainer: {
    backgroundColor: colors.error + '15',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: isSmallScreen ? 16 : 24,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: isSmallScreen ? 16 : 24,
    paddingBottom: isSmallScreen ? 24 : 32,
  },
  footerText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
