const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Authentication
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  phoneVerificationCode: String,
  
  // Role & Permissions
  role: {
    type: String,
    enum: ['user', 'store_owner', 'admin', 'super_admin'],
    default: 'user'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users', 'manage_stores', 'manage_products', 
      'view_analytics', 'manage_categories', 'manage_ads',
      'moderate_content', 'manage_payments', 'system_config'
    ]
  }],
  
  // Profile Info
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Business Info (for store owners)
  businessInfo: {
    businessName: String,
    businessType: String,
    taxId: String,
    businessLicense: String,
    businessAddress: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  
  // Settings & Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      showPhone: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false },
      showLocation: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' }
  },
  
  // Activity & Stats
  stats: {
    totalProducts: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now }
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'pending'],
    default: 'pending'
  },
  suspensionReason: String,
  
  // Security
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  
  // Store Reference (if store owner)
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we're at max attempts and not locked, lock account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

userSchema.methods.hasPermission = function(permission) {
  // Super admin has all permissions
  if (this.role === 'super_admin') return true;
  
  // Admin has most permissions
  if (this.role === 'admin') {
    const adminPermissions = [
      'manage_users', 'manage_stores', 'manage_products',
      'view_analytics', 'manage_categories', 'manage_ads',
      'moderate_content'
    ];
    return adminPermissions.includes(permission);
  }
  
  // Check specific permissions
  return this.permissions.includes(permission);
};

userSchema.methods.canManageStore = function(storeId) {
  // Super admin and admin can manage any store
  if (this.role === 'super_admin' || this.role === 'admin') return true;
  
  // Store owner can manage their own store
  if (this.role === 'store_owner' && this.storeId && this.storeId.toString() === storeId.toString()) {
    return true;
  }
  
  return false;
};

userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  
  // Remove sensitive information
  delete user.password;
  delete user.emailVerificationToken;
  delete user.phoneVerificationCode;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.loginAttempts;
  delete user.lockUntil;
  
  // Apply privacy settings
  if (!user.preferences.privacy.showPhone) {
    delete user.phone;
  }
  if (!user.preferences.privacy.showEmail) {
    delete user.email;
  }
  if (!user.preferences.privacy.showLocation) {
    delete user.location;
  }
  
  return user;
};

// Static methods
userSchema.statics.findByCredentials = async function(identifier, password) {
  // Find user by email or phone
  const user = await this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { phone: identifier }
    ]
  });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Check if account is locked
  if (user.isLocked) {
    throw new Error('Account temporarily locked due to too many failed login attempts');
  }
  
  // Check if account is active
  if (user.status !== 'active') {
    throw new Error('Account is not active');
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw new Error('Invalid credentials');
  }
  
  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }
  
  // Update last active
  user.stats.lastActive = new Date();
  await user.save();
  
  return user;
};

module.exports = mongoose.model('User', userSchema); 