import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Ruler, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  Star
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import { ProductCard } from '../../components/products/ProductCard';
import { initialBanners } from '../../data/seedData';
import { formatINR } from '../../utils/formatters';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [allProds, allBrands, allCats] = await Promise.all([
          getProducts(),
          getBrands(),
          getCategories(),
        ]);

        setFeaturedProducts(allProds.filter(p => p.isFeatured).slice(0, 8));
        setNewArrivals([...allProds].reverse().slice(0, 4));
        setBrands(allBrands);
        setCategories(allCats);
      } catch (err) {
        console.error('Home load error', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Banner carousel auto rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIdx(prev => (prev + 1) % initialBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = initialBanners[currentBannerIdx];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[460px] sm:min-h-[540px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center opacity-30 sm:opacity-40 transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left w-full">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" /> {currentBanner.tag || 'Handcrafted Footwear'}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              {currentBanner.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {currentBanner.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to={currentBanner.targetUrl}
                className="px-7 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 group"
              >
                <span>{currentBanner.buttonText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-colors border border-white/20"
              >
                Browse All Shoes
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
          {initialBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBannerIdx(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentBannerIdx === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Shoe Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore by Shoe Type
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">Pick from our hand-curated footwear categories</p>
          </div>
          <Link to="/shop" className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square border border-slate-200 bg-slate-900 text-white shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover object-center opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-left">
                <span className="font-extrabold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-300 font-medium">Explore &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Iqra Brand Craftsmanship Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-amber-900/30 shadow-xl">
          <div className="relative z-10 max-w-2xl text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              Direct From Shoe Manufacturer & Workshop
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Handcrafted Leather Footwear by Iqra Shoes
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every shoe crafted at Iqra footwear begins with carefully chosen top-grain hides, hand-cut patterns, and reinforced welt stitching. We bypass middleman markups so you get royal Italian derbies, oxford brogues, and moccasin loafers directly from the craftsmen.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                to="/shop?brand=brand-iqra"
                className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/30"
              >
                Explore Iqra Workshop Shoes
              </Link>
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Genuine Leather Guarantee</span>
              </div>
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Shoes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Featured Collection
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">Most-loved styles handpicked by our showroom managers</p>
          </div>
          <Link to="/shop?sort=featured" className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Budget Collections (Under ₹500, ₹500-₹999, ₹1,000-₹1,999, ₹2,000+) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Shop By Budget
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Quality footwear at prices suited to every requirement</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/shop?priceMax=499"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all text-left group"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">Affordable Daily</span>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">Under ₹500</h3>
            <p className="text-[11px] text-slate-500 mt-1">Slippers, comfort slides & home footwear</p>
          </Link>

          <Link
            to="/shop?priceMin=500&priceMax=999"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all text-left group"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">Great Value</span>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">₹500 – ₹999</h3>
            <p className="text-[11px] text-slate-500 mt-1">School shoes, sandals & active trainers</p>
          </Link>

          <Link
            to="/shop?priceMin=1000&priceMax=1999"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all text-left group"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">Most Popular</span>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">₹1,000 – ₹1,999</h3>
            <p className="text-[11px] text-slate-500 mt-1">Pure leather formals, sports & running</p>
          </Link>

          <Link
            to="/shop?priceMin=2000"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all text-left group"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">Premium Tier</span>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">₹2,000 & Above</h3>
            <p className="text-[11px] text-slate-500 mt-1">Chelsea boots, branded sneakers & lux oxfords</p>
          </Link>
        </div>
      </section>

      {/* Brand Partners Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Top Shoe Brands in Showroom
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">Genuine branded shoes with official manufacturer warranty</p>
          </div>
          <Link to="/brands" className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            <span>All Brands</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {brands.map(brand => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 mb-2 border border-slate-100 flex items-center justify-center">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600">
                {brand.name}
              </span>
              {brand.isManufactured && (
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full mt-1">
                  Own Factory
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Trust & Showroom Experience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Why Customers Trust Iqra Shoes</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-8">
            Experience Footwear Crafted with Passion
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                01
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Direct Factory Pricing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                By producing our own footwear line in our manufacturing facility, we offer pure leather shoes at 40-50% less than department store retail rates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                02
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Accurate Indian Sizing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our shoe lasts are shaped specifically for Indian foot anatomy (standard UK/IND sizes), ensuring roomy toe boxes and zero pinch points.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                03
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Reliable Cash On Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Order with complete confidence. Check the package at your door and pay with cash or UPI on delivery. 7-day easy size exchange support.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
