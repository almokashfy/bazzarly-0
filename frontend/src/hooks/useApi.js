import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, apiUtils } from '../services/api';

// Generic API hook
export const useApi = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  
  const {
    immediate = true,
    retry = 0,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const execute = useCallback(async (...args) => {
    if (!mountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const apiCallWithRetry = retry > 0 
        ? () => apiUtils.retry(() => apiCall(...args), retry, retryDelay)
        : () => apiCall(...args);
      
      const result = await apiCallWithRetry();
      
      if (mountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
      
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
        onError?.(err);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiCall, retry, retryDelay, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, execute, ...dependencies]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(() => execute(), [execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
  };
};

// Products hooks
export const useProducts = (filters = {}, options = {}) => {
  return useApi(
    () => apiService.getProducts(filters),
    [JSON.stringify(filters)],
    options
  );
};

export const useProduct = (productId, options = {}) => {
  return useApi(
    () => apiService.getProduct(productId),
    [productId],
    {
      immediate: Boolean(productId),
      ...options,
    }
  );
};

// Categories hooks
export const useCategories = (options = {}) => {
  return useApi(
    () => apiService.getCategories(),
    [],
    options
  );
};

export const useCategory = (categoryId, options = {}) => {
  return useApi(
    () => apiService.getCategory(categoryId),
    [categoryId],
    {
      immediate: Boolean(categoryId),
      ...options,
    }
  );
};

// Search hook with debouncing
export const useSearch = (query, filters = {}, options = {}) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { debounceDelay = 300 } = options;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, debounceDelay]);

  return useApi(
    () => debouncedQuery ? apiService.searchProducts(debouncedQuery, filters) : Promise.resolve({ data: { results: [], count: 0 } }),
    [debouncedQuery, JSON.stringify(filters)],
    {
      immediate: Boolean(debouncedQuery),
      ...options,
    }
  );
};

// Ads hook
export const useAds = (options = {}) => {
  return useApi(
    () => apiService.getAds(),
    [],
    options
  );
};

// Stats hook
export const useStats = (options = {}) => {
  return useApi(
    () => apiService.getStats(),
    [],
    options
  );
};

// Local storage hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Debounce hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Previous value hook
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Online status hook
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}; 