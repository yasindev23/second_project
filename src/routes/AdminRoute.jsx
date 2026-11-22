import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

export const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading, toggleStaffDemoAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Staff Admin Access</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This section is restricted to authorized Iqra Shoes showroom staff and administrators.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => toggleStaffDemoAdmin(true)}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-md"
            >
              Continue as Showroom Staff (Demo Access)
            </button>

            <Link
              to="/login?redirect=/admin"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Login with Staff Account</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
