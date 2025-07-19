import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, ShoppingCart, User, Heart, Bell } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Automotive', 'Books', 'Health', 'Toys'
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <span>Free shipping on orders over $50!</span>
            <div className="flex space-x-4">
              <Link to="/help" className="hover:text-primary-200">Help</Link>
              <Link to="/contact" className="hover:text-primary-200">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-secondary-800">Bazzarly</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center space-x-1 text-secondary-600 hover:text-primary-600">
              <Heart size={20} />
              <span className="text-sm">Wishlist</span>
            </button>
            
            <button className="relative text-secondary-600 hover:text-primary-600">
              <Bell size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            
            <button className="relative text-secondary-600 hover:text-primary-600">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
            </button>
            
            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-secondary-600 hover:text-primary-600">
                <User size={20} />
                <span className="hidden md:block text-sm">Account</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/login" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                    Sign In
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                    Create Account
                  </Link>
                  <div className="border-t border-secondary-200 my-2"></div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                    My Profile
                  </Link>
                  <Link to="/store/dashboard" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                    Store Management
                  </Link>
                  <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                    Admin Panel
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-secondary-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-2 rounded-md">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-secondary-100 border-t border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between py-3">
            <div className="flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-secondary-700 hover:text-primary-600 font-medium text-sm whitespace-nowrap"
                >
                  {category}
                </Link>
              ))}
              <Link
                to="/stores"
                className="text-secondary-700 hover:text-primary-600 font-medium text-sm whitespace-nowrap"
              >
                Browse Stores
              </Link>
            </div>
            <Link to="/sell" className="btn-primary text-sm">
              Sell Now
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-200">
          <div className="py-4 space-y-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 py-2 text-secondary-700 hover:bg-secondary-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link to="/sell" className="btn-primary text-sm w-full text-center block">
                Sell Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 