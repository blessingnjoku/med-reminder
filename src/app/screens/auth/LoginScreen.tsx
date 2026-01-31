import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { loginSuccess, setLoading, setError } from '../../../store/authSlice';
import { storageService } from '../../services/storage';
import { loginValidationSchema } from '../../../utils/validators';
import { colors } from '../../theme/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { User } from '../../../types/reminder';

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      dispatch(setLoading(true));
      setApiError(null);

      // TODO: Replace with actual API call to backend
      // For now, verify against AsyncStorage registered users
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify credentials against registered users in AsyncStorage
      const user = await storageService.verifyCredentials(
        values.email,
        values.password
      );

      // Save to AsyncStorage (for session persistence)
      const sessionUser: User = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      };
      
      await storageService.saveUser(sessionUser);

      // Update Redux with user data
      dispatch(loginSuccess(sessionUser));
      
      dispatch(setLoading(false));
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid email or password';
      setApiError(errorMessage);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      Alert.alert('Login Error', errorMessage);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
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
                  placeholder="Enter your password"
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

              <Button
                title={isSubmitting ? 'Signing in...' : 'Sign In'}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.spacer} />

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={styles.linkText}>Sign up</Text>
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
    marginBottom: isSmallScreen ? 24 : 32,
    marginTop: isSmallScreen ? 16 : 24,
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
    paddingVertical: isSmallScreen ? 16 : 24,
  },
  inputGroup: {
    marginBottom: isSmallScreen ? 16 : 20,
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
