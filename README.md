# Bazzarly E-Commerce Platform

A comprehensive multi-seller e-commerce platform with dual selling systems, advanced admin dashboard, and business analytics. Built with React.js, Node.js, Express, MongoDB, and Tailwind CSS.

## 🚀 Features

### **Core E-Commerce Features**
- **Multi-Seller Marketplace**: Support for both individual sellers and business stores
- **Dual Selling System**: 
  - Direct user-to-user selling
  - Store-based selling with dedicated store pages
- **Advanced Product Management**: Categories, conditions, locations, specifications
- **Real-time Comments & Negotiations**: Price discussions and offers on products
- **Location-based Discovery**: Find products and stores nearby
- **Comprehensive Search & Filtering**: By category, price, condition, location, seller type

### **Admin Dashboard & Management**
- **Comprehensive Admin Panel**: User, store, and product management
- **Business Analytics**: Revenue tracking, growth metrics, user analytics
- **Content Moderation**: Product approval system with flagging capabilities
- **Investment Monitoring**: Track business performance and ROI
- **System Configuration**: Platform settings and feature toggles
- **Role-based Access Control**: Admin, Store Owner, User permissions

### **Store Management System**
- **Store Creation & Customization**: Custom branding, colors, logos
- **Store Analytics**: Revenue, visitors, conversion rates
- **Product Portfolio Management**: Bulk uploads, inventory tracking
- **Store Policies**: Custom terms, shipping, return policies
- **Multi-admin Support**: Assign managers and editors to stores
- **Opening Hours & Location**: Business hours and multiple addresses

### **User Authentication & Security**
- **Multi-method Registration**: Email and phone number verification
- **Secure Authentication**: JWT tokens with refresh token support
- **Account Verification**: Email and SMS verification codes
- **Password Security**: Strong password requirements, reset functionality
- **Rate Limiting**: Protection against brute force attacks
- **Role-based Permissions**: Granular access control

### **Advanced Technical Features**
- **Real-time Data**: Live updates for inventory and analytics
- **Error Handling**: Comprehensive error boundaries and logging
- **Performance Optimization**: Code splitting, lazy loading, caching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimization**: Meta tags, structured data, sitemap
- **API Documentation**: RESTful APIs with validation
- **Logging & Monitoring**: Comprehensive logging with rotation

## 🏗️ Architecture

### **Frontend (React.js)**
```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.js # Error handling
│   ├── Loading.js       # Loading states & skeletons
│   ├── Header.js        # Navigation header
│   └── Footer.js        # Site footer
├── pages/              # Main application pages
│   ├── HomePage.js     # Landing page
│   ├── Login.js        # User authentication
│   ├── Register.js     # User registration
│   ├── AdminDashboard.js # Admin management panel
│   ├── StoreManagement.js # Store owner dashboard
│   ├── CategoryPage.js # Product category listings
│   └── ProductDetailPage.js # Product details & comments
├── hooks/              # Custom React hooks
│   └── useApi.js       # Data fetching with error handling
├── services/           # API service layer
│   └── api.js          # Centralized API management
├── utils/              # Utility functions
│   └── validation.js   # Form validation & sanitization
└── config/             # Configuration management
    └── config.js       # Environment-based settings
```

### **Backend (Node.js/Express)**
```
backend/
├── models/             # MongoDB data models
│   ├── User.js         # User accounts & authentication
│   ├── Store.js        # Store management & settings
│   └── Product.js      # Products with comments system
├── routes/             # API route handlers
│   ├── auth.js         # Authentication endpoints
│   └── admin.js        # Admin management APIs
├── middleware/         # Express middleware
│   ├── validation.js   # Request validation & sanitization
│   └── logger.js       # Comprehensive logging system
└── logs/               # Application logs
    ├── app.log         # General application logs
    └── error.log       # Error-specific logs
```

## 🎯 User Roles & Permissions

### **Super Admin**
- Full platform control
- System configuration
- User role management
- Financial oversight

### **Admin**
- User management
- Store approval
- Content moderation
- Analytics access

### **Store Owner**
- Store management
- Product management
- Order processing
- Store analytics

### **Individual User**
- Product listing
- Direct selling
- Purchasing
- Account management

## 📊 Admin Dashboard Features

### **Overview Analytics**
- Total users, stores, products
- Revenue tracking and growth metrics
- Pending approvals (users, stores, products)
- Top-performing categories
- System health monitoring

### **User Management**
- User search and filtering
- Role assignment and permissions
- Account status management
- Activity monitoring
- Bulk operations

### **Store Management**
- Store approval workflow
- Verification process
- Performance monitoring
- Subscription management
- Store analytics

### **Product Moderation**
- Content approval system
- Flagged content review
- Quality control
- Bulk moderation tools
- Automated filters

### **Business Analytics**
- Revenue and profit tracking
- User acquisition metrics
- Conversion rate analysis
- Geographic distribution
- Performance trends

## 🏪 Store Management Features

### **Store Dashboard**
- Revenue and sales analytics
- Product performance metrics
- Customer insights
- Inventory management
- Order processing

### **Product Management**
- Bulk product uploads
- Inventory tracking
- Price management
- Category organization
- SEO optimization

