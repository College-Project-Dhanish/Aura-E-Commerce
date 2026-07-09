import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Collections from './pages/Collections';
import Products from './pages/Products';
import Colors from './pages/Colors';
import Sizes from './pages/Sizes';
import Variants from './pages/Variants';
import ProductImages from './pages/ProductImages';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Coupons from './pages/Coupons';
import Reviews from './pages/Reviews';
import Subscribers from './pages/Subscribers';
import StoreSettings from './pages/StoreSettings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="catalog/categories" element={<Categories />} />
            <Route path="catalog/collections" element={<Collections />} />
            <Route path="catalog/products" element={<Products />} />
            <Route path="catalog/colors" element={<Colors />} />
            <Route path="catalog/sizes" element={<Sizes />} />
            <Route path="catalog/variants" element={<Variants />} />
            <Route path="catalog/images" element={<ProductImages />} />
            
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="promotions/coupons" element={<Coupons />} />
            
            <Route path="reviews/pending" element={<Reviews />} />
            <Route path="reviews/approved" element={<Reviews />} />
            
            <Route path="newsletter/subscribers" element={<Subscribers />} />
            <Route path="settings/store" element={<StoreSettings />} />
          </Route>

          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<div className="p-8 text-center">404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
