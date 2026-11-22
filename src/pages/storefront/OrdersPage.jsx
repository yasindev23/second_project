import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  MapPin, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getOrdersByUser, updateOrderStatus } from '../../services/orderService';
import { formatINR, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';

export const OrdersPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getOrdersByUser(user.uid).then(data => {
        setOrders(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this shoe order?')) return;
    try {
      await updateOrderStatus(orderId, 'cancelled');
      showToast('Order cancelled successfully', 'info');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: 'cancelled' } : o));
    } catch (err) {
      showToast('Error cancelling order', 'error');
    }
  };

  const getStatusBadge = (statusId) => {
    const found = ORDER_STATUSES.find(s => s.id === statusId);
    return found || { label: statusId, color: 'bg-slate-100 text-slate-800' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Footwear Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track fulfillment status, courier dispatch, and history of all shoe orders
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">No orders placed yet</h3>
          <p className="text-xs text-slate-500">
            Once you place an order for handcrafted derbies, sneakers, or sports shoes, you can track it live here.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const badge = getStatusBadge(order.orderStatus);
            const canCancel = order.orderStatus === 'placed' || order.orderStatus === 'confirmed';

            return (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                
                {/* Order Card Header */}
                <div className="p-5 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Order Reference</p>
                    <p className="font-mono font-extrabold text-slate-900 text-sm">
                      {order.orderNumber || order.id}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Placed On</p>
                    <p className="font-semibold text-slate-800">{formatDate(order.createdAt)}</p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Total Amount</p>
                    <p className="font-black text-amber-600 text-sm">{formatINR(order.total)}</p>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="p-5 sm:p-6 divide-y divide-slate-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-amber-700 uppercase">{item.brandName}</span>
                        <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-slate-500">
                          Size: <strong className="text-slate-800">UK {item.size}</strong> • Qty: {item.quantity} • {formatINR(item.price)} each
                        </p>
                      </div>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Actions */}
                <div className="p-4 sm:px-6 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="text-slate-500">
                    <span>Delivering to: </span>
                    <strong className="text-slate-800">{order.shippingAddress?.fullName}, {order.shippingAddress?.city}</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-rose-600 hover:text-rose-700 font-bold hover:underline"
                      >
                        Cancel Order
                      </button>
                    )}
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                    >
                      View Invoice Receipt
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
