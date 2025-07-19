import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Heart, Share, MapPin, Clock, User, 
  MessageCircle, ChevronLeft, ChevronRight,
  Truck, RotateCcw, CreditCard, CheckCircle
} from 'lucide-react';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Sample product data - would normally come from API
    const sampleProduct = {
      id: productId,
      title: "iPhone 15 Pro Max 256GB - Titanium Blue",
      price: 1199,
      originalPrice: 1299,
      discount: 8,
      condition: "new",
      location: "New York, NY",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop"
      ],
      description: "Brand new iPhone 15 Pro Max with 256GB storage in stunning Titanium Blue. Features the latest A17 Pro chip, advanced camera system with 5x telephoto zoom, and titanium design. Still under Apple warranty with all original accessories included.",
      features: [
        "A17 Pro chip with 6-core GPU",
        "6.7-inch Super Retina XDR display",
        "Pro camera system (48MP Main, 12MP Ultra Wide, 12MP Telephoto)",
        "5x optical zoom and 2x telephoto",
        "Up to 29 hours video playback",
        "Face ID for secure authentication",
        "iOS 17 with latest features"
      ],
      specifications: {
        brand: "Apple",
        model: "iPhone 15 Pro Max",
        storage: "256GB",
        color: "Titanium Blue",
        connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3",
        weight: "221 grams",
        dimensions: "6.29 × 3.02 × 0.32 inches"
      },
      seller: {
        name: "Apple Store Manhattan",
        type: "business",
        rating: 4.9,
        totalReviews: 2847,
        verified: true,
        memberSince: "2020",
        responseRate: "100%",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      shipping: {
        free: true,
        estimatedDays: "2-3",
        returnPolicy: "30 days"
      },
      rating: 4.8,
      totalReviews: 156,
      postedTime: "2 hours ago",
      views: 1247,
      availability: "in-stock",
      quantity: 5
    };

    setProduct(sampleProduct);

    // Sample related products
    const sampleRelated = [
      {
        id: 2,
        title: "iPhone 15 Pro 128GB",
        price: 999,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
        rating: 4.7
      },
      {
        id: 3,
        title: "iPhone 15 256GB",
        price: 829,
        image: "https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=300&h=300&fit=crop",
        rating: 4.6
      },
      {
        id: 4,
        title: "iPhone 14 Pro Max",
        price: 1099,
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&h=300&fit=crop",
        rating: 4.5
      }
    ];

    setRelatedProducts(sampleRelated);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-secondary-600">
            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
            <li className="before:content-['/'] before:mx-2">Electronics</li>
            <li className="before:content-['/'] before:mx-2">Smartphones</li>
            <li className="before:content-['/'] before:mx-2 text-secondary-800 font-medium">iPhone 15 Pro Max</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${index === selectedImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border-2 rounded-lg overflow-hidden ${index === selectedImageIndex ? 'border-primary-600' : 'border-secondary-200'}`}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-800 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-secondary-600">({product.totalReviews} reviews)</span>
                </div>
                <span className="text-secondary-500">•</span>
                <span className="text-secondary-600">{product.views} views</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white p-6 rounded-lg border border-secondary-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold text-primary-600">${product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-secondary-400 line-through">${product.originalPrice}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{product.postedTime}</span>
                </div>
              </div>

              <div className="flex space-x-3 mb-4">
                <button className="flex-1 btn-primary">
                  <MessageCircle size={16} className="mr-2" />
                  Contact Seller
                </button>
                <button className="p-3 border border-secondary-300 rounded-lg hover:bg-secondary-50">
                  <Heart size={16} />
                </button>
                <button className="p-3 border border-secondary-300 rounded-lg hover:bg-secondary-50">
                  <Share size={16} />
                </button>
              </div>

              {/* Shipping Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Truck size={14} className="text-green-600" />
                  <span>{product.shipping.free ? 'Free shipping' : 'Shipping available'}</span>
                  <span className="text-secondary-500">• {product.shipping.estimatedDays} business days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw size={14} className="text-blue-600" />
                  <span>{product.shipping.returnPolicy} return policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard size={14} className="text-purple-600" />
                  <span>Secure payment options available</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white p-6 rounded-lg border border-secondary-200">
              <h3 className="font-semibold text-secondary-800 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={product.seller.avatar} 
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-secondary-800">{product.seller.name}</h4>
                    {product.seller.verified && (
                      <CheckCircle size={16} className="text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-secondary-600">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span>{product.seller.rating}</span>
                    <span>({product.seller.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary-600">Member since:</span>
                  <span className="font-medium ml-2">{product.seller.memberSince}</span>
                </div>
                <div>
                  <span className="text-secondary-600">Response rate:</span>
                  <span className="font-medium ml-2">{product.seller.responseRate}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 btn-secondary text-sm">
                  <User size={14} className="mr-2" />
                  View Profile
                </button>
                <button className="flex-1 btn-secondary text-sm">
                  <MessageCircle size={14} className="mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg border border-secondary-200 mb-12">
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 border-b-2 border-primary-600 text-primary-600 font-medium">
                Description
              </button>
              <button className="py-4 text-secondary-600 hover:text-secondary-800">
                Specifications
              </button>
              <button className="py-4 text-secondary-600 hover:text-secondary-800">
                Reviews ({product.totalReviews})
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <p className="text-secondary-700 leading-relaxed mb-6">{product.description}</p>
              
              <h4 className="font-semibold text-secondary-800 mb-4">Key Features:</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-secondary-800 mb-8">Related Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="group">
                <div className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-secondary-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {relatedProduct.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">${relatedProduct.price}</span>
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-secondary-600">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 