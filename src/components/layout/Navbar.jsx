import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Package, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Phone,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { STORE_NAME, STORE_PHONE } from '../../utils/constants';

export const Navbar = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar Announcement */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct from Iqra Footwear Factory & Showroom • Free Shipping on orders ₹999+</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Helpline: {STORE_PHONE}</span>
            </span>
            <Link to="/shop?offer=true" className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium">
              <Tag className="w-3 h-3" /> Special Factory Offers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-extrabold text-2xl tracking-tighter">
              IS
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                IQRA <span className="text-amber-600">SHOES</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 mt-1">
                Manufacturer & Showroom
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              placeholder="Search shoes by brand, type, or occasion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-amber-600 transition-colors">
              Shop All
            </Link>
            <Link to="/brands" className="hover:text-amber-600 transition-colors">
              Brands
            </Link>
            <Link to="/shop?category=cat-formal" className="hover:text-amber-600 transition-colors">
              Formal Leather
            </Link>
            <Link to="/shop?category=cat-sports" className="hover:text-amber-600 transition-colors">
              Sports & Running
            </Link>
            <Link to="/shop?brand=brand-iqra" className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors text-xs font-bold tracking-wide">
              Iqra Exclusives
            </Link>
          </nav>

          {/* Actions: Account, Cart, Menu */}
          <div className="flex items-center gap-3">
            
            {/* Account Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                title="Account"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-left">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.displayName || user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Showroom Staff / Admin
                          </span>
                        )}
                      </div>
                      <Link
                        to="/account"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile & Addresses
                      </Link>
                      <Link
                        to="/account/orders"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-amber-700 bg-amber-50/70 hover:bg-amber-100/70 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-600">Welcome to Iqra Shoes</p>
                        <p className="text-xs text-slate-400">Sign in for fast checkout & orders</p>
                      </div>
                      <Link
                        to="/login"
                        className="block px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-amber-600 font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Create New Account
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-500 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Staff Login
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-transform active:scale-95 shadow-sm"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search shoes by brand, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <Link to="/" className="py-2 px-3 rounded-lg hover:bg-slate-50">
              Home
            </Link>
            <Link to="/shop" className="py-2 px-3 rounded-lg hover:bg-slate-50">
              Shop All Shoes
            </Link>
            <Link to="/brands" className="py-2 px-3 rounded-lg hover:bg-slate-50">
              Shoe Brands
            </Link>
            <Link to="/shop?category=cat-formal" className="py-2 px-3 rounded-lg hover:bg-slate-50">
              Formal Leather Shoes
            </Link>
            <Link to="/shop?category=cat-sports" className="py-2 px-3 rounded-lg hover:bg-slate-50">
              Sports & Running
            </Link>
            <Link to="/shop?category=cat-sneakers" className="py-2 px-3 rounded-lg hover:bg-slate-50">
              Sneakers & Streetwear
            </Link>
            <Link to="/shop?brand=brand-iqra" className="py-2 px-3 rounded-lg bg-amber-50 text-amber-800 font-bold">
              ★ Iqra Handcrafted Collection
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/account" className="flex items-center gap-2 py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <Link to="/account/orders" className="flex items-center gap-2 py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2 py-2 px-3 text-sm font-bold text-amber-700 bg-amber-50 rounded-lg">
                    <ShieldCheck className="w-4 h-4" /> Staff Admin Panel
                  </Link>
                )}
                <button onClick={logout} className="flex items-center gap-2 py-2 px-3 text-sm font-medium text-rose-600 hover:bg-rose-50 text-left">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" className="text-center py-2 px-4 rounded-xl border border-slate-300 font-semibold text-sm text-slate-800 hover:bg-slate-50">
                  Sign In
                </Link>
                <Link to="/register" className="text-center py-2 px-4 rounded-xl bg-slate-900 font-semibold text-sm text-white hover:bg-slate-800">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
