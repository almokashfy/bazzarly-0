const validator = require('validator');

// Validation rules
const validationRules = {
  // Product validation
  product: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      sanitize: 'string'
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      sanitize: 'string'
    },
    price: {
      required: true,
      type: 'number',
      min: 0.01,
      max: 999999.99
    },
    location: {
      required: true,
      minLength: 2,
      maxLength: 100,
      sanitize: 'string'
    },
    condition: {
      required: true,
      enum: ['new', 'like-new', 'good', 'fair', 'poor']
    },
    categoryId: {
      required: true,
      sanitize: 'string'
    }
  },

  // Search validation
  search: {
    q: {
      required: true,
      minLength: 2,
      maxLength: 100,
      sanitize: 'string'
    }
  },

  // User validation
  user: {
    email: {
      required: true,
      type: 'email',
      sanitize: 'email'
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    },
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 30,
      sanitize: 'string'
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 30,
      sanitize: 'string'
    },
    phone: {
      required: false,
      type: 'phone'
    }
  }
};

// Sanitization functions
const sanitize = {
  string: (value) => {
    if (typeof value !== 'string') return '';
    return validator.escape(value.trim());
  },

  email: (value) => {
    if (typeof value !== 'string') return '';
    return validator.normalizeEmail(value.trim());
  },

  number: (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  },

  boolean: (value) => {
    return Boolean(value);
  },

  phone: (value) => {
    if (typeof value !== 'string') return '';
    return value.replace(/[^\d\+\-\s\(\)]/g, '');
  }
};

// Validation functions
const validate = {
  required: (value, fieldName) => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value, min, fieldName) => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (value, max, fieldName) => {
    if (value && value.length > max) {
      return `${fieldName} must be no more than ${max} characters long`;
    }
    return null;
  },

  type: (value, type, fieldName) => {
    switch (type) {
      case 'email':
        if (value && !validator.isEmail(value)) {
          return `${fieldName} must be a valid email address`;
        }
        break;
      case 'number':
        if (value && isNaN(Number(value))) {
          return `${fieldName} must be a number`;
        }
        break;
      case 'phone':
        if (value && !validator.isMobilePhone(value.replace(/\s/g, ''))) {
          return `${fieldName} must be a valid phone number`;
        }
        break;
      case 'url':
        if (value && !validator.isURL(value)) {
          return `${fieldName} must be a valid URL`;
        }
        break;
      default:
        break;
    }
    return null;
  },

  min: (value, min, fieldName) => {
    const num = Number(value);
    if (!isNaN(num) && num < min) {
      return `${fieldName} must be at least ${min}`;
    }
    return null;
  },

  max: (value, max, fieldName) => {
    const num = Number(value);
    if (!isNaN(num) && num > max) {
      return `${fieldName} must be no more than ${max}`;
    }
    return null;
  },

  enum: (value, options, fieldName) => {
    if (value && !options.includes(value)) {
      return `${fieldName} must be one of: ${options.join(', ')}`;
    }
    return null;
  },

  pattern: (value, pattern, fieldName) => {
    if (value && !pattern.test(value)) {
      return `${fieldName} format is invalid`;
    }
    return null;
  }
};

// Main validation function
const validateData = (data, schema) => {
  const errors = {};
  const sanitizedData = {};

  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    const value = data[field];
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

    // Sanitize first
    let sanitizedValue = value;
    if (rules.sanitize && sanitize[rules.sanitize]) {
      sanitizedValue = sanitize[rules.sanitize](value);
    }
    sanitizedData[field] = sanitizedValue;

    // Validate
    if (rules.required) {
      const error = validate.required(sanitizedValue, fieldName);
      if (error) {
        errors[field] = error;
        return;
      }
    }

    // Skip other validations if value is empty and not required
    if (!sanitizedValue && !rules.required) {
      return;
    }

    if (rules.minLength) {
      const error = validate.minLength(sanitizedValue, rules.minLength, fieldName);
      if (error) errors[field] = error;
    }

    if (rules.maxLength) {
      const error = validate.maxLength(sanitizedValue, rules.maxLength, fieldName);
      if (error) errors[field] = error;
    }

    if (rules.type) {
      const error = validate.type(sanitizedValue, rules.type, fieldName);
      if (error) errors[field] = error;
    }

    if (rules.min !== undefined) {
      const error = validate.min(sanitizedValue, rules.min, fieldName);
      if (error) errors[field] = error;
    }

    if (rules.max !== undefined) {
      const error = validate.max(sanitizedValue, rules.max, fieldName);
      if (error) errors[field] = error;
    }

    if (rules.enum) {
      const error = validate.enum(sanitizedValue, rules.enum, fieldName);
      if (error) errors[field] = error;
    }

    if (rules.pattern) {
      const error = validate.pattern(sanitizedValue, rules.pattern, fieldName);
      if (error) errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: sanitizedData
  };
};

// Middleware factory
const createValidationMiddleware = (schemaName) => {
  return (req, res, next) => {
    const schema = validationRules[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found'
      });
    }

    const { isValid, errors, data } = validateData(req.body, schema);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Replace request body with sanitized data
    req.body = { ...req.body, ...data };
    next();
  };
};

// Query parameter validation
const validateQueryParams = (params, rules) => {
  const errors = {};
  const sanitizedParams = {};

  Object.keys(rules).forEach(param => {
    const rule = rules[param];
    const value = params[param];

    if (value !== undefined) {
      // Sanitize
      let sanitizedValue = value;
      if (rule.sanitize && sanitize[rule.sanitize]) {
        sanitizedValue = sanitize[rule.sanitize](value);
      }
      sanitizedParams[param] = sanitizedValue;

      // Validate
      if (rule.type === 'number') {
        const num = Number(sanitizedValue);
        if (isNaN(num)) {
          errors[param] = `${param} must be a number`;
        } else {
          sanitizedParams[param] = num;
        }
      }

      if (rule.min !== undefined && Number(sanitizedValue) < rule.min) {
        errors[param] = `${param} must be at least ${rule.min}`;
      }

      if (rule.max !== undefined && Number(sanitizedValue) > rule.max) {
        errors[param] = `${param} must be no more than ${rule.max}`;
      }

      if (rule.enum && !rule.enum.includes(sanitizedValue)) {
        errors[param] = `${param} must be one of: ${rule.enum.join(', ')}`;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    params: sanitizedParams
  };
};

// Product query validation middleware
const validateProductQuery = (req, res, next) => {
  const rules = {
    category: { sanitize: 'string' },
    minPrice: { type: 'number', min: 0 },
    maxPrice: { type: 'number', min: 0 },
    location: { sanitize: 'string' },
    condition: { enum: ['new', 'like-new', 'good', 'fair', 'poor'] },
    availability: { enum: ['in-stock', 'low-stock', 'out-of-stock'] },
    sortBy: { enum: ['newest', 'price-low', 'price-high', 'rating'] },
    page: { type: 'number', min: 1 },
    limit: { type: 'number', min: 1, max: 100 }
  };

  const { isValid, errors, params } = validateQueryParams(req.query, rules);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors
    });
  }

  req.query = { ...req.query, ...params };
  next();
};

// Search query validation middleware
const validateSearchQuery = (req, res, next) => {
  const rules = {
    q: { required: true, minLength: 2, maxLength: 100, sanitize: 'string' }
  };

  const { isValid, errors, params } = validateQueryParams(req.query, rules);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid search query',
      errors
    });
  }

  req.query = { ...req.query, ...params };
  next();
};

module.exports = {
  createValidationMiddleware,
  validateProductQuery,
  validateSearchQuery,
  validateData,
  validationRules,
  sanitize
}; 