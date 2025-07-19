import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StoreManagement from './pages/StoreManagement';
import UserProfile from './pages/UserProfile';
import StorePage from './pages/StorePage';
import StoresPage from './pages/StoresPage';

import { useOnlineStatus } from './hooks/useApi';

function App() {
  const isOnline = useOnlineStatus();

  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-secondary-50 flex flex-col">
          {/* Offline indicator */}
          {!isOnline && (
            <div className="bg-red-600 text-white text-center py-2 text-sm">
              <span>⚠️ You're currently offline. Some features may not work properly.</span>
            </div>
          )}
          
          <Header />
          <main className="flex-grow">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/product/:productId" element={<ProductDetailPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/store/dashboard" element={<StoreManagement />} />
                <Route path="/store/:storeId/dashboard" element={<StoreManagement />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/dashboard" element={<UserProfile />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/store/:storeSlug" element={<StorePage />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 