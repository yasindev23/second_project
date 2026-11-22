import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Storefront pages
import { HomePage } from '../pages/storefront/HomePage';
import { ShopPage } from '../pages/storefront/ShopPage';
import { BrandsPage } from '../pages/storefront/BrandsPage';
import { BrandDetailPage } from '../pages/storefront/BrandDetailPage';
import { CategoryDetailPage } from '../pages/storefront/CategoryDetailPage';
import { ProductDetailPage } from '../pages/storefront/ProductDetailPage';
import { SearchPage } from '../pages/storefront/SearchPage';
import { CartPage } from '../pages/storefront/CartPage';
import { CheckoutPage } from '../pages/storefront/CheckoutPage';
import { OrderConfirmationPage } from '../pages/storefront/OrderConfirmationPage';
import { LoginPage } from '../pages/storefront/LoginPage';
import { RegisterPage } from '../pages/storefront/RegisterPage';
import { ForgotPasswordPage } from '../pages/storefront/ForgotPasswordPage';
import { AccountPage } from '../pages/storefront/AccountPage';
import { OrdersPage } from '../pages/storefront/OrdersPage';

// Admin pages & layouts
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminInventory } from '../pages/admin/AdminInventory';
import { AdminOrders } from '../pages/admin/AdminOrders';
import { AdminBrands } from '../pages/admin/AdminBrands';
import { AdminCategories } from '../pages/admin/AdminCategories';
import { AdminCustomers } from '../pages/admin/AdminCustomers';
import { AdminBanners } from '../pages/admin/AdminBanners';
import { AdminSettings } from '../pages/admin/AdminSettings';

// Route guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/brands/:slug" element={<BrandDetailPage />} />
      <Route path="/categories/:slug" element={<CategoryDetailPage />} />
      <Route path="/product/:slug" element={<ProductDetailPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Customer Routes */}
      <Route path="/account" element={
        <ProtectedRoute>
          <AccountPage />
        </ProtectedRoute>
      } />
      <Route path="/account/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />

      {/* Admin Panel Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
