import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Camera, 
  DollarSign, 
  Tag, 
  MapPin,
  Edit,
  Eye,
  Trash2,
  TrendingUp,
  Star,
  MessageCircle,
  User
} from 'lucide-react';

const SimpleSeller = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Mock user seller data
  const sellerData = {
    firstName: 'John',
    lastName: 'Doe',
    totalListings: 8,
    activeListing: 6,
    soldItems: 2,
    totalEarnings: 350,
    rating: 4.7,
    reviewCount: 12
  };

  const sellerTabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Seller Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary-800">
                Welcome, {sellerData.firstName}! 🎉
              </h1>
              <p className="text-secondary-600">Start selling your items and earn money</p>
            </div>
            
            <button 
              onClick={() => setShowAddProduct(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              List New Product
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Banner for New Sellers */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-800">You're now a seller! 🚀</h3>
              <p className="text-sm text-secondary-600">
                Start by listing your first product. It's quick and easy - just add photos, details, and price!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {sellerTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <SellerOverview sellerData={sellerData} onAddProduct={() => setShowAddProduct(true)} />
        )}

        {activeTab === 'products' && (
          <MyProducts onAddProduct={() => setShowAddProduct(true)} />
        )}

        {activeTab === 'messages' && (
          <SellerMessages />
        )}

        {activeTab === 'profile' && (
          <SellerProfile sellerData={sellerData} />
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal onClose={() => setShowAddProduct(false)} />
      )}
    </div>
  );
};

// Seller Overview Tab
const SellerOverview = ({ sellerData, onAddProduct }) => {
  const statsCards = [
    {
      title: 'Total Earnings',
      value: sellerData.totalEarnings,
      icon: DollarSign,
      color: 'green',
      prefix: '$'
    },
    {
      title: 'Active Listings',
      value: sellerData.activeListing,
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Items Sold',
      value: sellerData.soldItems,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Seller Rating',
      value: sellerData.rating,
      icon: Star,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">{card.title}</p>
                  <p className="text-3xl font-bold text-secondary-800">
                    {card.prefix}{card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Start Guide */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Quick Start Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-secondary-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-secondary-800">List Your First Product</h4>
              <p className="text-sm text-secondary-600 mt-1">Add photos, description, and price</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-secondary-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-secondary-800">Get Your First Sale</h4>
              <p className="text-sm text-secondary-600 mt-1">Respond to buyers quickly</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-secondary-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-medium text-secondary-800">Build Your Reputation</h4>
              <p className="text-sm text-secondary-600 mt-1">Get great reviews from buyers</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={onAddProduct} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            List Your First Product
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {sellerData.soldItems > 0 ? (
              [1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=50&h=50&fit=crop`}
                      alt="Product"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-secondary-800">Product {i}</p>
                      <p className="text-sm text-secondary-600">Sold 3 days ago</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">+$99.99</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-secondary-400 mx-auto mb-2" />
                <p className="text-secondary-600">No sales yet</p>
                <p className="text-sm text-secondary-500">List your first product to get started!</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">Selling Tips</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">📸 Take Great Photos</h4>
              <p className="text-sm text-blue-600 mt-1">Good photos get 5x more views</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">💬 Respond Quickly</h4>
              <p className="text-sm text-green-600 mt-1">Fast replies lead to more sales</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">💰 Price Competitively</h4>
              <p className="text-sm text-purple-600 mt-1">Check similar items for pricing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// My Products Tab
const MyProducts = ({ onAddProduct }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-secondary-800">My Products</h2>
      <button onClick={onAddProduct} className="btn-primary">
        <Plus className="w-4 h-4 mr-2" />
        Add Product
      </button>
    </div>

    {/* Products Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="card overflow-hidden">
          <img 
            src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=300&h=200&fit=crop`}
            alt="Product"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-secondary-800 mb-2">My Product {i}</h3>
            <p className="text-primary-600 font-bold mb-2">$99.99</p>
            <div className="flex items-center justify-between text-sm text-secondary-600 mb-4">
              <span>Listed 2 days ago</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                i <= 4 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {i <= 4 ? 'Active' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex-1 btn-secondary text-sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button className="btn-outline text-sm px-3">
                <Eye className="w-4 h-4" />
              </button>
              <button className="text-red-600 hover:text-red-700 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Empty State for new sellers */}
    <div className="card p-12 text-center">
      <Package className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-secondary-800 mb-2">Ready to list your first product?</h3>
      <p className="text-secondary-600 mb-6">It's quick and easy to get started selling</p>
      <button onClick={onAddProduct} className="btn-primary">
        <Plus className="w-4 h-4 mr-2" />
        List Your First Product
      </button>
    </div>
  </div>
);

// Simple Add Product Modal
const AddProductModal = ({ onClose }) => {
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    location: '',
    images: []
  });

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Automotive', 'Toys', 'Others'
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, this would submit to API
    console.log('Product data:', productData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-800">List Your Product</h2>
            <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Product Photos
              </label>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600 mb-2">Add up to 8 photos</p>
                <button type="button" className="btn-secondary text-sm">
                  Choose Photos
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Product Title
              </label>
              <input
                type="text"
                value={productData.title}
                onChange={(e) => setProductData({...productData, title: e.target.value})}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="What are you selling?"
                required
              />
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category
                </label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData({...productData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Condition
                </label>
                <select
                  value={productData.condition}
                  onChange={(e) => setProductData({...productData, condition: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select condition</option>
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description
              </label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe your item..."
                required
              />
            </div>

            {/* Price and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({...productData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={productData.location}
                  onChange={(e) => setProductData({...productData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="City, State"
                  required
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center space-x-4 pt-6 border-t">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button type="submit" className="flex-1 btn-primary">
                List Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Placeholder components
const SellerMessages = () => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Messages from Buyers</h3>
    <p className="text-secondary-600">You'll see messages from interested buyers here</p>
  </div>
);

const SellerProfile = ({ sellerData }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Seller Profile</h3>
    <p className="text-secondary-600">Manage your seller profile and preferences</p>
  </div>
);

export default SimpleSeller; 