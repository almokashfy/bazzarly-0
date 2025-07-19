import axios from 'axios';
import config from '../config/config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // API timing removed for production
    
    return response.data;
  },
  (error) => {
    // Handle common errors
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const statusCode = error.response?.status;
    
    // Log errors in development
    if (config.ENVIRONMENT === 'development') {
      // API error logs removed for production
    }
    
    // Handle specific status codes
    switch (statusCode) {
      case 401:
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        break;
      case 403:
        // Handle forbidden access
        break;
      case 404:
        // Handle not found
        break;
      case 429:
        // Handle rate limiting
        break;
      case 500:
        // Handle server errors
        break;
      default:
        break;
    }
    
    return Promise.reject({
      message: errorMessage,
      status: statusCode,
      data: error.response?.data,
    });
  }
);

// API Service Methods
export const apiService = {
  // Generic methods
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url) => api.delete(url),
  
  // Health check
  healthCheck: () => api.get(config.ENDPOINTS.HEALTH),
  
  // Categories
  getCategories: () => api.get(config.ENDPOINTS.CATEGORIES),
  getCategory: (id) => api.get(`${config.ENDPOINTS.CATEGORIES}/${id}`),
  
  // Products
  getProducts: (params = {}) => api.get(config.ENDPOINTS.PRODUCTS, { params }),
  getProduct: (id) => api.get(`${config.ENDPOINTS.PRODUCTS}/${id}`),
  createProduct: (productData) => api.post(config.ENDPOINTS.PRODUCTS, productData),
  updateProduct: (id, productData) => api.put(`${config.ENDPOINTS.PRODUCTS}/${id}`, productData),
  deleteProduct: (id) => api.delete(`${config.ENDPOINTS.PRODUCTS}/${id}`),
  
  // Search
  searchProducts: (query, params = {}) => 
    api.get(config.ENDPOINTS.SEARCH, { params: { q: query, ...params } }),
  
  // Ads
  getAds: () => api.get(config.ENDPOINTS.ADS),
  
  // Stats
  getStats: () => api.get(config.ENDPOINTS.STATS),
};

// Utility functions for handling API responses
export const apiUtils = {
  // Handle loading states
  withLoading: async (apiCall, setLoading) => {
    try {
      setLoading(true);
      const result = await apiCall();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  },
  
  // Retry failed requests
  retry: async (apiCall, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  },
  
  // Debounced API calls
  debounce: (func, delay = config.UI.DEBOUNCE_DELAY) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await func(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };
  },
};

export default api; 