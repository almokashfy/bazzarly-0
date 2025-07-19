import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Clock, 
  Package, 
  Grid, 
  List,
  Search,
  Heart,
  Share2,
  ShoppingCart,
  Eye,
  Calendar,
  Award,
  Users
} from 'lucide-react';

const StorePage = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock store data - in real app this would come from API
  const storeData = {
    id: 'store_123',
    name: 'Tech Electronics Hub',
    slug: 'tech-electronics-hub',
    description: 'Your premier destination for the latest electronics, gadgets, and tech accessories. We offer quality products at competitive prices with excellent customer service.',
    tagline: 'Innovation at Your Fingertips',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    owner: {
      name: 'TechStore Inc.',
      joinedDate: '2022-03-15'
    },
    contact: {
      email: 'hello@techelectronicshub.com',
      phone: '+1 (555) 123-4567',
      website: 'https://techelectronicshub.com'
    },
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    stats: {
      totalProducts: 156,
      followers: 1234,
      rating: 4.8,
      reviewCount: 89,
      responseTime: '2 hours',
      joinedDate: '2022-03-15'
    },
    hours: [
      { day: 'Monday', open: '09:00', close: '18:00', isOpen: true },
      { day: 'Tuesday', open: '09:00', close: '18:00', isOpen: true },
      { day: 'Wednesday', open: '09:00', close: '18:00', isOpen: true },
      { day: 'Thursday', open: '09:00', close: '18:00', isOpen: true },
      { day: 'Friday', open: '09:00', close: '18:00', isOpen: true },
      { day: 'Saturday', open: '10:00', close: '16:00', isOpen: true },
      { day: 'Sunday', open: '12:00', close: '16:00', isOpen: false }
    ],
    policies: {
      returns: '30-day return policy',
      shipping: 'Free shipping on orders over $50',
      warranty: '1-year manufacturer warranty'
    },
    isVerified: true,
    isOpen: true
  };

  // Mock products data
  const products = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      price: 1199,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      category: 'smartphones',
      condition: 'new',
      rating: 4.9,
      reviews: 45,
      isPromoted: true
    },
    {
      id: 2,
      title: 'MacBook Pro 16"',
      price: 2399,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      category: 'laptops',
      condition: 'new',
      rating: 4.8,
      reviews: 23
    },
    {
      id: 3,
      title: 'AirPods Pro 2',
      price: 249,
      image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=300&h=300&fit=crop',
      category: 'accessories',
      condition: 'new',
      rating: 4.7,
      reviews: 67
    },
    {
      id: 4,
      title: 'iPad Air 5th Gen',
      price: 599,
      originalPrice: 649,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
      category: 'tablets',
      condition: 'like-new',
      rating: 4.6,
      reviews: 34
    },
    {
      id: 5,
      title: 'Apple Watch Series 9',
      price: 399,
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop',
      category: 'wearables',
      condition: 'new',
      rating: 4.8,
      reviews: 89
    },
    {
      id: 6,
      title: 'Samsung Galaxy S24',
      price: 899,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      category: 'smartphones',
      condition: 'new',
      rating: 4.5,
      reviews: 56
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'smartphones', name: 'Smartphones', count: 2 },
    { id: 'laptops', name: 'Laptops', count: 1 },
    { id: 'tablets', name: 'Tablets', count: 1 },
    { id: 'accessories', name: 'Accessories', count: 1 },
    { id: 'wearables', name: 'Wearables', count: 1 }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Store Header Banner */}
      <div className="relative">
        <img 
          src={storeData.banner}
          alt={storeData.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex items-end justify-between">
            <div className="flex items-end space-x-6">
              <img 
                src={storeData.logo}
                alt={storeData.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-4 border-white shadow-lg"
              />
              <div className="text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{storeData.name}</h1>
                  {storeData.isVerified && (
                    <Award className="h-6 w-6 text-blue-400" />
                  )}
                </div>
                <p className="text-lg mb-2">{storeData.tagline}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {storeData.stats.rating} ({storeData.stats.reviewCount} reviews)
                  </span>
                  <span className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {storeData.stats.totalProducts} products
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {storeData.stats.followers} followers
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="btn-secondary text-white border-white hover:bg-white hover:text-secondary-800">
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </button>
              <button className="btn-secondary text-white border-white hover:bg-white hover:text-secondary-800">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Navigation & Info */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-6 space-y-4 lg:space-y-0">
            {/* Store Status */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${storeData.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-secondary-700">
                  {storeData.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary-600">
                <Clock className="h-4 w-4" />
                <span>Responds in {storeData.stats.responseTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary-600">
                <MapPin className="h-4 w-4" />
                <span>{storeData.address.city}, {storeData.address.state}</span>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex items-center space-x-3">
              <button className="btn-outline text-sm">
                <Phone className="w-4 h-4 mr-2" />
                Call Store
              </button>
              <button className="btn-outline text-sm">
                <Mail className="w-4 h-4 mr-2" />
                Message
              </button>
              <button className="btn-primary text-sm">
                <Eye className="w-4 h-4 mr-2" />
                View All Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Store Description */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-3">About This Store</h3>
              <p className="text-secondary-600 text-sm leading-relaxed mb-4">
                {storeData.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-secondary-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {new Date(storeData.stats.joinedDate).toLocaleDateString()}</span>
                </div>
                {storeData.contact.website && (
                  <div className="flex items-center text-secondary-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <a href={storeData.contact.website} className="text-primary-600 hover:text-primary-700">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setCategoryFilter(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      categoryFilter === category.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-secondary-100 text-secondary-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-xs bg-secondary-200 text-secondary-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Store Policies */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Store Policies</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-secondary-700">Returns</p>
                  <p className="text-secondary-600">{storeData.policies.returns}</p>
                </div>
                <div>
                  <p className="font-medium text-secondary-700">Shipping</p>
                  <p className="text-secondary-600">{storeData.policies.shipping}</p>
                </div>
                <div>
                  <p className="font-medium text-secondary-700">Warranty</p>
                  <p className="text-secondary-600">{storeData.policies.warranty}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Filters */}
            <div className="card p-6">
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
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-secondary-300 rounded-lg"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400 hover:text-secondary-600'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map(product => (
                <div key={product.id} className={`card overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  {product.isPromoted && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  <img 
                    src={product.image}
                    alt={product.title}
                    className={`object-cover ${
                      viewMode === 'list' ? 'w-48 h-48' : 'w-full h-48'
                    }`}
                  />
                  
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-semibold text-secondary-800 mb-2">{product.title}</h3>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      {product.originalPrice && (
                        <span className="text-sm text-secondary-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                      <span className="text-xl font-bold text-primary-600">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Save ${product.originalPrice - product.price}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{product.rating} ({product.reviews})</span>
                      </div>
                      <span className="capitalize px-2 py-1 bg-secondary-100 rounded-full text-xs">
                        {product.condition}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 btn-primary text-sm">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      <button className="p-2 text-secondary-400 hover:text-red-500 border border-secondary-300 rounded-lg">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="card p-12 text-center">
                <Package className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-800 mb-2">No products found</h3>
                <p className="text-secondary-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage; 