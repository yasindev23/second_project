import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight,
  User,
  Phone,
  Building
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { createOrder } from '../../services/orderService';
import { getUserAddresses, saveUserAddress } from '../../services/authService';
import { formatINR, getEstimatedDelivery } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';

export const CheckoutPage = () => {
  const { cartItems, subtotal, shippingCharge, discount, total, appliedCoupon, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address form fields
  const [address, setAddress] = useState({
    fullName: user?.displayName || userProfile?.displayName || '',
    phone: userProfile?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Load saved addresses if user is logged in
  useEffect(() => {
    if (user?.uid) {
      getUserAddresses(user.uid).then(list => {
        if (list && list.length > 0) {
          setSavedAddresses(list);
          const def = list.find(a => a.isDefault) || list[0];
          setSelectedAddressId(def.id);
          setAddress(def);
        }
      });
    }
  }, [user]);

  const handleSavedAddressChange = (id) => {
    setSelectedAddressId(id);
    if (id === 'new') {
      setAddress({
        fullName: user?.displayName || '',
        phone: userProfile?.phone || '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: 'Maharashtra',
        pincode: '',
      });
    } else {
      const chosen = savedAddresses.find(a => a.id === id);
      if (chosen) setAddress(chosen);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.pincode) {
      showToast('Please complete all required shipping address fields', 'error');
      return;
    }

    if (address.phone.length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    if (address.pincode.length !== 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save address for logged-in user if new
      if (user?.uid && selectedAddressId === 'new') {
        try {
          await saveUserAddress(user.uid, address);
        } catch (e) {
          console.warn('Address saving notice', e);
        }
      }

      // Prepare order payload
      const orderPayload = {
        userId: user?.uid || 'guest',
        customerName: address.fullName,
        customerEmail: user?.email || `${address.phone}@guest.iqrashoes.com`,
        customerPhone: address.phone,
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          brandName: item.brandName,
          size: item.size,
          colour: item.colour || 'Standard',
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          sku: item.sku,
        })),
        shippingAddress: address,
        subtotal,
        shippingCharge,
        discount,
        discountCode: appliedCoupon?.code || null,
        total,
        paymentMethod,
        orderStatus: 'placed',
      };

      const createdOrder = await createOrder(orderPayload);
      clearCart();
      showToast('🎉 Shoe order placed successfully!', 'success');
      navigate(`/order-confirmation/${createdOrder.id || createdOrder.orderNumber}`, {
        state: { order: createdOrder },
      });
    } catch (error) {
      console.error('Order creation error:', error);
      showToast('Error placing order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/cart" className="hover:text-amber-600 flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 font-bold">Secure Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Address & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Customer & Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  1
                </div>
                <h2 className="font-black text-slate-900 text-lg">Delivery Address</h2>
              </div>
              {!user && (
                <Link to="/login?redirect=checkout" className="text-xs font-bold text-amber-600 hover:underline">
                  Already have an account? Sign In
                </Link>
              )}
            </div>

            {/* Saved Addresses Selector (for logged-in users) */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Saved Address:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map(addr => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSavedAddressChange(addr.id)}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{addr.fullName}</p>
                      <p className="text-slate-600 truncate">{addr.addressLine1}, {addr.city}</p>
                      <p className="text-slate-400 mt-1">Phone: {addr.phone}</p>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleSavedAddressChange('new')}
                    className={`p-3.5 rounded-2xl border text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedAddressId === 'new'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-dashed border-slate-300 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    + Enter New Address
                  </button>
                </div>
              </div>
            )}

            {/* Address Form Inputs */}
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Recipient's Name"
                    value={address.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (for Courier updates) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    placeholder="10-digit Mobile Number"
                    value={address.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address / House No. / Building *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  placeholder="Flat/House No., Street Name, Area"
                  value={address.addressLine1}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Near Metro/Temple/Park"
                    value={address.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City / Town"
                    value={address.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="6-digit PIN"
                    value={address.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                2
              </div>
              <h2 className="font-black text-slate-900 text-lg">Payment Choice</h2>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      {method.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {method.desc}
                    </span>
                    {method.id === 'cod' && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        Recommended • Zero Advance Risk
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Order Snapshot & Confirmation Button */}
        <div className="space-y-4 sticky top-28">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 text-base">Your Shoe Package</h3>

            {/* Selected Shoe Items List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
              {cartItems.map(item => (
                <div key={item.id} className="pt-2 flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-slate-500 text-[11px]">Size: <strong>UK {item.size}</strong> • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-slate-900">
                  {shippingCharge === 0 ? <span className="text-emerald-600">FREE</span> : formatINR(shippingCharge)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-950">
                <span>Total Payable</span>
                <span className="text-amber-600">{formatINR(total)}</span>
              </div>
            </div>

            {/* Estimated Delivery Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Estimated Delivery: <strong className="text-slate-900">{getEstimatedDelivery(4)}</strong></span>
            </div>

            {/* Place Order CTA Button */}
            <button
              form="checkout-form"
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-300 text-slate-500 cursor-wait'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Placing Shoe Order...' : `Place Order (${formatINR(total)})`}</span>
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected by 100% Genuine Shoe Guarantee</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
