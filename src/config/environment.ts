/**
 * Environment configuration
 * Update these values based on your environment (development, staging, production)
 */

const ENV = {
  development: {
    API_URL: 'http://localhost:3000/api',
    USE_MOCK_DATA: true,
  },
  staging: {
    API_URL: 'https://staging-api.medreminder.com/api',
    USE_MOCK_DATA: false,
  },
  production: {
    API_URL: 'https://api.medreminder.com/api',
    USE_MOCK_DATA: false,
  },
};

// Change this to match your environment
const CURRENT_ENV: keyof typeof ENV = 'development';

export const config = {
  API_URL: ENV[CURRENT_ENV].API_URL,
  USE_MOCK_DATA: ENV[CURRENT_ENV].USE_MOCK_DATA,
  TIMEOUT: 30000, // 30 seconds
};
