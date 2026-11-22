import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Check, Zap } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(() => {
    // default to first in-stock variant if available
    return product.variants?.find(v => v.stock > 0) || product.variants?.[0] || null;
  });

  const isIqra = product.brandId === 'brand-iqra' || product.brandName?.toLowerCase().includes('iqra');
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 10;
  const isOutOfStock = totalStock <= 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      showToast('This shoe is currently out of stock', 'error');
      return;
    }

    if (!selectedVariant) {
      // Navigate to product detail page if user needs to select size
      navigate(`/product/${product.slug}`);
      return;
    }

    try {
      addToCart(product, selectedVariant, 1);
      showToast(`Added ${product.name} (UK ${selectedVariant.size}) to cart!`, 'success');
    } catch (err) {
      navigate(`/product/${product.slug}`);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {isIqra && (
          <span className="bg-amber-600 text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Zap className="w-3 h-3 fill-white" /> Iqra Original
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-slate-800 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
            Sold Out
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-4/3 overflow-hidden bg-slate-50">
        <img
          src={product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.imageUrls?.[1] && (
          <img
            src={product.imageUrls[1]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 text-left">
        
        {/* Brand & Shoe Type */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-extrabold uppercase tracking-wider text-amber-700">
            {product.brandName}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            {product.shoeType || product.categoryNames?.[0]}
          </span>
        </div>

        {/* Title */}
        <Link 
          to={`/product/${product.slug}`}
          className="font-bold text-slate-900 text-sm hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-2"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating preview */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-800">{product.rating || 4.7}</span>
          </div>
          <span className="text-slate-400">({product.reviewCount || 48})</span>
          {totalStock > 0 && totalStock <= 6 && (
            <span className="ml-auto text-[10px] font-bold text-rose-600 animate-pulse">
              Only {totalStock} left
            </span>
          )}
        </div>

        {/* Available Size Pills */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Select UK Size:</span>
              {selectedVariant && <span className="font-bold text-slate-700">UK {selectedVariant.size}</span>}
            </div>
            <div className="flex flex-wrap gap-1">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const hasStock = v.stock > 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={!hasStock}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (hasStock) setSelectedVariant(v);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${
                      !hasStock
                        ? 'border-slate-100 bg-slate-100 text-slate-300 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pricing & Add to Cart button */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              Inclusive of all taxes
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-amber-600 active:scale-95 shadow-sm'
            }`}
            title="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

      </div>
    </div>
  );
};
