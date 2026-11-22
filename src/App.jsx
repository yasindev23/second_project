import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { AppRoutes } from './routes/AppRoutes';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Storefront Navigation (hidden on /admin) */}
      {!isAdminPath && <Navbar />}
      
      {/* Cart Drawer */}
      {!isAdminPath && <CartDrawer />}

      {/* Main Pages */}
      <main className="flex-1">
        <AppRoutes />
      </main>

      {/* Storefront Footer (hidden on /admin) */}
      {!isAdminPath && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
