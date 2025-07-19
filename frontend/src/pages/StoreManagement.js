import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Eye, 
  Edit, 
  Plus,
  Upload,
  Trash2,
  Star,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { LoadingWrapper, LoadingSpinner } from '../components/Loading';

const StoreManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  // Mock store data - in real app this would come from API
  const storeData = {
    id: 'store_123',
    name: 'Tech Electronics Store',
    slug: 'tech-electronics',
    description: 'Premium electronics and gadgets',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    status: 'active',
    verified: true,
    rating: 4.8,
    reviewCount: 234,
    analytics: {
      totalProducts: 156,
      activeProducts: 142,
      totalOrders: 89,
      revenue: 15420,
      visitors: 2341,
      conversionRate: 3.8
    }
  };

  const tabConfig = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: storeData.analytics.revenue,
      change: 12.5,
      icon: DollarSign,
      color: 'green',
      prefix: '$'
    },
    {
      title: 'Active Products',
      value: storeData.analytics.activeProducts,
      change: 8.2,
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Total Orders',
      value: storeData.analytics.totalOrders,
      change: 15.3,
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      title: 'Store Visitors',
      value: storeData.analytics.visitors,
      change: 22.1,
      icon: Eye,
      color: 'yellow'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <img 
                src={storeData.logo} 
                alt={storeData.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-secondary-800">{storeData.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {storeData.rating} ({storeData.reviewCount} reviews)
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    storeData.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {storeData.verified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-secondary text-sm">
                <Eye className="w-4 h-4 mr-2" />
                View Store
              </button>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="rounded-lg border border-secondary-300 px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
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
          <OverviewTab statsCards={statsCards} storeData={storeData} />
        )}

        {activeTab === 'products' && (
          <ProductsTab storeId={storeData.id} />
        )}

        {activeTab === 'orders' && (
          <OrdersTab storeId={storeData.id} />
        )}

        {activeTab === 'customers' && (
          <CustomersTab storeId={storeData.id} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab storeId={storeData.id} timeRange={timeRange} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab storeData={storeData} />
        )}
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ statsCards, storeData }) => (
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
                  {card.prefix}{card.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                <Icon className={`h-6 w-6 text-${card.color}-600`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp 
                className={`h-4 w-4 ${card.change > 0 ? 'text-green-500' : 'text-red-500'}`} 
              />
              <span className={`ml-2 text-sm ${card.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {card.change > 0 ? '+' : ''}{card.change}%
              </span>
              <span className="ml-1 text-sm text-secondary-500">vs last period</span>
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
            <p className="font-medium text-secondary-800">Add New Product</p>
            <p className="text-sm text-secondary-600">Create a new product listing</p>
          </div>
        </button>

        <button className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
          <Upload className="h-6 w-6 text-primary-600 mr-3" />
          <div className="text-left">
            <p className="font-medium text-secondary-800">Bulk Upload</p>
            <p className="text-sm text-secondary-600">Upload multiple products via CSV</p>
          </div>
        </button>

        <button className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
          <Settings className="h-6 w-6 text-primary-600 mr-3" />
          <div className="text-left">
            <p className="font-medium text-secondary-800">Store Settings</p>
            <p className="text-sm text-secondary-600">Manage store configuration</p>
          </div>
        </button>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div>
                <p className="font-medium text-secondary-800">Order #00{i}23</p>
                <p className="text-sm text-secondary-600">2 items • $125.00</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Completed
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Low Stock Alerts</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div>
                <p className="font-medium text-secondary-800">Product Name {i}</p>
                <p className="text-sm text-secondary-600">Only 2 items left</p>
              </div>
              <button className="text-primary-600 hover:text-primary-700">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Products Tab
const ProductsTab = ({ storeId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        
        <button className="btn-primary flex items-center">
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
              <h3 className="font-semibold text-secondary-800 mb-2">Product Name {i}</h3>
              <p className="text-primary-600 font-bold mb-2">$99.99</p>
              <div className="flex items-center justify-between text-sm text-secondary-600">
                <span>Stock: 15</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Active
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <button className="flex-1 btn-secondary text-sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
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
const OrdersTab = ({ storeId }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Order Management</h3>
    <p className="text-secondary-600">Order management interface coming soon...</p>
  </div>
);

const CustomersTab = ({ storeId }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Customer Management</h3>
    <p className="text-secondary-600">Customer management interface coming soon...</p>
  </div>
);

const AnalyticsTab = ({ storeId, timeRange }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Store Analytics</h3>
    <p className="text-secondary-600">Analytics dashboard coming soon...</p>
  </div>
);

const SettingsTab = ({ storeData }) => (
  <div className="space-y-6">
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Store Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Store Name
          </label>
          <input
            type="text"
            defaultValue={storeData.name}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Store Slug
          </label>
          <input
            type="text"
            defaultValue={storeData.slug}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          defaultValue={storeData.description}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="mt-6">
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  </div>
);

export default StoreManagement; 