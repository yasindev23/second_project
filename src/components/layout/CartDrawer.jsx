import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';

export const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shippingCharge, 
    total,
    totalItems 
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeShippingRemaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-slate-900 text-lg">Your Shoe Cart</h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'pair' : 'pairs'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-100 text-xs">
            {freeShippingRemaining > 0 ? (
              <p className="text-amber-800 font-medium">
                Add <span className="font-bold">{formatINR(freeShippingRemaining)}</span> more shoes for <span className="font-bold text-emerald-700">FREE delivery!</span>
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked FREE Delivery!
              </p>
            )}
            <div className="w-full bg-amber-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Your cart is empty</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Looks like you haven't added any pairs yet. Explore our handcrafted footwear collections!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Shoe Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Shoe Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                      {item.brandName}
                    </p>
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="font-bold text-slate-800 text-sm hover:text-amber-600 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Size: <strong className="text-slate-800 font-bold">UK {item.size}</strong></span>
                      {item.colour && <span>Colour: <strong className="text-slate-800">{item.colour}</strong></span>}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-amber-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-amber-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Subtotal & Actions */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-800">
                    {shippingCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatINR(shippingCharge)
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-slate-950">
                  <span>Total Amount</span>
                  <span className="text-amber-600">{formatINR(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-xl border border-slate-300 font-bold text-slate-700 text-center text-xs hover:bg-slate-100 transition-colors"
                >
                  View Full Cart
                </Link>
                <button
                  onClick={handleCheckoutClick}
                  className="py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-center text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
