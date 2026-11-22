import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { getBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import { ProductFilters } from '../../components/products/ProductFilters';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Filter, X } from 'lucide-react';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState(() => ({
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    shoeType: searchParams.get('shoeType') || '',
    minPrice: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    maxPrice: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    size: searchParams.get('size') || '',
    inStockOnly: searchParams.get('inStock') === 'true',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'featured',
  }));

  // Fetch brands & categories
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [b, c] = await Promise.all([getBrands(), getCategories()]);
        setBrands(b);
        setCategories(c);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch filtered products whenever filters change
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const prods = await getProducts(filters);
        setProducts(prods);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      brand: '',
      category: '',
      gender: '',
      shoeType: '',
      minPrice: undefined,
      maxPrice: undefined,
      size: '',
      inStockOnly: false,
      search: '',
      sort: 'featured',
    });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Footwear Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore premium handcrafted shoes and popular top footwear brands
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs self-start"
        >
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filters & Sort</span>
        </button>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            brands={brands}
            categories={categories}
            resetFilters={resetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={products}
            loading={loading}
            sort={filters.sort}
            onSortChange={(newSort) => setFilters(prev => ({ ...prev, sort: newSort }))}
            onResetFilters={resetFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative min-h-screen flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Filter Shoes</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                brands={brands}
                categories={categories}
                resetFilters={resetFilters}
              />

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Apply Filters ({products.length} shoes)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
