import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  Boxes, 
  AlertTriangle, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { formatINR, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';
import { useNotification } from '../../context/NotificationContext';

export const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, o] = await Promise.all([getProducts(), getAllOrders()]);
        setProducts(p);
        setOrders(o);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalSales = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'confirmed');

  // Compute low stock items (variants with stock <= 5)
  const lowStockVariants = [];
  products.forEach(p => {
    p.variants?.forEach(v => {
      if (v.stock <= 5) {
        lowStockVariants.push({
          productId: p.id,
          productName: p.name,
          brandName: p.brandName,
          size: v.size,
          colour: v.colour,
          stock: v.stock,
          sku: v.sku,
        });
      }
    });
  });

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (e) {
      showToast('Error updating order', 'error');
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Showroom & Operations Overview
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics on customer shoe sales, incoming orders, and inventory health
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Shoe Sales</p>
            <h3 className="text-2xl font-black text-white mt-1">{formatINR(totalSales)}</h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">From {orders.length} orders</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{pendingOrders.length}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting dispatch</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalogue Models</p>
            <h3 className="text-2xl font-black text-white mt-1">{products.length}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Published shoe styles</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{lowStockVariants.length}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Sizes with &le; 5 units</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Recent Customer Orders */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black text-white">Recent Customer Orders</h2>
              <p className="text-xs text-slate-400">Incoming online & showroom customer requests</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-amber-400 hover:underline">
              View All Orders &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No orders received yet. Test by placing an order from the storefront!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Order</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {order.orderNumber || order.id}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-white">{order.customerName}</p>
                        <p className="text-[11px] text-slate-400">{order.shippingAddress?.city}</p>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-400">
                        {formatINR(order.total)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500"
                        >
                          {ORDER_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Col: Low Stock Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Low Stock Variants
            </h2>
            <Link to="/admin/inventory" className="text-xs font-bold text-amber-400 hover:underline">
              Inventory &rarr;
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              All shoe sizes and colours have sufficient stock levels.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {lowStockVariants.slice(0, 6).map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">{item.brandName}</span>
                    <p className="font-bold text-white truncate max-w-[160px]">{item.productName}</p>
                    <p className="text-[11px] text-slate-400">Size: <strong>UK {item.size}</strong> {item.colour && `• ${item.colour}`}</p>
                  </div>
                  <span className="px-2 py-1 rounded-xl bg-rose-500/20 text-rose-400 font-extrabold text-xs">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
