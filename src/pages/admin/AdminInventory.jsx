import React, { useState, useEffect } from 'react';
import { getProducts, updateVariantStock } from '../../services/productService';
import { Boxes, Plus, Minus, Search, AlertTriangle, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useNotification();

  const loadData = async () => {
    setLoading(true);
    try {
      const prods = await getProducts();
      setProducts(prods);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockChange = async (productId, variantId, newStock) => {
    setUpdatingId(`${productId}-${variantId}`);
    try {
      await updateVariantStock(productId, variantId, newStock);
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            variants: p.variants.map(v => v.id === variantId ? { ...v, stock: newStock } : v)
          };
        }
        return p;
      }));
      showToast('Variant stock level updated', 'success', 2000);
    } catch (err) {
      showToast('Error updating stock', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Shoe Inventory Matrix</h1>
          <p className="text-xs text-slate-400">Adjust stock quantities by UK size & colour in real time</p>
        </div>

        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Filter shoe model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
        </div>
      </div>

      {/* Grid of Shoe Models with Variant Editors */}
      <div className="space-y-4">
        {filtered.map(product => {
          const totalStock = product.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0;
          return (
            <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
              
              {/* Product Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                    <img src={product.imageUrls?.[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{product.brandName}</span>
                    <h3 className="font-extrabold text-white text-sm">{product.name}</h3>
                    <p className="text-[11px] text-slate-400">SKU: {product.sku} • Price: {formatINR(product.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    totalStock <= 5 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-slate-800 text-emerald-400 border-slate-700'
                  }`}>
                    Total: {totalStock} pairs
                  </span>
                </div>
              </div>

              {/* Variants Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {product.variants?.map(v => {
                  const isUpdating = updatingId === `${product.id}-${v.id}`;
                  const isLow = v.stock <= 5;

                  return (
                    <div 
                      key={v.id} 
                      className={`p-3 rounded-2xl border text-xs space-y-2 transition-all ${
                        isLow 
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
                          : 'bg-slate-800/70 border-slate-700/80 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-amber-400 text-sm">UK {v.size}</span>
                        <span className="text-[10px] text-slate-400">{v.colour || 'Standard'}</span>
                      </div>

                      <div className="flex items-center justify-between gap-1 bg-slate-900/80 rounded-xl p-1 border border-slate-700">
                        <button
                          type="button"
                          disabled={isUpdating || v.stock <= 0}
                          onClick={() => handleStockChange(product.id, v.id, Math.max(0, v.stock - 1))}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-black text-sm text-center w-8">
                          {v.stock}
                        </span>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleStockChange(product.id, v.id, v.stock + 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {isLow && (
                        <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1 justify-center">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
