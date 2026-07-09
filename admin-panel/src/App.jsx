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

// Placeholder for other pages until implemented
const PlaceholderPage = ({ title }) => (
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-6">{title}</h1>
    <div className="border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-500">
      {title} Module Under Construction
    </div>
  </div>
);

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
            <Route path="catalog/variants" element={<PlaceholderPage title="Variants" />} />
            <Route path="catalog/images" element={<PlaceholderPage title="Product Images" />} />
            
            <Route path="orders" element={<PlaceholderPage title="Orders" />} />
            <Route path="customers" element={<PlaceholderPage title="Customers" />} />
            <Route path="promotions/coupons" element={<PlaceholderPage title="Coupons" />} />
            
            <Route path="reviews/pending" element={<PlaceholderPage title="Pending Reviews" />} />
            <Route path="reviews/approved" element={<PlaceholderPage title="Approved Reviews" />} />
            
            <Route path="newsletter/subscribers" element={<PlaceholderPage title="Subscribers" />} />
            <Route path="settings/store" element={<PlaceholderPage title="Store Settings" />} />
          </Route>

          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<div className="p-8 text-center">404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
