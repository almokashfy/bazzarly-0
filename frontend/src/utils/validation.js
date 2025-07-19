import React from 'react';
import config from '../config/config';

// Validation rules
export const validators = {
  required: (value, message = 'This field is required') => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    return null;
  },

  email: (value, message = 'Please enter a valid email address') => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters long`;
    }
    return null;
  },

  pattern: (regex, message = 'Invalid format') => (value) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  },

  numeric: (value, message = 'Must be a number') => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return null;
  },

  price: (value, message = 'Please enter a valid price') => {
    const num = Number(value);
    if (value && (isNaN(num) || num < config.VALIDATION.MIN_PRICE || num > config.VALIDATION.MAX_PRICE)) {
      return message;
    }
    return null;
  },

  url: (value, message = 'Please enter a valid URL') => {
    try {
      if (value) {
        new URL(value);
      }
      return null;
    } catch {
      return message;
    }
  },

  phone: (value, message = 'Please enter a valid phone number') => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
      return message;
    }
    return null;
  },

  zipCode: (value, message = 'Please enter a valid ZIP code') => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (value && !zipRegex.test(value)) {
      return message;
    }
    return null;
  },

  match: (matchField, message) => (value, formData) => {
    if (value && formData[matchField] && value !== formData[matchField]) {
      return message || `Must match ${matchField}`;
    }
    return null;
  },
};

// Form validation schemas
export const validationSchemas = {
  product: {
    title: [
      validators.required(),
      validators.minLength(config.VALIDATION.MIN_TITLE_LENGTH),
      validators.maxLength(config.VALIDATION.MAX_TITLE_LENGTH),
    ],
    description: [
      validators.required(),
      validators.minLength(config.VALIDATION.MIN_DESCRIPTION_LENGTH),
      validators.maxLength(config.VALIDATION.MAX_DESCRIPTION_LENGTH),
    ],
    price: [
      validators.required(),
      validators.price(),
    ],
    location: [
      validators.required(),
    ],
    condition: [
      validators.required(),
    ],
    categoryId: [
      validators.required(),
    ],
  },

  contact: {
    name: [
      validators.required(),
      validators.minLength(2),
      validators.maxLength(50),
    ],
    email: [
      validators.required(),
      validators.email(),
    ],
    message: [
      validators.required(),
      validators.minLength(10),
      validators.maxLength(1000),
    ],
  },

  search: {
    query: [
      validators.minLength(2, 'Search term must be at least 2 characters'),
      validators.maxLength(100, 'Search term is too long'),
    ],
  },

  user: {
    email: [
      validators.required(),
      validators.email(),
    ],
    password: [
      validators.required(),
      validators.minLength(8, 'Password must be at least 8 characters'),
      validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    ],
    confirmPassword: [
      validators.required(),
      validators.match('password', 'Passwords do not match'),
    ],
    firstName: [
      validators.required(),
      validators.minLength(2),
      validators.maxLength(30),
    ],
    lastName: [
      validators.required(),
      validators.minLength(2),
      validators.maxLength(30),
    ],
    phone: [
      validators.phone(),
    ],
  },
};

// Validate a single field
export const validateField = (value, validationRules, formData = {}) => {
  if (!validationRules || !Array.isArray(validationRules)) {
    return null;
  }

  for (const rule of validationRules) {
    const error = rule(value, formData);
    if (error) {
      return error;
    }
  }

  return null;
};

// Validate entire form
export const validateForm = (formData, schema) => {
  const errors = {};
  let hasErrors = false;

  Object.keys(schema).forEach(field => {
    const error = validateField(formData[field], schema[field], formData);
    if (error) {
      errors[field] = error;
      hasErrors = true;
    }
  });

  return { errors, isValid: !hasErrors };
};

// Real-time validation hook
export const useFormValidation = (initialData = {}, schema = {}) => {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validateField = React.useCallback((field, value) => {
    const fieldRules = schema[field];
    if (!fieldRules) return null;

    return validateField(value, fieldRules, data);
  }, [schema, data]);

  const handleChange = React.useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));

    // Validate if field has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error,
      }));
    }
  }, [touched, validateField]);

  const handleBlur = React.useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const error = validateField(field, data[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, [data, validateField]);

  const validateAll = React.useCallback(() => {
    const { errors: allErrors, isValid } = validateForm(data, schema);
    setErrors(allErrors);
    setTouched(
      Object.keys(schema).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {})
    );
    return isValid;
  }, [data, schema]);

  const reset = React.useCallback((newData = initialData) => {
    setData(newData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const isValid = React.useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);

  return {
    data,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setData,
  };
};

// Sanitization functions
export const sanitize = {
  string: (value) => {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/[<>]/g, '');
  },

  number: (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  },

  price: (value) => {
    const num = Number(value);
    if (isNaN(num)) return 0;
    return Math.max(0, Math.min(num, config.VALIDATION.MAX_PRICE));
  },

  email: (value) => {
    if (typeof value !== 'string') return '';
    return value.trim().toLowerCase();
  },

  url: (value) => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (trimmed && !trimmed.startsWith('http')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  },

  phone: (value) => {
    if (typeof value !== 'string') return '';
    return value.replace(/[^\d+\-\s()]/g, '');
  },
};

// Form helpers
export const createFormHandler = (schema, onSubmit) => {
  return (formData) => {
    const { errors, isValid } = validateForm(formData, schema);
    
    if (isValid) {
      // Sanitize data before submission
      const sanitizedData = Object.keys(formData).reduce((acc, key) => {
        const value = formData[key];
        
        // Apply appropriate sanitization based on field type
        if (key.includes('email')) {
          acc[key] = sanitize.email(value);
        } else if (key.includes('price') || key.includes('amount')) {
          acc[key] = sanitize.price(value);
        } else if (key.includes('url') || key.includes('website')) {
          acc[key] = sanitize.url(value);
        } else if (key.includes('phone')) {
          acc[key] = sanitize.phone(value);
        } else if (typeof value === 'string') {
          acc[key] = sanitize.string(value);
        } else {
          acc[key] = value;
        }
        
        return acc;
      }, {});
      
      return onSubmit(sanitizedData);
    }
    
    return Promise.reject({ errors, message: 'Validation failed' });
  };
};

const validationUtils = {
  validators,
  validationSchemas,
  validateField,
  validateForm,
  sanitize,
  createFormHandler,
};

export default validationUtils; 