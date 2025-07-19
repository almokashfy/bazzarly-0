const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import custom middleware
const { 
  logger, 
  requestLogger, 
  errorLogger, 
  apiUsageLogger,
  businessLogger,
  securityLogger 
} = require('./middleware/logger');
const { 
  createValidationMiddleware, 
  validateProductQuery, 
  validateSearchQuery 
} = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (important for rate limiting and logging)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    securityLogger.logRateLimitExceeded(req.ip, req.originalUrl);
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    });
  }
});

// Search rate limiting (more restrictive)
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 search requests per windowMs
  message: {
    success: false,
    message: 'Too many search requests, please try again later.'
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(requestLogger);
app.use(apiUsageLogger);

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Sample data - In a real app, this would come from a database
const categories = [
  { id: 'electronics', name: 'Electronics', count: 12453 },
  { id: 'fashion', name: 'Fashion', count: 8921 },
  { id: 'home-garden', name: 'Home & Garden', count: 6734 },
  { id: 'automotive', name: 'Automotive', count: 4567 },
  { id: 'sports', name: 'Sports', count: 3892 },
  { id: 'books', name: 'Books', count: 5234 }
];

const products = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    price: 1199,
    originalPrice: 1299,
    location: "New York, NY",
    condition: "new",
    categoryId: "electronics",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    rating: 4.8,
    seller: "Apple Store",
    postedTime: "2 hours ago",
    description: "Latest iPhone with advanced camera system and A17 Pro chip.",
    availability: "in-stock",
    sellerId: 1
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    price: 1099,
    originalPrice: 1199,
    location: "Los Angeles, CA",
    condition: "new",
    categoryId: "electronics",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    rating: 4.7,
    seller: "TechWorld",
    postedTime: "5 hours ago",
    description: "Premium Android phone with S Pen and 200MP camera.",
    availability: "in-stock",
    sellerId: 2
  },
  {
    id: 3,
    title: "MacBook Pro 14-inch M3",
    price: 1999,
    originalPrice: 2199,
    location: "Chicago, IL",
    condition: "like-new",
    categoryId: "electronics",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
    rating: 4.9,
    seller: "John Doe",
    postedTime: "1 day ago",
    description: "Powerful laptop for professionals with M3 chip.",
    availability: "in-stock",
    sellerId: 3
  }
];

const ads = [
  {
    id: 1,
    title: "Summer Sale - Up to 70% Off Electronics",
    description: "Limited time offer on smartphones, laptops, and accessories",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
    discount: "70%",
    validUntil: "Dec 31, 2024",
    isActive: true
  },
  {
    id: 2,
    title: "Fashion Week Special",
    description: "Designer clothes and accessories at unbeatable prices",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    discount: "50%",
    validUntil: "Dec 25, 2024",
    isActive: true
  }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bazzarly API is running' });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// Get category by ID
app.get('/api/categories/:id', (req, res) => {
  const category = categories.find(cat => cat.id === req.params.id);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }
  res.json({
    success: true,
    data: category
  });
});

// Get all products with optional filtering
app.get('/api/products', validateProductQuery, (req, res) => {
  try {
    let filteredProducts = [...products];
    
    // Filter by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.categoryId === req.query.category
      );
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      const minPrice = req.query.minPrice || 0;
      const maxPrice = req.query.maxPrice || Infinity;
      filteredProducts = filteredProducts.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
      );
    }
    
    // Filter by location
    if (req.query.location) {
      filteredProducts = filteredProducts.filter(product =>
        product.location.toLowerCase().includes(req.query.location.toLowerCase())
      );
    }
    
    // Filter by condition
    if (req.query.condition) {
      filteredProducts = filteredProducts.filter(product =>
        product.condition === req.query.condition
      );
    }
    
    // Filter by availability
    if (req.query.availability) {
      filteredProducts = filteredProducts.filter(product =>
        product.availability === req.query.availability
      );
    }
    
    // Sort products
    const sortBy = req.query.sortBy || 'newest';
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Keep original order for newest
        break;
    }
    
    // Pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    logger.info('Products retrieved', {
      filters: req.query,
      resultCount: paginatedProducts.length,
      totalCount: filteredProducts.length,
      ip: req.ip
    });
    
    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredProducts.length / limit),
          totalProducts: filteredProducts.length,
          hasNext: endIndex < filteredProducts.length,
          hasPrev: startIndex > 0
        }
      }
    });
  } catch (error) {
    logger.error('Error retrieving products', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products'
    });
  }
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      logger.warn('Product not found', { productId, ip: req.ip });
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Log product view for analytics
    businessLogger.logProductViewed(productId, null, req.ip);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Error retrieving product', { 
      productId: req.params.id, 
      error: error.message, 
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product'
    });
  }
});

// Get featured ads
app.get('/api/ads', (req, res) => {
  const activeAds = ads.filter(ad => ad.isActive);
  res.json({
    success: true,
    data: activeAds
  });
});

// Search products
app.get('/api/search', searchLimiter, validateSearchQuery, (req, res) => {
  try {
    const query = req.query.q;
    
    const searchResults = products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.seller.toLowerCase().includes(query.toLowerCase())
    );
    
    // Log search for analytics
    businessLogger.logSearchPerformed(query, searchResults.length, null, req.ip);
    
    res.json({
      success: true,
      data: {
        query,
        results: searchResults,
        count: searchResults.length
      }
    });
  } catch (error) {
    logger.error('Error performing search', { 
      query: req.query.q, 
      error: error.message, 
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// Create new product (simplified)
app.post('/api/products', createValidationMiddleware('product'), (req, res) => {
  try {
    const { title, price, location, condition, categoryId, description } = req.body;
    
    const newProduct = {
      id: products.length + 1,
      title,
      price: parseFloat(price),
      originalPrice: parseFloat(price),
      location,
      condition,
      categoryId,
      description: description || '',
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
      rating: 0,
      seller: "New Seller",
      postedTime: "Just now",
      availability: "in-stock",
      sellerId: 999
    };
    
    products.push(newProduct);
    
    // Log product creation for analytics
    businessLogger.logProductCreated(newProduct.id, newProduct.sellerId);
    
    logger.info('Product created successfully', {
      productId: newProduct.id,
      title: newProduct.title,
      price: newProduct.price,
      ip: req.ip
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    logger.error('Error creating product', { 
      body: req.body, 
      error: error.message, 
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// Get stats for dashboard
app.get('/api/stats', (req, res) => {
  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalAds: ads.length,
    activeAds: ads.filter(ad => ad.isActive).length,
    averagePrice: products.reduce((sum, product) => sum + product.price, 0) / products.length,
    topCategories: categories.slice(0, 3)
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
  // Don't log the error again if it's already been logged
  if (!err.logged) {
    logger.error('Unhandled application error', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details 
    })
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  res.status(404).json({
    success: false,
    message: 'Route not found',
    endpoint: req.originalUrl
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason.toString(),
    stack: reason.stack,
    promise: promise.toString()
  });
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

app.listen(PORT, () => {
  logger.info(`🚀 Bazzarly API server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
  
  console.log(`🚀 Bazzarly API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📂 Categories API: http://localhost:${PORT}/api/categories`);
  console.log(`📢 Ads API: http://localhost:${PORT}/api/ads`);
  console.log(`📝 Logs directory: ${require('path').join(__dirname, 'logs')}`);
}); 