import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Settings, 
  MapPin,
  Eye,
  Calendar,
  Package,
  Store,
  Plus,
  Award
} from 'lucide-react';

const UserProfile = () => {
  // Mock user data - in real app this would come from API/auth context
  const [userData, setUserData] = useState({
    id: 'user_123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    accountType: 'buyer', // 'buyer' or 'seller'
    canSell: false, // true after upgrade
    isSeller: false, // true if user has selling capabilities
    stats: {
      totalPurchases: 12,
      totalSpent: 850,
      favoriteItems: 23,
      reviewsGiven: 8,
      rating: 4.6, // as a buyer
      reviewCount: 5
    },
    joinedDate: '2023-06-15',
    membershipLevel: 'Silver', // Bronze, Silver, Gold, Platinum
    isVerified: true
  });

  const [activeTab, setActiveTab] = useState('orders');

  // Tab configuration - different tabs for sellers
  const getTabConfig = () => {
    if (userData.isSeller) {
      // Seller tabs
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Eye },
        { id: 'management', label: 'Management', icon: Settings },
        { id: 'products', label: 'My Products', icon: Package },
        { id: 'settings', label: 'Settings', icon: Heart }
      ];
    } else {
      // Buyer tabs
      return [
        { id: 'orders', label: 'Order History', icon: ShoppingBag },
        { id: 'pending', label: 'Pending Orders', icon: Package },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings }
      ];
    }
  };

  const tabConfig = getTabConfig();



  const handleUpgradeToSeller = () => {
    // In real app, this would make API call to upgrade account
    // For now, just update the user state to seller mode
    setUserData(prev => ({
      ...prev,
      isSeller: true,
      canSell: true
    }));
    setActiveTab('dashboard'); // Go to seller dashboard tab
  };



  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <img 
                src={userData.avatar} 
                alt={`${userData.firstName} ${userData.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-secondary-800">
                  My Profile
                </h1>
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {userData.location.city}, {userData.location.state}
                  </span>
                  <span className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    {userData.membershipLevel} Member
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(userData.joinedDate).toLocaleDateString()}
                  </span>
                  {userData.isVerified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!userData.canSell && !userData.isSeller && (
                <button 
                  onClick={handleUpgradeToSeller}
                  className="btn-primary text-sm bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Upgrade to Seller
                </button>
              )}

              {userData.isSeller && (
                <div className="flex items-center text-sm text-green-600">
                  <Store className="w-4 h-4 mr-1" />
                  <span className="font-medium">Seller Account</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



              {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabConfig.map((tab) => {
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
          {/* Seller Tabs */}
          {activeTab === 'dashboard' && userData.isSeller && (
            <IntegratedDashboardTab userId={userData.id} />
          )}

          {activeTab === 'management' && userData.isSeller && (
            <ManagementTab userId={userData.id} />
          )}

          {activeTab === 'products' && userData.isSeller && (
            <MyProductsTab userId={userData.id} />
          )}

          {/* Buyer Tabs */}
          {activeTab === 'orders' && !userData.isSeller && (
            <OrderHistoryTab userId={userData.id} />
          )}

          {activeTab === 'pending' && !userData.isSeller && (
            <PendingOrdersTab userId={userData.id} />
          )}

          {activeTab === 'wishlist' && !userData.isSeller && (
            <WishlistTab userId={userData.id} />
          )}

          {/* Common Tabs */}
          {activeTab === 'settings' && (
            <SettingsTab userData={userData} />
          )}
        </div>


    </div>
  );
};



// Order History Tab
const OrderHistoryTab = ({ userId }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg"
          >
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="shipping">Shipping</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Continue Shopping
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-secondary-800">Order #{12340 + i}</h3>
                <p className="text-sm text-secondary-600">Placed on Dec {i}, 2023</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                i <= 2 ? 'bg-green-100 text-green-800' : 
                i === 3 ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {i <= 2 ? 'Delivered' : i === 3 ? 'Shipping' : 'Pending'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <img 
                src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=80&h=80&fit=crop`}
                alt="Product"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-secondary-800">Product Name {i}</h4>
                <p className="text-sm text-secondary-600">Quantity: 1</p>
                <p className="text-lg font-bold text-primary-600">$99.99</p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button className="btn-secondary text-sm">
                  View Details
                </button>
                {i <= 2 && (
                  <button className="btn-outline text-sm">
                    Write Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Dashboard Tab (essential elements only)
const IntegratedDashboardTab = ({ userId }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-secondary-800">Dashboard</h2>
      <button className="btn-primary">
        <Plus className="w-4 h-4 mr-2" />
        List Product
      </button>
    </div>

    {/* Essential Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <ShoppingBag className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-800 mb-1">Total Earnings</h3>
        <p className="text-3xl font-bold text-green-600">$0.00</p>
      </div>
      
      <div className="card p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-800 mb-1">Products Listed</h3>
        <p className="text-3xl font-bold text-blue-600">0</p>
      </div>
      
      <div className="card p-6 text-center">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Eye className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-800 mb-1">Profile Views</h3>
        <p className="text-3xl font-bold text-purple-600">24</p>
      </div>
    </div>

    {/* Quick Start */}
    <div className="card p-6 text-center">
      <h3 className="text-lg font-semibold text-secondary-800 mb-4">🚀 Start Selling</h3>
      <p className="text-secondary-600 mb-6">List your first product to start earning money</p>
      
      <button className="btn-primary px-8 py-3 mx-auto">
        <Plus className="w-5 h-5 mr-2" />
        List Your First Product
      </button>
    </div>

    {/* Recent Activity */}
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Activity</h3>
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-secondary-400 mx-auto mb-2" />
        <p className="text-secondary-600">No activity yet</p>
        <p className="text-sm text-secondary-500">Start by listing your first product</p>
      </div>
    </div>
  </div>
);

// Management Tab (for sellers)
const ManagementTab = ({ userId }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-secondary-800">Product & Sales Management</h2>
      <div className="flex items-center space-x-4">
        <button className="btn-secondary">
          <Eye className="w-4 h-4 mr-2" />
          View Reports
        </button>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>
    </div>

    {/* Quick Management Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600" />
          Product Control
        </h3>
        <div className="space-y-3">
          <button className="w-full btn-secondary text-sm justify-start">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </button>
          <button className="w-full btn-secondary text-sm justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Bulk Edit Products
          </button>
          <button className="w-full btn-secondary text-sm justify-start">
            <Eye className="w-4 h-4 mr-2" />
            Manage Inventory
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
          Sales Control
        </h3>
        <div className="space-y-3">
          <button className="w-full btn-secondary text-sm justify-start">
            <Eye className="w-4 h-4 mr-2" />
            View All Sales
          </button>
          <button className="w-full btn-secondary text-sm justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Manage Orders
          </button>
          <button className="w-full btn-secondary text-sm justify-start">
            <Package className="w-4 h-4 mr-2" />
            Update Shipping
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-purple-600" />
          Customer Control
        </h3>
        <div className="space-y-3">
          <button className="w-full btn-secondary text-sm justify-start">
            <Eye className="w-4 h-4 mr-2" />
            View Messages
          </button>
          <button className="w-full btn-secondary text-sm justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Manage Reviews
          </button>
          <button className="w-full btn-secondary text-sm justify-start">
            <Heart className="w-4 h-4 mr-2" />
            Customer Support
          </button>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Product Updates</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img 
                  src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=50&h=50&fit=crop`}
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-secondary-800">Product {i} Updated</p>
                  <p className="text-sm text-secondary-600">2 hours ago</p>
                </div>
              </div>
              <button className="btn-secondary text-xs">
                <Eye className="w-3 h-3 mr-1" />
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div>
                <p className="font-medium text-secondary-800">Order #1234{i}</p>
                <p className="text-sm text-secondary-600">Customer {i} • $99.99</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Completed
                </span>
                <button className="btn-secondary text-xs">
                  <Eye className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);





// My Products Tab (for sellers) 
const MyProductsTab = ({ userId }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-secondary-800">My Products</h2>
      <div className="flex items-center space-x-4">
        <select className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>All Products</option>
          <option>Active</option>
          <option>Sold</option>
          <option>Draft</option>
        </select>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>
    </div>

    {/* Getting Started Guide */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="font-semibold text-blue-800 mb-3">📝 Quick Start Guide</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
          <span className="text-blue-700">Add product photos & details</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
          <span className="text-blue-700">Set competitive pricing</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
          <span className="text-blue-700">Respond to buyers quickly</span>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="card p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=80&h=80&fit=crop`}
              alt="Product"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-secondary-800 mb-1">My Product {i}</h3>
              <p className="text-sm text-secondary-600 mb-2">Listed in Electronics</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-primary-600 font-medium">$99.99</span>
                <span className="text-secondary-600">23 views</span>
                <span className="text-secondary-600">3 likes</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs text-center ${
                i <= 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {i <= 3 ? 'Active' : 'Sold'}
              </span>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm px-3 py-1">Edit</button>
                <button className="text-red-600 hover:text-red-700 p-1">
                  <Package className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card p-4 text-center">
        <p className="text-2xl font-bold text-blue-600">8</p>
        <p className="text-sm text-secondary-600">Total Products</p>
      </div>
      <div className="card p-4 text-center">
        <p className="text-2xl font-bold text-green-600">5</p>
        <p className="text-sm text-secondary-600">Active Listings</p>
      </div>
      <div className="card p-4 text-center">
        <p className="text-2xl font-bold text-purple-600">3</p>
        <p className="text-sm text-secondary-600">Sold Items</p>
      </div>
      <div className="card p-4 text-center">
        <p className="text-2xl font-bold text-yellow-600">156</p>
        <p className="text-sm text-secondary-600">Total Views</p>
      </div>
    </div>
  </div>
);

// Pending Orders Tab
const PendingOrdersTab = ({ userId }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-secondary-800">Pending Orders</h2>
      <p className="text-sm text-secondary-600">3 orders awaiting processing</p>
    </div>
    
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-secondary-800">Order #{12340 + i}</h3>
              <p className="text-sm text-secondary-600">Placed on Dec {i + 5}, 2023</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Processing
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <img 
              src={`https://images.unsplash.com/photo-156042235${i + 3}-b33ff0c44a43?w=80&h=80&fit=crop`}
              alt="Product"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-secondary-800">Pending Product {i}</h4>
              <p className="text-sm text-secondary-600">Quantity: 1</p>
              <p className="text-lg font-bold text-primary-600">$129.99</p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <button className="btn-secondary text-sm">
                Track Order
              </button>
              <button className="btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Wishlist Tab
const WishlistTab = ({ userId }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-secondary-800">My Wishlist</h2>
      <p className="text-sm text-secondary-600">23 items saved</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="card overflow-hidden group">
          <div className="relative">
            <img 
              src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=300&h=200&fit=crop`}
              alt="Product"
              className="w-full h-48 object-cover"
            />
            <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </button>
          </div>
          <div className="p-4">
            <h4 className="font-medium text-secondary-800 mb-2">Wishlist Item {i}</h4>
            <p className="text-primary-600 font-bold mb-2">$159.99</p>
            <div className="flex items-center space-x-2">
              <button className="flex-1 btn-primary text-sm">
                Buy Now
              </button>
              <button className="btn-outline text-sm px-3">
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);



// Settings Tab (same as before)
const SettingsTab = ({ userData }) => (
  <div className="space-y-6">
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            defaultValue={userData.firstName}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            defaultValue={userData.lastName}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Email
          </label>
          <input
            type="email"
            defaultValue={userData.email}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            defaultValue={userData.phone}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="mt-6">
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>

    {/* Notification Settings */}
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-800">Order Updates</p>
            <p className="text-sm text-secondary-600">Get notified about order status changes</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-800">Price Alerts</p>
            <p className="text-sm text-secondary-600">Get notified when wishlist items go on sale</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-800">New Products</p>
            <p className="text-sm text-secondary-600">Get notified about new products in your interests</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
        </div>
      </div>
    </div>
  </div>
);



export default UserProfile; 