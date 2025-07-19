const express = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { logger, businessLogger } = require('../middleware/logger');

const router = express.Router();

// TODO: Add authentication and authorization middleware
// const auth = require('../middleware/auth');
// const authorize = require('../middleware/authorize');

// Apply to all admin routes
// router.use(auth);
// router.use(authorize(['admin', 'super_admin']));

// Dashboard Analytics
router.get('/dashboard', async (req, res) => {
  try {
    const timeRange = req.query.range || '30d'; // 7d, 30d, 90d, 1y
    const startDate = getDateFromRange(timeRange);

    // Parallel queries for better performance
    const [
      totalUsers,
      newUsers,
      totalStores,
      newStores,
      totalProducts,
      newProducts,
      activeUsers,
      pendingApprovals,
      revenueMetrics,
      topCategories,
      userGrowth,
      storeGrowth,
      productGrowth
    ] = await Promise.all([
      // Total counts
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Store.countDocuments(),
      Store.countDocuments({ createdAt: { $gte: startDate } }),
      Product.countDocuments(),
      Product.countDocuments({ createdAt: { $gte: startDate } }),
      
      // Active users (logged in within last 30 days)
      User.countDocuments({ 'stats.lastActive': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      
      // Pending approvals
      getPendingApprovals(),
      
      // Revenue metrics (mock for now)
      getRevenueMetrics(startDate),
      
      // Top categories
      getTopCategories(),
      
      // Growth data
      getUserGrowthData(timeRange),
      getStoreGrowthData(timeRange),
      getProductGrowthData(timeRange)
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          newUsers,
          totalStores,
          newStores,
          totalProducts,
          newProducts,
          activeUsers,
          pendingApprovals: pendingApprovals.total
        },
        revenue: revenueMetrics,
        categories: topCategories,
        growth: {
          users: userGrowth,
          stores: storeGrowth,
          products: productGrowth
        },
        pendingItems: pendingApprovals.items
      }
    });

  } catch (error) {
    logger.error('Admin dashboard error', {
      error: error.message,
      stack: error.stack,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    
    if (search) {
      filters.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) filters.role = role;
    if (status) filters.status = status;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [users, total] = await Promise.all([
      User.find(filters)
        .select('-password -emailVerificationToken -phoneVerificationCode -resetPasswordToken')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('storeId', 'name slug status'),
      User.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Admin users list error', {
      error: error.message,
      query: req.query,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get specific user
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -emailVerificationToken -phoneVerificationCode -resetPasswordToken')
      .populate('storeId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's products and activity
    const [products, recentActivity] = await Promise.all([
      Product.find({ seller: user._id }).limit(10),
      getUserActivity(user._id)
    ]);

    res.json({
      success: true,
      data: {
        user,
        products,
        activity: recentActivity
      }
    });

  } catch (error) {
    logger.error('Admin user details error', {
      error: error.message,
      userId: req.params.userId,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
});

// Update user
router.put('/users/:userId', async (req, res) => {
  try {
    const { status, role, permissions, suspensionReason } = req.body;
    const userId = req.params.userId;

    const updateData = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;
    if (permissions) updateData.permissions = permissions;
    if (suspensionReason) updateData.suspensionReason = suspensionReason;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info('User updated by admin', {
      userId,
      updateData,
      adminId: req.user?.id, // TODO: Get from auth middleware
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error) {
    logger.error('Admin user update error', {
      error: error.message,
      userId: req.params.userId,
      body: req.body,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Store Management
router.get('/stores', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      verified = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'business.category': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filters.status = status;
    if (verified) filters['verification.isVerified'] = verified === 'true';

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [stores, total] = await Promise.all([
      Store.find(filters)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('owner', 'firstName lastName email phone'),
      Store.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        stores,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Admin stores list error', {
      error: error.message,
      query: req.query,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores'
    });
  }
});

// Product Management & Moderation
router.get('/products', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      sellerType = '',
      flagged = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    
    if (status) filters['moderation.status'] = status;
    if (sellerType) filters.sellerType = sellerType;
    if (flagged === 'true') {
      filters['moderation.flags'] = { $exists: true, $not: { $size: 0 } };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [products, total] = await Promise.all([
      Product.find(filters)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('seller', 'firstName lastName email')
        .populate('store', 'name slug')
        .populate('category', 'name'),
      Product.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Admin products list error', {
      error: error.message,
      query: req.query,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Approve/Reject Product
router.put('/products/:productId/moderate', async (req, res) => {
  try {
    const { action, reason } = req.body; // action: 'approve' | 'reject'
    const productId = req.params.productId;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    const updateData = {
      'moderation.status': action === 'approve' ? 'approved' : 'rejected',
      'moderation.approvedBy': req.user?.id, // TODO: Get from auth middleware
      'moderation.approvedAt': new Date()
    };

    if (action === 'reject' && reason) {
      updateData['moderation.rejectionReason'] = reason;
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).populate('seller', 'firstName lastName email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    logger.info('Product moderated by admin', {
      productId,
      action,
      reason,
      adminId: req.user?.id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: `Product ${action}d successfully`,
      data: { product }
    });

  } catch (error) {
    logger.error('Admin product moderation error', {
      error: error.message,
      productId: req.params.productId,
      body: req.body,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to moderate product'
    });
  }
});

// System Analytics
router.get('/analytics', async (req, res) => {
  try {
    const { type, range = '30d' } = req.query;
    const startDate = getDateFromRange(range);

    let analyticsData = {};

    switch (type) {
      case 'users':
        analyticsData = await getUserAnalytics(startDate);
        break;
      case 'stores':
        analyticsData = await getStoreAnalytics(startDate);
        break;
      case 'products':
        analyticsData = await getProductAnalytics(startDate);
        break;
      case 'revenue':
        analyticsData = await getRevenueAnalytics(startDate);
        break;
      case 'geography':
        analyticsData = await getGeographyAnalytics(startDate);
        break;
      default:
        analyticsData = await getOverallAnalytics(startDate);
    }

    res.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    logger.error('Admin analytics error', {
      error: error.message,
      query: req.query,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// System Settings
router.get('/settings', async (req, res) => {
  try {
    // TODO: Implement system settings storage
    const settings = {
      site: {
        name: 'Bazzarly',
        description: 'Modern E-commerce Platform',
        logo: '',
        favicon: '',
        theme: 'default'
      },
      features: {
        userRegistration: true,
        emailVerification: true,
        phoneVerification: true,
        storeCreation: true,
        productModeration: true
      },
      limits: {
        maxProductsPerUser: 100,
        maxProductsPerStore: 1000,
        maxImageSize: '5MB',
        maxImagesPerProduct: 10
      },
      payments: {
        enabledMethods: ['cash', 'card'],
        defaultCurrency: 'USD',
        commissionRate: 5
      }
    };

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    logger.error('Admin settings fetch error', {
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Update System Settings
router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;

    // TODO: Implement settings update logic
    // This would typically save to a Settings collection

    logger.info('System settings updated', {
      settings,
      adminId: req.user?.id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });

  } catch (error) {
    logger.error('Admin settings update error', {
      error: error.message,
      body: req.body,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Helper functions
function getDateFromRange(range) {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

async function getPendingApprovals() {
  const [users, stores, products] = await Promise.all([
    User.countDocuments({ status: 'pending' }),
    Store.countDocuments({ status: 'pending' }),
    Product.countDocuments({ 'moderation.status': 'pending' })
  ]);

  return {
    total: users + stores + products,
    items: {
      users,
      stores,
      products
    }
  };
}

async function getRevenueMetrics(startDate) {
  // Mock data - implement actual revenue calculation
  return {
    total: 125000,
    growth: 15.5,
    breakdown: {
      commissions: 6250,
      subscriptions: 3750,
      promotions: 2500
    }
  };
}

async function getTopCategories() {
  const categories = await Product.aggregate([
    { $match: { 'moderation.status': 'approved' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' }
  ]);

  return categories.map(cat => ({
    name: cat.category.name,
    count: cat.count
  }));
}

async function getUserGrowthData(timeRange) {
  // Implement user growth aggregation
  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [120, 150, 180, 200]
  };
}

async function getStoreGrowthData(timeRange) {
  // Implement store growth aggregation
  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [10, 15, 22, 28]
  };
}

async function getProductGrowthData(timeRange) {
  // Implement product growth aggregation
  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [450, 520, 680, 750]
  };
}

async function getUserActivity(userId) {
  // Mock activity data
  return [
    { type: 'login', timestamp: new Date(), details: 'User logged in' },
    { type: 'product_created', timestamp: new Date(), details: 'Created new product' }
  ];
}

async function getUserAnalytics(startDate) {
  // Implement detailed user analytics
  return {
    totalUsers: 5000,
    activeUsers: 3500,
    newUsers: 150,
    usersByRole: {
      user: 4500,
      store_owner: 450,
      admin: 50
    }
  };
}

async function getStoreAnalytics(startDate) {
  // Implement store analytics
  return {
    totalStores: 500,
    activeStores: 350,
    verifiedStores: 300,
    avgProductsPerStore: 25
  };
}

async function getProductAnalytics(startDate) {
  // Implement product analytics
  return {
    totalProducts: 12500,
    activeProducts: 10000,
    soldProducts: 2000,
    avgPrice: 85.50
  };
}

async function getRevenueAnalytics(startDate) {
  // Implement revenue analytics
  return {
    totalRevenue: 125000,
    commission: 6250,
    growth: 15.5
  };
}

async function getGeographyAnalytics(startDate) {
  // Implement geography analytics
  return {
    topCities: [
      { name: 'New York', users: 1200, stores: 150 },
      { name: 'Los Angeles', users: 980, stores: 120 },
      { name: 'Chicago', users: 750, stores: 85 }
    ]
  };
}

async function getOverallAnalytics(startDate) {
  // Implement overall analytics
  return {
    overview: await getPendingApprovals(),
    growth: {
      users: 15.5,
      stores: 12.3,
      products: 18.7,
      revenue: 22.1
    }
  };
}

module.exports = router; 