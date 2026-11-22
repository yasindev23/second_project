import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  Printer, 
  Phone, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { getOrderById } from '../../services/orderService';
import { formatINR, formatDate, getEstimatedDelivery } from '../../utils/formatters';
import { STORE_NAME, STORE_PHONE, STORE_ADDRESS } from '../../utils/constants';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      getOrderById(orderId).then(data => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [orderId, order]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-slate-900">Order Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          Could not locate the requested order ID.
        </p>
        <Link to="/" className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Success Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed & Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your footwear order has been registered at our workshop and is being prepared for packing and dispatch.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800">
          <span className="text-slate-400">Order Reference:</span>
          <strong className="text-amber-700 font-extrabold text-sm">{order.orderNumber || order.id}</strong>
        </div>
      </div>

      {/* Order Summary & Dispatch Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Estimated Delivery Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">Estimated Delivery Date</p>
              <p className="text-sm font-black text-slate-900">{getEstimatedDelivery(4)}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </span>
        </div>

        {/* Ordered Footwear Items */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm mb-3">Purchased Footwear</h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center gap-4 bg-white">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">{item.brandName}</span>
                  <p className="font-bold text-slate-900 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Size: <strong className="text-slate-800">UK {item.size}</strong> • Qty: {item.quantity}</p>
                </div>
                <span className="font-black text-slate-900 text-sm">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Pricing Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> Shipping Address
            </h4>
            <p className="font-bold text-slate-900 text-sm">{order.shippingAddress?.fullName}</p>
            <p className="text-slate-600">{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.landmark && <p className="text-slate-500">Near: {order.shippingAddress.landmark}</p>}
            <p className="text-slate-600">{order.shippingAddress?.city}, PIN - {order.shippingAddress?.pincode}</p>
            <p className="text-slate-700 font-semibold pt-1">Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Payment Summary
            </h4>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>- {formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-slate-900">{order.shippingCharge === 0 ? 'FREE' : formatINR(order.shippingCharge)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-950">
              <span>Total Amount</span>
              <span className="text-amber-600">{formatINR(order.total)}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice Receipt</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/account/orders"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>

      {/* Showroom Contact Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left space-y-1">
          <h4 className="font-extrabold text-sm">Need help with your order?</h4>
          <p className="text-xs text-slate-300">
            Contact Iqra Shoes showroom support on WhatsApp or call our helpline.
          </p>
        </div>
        <a
          href={`https://wa.me/919876543210?text=Hi%20Iqra%20Shoes,%20I%20have%20a%20question%20about%20order%20${order.orderNumber || order.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-2"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

    </div>
  );
};
