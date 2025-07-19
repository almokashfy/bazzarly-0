import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Clock, TrendingUp, Zap } from 'lucide-react';
import { useCategories, useProducts, useAds, useStats } from '../hooks/useApi';
import { LoadingWrapper, CategoryGridSkeleton, ProductListSkeleton } from '../components/Loading';

const HomePage = () => {
  // Fetch data using custom hooks
  const { data: adsData } = useAds();
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: productsData, loading: productsLoading, error: productsError } = useProducts({ limit: 4 });
  const { data: statsData, loading: statsLoading, error: statsError } = useStats();

  // Extract data with fallbacks
  const featuredAds = adsData?.data || [];
  const categories = categoriesData?.data || [];
  const featuredProducts = productsData?.data?.products || [];
  const stats = statsData?.data || {};

  // Category icons mapping
  const categoryIcons = {
    'electronics': '📱',
    'fashion': '👗',
    'home-garden': '🏠',
    'automotive': '🚗',
    'sports': '⚽',
    'books': '📚',
    'health': '💊',
    'toys': '🧸'
  };

  // Category images mapping
  const categoryImages = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
    'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
    'home-garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
    'automotive': 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=300&h=200&fit=crop',
    'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    'books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop'
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Buy, Sell, Connect
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover amazing deals in your neighborhood and beyond
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Start Shopping
              </Link>
              <Link to="/sell" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">Featured Deals</h2>
            <p className="text-secondary-600">Don't miss out on these amazing offers</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredAds.map((ad) => (
              <div key={ad.id} className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer">
                <img 
                  src={ad.image} 
                  alt={ad.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {ad.discount} OFF
                    </span>
                    <span className="text-sm opacity-90">Valid until {ad.validUntil}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
                  <p className="text-primary-100 mb-4">{ad.description}</p>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">Shop by Category</h2>
            <p className="text-secondary-600">Explore our wide range of categories</p>
          </div>
          
          <LoadingWrapper
            loading={categoriesLoading}
            error={categoriesError}
            loadingComponent={CategoryGridSkeleton}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group"
                >
                  <div className="card p-6 text-center hover:shadow-lg transition-shadow group-hover:scale-105 transition-transform">
                    <div className="relative mb-4">
                      <img 
                        src={categoryImages[category.id] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'} 
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/10 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl">{categoryIcons[category.id] || '📦'}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-secondary-800 mb-1">{category.name}</h3>
                    <p className="text-sm text-secondary-500">{category.count || '0'} items</p>
                  </div>
                </Link>
              ))}
            </div>
          </LoadingWrapper>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-4">Featured Products</h2>
              <p className="text-secondary-600">Handpicked deals for you</p>
            </div>
            <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700 font-semibold">
              View All <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
          
          <LoadingWrapper
            loading={productsLoading}
            error={productsError}
            loadingComponent={() => <ProductListSkeleton />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="card overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.condition === 'new' && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full font-semibold">
                          New
                        </span>
                      )}
                      <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Star size={16} className="text-secondary-600" />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-secondary-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary-600">${product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-secondary-400 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-sm text-secondary-600">{product.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{product.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{product.postedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </LoadingWrapper>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingWrapper
            loading={statsLoading}
            error={statsError}
            loadingComponent={() => (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-8 h-8 bg-primary-400 rounded mx-auto mb-2"></div>
                    <div className="h-8 bg-primary-400 rounded mb-1"></div>
                    <div className="h-4 bg-primary-400 rounded"></div>
                  </div>
                ))}
              </div>
            )}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp size={32} className="text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalUsers || '50K+'}{ !stats.totalUsers && '+'}</div>
                <div className="text-primary-200">Active Users</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Zap size={32} className="text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalProducts || '100K+'}{ !stats.totalProducts && '+'}</div>
                <div className="text-primary-200">Products Listed</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Star size={32} className="text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalDeals || '25K+'}{ !stats.totalDeals && '+'}</div>
                <div className="text-primary-200">Successful Deals</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <MapPin size={32} className="text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalCities || '500+'}{ !stats.totalCities && '+'}</div>
                <div className="text-primary-200">Cities Covered</div>
              </div>
            </div>
          </LoadingWrapper>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 