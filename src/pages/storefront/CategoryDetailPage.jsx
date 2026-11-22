import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryBySlug } from '../../services/categoryService';
import { getProducts } from '../../services/productService';
import { ProductGrid } from '../../components/products/ProductGrid';
import { ChevronRight } from 'lucide-react';

export const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    const loadCategoryShoes = async () => {
      setLoading(true);
      try {
        const c = await getCategoryBySlug(slug);
        setCategory(c);
        if (c) {
          const prods = await getProducts({ category: c.id, sort });
          setProducts(prods);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryShoes();
  }, [slug, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-amber-600">Categories</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 font-bold">{category?.name || slug}</span>
      </nav>

      {/* Category Header */}
      {category && (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[160px] flex items-center p-6 sm:p-10">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="relative z-10 space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {category.description}
            </p>
          </div>
        </div>
      )}

      {/* Category Products */}
      <ProductGrid
        products={products}
        loading={loading}
        sort={sort}
        onSortChange={setSort}
      />

    </div>
  );
};
