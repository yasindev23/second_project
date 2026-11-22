import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Search, ChevronRight } from 'lucide-react';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    const runSearch = async () => {
      setLoading(true);
      try {
        const results = await getProducts({ search: query, sort });
        setProducts(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      runSearch();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 font-bold">Search</span>
      </nav>

      {/* Search Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Search className="w-4 h-4 text-amber-600" />
          <span>Search results for:</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          "{query}"
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Found {products.length} matching footwear {products.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        sort={sort}
        onSortChange={setSort}
      />

    </div>
  );
};
