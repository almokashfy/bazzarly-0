import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  BarChart3,
  PieChart,
  Settings,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { LoadingWrapper, LoadingSpinner } from '../components/Loading';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  
  // Fetch dashboard data
  const { 
    data: dashboardData, 
    loading: dashboardLoading, 
    error: dashboardError,
    refetch: refetchDashboard 
  } = useApi(
    () => fetch('/api/admin/dashboard?range=' + timeRange).then(res => res.json()),
    [timeRange]
  );

  const { 
    data: usersData, 
    loading: usersLoading, 
    execute: fetchUsers 
  } = useApi(
    (params = {}) => fetch(`/api/admin/users?${new URLSearchParams(params)}`).then(res => res.json()),
    [],
    { immediate: false }
  );

  const { 
    data: storesData, 
    loading: storesLoading, 
    execute: fetchStores 
  } = useApi(
    (params = {}) => fetch(`/api/admin/stores?${new URLSearchParams(params)}`).then(res => res.json()),
    [],
    { immediate: false }
  );

  const { 
    data: productsData, 
    loading: productsLoading, 
    execute: fetchProducts 
  } = useApi(
    (params = {}) => fetch(`/api/admin/products?${new URLSearchParams(params)}`).then(res => res.json()),
    [],
    { immediate: false }
  );

  // Load appropriate data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'users':
        fetchUsers();
        break;
      case 'stores':
        fetchStores();
        break;
      case 'products':
        fetchProducts({ status: 'pending' });
        break;
      default:
        break;
    }
  }, [activeTab]);

  const overview = dashboardData?.data?.overview || {};
  const growth = dashboardData?.data?.growth || {};
  const pendingItems = dashboardData?.data?.pendingItems || {};

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Users',
      value: overview.totalUsers || 0,
      change: growth.users?.growth || 0,
      icon: Users,
      color: 'blue',
      newCount: overview.newUsers || 0
    },
    {
      title: 'Active Stores',
      value: overview.totalStores || 0,
      change: growth.stores?.growth || 0,
      icon: Store,
      color: 'green',
      newCount: overview.newStores || 0
    },
    {
      title: 'Total Products',
      value: overview.totalProducts || 0,
      change: growth.products?.growth || 0,
      icon: Package,
      color: 'purple',
      newCount: overview.newProducts || 0
    },
    {
      title: 'Revenue',
      value: dashboardData?.data?.revenue?.total || 0,
      change: dashboardData?.data?.revenue?.growth || 0,
      icon: DollarSign,
      color: 'yellow',
      prefix: '$'
    }
  ];

  const pendingApprovals = [
    {
      title: 'Pending Users',
      count: pendingItems.users || 0,
      icon: Users,
      color: 'blue',
      action: () => setActiveTab('users')
    },
    {
      title: 'Pending Stores',
      count: pendingItems.stores || 0,
      icon: Store,
      color: 'green',
      action: () => setActiveTab('stores')
    },
    {
      title: 'Pending Products',
      count: pendingItems.products || 0,
      icon: Package,
      color: 'red',
      action: () => setActiveTab('products')
    }
  ];

  const tabConfig = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'stores', label: 'Stores', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-800">Admin Dashboard</h1>
              <p className="text-secondary-600">Manage your e-commerce platform</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="rounded-lg border border-secondary-300 px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button
                onClick={refetchDashboard}
                className="btn-secondary text-sm"
              >
                Refresh
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
        <LoadingWrapper
          loading={dashboardLoading}
          error={dashboardError}
          loadingComponent={() => <LoadingSpinner size="lg" />}
        >
          {activeTab === 'overview' && (
            <OverviewTab 
              statsCards={statsCards}
              pendingApprovals={pendingApprovals}
              growth={dashboardData?.data?.growth}
              categories={dashboardData?.data?.categories}
            />
          )}

          {activeTab === 'users' && (
            <UsersTab 
              data={usersData?.data}
              loading={usersLoading}
              onRefetch={fetchUsers}
            />
          )}

          {activeTab === 'stores' && (
            <StoresTab 
              data={storesData?.data}
              loading={storesLoading}
              onRefetch={fetchStores}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab 
              data={productsData?.data}
              loading={productsLoading}
              onRefetch={fetchProducts}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab timeRange={timeRange} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </LoadingWrapper>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ statsCards, pendingApprovals, growth, categories }) => (
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
                {card.newCount > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    +{card.newCount} new
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                <Icon className={`h-6 w-6 text-${card.color}-600`} />
              </div>
            </div>
            {card.change !== 0 && (
              <div className="mt-4 flex items-center">
                <TrendingUp 
                  className={`h-4 w-4 ${card.change > 0 ? 'text-green-500' : 'text-red-500'}`} 
                />
                <span className={`ml-2 text-sm ${card.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change > 0 ? '+' : ''}{card.change}%
                </span>
                <span className="ml-1 text-sm text-secondary-500">vs last period</span>
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* Pending Approvals */}
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
        Pending Approvals
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pendingApprovals.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className={`p-4 rounded-lg border-2 border-dashed border-${item.color}-200 hover:border-${item.color}-300 transition-colors text-left`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">{item.title}</p>
                  <p className="text-2xl font-bold text-secondary-800">{item.count}</p>
                </div>
                <Icon className={`h-8 w-8 text-${item.color}-500`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Growth Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Growth Trends</h3>
        <div className="space-y-4">
          {growth && Object.entries(growth).map(([key, data]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-secondary-600 capitalize">{key}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${Math.min(Math.abs(data.growth || 0), 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {data.growth > 0 ? '+' : ''}{data.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Top Categories</h3>
        <div className="space-y-3">
          {categories?.slice(0, 6).map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-secondary-700">{category.name}</span>
              <span className="text-sm font-medium text-secondary-800">
                {category.count} products
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Users Tab Component
const UsersTab = ({ data, loading, onRefetch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <button onClick={onRefetch} className="btn-primary">
            Refresh
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {data?.users?.map((user) => (
                <tr key={user._id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-secondary-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'store_owner' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      {user.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const StoresTab = ({ data, loading, onRefetch }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Store Management</h3>
    <p className="text-secondary-600">Store management interface coming soon...</p>
  </div>
);

const ProductsTab = ({ data, loading, onRefetch }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Product Moderation</h3>
    <p className="text-secondary-600">Product moderation interface coming soon...</p>
  </div>
);

const AnalyticsTab = ({ timeRange }) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Advanced Analytics</h3>
    <p className="text-secondary-600">Analytics dashboard coming soon...</p>
  </div>
);

const SettingsTab = () => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">System Settings</h3>
    <p className="text-secondary-600">Settings panel coming soon...</p>
  </div>
);

export default AdminDashboard; 