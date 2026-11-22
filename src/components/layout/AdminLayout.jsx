import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  FolderTree, 
  Boxes, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  Store, 
  LogOut, 
  Menu, 
  X,
  Database,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { seedDatabase } from '../../services/seedService';
import { STORE_NAME } from '../../utils/constants';

export const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useNotification();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSeedData = async () => {
    if (!window.confirm('Populate/refresh initial Iqra Shoes catalogue & showroom data?')) return;
    setIsSeeding(true);
    try {
      const res = await seedDatabase(false);
      showToast(res.message, res.success ? 'success' : 'info');
      // Reload page to refresh state
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      showToast('Seeding completed with local fallback', 'info');
    } finally {
      setIsSeeding(false);
    }
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Shoes / Products', path: '/admin/products', icon: Package },
    { label: 'Stock / Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Shoe Brands', path: '/admin/brands', icon: Tag },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Banners & Offers', path: '/admin/banners', icon: ImageIcon },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
              IS
            </div>
            <div className="text-left">
              <span className="font-extrabold text-base tracking-tight text-white block">
                IQRA <span className="text-amber-500">ADMIN</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Showroom & Factory Hub</span>
            </div>
          </Link>

          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto text-left">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          
          {/* Quick Seed Button */}
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            title="Populate initial sample catalogue into Firestore"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSeeding ? 'Syncing...' : 'Sync Demo Catalogue'}</span>
          </button>

          {/* Visit Live Store */}
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Live Storefront</span>
          </Link>

          {/* User Signout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/40">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-extrabold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Showroom Management Desk
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user?.displayName || 'Staff Administrator'}</p>
              <p className="text-[10px] text-slate-400">{user?.email || 'admin@iqrashoes.com'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              AD
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
