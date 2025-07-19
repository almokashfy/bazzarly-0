const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 500
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  isNegotiable: {
    type: Boolean,
    default: true
  },
  minPrice: {
    type: Number,
    min: 0
  },
  
  // Category & Classification
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: String,
  tags: [String],
  brand: String,
  model: String,
  
  // Condition & Status
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor', 'for-parts'],
    required: true
  },
  availability: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'pending'],
    default: 'available'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  
  // Seller Information (Dual System)
  sellerType: {
    type: String,
    enum: ['individual', 'store'],
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    default: null
  },
  
  // Contact Information
  contact: {
    preferredMethod: {
      type: String,
      enum: ['phone', 'email', 'message', 'in-person'],
      default: 'message'
    },
    phone: {
      number: String,
      isPublic: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false }
    },
    email: {
      address: String,
      isPublic: { type: Boolean, default: false }
    },
    meetingPreferences: {
      locations: [String], // e.g., ['home', 'public-place', 'pickup-only']
      timeSlots: [String], // e.g., ['morning', 'afternoon', 'evening', 'weekend']
      notes: String
    }
  },
  
  // Location Information
  location: {
    address: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'USA' },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    isExact: { type: Boolean, default: false }, // If false, shows approximate location
    pickupOnly: { type: Boolean, default: false },
    deliveryAvailable: { type: Boolean, default: false },
    deliveryRadius: Number, // kilometers
    deliveryFee: Number
  },
  
  // Media
  images: [{
    url: { type: String, required: true },
    alt: String,
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  videos: [{
    url: String,
    thumbnail: String,
    title: String,
    duration: Number // seconds
  }],
  
  // Product Details & Specifications
  specifications: [{
    name: String,
    value: String,
    unit: String
  }],
  features: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: { type: String, default: 'cm' }
  },
  
  // Purchase Information
  purchaseInfo: {
    originalPurchaseDate: Date,
    originalPurchasePrice: Number,
    warranty: {
      hasWarranty: { type: Boolean, default: false },
      expiryDate: Date,
      type: String, // manufacturer, extended, etc.
      isTransferable: { type: Boolean, default: false }
    },
    receipt: {
      hasReceipt: { type: Boolean, default: false },
      image: String
    },
    reasonForSelling: String
  },
  
  // Comments & Discussions
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    type: {
      type: String,
      enum: ['question', 'price_inquiry', 'interest', 'offer', 'general'],
      default: 'general'
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product.comments',
      default: null
    },
    offers: {
      amount: Number,
      isActive: { type: Boolean, default: false },
      expiresAt: Date
    },
    status: {
      type: String,
      enum: ['active', 'hidden', 'reported'],
      default: 'active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // SEO & Discovery
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Analytics & Performance
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    lastViewed: Date
  },
  
  // Moderation & Safety
  moderation: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String,
    flags: [{
      reason: String,
      reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reportedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'],
        default: 'pending'
      }
    }],
    isPromoted: { type: Boolean, default: false },
    promotedUntil: Date
  },
  
  // Visibility & Settings
  settings: {
    isActive: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true },
    allowOffers: { type: Boolean, default: true },
    allowQuestions: { type: Boolean, default: true },
    autoRenew: { type: Boolean, default: false },
    expiresAt: Date,
    urgentSale: { type: Boolean, default: false },
    featuredUntil: Date
  },
  
  // Transaction History
  transactions: [{
    type: {
      type: String,
      enum: ['inquiry', 'offer', 'negotiation', 'sale', 'cancelled'],
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    status: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Related Products (for stores)
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Boost & Promotion
  boost: {
    isActive: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['featured', 'premium', 'urgent', 'spotlight']
    },
    startDate: Date,
    endDate: Date,
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ slug: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ store: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sellerType: 1 });
productSchema.index({ condition: 1 });
productSchema.index({ availability: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'location.coordinates': '2dsphere' });
productSchema.index({ 'moderation.status': 1 });
productSchema.index({ 'settings.isActive': 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Compound indexes
productSchema.index({ 
  'moderation.status': 1, 
  'settings.isActive': 1, 
  'settings.isPublic': 1, 
  availability: 1 
});

// Virtuals
productSchema.virtual('url').get(function() {
  return `/product/${this.slug || this._id}`;
});

productSchema.virtual('primaryImage').get(function() {
  if (!this.images.length) return null;
  return this.images.find(img => img.isPrimary) || this.images[0];
});

productSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

productSchema.virtual('isExpired').get(function() {
  return this.settings.expiresAt && this.settings.expiresAt < new Date();
});

productSchema.virtual('activeComments').get(function() {
  return this.comments.filter(comment => comment.status === 'active');
});

productSchema.virtual('publicComments').get(function() {
  return this.activeComments.filter(comment => comment.isPublic);
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (!this.slug) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  }
  
  // Ensure only one primary image
  if (this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
    }
  }
  
  // Set originalPrice if not provided
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  
  // Set expiry date if not provided (default 30 days)
  if (!this.settings.expiresAt) {
    this.settings.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Instance methods
productSchema.methods.addView = function(userId = null) {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  
  // Track unique views (simplified - in production, use more sophisticated tracking)
  if (userId && this.seller.toString() !== userId.toString()) {
    this.analytics.uniqueViews += 1;
  }
  
  return this.save();
};

productSchema.methods.addComment = function(userId, message, type = 'general', isPublic = true, parentId = null) {
  const comment = {
    user: userId,
    message,
    type,
    isPublic,
    parentComment: parentId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  this.comments.push(comment);
  this.analytics.inquiries += 1;
  
  return this.save();
};

productSchema.methods.makeOffer = function(userId, amount, message = '', expiresIn = 7) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiresIn);
  
  const comment = {
    user: userId,
    message: message || `Offering $${amount}`,
    type: 'offer',
    isPublic: false,
    offers: {
      amount,
      isActive: true,
      expiresAt: expiryDate
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  this.comments.push(comment);
  return this.save();
};

productSchema.methods.canUserEdit = function(userId) {
  // Seller can edit their own product
  if (this.seller.toString() === userId.toString()) {
    return true;
  }
  
  // Store admins can edit store products
  if (this.store && this.sellerType === 'store') {
    // This would need to check store permissions - simplified for now
    return false;
  }
  
  return false;
};

productSchema.methods.isAvailableForPurchase = function() {
  return this.availability === 'available' && 
         this.settings.isActive && 
         this.settings.isPublic && 
         this.moderation.status === 'approved' &&
         !this.isExpired &&
         this.quantity > 0;
};

productSchema.methods.markAsSold = function(buyerId = null, finalPrice = null) {
  this.availability = 'sold';
  this.settings.isActive = false;
  
  if (finalPrice) {
    this.price = finalPrice;
  }
  
  if (buyerId) {
    this.transactions.push({
      type: 'sale',
      user: buyerId,
      amount: finalPrice || this.price,
      status: 'completed',
      createdAt: new Date()
    });
  }
  
  return this.save();
};

productSchema.methods.toPublicJSON = function(userId = null) {
  const product = this.toObject();
  
  // Remove sensitive seller information based on privacy settings
  if (!this.contact.phone.isPublic) {
    delete product.contact.phone.number;
  }
  if (!this.contact.email.isPublic) {
    delete product.contact.email.address;
  }
  
  // Filter comments based on user access
  if (!userId || userId.toString() !== this.seller.toString()) {
    product.comments = product.comments.filter(comment => comment.isPublic);
  }
  
  // Remove private transaction details
  delete product.transactions;
  
  return product;
};

// Static methods
productSchema.statics.findAvailable = function() {
  return this.find({
    availability: 'available',
    'settings.isActive': true,
    'settings.isPublic': true,
    'moderation.status': 'approved',
    'settings.expiresAt': { $gt: new Date() }
  });
};

productSchema.statics.findByLocation = function(coordinates, maxDistance = 50000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  }).where('availability').equals('available')
    .where('settings.isActive').equals(true)
    .where('moderation.status').equals('approved');
};

productSchema.statics.searchProducts = function(query, filters = {}) {
  const searchConditions = {
    $text: { $search: query },
    availability: 'available',
    'settings.isActive': true,
    'settings.isPublic': true,
    'moderation.status': 'approved'
  };
  
  // Apply filters
  if (filters.category) searchConditions.category = filters.category;
  if (filters.condition) searchConditions.condition = filters.condition;
  if (filters.sellerType) searchConditions.sellerType = filters.sellerType;
  if (filters.minPrice) searchConditions.price = { ...searchConditions.price, $gte: filters.minPrice };
  if (filters.maxPrice) searchConditions.price = { ...searchConditions.price, $lte: filters.maxPrice };
  
  return this.find(searchConditions).sort({ score: { $meta: 'textScore' } });
};

productSchema.statics.findFeatured = function() {
  return this.findAvailable()
    .where('boost.isActive').equals(true)
    .where('boost.endDate').gt(new Date())
    .sort({ 'boost.type': 1, createdAt: -1 });
};

module.exports = mongoose.model('Product', productSchema); 