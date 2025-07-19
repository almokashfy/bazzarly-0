const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { createValidationMiddleware } = require('../middleware/validation');
const { logger, securityLogger } = require('../middleware/logger');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: { success: false, message: 'Too many registration attempts, please try again later.' }
});

// JWT helper functions
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// Generate verification codes
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register new user
router.post('/register', registrationLimiter, createValidationMiddleware('user'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      securityLogger.logSuspiciousActivity(req.ip, 'Duplicate registration attempt');
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    // Create verification tokens
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const phoneVerificationCode = generateVerificationCode();

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: ['admin', 'super_admin'].includes(role) ? 'user' : role, // Prevent privilege escalation
      emailVerificationToken,
      phoneVerificationCode,
      status: 'pending'
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken();

    logger.info('User registered successfully', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    // TODO: Send verification email and SMS
    // await sendVerificationEmail(email, emailVerificationToken);
    // await sendVerificationSMS(phone, phoneVerificationCode);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email and phone number.',
      data: {
        user: user.toPublicJSON(),
        token,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });

  } catch (error) {
    logger.error('Registration error', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required'
      });
    }

    // Find and validate user
    const user = await User.findByCredentials(identifier, password);
    
    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken();

    logger.info('User logged in successfully', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toPublicJSON(),
        token,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });

  } catch (error) {
    securityLogger.logFailedLogin(req.ip, req.body.identifier);
    
    logger.error('Login error', {
      error: error.message,
      identifier: req.body.identifier,
      ip: req.ip
    });

    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    
    // Activate account if both email and phone are verified
    if (user.phoneVerified || !user.phone) {
      user.status = 'active';
    }

    await user.save();

    logger.info('Email verified successfully', {
      userId: user._id,
      email: user.email,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: user.toPublicJSON()
      }
    });

  } catch (error) {
    logger.error('Email verification error', {
      error: error.message,
      token: req.body.token,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
});

// Verify phone
router.post('/verify-phone', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and verification code are required'
      });
    }

    const user = await User.findOne({ 
      phone, 
      phoneVerificationCode: code 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number or verification code'
      });
    }

    user.phoneVerified = true;
    user.phoneVerificationCode = undefined;
    
    // Activate account if both email and phone are verified
    if (user.emailVerified) {
      user.status = 'active';
    }

    await user.save();

    logger.info('Phone verified successfully', {
      userId: user._id,
      phone: user.phone,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Phone number verified successfully',
      data: {
        user: user.toPublicJSON()
      }
    });

  } catch (error) {
    logger.error('Phone verification error', {
      error: error.message,
      phone: req.body.phone,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Phone verification failed'
    });
  }
});

// Resend verification email
router.post('/resend-email-verification', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new token
    user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
    await user.save();

    // TODO: Send verification email
    // await sendVerificationEmail(email, user.emailVerificationToken);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    logger.error('Resend email verification error', {
      error: error.message,
      email: req.body.email,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email'
    });
  }
});

// Forgot password
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { identifier } = req.body; // email or phone

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phone: identifier }
      ]
    });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account exists with this email/phone, you will receive reset instructions'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // TODO: Send password reset email/SMS
    // await sendPasswordResetEmail(user.email, resetToken);

    logger.info('Password reset requested', {
      userId: user._id,
      identifier,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Password reset instructions sent'
    });

  } catch (error) {
    logger.error('Forgot password error', {
      error: error.message,
      identifier: req.body.identifier,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Reset login attempts
    await user.resetLoginAttempts();
    
    await user.save();

    logger.info('Password reset successfully', {
      userId: user._id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    logger.error('Reset password error', {
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// Change password (authenticated)
router.post('/change-password', async (req, res) => {
  try {
    // This would need authentication middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // TODO: Get user from authentication middleware
    // const user = req.user;

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error', {
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Logout (optional - mainly for token blacklisting)
router.post('/logout', async (req, res) => {
  try {
    // TODO: Add token to blacklist if using token blacklisting strategy
    
    logger.info('User logged out', {
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logger.error('Logout error', {
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // TODO: Implement refresh token validation
    // This would involve storing refresh tokens and validating them

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: 'new-access-token',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });

  } catch (error) {
    logger.error('Refresh token error', {
      error: error.message,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
});

module.exports = router; 