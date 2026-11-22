import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBrands } from '../../services/brandService';
import { Award, ChevronRight } from 'lucide-react';

export const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands().then(data => {
      setBrands(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Footwear Brands</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore our in-house manufactured collections and authorized partner brands
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map(brand => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                    <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                  </div>
                  {brand.isManufactured && (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500 text-slate-950">
                      <Award className="w-3 h-3" /> Own Workshop
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                  {brand.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                <span>View Products</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
