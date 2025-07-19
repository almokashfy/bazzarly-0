import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-800 text-secondary-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-xl font-bold text-white">Bazzarly</span>
            </Link>
            <p className="text-secondary-400 text-sm">
              Your trusted marketplace for buying and selling products. 
              Connect with buyers and sellers in your area and beyond.
            </p>
            <div className="flex space-x-4">
              <button className="text-secondary-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </button>
              <button className="text-secondary-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </button>
              <button className="text-secondary-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </button>
              <button className="text-secondary-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-secondary-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-secondary-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="text-secondary-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/safety" className="text-secondary-400 hover:text-white transition-colors">Safety Tips</Link></li>
              <li><Link to="/blog" className="text-secondary-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-secondary-400 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/electronics" className="text-secondary-400 hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/category/fashion" className="text-secondary-400 hover:text-white transition-colors">Fashion</Link></li>
              <li><Link to="/category/home-garden" className="text-secondary-400 hover:text-white transition-colors">Home & Garden</Link></li>
              <li><Link to="/category/automotive" className="text-secondary-400 hover:text-white transition-colors">Automotive</Link></li>
              <li><Link to="/category/sports" className="text-secondary-400 hover:text-white transition-colors">Sports</Link></li>
              <li><Link to="/categories/all" className="text-secondary-400 hover:text-white transition-colors">View All</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-secondary-400" />
                <span className="text-secondary-400">support@bazzarly.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-secondary-400" />
                <span className="text-secondary-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-secondary-400" />
                <span className="text-secondary-400">123 Market St, City, State 12345</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-2">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-l-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-secondary-400 text-sm">
              © 2024 Bazzarly. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6 text-sm">
                <Link to="/privacy" className="text-secondary-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-secondary-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-secondary-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
                <Link to="/help" className="text-secondary-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 