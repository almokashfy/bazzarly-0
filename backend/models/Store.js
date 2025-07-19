const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  tagline: {
    type: String,
    maxlength: 200
  },
  
  // Owner Info
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Store Admins (additional users who can manage the store)
  admins: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['manager', 'editor', 'viewer'],
      default: 'editor'
    },
    permissions: [{
      type: String,
      enum: [
        'manage_products', 'manage_orders', 'manage_customers',
        'view_analytics', 'manage_settings', 'manage_staff'
      ]
    }],
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Branding & Customization
  branding: {
    logo: String,
    banner: String,
    favicon: String,
    colors: {
      primary: { type: String, default: '#3b82f6' },
      secondary: { type: String, default: '#64748b' },
      accent: { type: String, default: '#f59e0b' }
    },
    fonts: {
      heading: { type: String, default: 'Inter' },
      body: { type: String, default: 'Inter' }
    }
  },
  
  // Contact Information
  contact: {
    email: {
      type: String,
      required: true
    },
    phone: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String
    }
  },
  
  // Address & Location
  addresses: [{
    type: {
      type: String,
      enum: ['primary', 'warehouse', 'pickup', 'billing'],
      default: 'primary'
    },
    name: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    isDefault: { type: Boolean, default: false }
  }],
  
  // Business Information
  business: {
    type: {
      type: String,
      enum: ['individual', 'business', 'corporation'],
      default: 'individual'
    },
    category: {
      type: String,
      required: true
    },
    subCategory: String,
    taxId: String,
    businessLicense: String,
    registrationNumber: String,
    establishedYear: Number
  },
  
  // Store Settings
  settings: {
    isActive: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true },
    allowGuestCheckout: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: false },
    autoApproveProducts: { type: Boolean, default: true },
    
    // Shipping
    shipping: {
      enabled: { type: Boolean, default: true },
      freeShippingThreshold: { type: Number, default: 0 },
      processingTime: { type: String, default: '1-2 business days' },
      zones: [{
        name: String,
        countries: [String],
        rate: Number,
        freeThreshold: Number
      }]
    },
    
    // Payment
    payment: {
      acceptsCash: { type: Boolean, default: true },
      acceptsCards: { type: Boolean, default: false },
      acceptsPaypal: { type: Boolean, default: false },
      acceptsCrypto: { type: Boolean, default: false }
    },
    
    // Returns & Refunds
    returns: {
      enabled: { type: Boolean, default: true },
      timeLimit: { type: Number, default: 30 }, // days
      policy: String,
      restockingFee: { type: Number, default: 0 }
    }
  },
  
  // SEO & Marketing
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Analytics & Performance
  analytics: {
    totalProducts: { type: Number, default: 0 },
    activeProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalCustomers: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  
  // Store Status & Verification
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'closed'],
    default: 'pending'
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    documents: [{
      type: String,
      url: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  
  // Subscription & Plans
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    features: [String],
    limits: {
      products: { type: Number, default: 10 },
      storage: { type: Number, default: 100 }, // MB
      bandwidth: { type: Number, default: 1000 }, // MB
      adminUsers: { type: Number, default: 1 }
    }
  },
  
  // Store Policies
  policies: {
    terms: String,
    privacy: String,
    refund: String,
    shipping: String
  },
  
  // Opening Hours
  hours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    isOpen: { type: Boolean, default: true },
    openTime: String, // e.g., "09:00"
    closeTime: String, // e.g., "18:00"
    breaks: [{
      start: String,
      end: String
    }]
  }],
  
  // Featured Content
  featured: {
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    deals: [{
      title: String,
      description: String,
      image: String,
      discountPercent: Number,
      validFrom: Date,
      validUntil: Date,
      isActive: { type: Boolean, default: true }
    }],
    announcements: [{
      title: String,
      message: String,
      type: {
        type: String,
        enum: ['info', 'warning', 'success', 'error'],
        default: 'info'
      },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  
  // Store Performance Metrics
  metrics: {
    views: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    averageSessionDuration: { type: Number, default: 0 }, // seconds
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
storeSchema.index({ slug: 1 });
storeSchema.index({ owner: 1 });
storeSchema.index({ status: 1 });
storeSchema.index({ 'business.category': 1 });
storeSchema.index({ 'verification.isVerified': 1 });
storeSchema.index({ 'settings.isActive': 1 });
storeSchema.index({ 'addresses.coordinates': '2dsphere' });

// Virtuals
storeSchema.virtual('url').get(function() {
  return `/store/${this.slug}`;
});

storeSchema.virtual('primaryAddress').get(function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
});

storeSchema.virtual('isOpen').get(function() {
  if (!this.hours.length) return true;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = this.hours.find(h => h.day === currentDay);
  if (!todayHours || !todayHours.isOpen) return false;
  
  return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
});

// Pre-save middleware
storeSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (!this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Ensure only one default address
  if (this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length === 0) {
      this.addresses[0].isDefault = true;
    } else if (defaultAddresses.length > 1) {
      this.addresses.forEach((addr, index) => {
        addr.isDefault = index === 0;
      });
    }
  }
  
  next();
});

// Instance methods
storeSchema.methods.canUserManage = function(userId, action = 'view') {
  // Check if user is owner
  if (this.owner.toString() === userId.toString()) {
    return true;
  }
  
  // Check if user is admin
  const admin = this.admins.find(admin => admin.user.toString() === userId.toString());
  if (!admin) return false;
  
  // Check specific permissions
  const permissionMap = {
    'view': ['manage_products', 'manage_orders', 'manage_customers', 'view_analytics', 'manage_settings', 'manage_staff'],
    'edit': ['manage_products', 'manage_settings'],
    'manage_products': ['manage_products'],
    'manage_orders': ['manage_orders'],
    'manage_settings': ['manage_settings'],
    'view_analytics': ['view_analytics']
  };
  
  const requiredPermissions = permissionMap[action] || [];
  return requiredPermissions.some(perm => admin.permissions.includes(perm));
};

storeSchema.methods.updateAnalytics = function(data) {
  Object.keys(data).forEach(key => {
    if (this.analytics[key] !== undefined) {
      this.analytics[key] = data[key];
    }
  });
  return this.save();
};

storeSchema.methods.addView = function() {
  this.metrics.views += 1;
  this.metrics.lastUpdated = new Date();
  return this.save();
};

storeSchema.methods.getActiveDeals = function() {
  const now = new Date();
  return this.featured.deals.filter(deal => 
    deal.isActive && 
    (!deal.validFrom || deal.validFrom <= now) &&
    (!deal.validUntil || deal.validUntil >= now)
  );
};

storeSchema.methods.toPublicJSON = function() {
  const store = this.toObject();
  
  // Remove sensitive information
  delete store.business.taxId;
  delete store.business.businessLicense;
  delete store.business.registrationNumber;
  delete store.verification.documents;
  delete store.subscription;
  
  return store;
};

// Static methods
storeSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, status: 'active', 'settings.isActive': true });
};

storeSchema.statics.findNearby = function(coordinates, maxDistance = 50000) {
  return this.find({
    'addresses.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    status: 'active',
    'settings.isActive': true,
    'settings.isPublic': true
  });
};

storeSchema.statics.searchStores = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { 'business.category': { $regex: query, $options: 'i' } }
    ],
    status: 'active',
    'settings.isActive': true,
    'settings.isPublic': true
  });
};

module.exports = mongoose.model('Store', storeSchema); 