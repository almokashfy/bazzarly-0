import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, List, MapPin, Clock, Star, SlidersHorizontal } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    location: '',
    condition: '',
    datePosted: '',
    seller: '',
    availability: ''
  });

  // Sample product data - would normally come from API
  useEffect(() => {
    const sampleProducts = [
      {
        id: 1,
        title: "iPhone 15 Pro Max 256GB",
        price: 1199,
        originalPrice: 1299,
        location: "New York, NY",
        condition: "new",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
        rating: 4.8,
        seller: "Apple Store",
        postedTime: "2 hours ago",
        description: "Latest iPhone with advanced camera system and A17 Pro chip.",
        availability: "in-stock"
      },
      {
        id: 2,
        title: "Samsung Galaxy S24 Ultra",
        price: 1099,
        originalPrice: 1199,
        location: "Los Angeles, CA",
        condition: "new",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
        rating: 4.7,
        seller: "TechWorld",
        postedTime: "5 hours ago",
        description: "Premium Android phone with S Pen and 200MP camera.",
        availability: "in-stock"
      },
      {
        id: 3,
        title: "MacBook Pro 14-inch M3",
        price: 1999,
        originalPrice: 2199,
        location: "Chicago, IL",
        condition: "like-new",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
        rating: 4.9,
        seller: "John Doe",
        postedTime: "1 day ago",
        description: "Powerful laptop for professionals with M3 chip.",
        availability: "in-stock"
      },
      {
        id: 4,
        title: "iPad Air 11-inch",
        price: 599,
        originalPrice: 699,
        location: "Miami, FL",
        condition: "good",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
        rating: 4.6,
        seller: "Electronics Plus",
        postedTime: "2 days ago",
        description: "Versatile tablet perfect for work and entertainment.",
        availability: "low-stock"
      },
      {
        id: 5,
        title: "Sony WH-1000XM5 Headphones",
        price: 349,
        originalPrice: 399,
        location: "Seattle, WA",
        condition: "new",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        rating: 4.8,
        seller: "Audio World",
        postedTime: "3 days ago",
        description: "Premium noise-canceling headphones with 30-hour battery.",
        availability: "in-stock"
      },
      {
        id: 6,
        title: "Nintendo Switch OLED",
        price: 299,
        originalPrice: 349,
        location: "Boston, MA",
        condition: "like-new",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
        rating: 4.5,
        seller: "Gaming Store",
        postedTime: "4 days ago",
        description: "Enhanced gaming console with vibrant OLED screen.",
        availability: "in-stock"
      }
    ];
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, [categoryId]);

  // Apply filters
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesLocation = !filters.location || product.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCondition = !filters.condition || product.condition === filters.condition;
      const matchesSeller = !filters.seller || product.seller.toLowerCase().includes(filters.seller.toLowerCase());
      const matchesAvailability = !filters.availability || product.availability === filters.availability;
      
      return matchesPrice && matchesLocation && matchesCondition && matchesSeller && matchesAvailability;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Keep original order for newest
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      location: '',
      condition: '',
      datePosted: '',
      seller: '',
      availability: ''
    });
  };

  const categoryName = categoryId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Products';

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-800">{categoryName}</h1>
              <p className="text-secondary-600 mt-1">{filteredProducts.length} products found</p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-secondary-600">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm py-1"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-1 border border-secondary-300 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-secondary-600'} rounded-l-lg`}
                >
                  <Grid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-secondary-600'} rounded-r-lg`}
                >
                  <List size={16} />
                </button>
              </div>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn-secondary lg:hidden"
              >
                <SlidersHorizontal size={16} className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'} w-full lg:w-80 flex-shrink-0`}>
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-800">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                    className="input-field text-sm"
                  />
                  <span className="text-secondary-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 10000])}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or state"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Condition */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Conditions</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              {/* Seller Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Seller
                </label>
                <input
                  type="text"
                  placeholder="Search by seller name"
                  value={filters.seller}
                  onChange={(e) => handleFilterChange('seller', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Items</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* Close button for mobile */}
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="lg:hidden w-full btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="card overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          product.condition === 'new' ? 'bg-green-500 text-white' :
                          product.condition === 'like-new' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {product.condition.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          product.availability === 'in-stock' ? 'bg-green-100 text-green-800' :
                          product.availability === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.availability.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-secondary-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-secondary-600 mb-3">{product.description}</p>
                      
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
                      
                      <div className="space-y-2 text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{product.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{product.postedTime}</span>
                          </div>
                          <span className="font-medium">by {product.seller}</span>
                        </div>
                      </div>
                      
                      <button className="w-full mt-4 btn-primary">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex gap-6">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-secondary-800 hover:text-primary-600 transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-lg text-secondary-400 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-secondary-600 mb-3">{product.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-secondary-500">
                            <div className="flex items-center space-x-1">
                              <MapPin size={14} />
                              <span>{product.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{product.postedTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star size={14} className="text-yellow-400 fill-current" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                          <button className="btn-primary">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">No products found</h3>
                <p className="text-secondary-600 mb-4">Try adjusting your filters or search criteria</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 