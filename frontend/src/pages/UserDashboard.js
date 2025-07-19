import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MessageCircle, 
  Settings, 
  ShoppingBag,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Eye,
  Trash2,
  Plus,
  DollarSign,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { LoadingWrapper, LoadingSpinner } from '../components/Loading';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - in real app this would come from API/auth context
  const userData = {
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
    stats: {
      totalProducts: 24,
      activeListing: 18,
      soldItems: 6,
      totalRevenue: 1250,
      rating: 4.8,
      reviewCount: 23
    },
    joinedDate: '2023-06-15'
  };

  const tabConfig = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: userData.stats.totalRevenue,
      icon: DollarSign,
      color: 'green',
      prefix: '$'
    },
    {
      title: 'Active Listings',
      value: userData.stats.activeListing,
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Items Sold',
      value: userData.stats.soldItems,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Rating',
      value: userData.stats.rating,
      icon: Star,
      color: 'yellow'
    }
  ];

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
                  {userData.firstName} {userData.lastName}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {userData.location.city}, {userData.location.state}
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {userData.stats.rating} ({userData.stats.reviewCount} reviews)
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(userData.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-secondary text-sm">
                <Eye className="w-4 h-4 mr-2" />
                View Public Profile
              </button>
              <button className="btn-primary text-sm">
                <Plus className="w-4 h-4 mr-2" />
                List New Product
              </button>
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
        {activeTab === 'overview' && (
          <OverviewTab statsCards={statsCards} userData={userData} />
        )}

        {activeTab === 'products' && (
          <ProductsTab userId={userData.id} />
        )}

        {activeTab === 'purchases' && (
          <PurchasesTab userId={userData.id} />
        )}

        {activeTab === 'favorites' && (
          <FavoritesTab userId={userData.id} />
        )}

        {activeTab === 'messages' && (
          <MessagesTab userId={userData.id} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab userData={userData} />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ statsCards, userData }) => (
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

    {/* Quick Actions */}
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-secondary-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
          <Plus className="h-6 w-6 text-primary-600 mr-3" />
          <div className="text-left">
            <p className="font-medium text-secondary-800">List New Product</p>
            <p className="text-sm text-secondary-600">Sell something new</p>
          </div>
        </button>

        <button className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
          <Settings className="h-6 w-6 text-primary-600 mr-3" />
          <div className="text-left">
            <p className="font-medium text-secondary-800">Account Settings</p>
            <p className="text-sm text-secondary-600">Manage your profile</p>
          </div>
        </button>

        <button className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
          <MessageCircle className="h-6 w-6 text-primary-600 mr-3" />
          <div className="text-left">
            <p className="font-medium text-secondary-800">Messages</p>
            <p className="text-sm text-secondary-600">Chat with buyers</p>
          </div>
        </button>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Sales</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img 
                  src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=50&h=50&fit=crop`}
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-secondary-800">Product Name {i}</p>
                  <p className="text-sm text-secondary-600">Sold 2 days ago</p>
                </div>
              </div>
              <span className="font-bold text-green-600">$99.99</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium">U{i}</span>
                </div>
                <div>
                  <p className="font-medium text-secondary-800">User {i}</p>
                  <p className="text-sm text-secondary-600">Interested in your product...</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Products Tab
const ProductsTab = ({ userId }) => {
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
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          List New Product
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
                <span>Listed 5 days ago</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  i <= 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {i <= 2 ? 'Active' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex-1 btn-secondary text-sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 btn-outline text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button className="text-red-600 hover:text-red-700 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const PurchasesTab = ({ userId }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Purchase History</h3>
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <img 
              src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=80&h=80&fit=crop`}
              alt="Product"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-medium text-secondary-800">Product Name {i}</h4>
              <p className="text-sm text-secondary-600">Purchased on Dec {i}, 2023</p>
              <p className="text-sm font-medium text-green-600">$99.99</p>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Delivered
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FavoritesTab = ({ userId }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Favorite Products</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="border border-secondary-200 rounded-lg overflow-hidden">
          <img 
            src={`https://images.unsplash.com/photo-156042235${i}-b33ff0c44a43?w=300&h=200&fit=crop`}
            alt="Product"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h4 className="font-medium text-secondary-800 mb-2">Favorite Product {i}</h4>
            <p className="text-primary-600 font-bold mb-2">$159.99</p>
            <button className="w-full btn-primary text-sm">
              View Product
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MessagesTab = ({ userId }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Messages</h3>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-medium">U{i}</span>
            </div>
            <div>
              <h4 className="font-medium text-secondary-800">User {i}</h4>
              <p className="text-sm text-secondary-600">Interested in your iPhone 13 Pro...</p>
              <p className="text-xs text-secondary-500">2 hours ago</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsTab = ({ userData }) => (
  <div className="space-y-6">
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-6">Account Information</h3>
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

    {/* Privacy Settings */}
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-800">Show Phone Number</p>
            <p className="text-sm text-secondary-600">Allow buyers to see your phone number</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-800">Show Email Address</p>
            <p className="text-sm text-secondary-600">Allow buyers to see your email</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-800">Show Exact Location</p>
            <p className="text-sm text-secondary-600">Show precise location instead of city only</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export default UserDashboard; 