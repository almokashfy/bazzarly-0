const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_LEVEL_NAMES = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
const CURRENT_LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';

class Logger {
  constructor() {
    this.logLevel = LOG_LEVELS[CURRENT_LOG_LEVEL] || LOG_LEVELS.INFO;
  }

  formatLogEntry(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    
    return JSON.stringify(logEntry);
  }

  writeToFile(filename, entry) {
    const filePath = path.join(logsDir, filename);
    fs.appendFileSync(filePath, entry + '\n');
  }

  log(level, message, meta = {}) {
    if (LOG_LEVELS[level] > this.logLevel) {
      return;
    }

    const entry = this.formatLogEntry(level, message, meta);
    
    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      const colors = {
        ERROR: '\x1b[31m', // Red
        WARN: '\x1b[33m',  // Yellow
        INFO: '\x1b[36m',  // Cyan
        DEBUG: '\x1b[90m'  // Gray
      };
      
      console.log(
        `${colors[level]}[${level}]\x1b[0m ${new Date().toISOString()} - ${message}`,
        Object.keys(meta).length > 0 ? meta : ''
      );
    }

    // Write to files
    this.writeToFile('app.log', entry);
    
    if (level === 'ERROR') {
      this.writeToFile('error.log', entry);
    }
  }

  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }
}

const logger = new Logger();

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  // Override res.send to capture response
  res.send = function(data) {
    res.send = originalSend;
    
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      responseTime: `${duration}ms`,
      contentLength: res.get('content-length') || 0
    };

    // Log request details
    if (res.statusCode >= 400) {
      logger.error(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, logData);
    } else {
      logger.info(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, logData);
    }

    return originalSend.call(this, data);
  };

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const errorData = {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip || req.connection.remoteAddress
    }
  };

  logger.error('Unhandled error occurred', errorData);
  
  next(err);
};

// API usage logger
const apiUsageLogger = (req, res, next) => {
  const usage = {
    endpoint: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  };

  logger.debug('API Usage', usage);
  next();
};

// Security events logger
const securityLogger = {
  logFailedLogin: (ip, email) => {
    logger.warn('Failed login attempt', {
      type: 'SECURITY_EVENT',
      event: 'FAILED_LOGIN',
      ip,
      email,
      timestamp: new Date().toISOString()
    });
  },

  logSuspiciousActivity: (ip, activity) => {
    logger.warn('Suspicious activity detected', {
      type: 'SECURITY_EVENT',
      event: 'SUSPICIOUS_ACTIVITY',
      ip,
      activity,
      timestamp: new Date().toISOString()
    });
  },

  logRateLimitExceeded: (ip, endpoint) => {
    logger.warn('Rate limit exceeded', {
      type: 'SECURITY_EVENT',
      event: 'RATE_LIMIT_EXCEEDED',
      ip,
      endpoint,
      timestamp: new Date().toISOString()
    });
  }
};

// Performance logger
const performanceLogger = {
  logSlowQuery: (query, duration) => {
    logger.warn('Slow query detected', {
      type: 'PERFORMANCE',
      query,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  },

  logHighMemoryUsage: (usage) => {
    logger.warn('High memory usage detected', {
      type: 'PERFORMANCE',
      memoryUsage: usage,
      timestamp: new Date().toISOString()
    });
  }
};

// Business logic logger
const businessLogger = {
  logProductCreated: (productId, userId) => {
    logger.info('Product created', {
      type: 'BUSINESS_EVENT',
      event: 'PRODUCT_CREATED',
      productId,
      userId,
      timestamp: new Date().toISOString()
    });
  },

  logProductViewed: (productId, userId, ip) => {
    logger.info('Product viewed', {
      type: 'BUSINESS_EVENT',
      event: 'PRODUCT_VIEWED',
      productId,
      userId,
      ip,
      timestamp: new Date().toISOString()
    });
  },

  logSearchPerformed: (query, resultsCount, userId, ip) => {
    logger.info('Search performed', {
      type: 'BUSINESS_EVENT',
      event: 'SEARCH_PERFORMED',
      query,
      resultsCount,
      userId,
      ip,
      timestamp: new Date().toISOString()
    });
  }
};

// Log rotation (simple implementation)
const rotateLogFiles = () => {
  const logFiles = ['app.log', 'error.log'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  logFiles.forEach(filename => {
    const filePath = path.join(logsDir, filename);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      
      if (stats.size > maxSize) {
        const timestamp = new Date().toISOString().split('T')[0];
        const backupPath = path.join(logsDir, `${filename}.${timestamp}`);
        
        fs.renameSync(filePath, backupPath);
        logger.info(`Log file rotated: ${filename} -> ${filename}.${timestamp}`);
      }
    }
  });
};

// Rotate logs daily
setInterval(rotateLogFiles, 24 * 60 * 60 * 1000);

module.exports = {
  logger,
  requestLogger,
  errorLogger,
  apiUsageLogger,
  securityLogger,
  performanceLogger,
  businessLogger,
  rotateLogFiles
}; 