import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  X
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { formatINR, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';
import { useNotification } from '../../context/NotificationContext';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('BlueDart Express');
  const { showToast } = useNotification();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, {
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
      });
      showToast(`Order status updated to ${newStatus}`, 'success');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (o.orderNumber && o.orderNumber.toLowerCase().includes(term)) ||
      (o.customerName && o.customerName.toLowerCase().includes(term)) ||
      (o.customerPhone && o.customerPhone.includes(term));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Customer Shoe Orders</h1>
        <p className="text-xs text-slate-400">Process fulfillment, update tracking information, and manage deliveries</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {ORDER_STATUSES.map(s => {
            const count = orders.filter(o => o.orderStatus === s.id).length;
            return (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === s.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search order ID, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Shoes Ordered</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {order.orderNumber || order.id}
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.shippingAddress?.phone}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-white">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'pair' : 'pairs'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-amber-400">
                      {formatINR(order.total)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 uppercase">
                        {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 font-semibold"
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <p className="text-xs font-mono text-amber-400 font-bold">{selectedOrder.orderNumber || selectedOrder.id}</p>
                <h3 className="font-black text-lg text-white">Customer Order Details</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Information</span>
                <p className="font-bold text-white text-sm">{selectedOrder.customerName}</p>
                <p className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> {selectedOrder.customerPhone}</p>
                <p className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> {selectedOrder.customerEmail}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shipping Address</span>
                <p className="text-white font-semibold">{selectedOrder.shippingAddress?.addressLine1}</p>
                {selectedOrder.shippingAddress?.landmark && <p className="text-slate-400">Near: {selectedOrder.shippingAddress.landmark}</p>}
                <p className="text-slate-300">{selectedOrder.shippingAddress?.city}, PIN - {selectedOrder.shippingAddress?.pincode}</p>
              </div>
            </div>

            {/* Footwear items */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Shoes in Order</h4>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-3 text-xs">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-amber-400 uppercase">{item.brandName}</span>
                      <p className="font-bold text-white truncate">{item.name}</p>
                      <p className="text-slate-400 text-[11px]">Size: <strong>UK {item.size}</strong> • Colour: {item.colour} • Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-amber-400">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order status & Courier tracking inputs */}
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Courier Tracking & Fulfillment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. BlueDart / Delhivery / DTDC"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">AWB / Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. BD94839201"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="text-xs">
                <span className="text-slate-400">Total: </span>
                <span className="font-black text-base text-amber-400">{formatINR(selectedOrder.total)}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
