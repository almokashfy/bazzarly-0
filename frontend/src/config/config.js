const config = {
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // App Information
  APP_NAME: process.env.REACT_APP_APP_NAME || 'Bazzarly',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  
  // Feature Flags
  FEATURES: {
    NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
    ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    PWA: process.env.REACT_APP_ENABLE_PWA !== 'false',
  },
  
  // External Services
  SERVICES: {
    GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || '',
    STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
  },
  
  // App Settings
  SETTINGS: {
    MAX_UPLOAD_SIZE: parseInt(process.env.REACT_APP_MAX_UPLOAD_SIZE) || 5242880, // 5MB
    ITEMS_PER_PAGE: parseInt(process.env.REACT_APP_ITEMS_PER_PAGE) || 12,
    DEFAULT_LOCATION: process.env.REACT_APP_DEFAULT_LOCATION || 'New York, NY',
    CURRENCY: 'USD',
    CURRENCY_SYMBOL: '$',
  },
  
  // API Endpoints
  ENDPOINTS: {
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    ADS: '/ads',
    SEARCH: '/search',
    STATS: '/stats',
    HEALTH: '/health',
  },
  
  // Validation Rules
  VALIDATION: {
    MIN_PRICE: 0.01,
    MAX_PRICE: 999999.99,
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 1000,
  },
  
  // UI Constants
  UI: {
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 5000,
    ANIMATION_DURATION: 200,
    MOBILE_BREAKPOINT: 768,
  },
};

export default config; 