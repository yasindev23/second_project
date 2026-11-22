import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';

export const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shippingCharge, 
    discount, 
    total, 
    appliedCoupon, 
    couponError, 
    applyCoupon, 
    removeCoupon,
    clearCart 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-2 mb-8">
          Explore our handcrafted leather shoes and branded collection to find your perfect pair.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  const freeShippingNeeded = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your chosen shoes, sizes, and quantities before checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
        >
          Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Free Shipping Progress bar */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900">
            {freeShippingNeeded > 0 ? (
              <p>
                Add shoes worth <strong className="font-extrabold text-slate-900">{formatINR(freeShippingNeeded)}</strong> more to get <strong className="text-emerald-700">FREE delivery</strong>!
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> You've qualified for FREE Delivery!
              </p>
            )}
            <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-amber-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {cartItems.map(item => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                
                {/* Image */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                    {item.brandName}
                  </span>
                  <Link
                    to={`/product/${item.slug}`}
                    className="font-bold text-slate-900 text-sm sm:text-base hover:text-amber-600 block truncate"
                  >
                    {item.name}
                  </Link>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>Size: <strong className="text-slate-800 font-bold">UK {item.size}</strong></span>
                    {item.colour && <span>Colour: <strong className="text-slate-800">{item.colour}</strong></span>}
                    <span className="text-slate-400 font-mono text-[11px]">SKU: {item.sku}</span>
                  </div>

                  <div className="text-sm font-extrabold text-slate-900 sm:hidden pt-1">
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-amber-600 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-amber-600 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total Item Price */}
                <div className="hidden sm:block text-right min-w-[90px]">
                  <span className="font-extrabold text-slate-900 text-base">
                    {formatINR(item.price * item.quantity)}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {formatINR(item.price)} each
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <Link to="/shop" className="text-amber-600 hover:underline font-bold">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-600" />
              Have a Promo Code?
            </h3>
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <div>
                  <span className="font-extrabold">{appliedCoupon.code}</span>
                  <p className="text-[11px] text-emerald-600">{appliedCoupon.desc}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-rose-600 font-semibold">{couponError}</p>}
                <p className="text-[11px] text-slate-400">
                  Try codes: <strong className="text-slate-700">WELCOME10</strong> (10% off) or <strong className="text-slate-700">IQRA100</strong> (₹100 off)
                </p>
              </form>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 text-base">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Charge</span>
                <span className="font-bold text-slate-900">
                  {shippingCharge === 0 ? <span className="text-emerald-600">FREE</span> : formatINR(shippingCharge)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-black text-slate-950">
                <span>Total Amount</span>
                <span className="text-amber-600">{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 flex flex-col gap-2 text-[11px] text-slate-400 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Secure Checkout & Order Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>7-Day Hassle-Free Size Exchange</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
