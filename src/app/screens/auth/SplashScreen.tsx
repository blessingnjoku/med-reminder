import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Button } from '../../components/Button';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Register');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration Section */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            {/* Decorative pill shapes - using circles and icons to simulate pills */}
            <View style={[styles.pill, styles.pill1]}>
              <MaterialCommunityIcons
                name="pill"
                size={40}
                color={colors.surface}
              />
            </View>
            <View style={[styles.pill, styles.pill2]}>
              <MaterialCommunityIcons
                name="pill"
                size={35}
                color={colors.surface}
              />
            </View>
            <View style={[styles.pill, styles.pill3]}>
              <MaterialCommunityIcons
                name="pill"
                size={30}
                color={colors.surface}
              />
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>Never miss your pills again</Text>
          <Text style={styles.subtitle}>
            Stay on top of your healthcare with timely dose reminders every pill track medications
          </Text>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Button
            title="Get started"
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          />

          {/* Sign In Link */}
          <TouchableOpacity style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  illustrationContainer: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  illustration: {
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pill: {
    position: 'absolute',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  pill1: {
    width: 100,
    height: 100,
    backgroundColor: colors.primary,
    top: 0,
    left: 20,
  },
  pill2: {
    width: 85,
    height: 85,
    backgroundColor: colors.primaryLight,
    top: 50,
    right: 30,
  },
  pill3: {
    width: 70,
    height: 70,
    backgroundColor: colors.accentWarning,
    bottom: 20,
    left: 50,
  },
  contentSection: {
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontWeight: '400',
  },
  ctaSection: {
    paddingBottom: 20,
  },
  getStartedButton: {
    marginBottom: 16,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signInText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
