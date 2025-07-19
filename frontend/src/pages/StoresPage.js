import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Star, 
  Search, 
  Grid, 
  List,
  Award,
  Package,
  Users,
  TrendingUp
} from 'lucide-react';

const StoresPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Mock stores data - in real app this would come from API
  const stores = [
    {
      id: 1,
      name: 'Tech Electronics Hub',
      slug: 'tech-electronics-hub',
      description: 'Premium electronics and gadgets with latest technology',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
      category: 'Electronics',
      location: { city: 'San Francisco', state: 'CA' },
      stats: {
        rating: 4.8,
        reviewCount: 234,
        productCount: 156,
        followers: 1234
      },
      isVerified: true,
      isOpen: true,
      featured: true
    },
    {
      id: 2,
      name: 'Fashion Forward',
      slug: 'fashion-forward',
      description: 'Trendy clothing and accessories for modern lifestyle',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
      category: 'Fashion',
      location: { city: 'New York', state: 'NY' },
      stats: {
        rating: 4.6,
        reviewCount: 189,
        productCount: 89,
        followers: 856
      },
      isVerified: true,
      isOpen: true,
      featured: false
    },
    {
      id: 3,
      name: 'Home & Garden Paradise',
      slug: 'home-garden-paradise',
      description: 'Everything you need for your home and garden',
      logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=120&fit=crop',
      banner: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop',
      category: 'Home & Garden',
      location: { city: 'Austin', state: 'TX' },
      stats: {
        rating: 4.7,
        reviewCount: 145,
        productCount: 203,
        followers: 967
      },
      isVerified: false,
      isOpen: true,
      featured: false
    },
    {
      id: 4,
      name: 'Sports Central',
      slug: 'sports-central',
      description: 'Quality sports equipment and athletic wear',
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop',
      banner: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      category: 'Sports',
      location: { city: 'Denver', state: 'CO' },
      stats: {
        rating: 4.5,
        reviewCount: 98,
        productCount: 134,
        followers: 623
      },
      isVerified: true,
      isOpen: false,
      featured: false
    },
    {
      id: 5,
      name: 'BookWorms Corner',
      slug: 'bookworms-corner',
      description: 'Rare and popular books for every reading taste',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
      banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
      category: 'Books',
      location: { city: 'Seattle', state: 'WA' },
      stats: {
        rating: 4.9,
        reviewCount: 312,
        productCount: 567,
        followers: 1589
      },
      isVerified: true,
      isOpen: true,
      featured: true
    },
    {
      id: 6,
      name: 'Auto Parts Pro',
      slug: 'auto-parts-pro',
      description: 'Professional automotive parts and accessories',
      logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&h=120&fit=crop',
      banner: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=200&fit=crop',
      category: 'Automotive',
      location: { city: 'Detroit', state: 'MI' },
      stats: {
        rating: 4.4,
        reviewCount: 76,
        productCount: 89,
        followers: 445
      },
      isVerified: true,
      isOpen: true,
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: stores.length },
    { id: 'Electronics', name: 'Electronics', count: 1 },
    { id: 'Fashion', name: 'Fashion', count: 1 },
    { id: 'Home & Garden', name: 'Home & Garden', count: 1 },
    { id: 'Sports', name: 'Sports', count: 1 },
    { id: 'Books', name: 'Books', count: 1 },
    { id: 'Automotive', name: 'Automotive', count: 1 }
  ];

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || store.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort stores
  const sortedStores = [...filteredStores].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.followers - a.stats.followers;
      case 'rating':
        return b.stats.rating - a.stats.rating;
      case 'newest':
        return b.id - a.id;
      case 'products':
        return b.stats.productCount - a.stats.productCount;
      default:
        return 0;
    }
  });

  // Separate featured stores
  const featuredStores = sortedStores.filter(store => store.featured);
  const regularStores = sortedStores.filter(store => !store.featured);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-800 mb-4">Browse Stores</h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Discover amazing stores from verified sellers offering quality products 
              across different categories
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="products">Most Products</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-secondary-400 hover:text-secondary-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-secondary-400 hover:text-secondary-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Stores */}
        {featuredStores.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-secondary-800">Featured Stores</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStores.map(store => (
                <StoreCard key={store.id} store={store} viewMode="grid" featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Stores */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-800">
              All Stores ({regularStores.length})
            </h2>
          </div>

          {/* Stores Grid/List */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {regularStores.map(store => (
              <StoreCard key={store.id} store={store} viewMode={viewMode} />
            ))}
          </div>

          {/* Empty State */}
          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-800 mb-2">No stores found</h3>
              <p className="text-secondary-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Store Card Component
const StoreCard = ({ store, viewMode, featured = false }) => (
  <Link 
    to={`/store/${store.slug}`}
    className={`card overflow-hidden hover:shadow-lg transition-shadow group ${
      viewMode === 'list' ? 'flex' : ''
    } ${featured ? 'ring-2 ring-primary-200' : ''}`}
  >
    {featured && (
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-gradient-to-r from-primary-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
          ⭐ Featured
        </span>
      </div>
    )}

    {/* Store Banner */}
    <div className={`relative ${viewMode === 'list' ? 'w-48' : 'w-full h-32'}`}>
      <img 
        src={store.banner}
        alt={store.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* Store Logo */}
      <div className="absolute bottom-0 left-4 transform translate-y-1/2">
        <img 
          src={store.logo}
          alt={store.name}
          className="w-16 h-16 rounded-lg object-cover border-4 border-white shadow-md"
        />
      </div>
    </div>

    {/* Store Info */}
    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : 'pt-10'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-secondary-800 group-hover:text-primary-600 transition-colors">
              {store.name}
            </h3>
            {store.isVerified && (
              <Award className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <p className="text-sm text-secondary-600 mb-2 line-clamp-2">
            {store.description}
          </p>
        </div>
        
        <div className={`w-3 h-3 rounded-full ${
          store.isOpen ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-1 text-secondary-600">
          <Star className="h-4 w-4 text-yellow-400" />
          <span>{store.stats.rating} ({store.stats.reviewCount})</span>
        </div>
        <div className="flex items-center space-x-1 text-secondary-600">
          <Package className="h-4 w-4" />
          <span>{store.stats.productCount} products</span>
        </div>
        <div className="flex items-center space-x-1 text-secondary-600">
          <MapPin className="h-4 w-4" />
          <span>{store.location.city}, {store.location.state}</span>
        </div>
        <div className="flex items-center space-x-1 text-secondary-600">
          <Users className="h-4 w-4" />
          <span>{store.stats.followers} followers</span>
        </div>
      </div>

      {/* Category & Status */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
          {store.category}
        </span>
        <span className={`text-xs font-medium ${
          store.isOpen ? 'text-green-600' : 'text-red-600'
        }`}>
          {store.isOpen ? 'Open Now' : 'Closed'}
        </span>
      </div>
    </div>
  </Link>
);

export default StoresPage; 