### **Store Customization**
- Brand identity setup
- Custom color schemes
- Logo and banner uploads
- Store policies configuration
- Social media integration

### **Customer Relations**
- Customer communication
- Review management
- Support ticket system
- Marketing campaigns
- Loyalty programs

## 🛒 Product Features

### **Dual Selling System**
- **Individual Sellers**: Direct person-to-person sales
- **Store Products**: Business inventory with store branding

### **Product Information**
- Comprehensive details and specifications
- Multiple image and video support
- Condition ratings (new, like-new, good, fair, poor)
- Purchase history and warranty information
- Location and delivery options

### **Communication System**
- Public and private comments
- Price negotiation tools
- Offer management
- Question and answer system
- Seller rating and reviews

### **Discovery & Search**
- Advanced filtering options
- Location-based search
- Category browsing
- Price range selection
- Condition and seller type filters

## 🔧 Setup Instructions

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd bazzarly-ecommerce
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

3. **Environment Configuration**

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bazzarly
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS configuration
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Logging
LOG_LEVEL=INFO
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Bazzarly
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

4. **Database Setup**
```bash
# Start MongoDB service
mongod

# Create database (automatic on first connection)
```

5. **Start the application**
```bash
# Development mode (both frontend and backend)
npm run dev

# Or start separately:
npm run dev:frontend  # Frontend only (port 3000)
npm run dev:backend   # Backend only (port 5000)
```

6. **Build for production**
```bash
npm run build
```

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/verify-phone` - Phone verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### **Admin Management**
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/users` - User management
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/stores` - Store management
- `GET /api/admin/products` - Product moderation
- `PUT /api/admin/products/:id/moderate` - Approve/reject product

### **Products**
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### **Search & Discovery**
- `GET /api/search` - Search products
- `GET /api/categories` - List categories
- `GET /api/ads` - Featured advertisements
- `GET /api/stats` - Platform statistics

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue (#3b82f6) - Actions, links, primary buttons
- **Secondary**: Gray (#64748b) - Text, borders, secondary elements
- **Success**: Green (#10b981) - Success states, positive actions
- **Warning**: Yellow (#f59e0b) - Warnings, pending states
- **Error**: Red (#ef4444) - Errors, destructive actions

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, hierarchical sizing
- **Body Text**: Regular weight, optimized line height
- **UI Text**: Medium weight for buttons and labels

### **Components**
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Consistent input styling with validation states
- **Loading States**: Skeleton screens and spinners
- **Error States**: Friendly error messages with recovery options

## 🔒 Security Features

### **Authentication Security**
- Password hashing with bcrypt (salt rounds: 12).
- JWT tokens with expiration
- Refresh token rotation
- Account lockout after failed attempts
- Rate limiting on authentication endpoints

### **Input Validation**
- Server-side validation for all inputs
- XSS protection through input sanitization
- SQL injection prevention
- File upload security
- Request size limiting

### **API Security**
- CORS configuration
- Security headers (Helmet.js)
- Rate limiting per endpoint
- Request logging and monitoring
- Error handling without information leakage

## 📈 Performance Optimizations

### **Frontend Optimizations**
- Code splitting by routes
- Lazy loading of images
- Component memoization
- Virtual scrolling for large lists
- Bundle size optimization

### **Backend Optimizations**
- Database indexing strategy
- Query optimization
- Response caching
- Compression middleware
- Connection pooling

### **Monitoring**
- Performance metrics logging
- Error tracking and alerting
- API response time monitoring
- Database query performance
- User interaction analytics

## 🚀 Deployment

### **Production Build**
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### **Deployment Platforms**

**Frontend Deployment:**
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

**Backend Deployment:**
- Heroku
- AWS EC2
- DigitalOcean
- Railway

**Database Hosting:**
- MongoDB Atlas
- AWS DocumentDB
- Azure Cosmos DB

### **Environment Variables**
Ensure all environment variables are properly configured for production:
- Database connection strings
- JWT secrets (use strong, random values)
- Email and SMS service credentials
- CORS origins for frontend domain
- Logging levels and destinations

## 🔮 Future Enhancements

### **Planned Features**
- [ ] Real-time chat system between buyers and sellers
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard with charts
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Social media integration
- [ ] Advanced search with AI recommendations
- [ ] Inventory management system
- [ ] Shipping integration
- [ ] Tax calculation system
- [ ] Advanced reporting tools

### **Technical Improvements**
- [ ] GraphQL API implementation
- [ ] Microservices architecture
- [ ] Container deployment (Docker)
- [ ] Automated testing suite
- [ ] CI/CD pipeline setup
- [ ] Performance monitoring (APM)
- [ ] CDN integration
- [ ] Database optimization
- [ ] Caching layer (Redis)
- [ ] Load balancing

## 📞 Support & Documentation

### **Getting Help**
- GitHub Issues for bug reports
- Discussion forums for feature requests
- Documentation wiki
- Video tutorials
- Community Discord server

### **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### **License**
This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the modern e-commerce experience**

For more information, visit our [documentation website](https://docs.bazzarly.com) or contact our [support team](mailto:support@bazzarly.com). 