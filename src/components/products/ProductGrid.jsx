import React from 'react';
import { ProductCard } from './ProductCard';
import { ShoppingBag, ArrowUpDown } from 'lucide-react';

export const ProductGrid = ({ 
  products = [], 
  loading = false, 
  sort = 'featured', 
  onSortChange,
  totalCount,
  onResetFilters 
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Bar with Count & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="text-xs text-slate-500 font-medium text-left">
          Showing <span className="font-extrabold text-slate-900">{products.length}</span> {products.length === 1 ? 'shoe' : 'shoes'}
          {totalCount !== undefined && totalCount !== products.length && ` (filtered from ${totalCount})`}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            Sort by:
          </label>
          <select
            value={sort}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="featured">Featured Collection</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 h-80 animate-pulse flex flex-col justify-between">
              <div className="bg-slate-200 aspect-4/3 rounded-2xl w-full"></div>
              <div className="space-y-2 mt-4">
                <div className="bg-slate-200 h-3 w-1/3 rounded"></div>
                <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
                <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">No Shoes Match Your Filter</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            We couldn't find any shoes matching your current filter criteria. Try clearing some filters or searching with a different term.
          </p>
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
