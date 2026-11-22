import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { SIZES, PRICE_RANGES, GENDERS, SHOE_TYPES } from '../../utils/constants';

export const ProductFilters = ({
  filters,
  setFilters,
  brands = [],
  categories = [],
  resetFilters,
}) => {
  const handleBrandChange = (brandId) => {
    setFilters(prev => ({
      ...prev,
      brand: prev.brand === brandId ? '' : brandId,
    }));
  };

  const handleCategoryChange = (catId) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catId ? '' : catId,
    }));
  };

  const handlePriceRangeClick = (range) => {
    if (filters.minPrice === range.min && filters.maxPrice === range.max) {
      setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }));
    } else {
      setFilters(prev => ({ ...prev, minPrice: range.min, maxPrice: range.max }));
    }
  };

  const handleSizeClick = (size) => {
    setFilters(prev => ({
      ...prev,
      size: prev.size === size ? '' : size,
    }));
  };

  return (
    <aside className="w-full bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-6 text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Brands</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {brands.map(brand => {
            const isSelected = filters.brand === brand.id || filters.brand === brand.slug;
            return (
              <button
                key={brand.id}
                onClick={() => handleBrandChange(brand.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{brand.name}</span>
                {brand.isManufactured && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-amber-700 text-amber-100' : 'bg-amber-100 text-amber-800'}`}>
                    Factory
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Categories</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {categories.map(cat => {
            const isSelected = filters.category === cat.id || filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* UK Size Selector */}
      <div>
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
          UK / India Shoe Size
        </h4>
        <div className="grid grid-cols-5 gap-1.5">
          {SIZES.map(s => {
            const isSelected = filters.size === s;
            return (
              <button
                key={s}
                onClick={() => handleSizeClick(s)}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:border-amber-400 bg-slate-50'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Ranges */}
      <div>
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Price Range</h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range, idx) => {
            const isSelected = filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <button
                key={idx}
                onClick={() => handlePriceRangeClick(range)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{range.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>

        {/* Custom Price Inputs */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Gender / Age Group */}
      <div>
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Gender / Age</h4>
        <div className="flex flex-wrap gap-1.5">
          {['All', ...GENDERS].map(g => {
            const isSelected = (filters.gender || 'All') === g;
            return (
              <button
                key={g}
                onClick={() => setFilters(prev => ({ ...prev, gender: g === 'All' ? '' : g }))}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability / In-Stock toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
          />
          <span className="text-xs font-semibold text-slate-800">In Stock Shoes Only</span>
        </label>
      </div>

    </aside>
  );
};
