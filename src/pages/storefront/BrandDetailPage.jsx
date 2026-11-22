import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBrandBySlug } from '../../services/brandService';
import { getProducts } from '../../services/productService';
import { ProductGrid } from '../../components/products/ProductGrid';
import { ChevronRight, Award } from 'lucide-react';

export const BrandDetailPage = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    const loadBrandShoes = async () => {
      setLoading(true);
      try {
        const b = await getBrandBySlug(slug);
        setBrand(b);
        if (b) {
          const prods = await getProducts({ brand: b.id, sort });
          setProducts(prods);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBrandShoes();
  }, [slug, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/brands" className="hover:text-amber-600">Brands</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 font-bold">{brand?.name || slug}</span>
      </nav>

      {/* Brand Header Banner */}
      {brand && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 p-1">
            <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {brand.name}
              </h1>
              {brand.isManufactured && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> In-House Manufacturer
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {brand.description}
            </p>
          </div>
        </div>
      )}

      {/* Brand Products Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        sort={sort}
        onSortChange={setSort}
      />

    </div>
  );
};
