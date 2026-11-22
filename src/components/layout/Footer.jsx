import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award,
  Heart
} from 'lucide-react';
import { 
  STORE_NAME, 
  STORE_PHONE, 
  STORE_EMAIL, 
  STORE_ADDRESS 
} from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-auto border-t border-slate-800">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-900 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Direct From Factory</h4>
              <p className="text-xs text-slate-400">Master craftsman quality at wholesale rates</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Free Delivery</h4>
              <p className="text-xs text-slate-400">On all shoe orders above ₹999 across India</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Easy Size Exchange</h4>
              <p className="text-xs text-slate-400">Hassle-free 7-day fitting replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Cash on Delivery</h4>
              <p className="text-xs text-slate-400">Pay safely when you receive your package</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Factory Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-extrabold text-lg">
                IS
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                IQRA <span className="text-amber-500">SHOES</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Established footwear manufacturer, workshop, and retail showroom. Dedicated to handcrafted pure leather formal shoes, high-cushion sports trainers, and durable daily wear for the entire family.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{STORE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{STORE_PHONE}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{STORE_EMAIL}</span>
              </div>
            </div>
          </div>

          {/* Quick Shop */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Shop</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?category=cat-formal" className="hover:text-amber-400 transition-colors">Formal Leather Shoes</Link></li>
              <li><Link to="/shop?category=cat-sports" className="hover:text-amber-400 transition-colors">Sports & Running Trainers</Link></li>
              <li><Link to="/shop?category=cat-sneakers" className="hover:text-amber-400 transition-colors">Casual Sneakers</Link></li>
              <li><Link to="/shop?category=cat-casual" className="hover:text-amber-400 transition-colors">Handcrafted Loafers</Link></li>
              <li><Link to="/shop?category=cat-sandals" className="hover:text-amber-400 transition-colors">Sandals & Floaters</Link></li>
              <li><Link to="/shop?category=cat-school" className="hover:text-amber-400 transition-colors">School & Uniform Shoes</Link></li>
              <li><Link to="/shop?category=cat-kids" className="hover:text-amber-400 transition-colors">Kids' Light & Play Shoes</Link></li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Popular Brands</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?brand=brand-iqra" className="text-amber-400 font-semibold hover:underline">Iqra Shoes (Own Factory)</Link></li>
              <li><Link to="/shop?brand=brand-nike" className="hover:text-amber-400 transition-colors">Nike</Link></li>
              <li><Link to="/shop?brand=brand-adidas" className="hover:text-amber-400 transition-colors">Adidas</Link></li>
              <li><Link to="/shop?brand=brand-puma" className="hover:text-amber-400 transition-colors">Puma</Link></li>
              <li><Link to="/shop?brand=brand-sparx" className="hover:text-amber-400 transition-colors">Sparx</Link></li>
              <li><Link to="/shop?brand=brand-bata" className="hover:text-amber-400 transition-colors">Bata</Link></li>
              <li><Link to="/shop?brand=brand-campus" className="hover:text-amber-400 transition-colors">Campus</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Customer Care</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/account/orders" className="hover:text-amber-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/account" className="hover:text-amber-400 transition-colors">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-amber-400 transition-colors">View Cart</Link></li>
              <li><Link to="/shop?priceMax=999" className="hover:text-amber-400 transition-colors">Budget Shoes Under ₹999</Link></li>
              <li><Link to="/admin" className="text-slate-500 hover:text-amber-400 transition-colors">Showroom Staff Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {STORE_NAME}. All rights reserved. Handcrafted Footwear Workshop & Retail Showroom.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for foot comfort</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
