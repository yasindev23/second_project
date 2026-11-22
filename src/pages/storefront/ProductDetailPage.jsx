import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Ruler, 
  Check, 
  ChevronRight, 
  Zap, 
  Share2, 
  MapPin,
  Clock
} from 'lucide-react';
import { getProductBySlug, getProducts } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { SizeChartModal } from '../../components/common/SizeChartModal';
import { formatINR, getEstimatedDelivery } from '../../utils/formatters';
import { ProductCard } from '../../components/products/ProductCard';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const prod = await getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.imageUrls?.[0] || '');
          // Select first available variant with stock
          const defaultVar = prod.variants?.find(v => v.stock > 0) || prod.variants?.[0] || null;
          setSelectedVariant(defaultVar);

          // Fetch related shoes from same brand or category
          const related = await getProducts({ 
            category: prod.categoryIds?.[0], 
            limitCount: 4 
          });
          setRelatedProducts(related.filter(r => r.id !== prod.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-96 bg-slate-200 rounded-3xl max-w-4xl mx-auto mb-6"></div>
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-slate-900">Shoe Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          The requested shoe may have been archived or the URL has changed.
        </p>
        <Link to="/shop" className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isIqra = product.brandId === 'brand-iqra' || product.brandName?.toLowerCase().includes('iqra');
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const currentStock = selectedVariant?.stock ?? 10;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast('Please select a shoe size first', 'error');
      return;
    }
    if (isOutOfStock) {
      showToast('Selected size is currently out of stock', 'error');
      return;
    }
    addToCart(product, selectedVariant, quantity);
    showToast(`Added ${product.name} (UK ${selectedVariant.size}) to cart!`, 'success');
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      showToast('Please select a shoe size first', 'error');
      return;
    }
    if (isOutOfStock) {
      showToast('Selected size is currently out of stock', 'error');
      return;
    }
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN Code' });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Delivery available by ${getEstimatedDelivery(4)}! Cash on Delivery available.`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-amber-600">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/brands/${product.brandId}`} className="hover:text-amber-600">{product.brandName}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <img
              src={selectedImage || product.imageUrls?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {isIqra && (
              <span className="absolute top-4 left-4 bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-white" /> Iqra Factory Original
              </span>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 ${
                    selectedImage === url ? 'border-amber-500 shadow-md' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                {product.brandName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SKU: {selectedVariant?.sku || product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-0.5 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span className="text-xs text-slate-500">
                ({product.reviewCount || 64} verified buyer reviews)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-600">
                Type: {product.shoeType}
              </span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-950">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    Save {formatINR(product.compareAtPrice - product.price)} ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Inclusive of all taxes • Free shipping on orders above ₹999
            </p>
          </div>

          {/* Size Selector with Size Chart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select UK / India Size:
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.variants?.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const hasStock = v.stock > 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={!hasStock}
                    onClick={() => setSelectedVariant(v)}
                    className={`py-2 px-4 rounded-xl text-xs font-extrabold border transition-all flex flex-col items-center min-w-[50px] ${
                      !hasStock
                        ? 'bg-slate-100 border-slate-200 text-slate-300 line-through cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-amber-400'
                    }`}
                  >
                    <span>UK {v.size}</span>
                    {v.stock > 0 && v.stock <= 5 && (
                      <span className="text-[9px] font-normal text-rose-500">Only {v.stock}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colour Info */}
          {selectedVariant?.colour && (
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Colour: </span>
              <span className="font-bold text-slate-900">{selectedVariant.colour}</span>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:text-amber-600"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-xs text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:text-amber-600"
                >
                  +
                </button>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {isOutOfStock && (
              <p className="text-xs text-rose-600 font-bold">
                This size is currently sold out. Please check other sizes or contact showroom.
              </p>
            )}
          </div>

          {/* Delivery Checker */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Check Delivery & COD Availability
            </span>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shrink-0"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className={`text-xs font-semibold ${pincodeStatus.valid ? 'text-emerald-700' : 'text-rose-600'}`}>
                {pincodeStatus.message}
              </p>
            )}
          </div>

          {/* Specifications Table */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Shoe Specifications</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Upper Material</span>
                <span className="font-bold text-slate-800">{product.material || 'Genuine Quality Material'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sole Material</span>
                <span className="font-bold text-slate-800">{product.soleMaterial || 'Anti-Skid Comfort Sole'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
                <span className="font-bold text-slate-800">{product.gender || 'Men'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Country of Origin</span>
                <span className="font-bold text-slate-800">India (Made in Factory)</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeChartModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      {/* Related Shoes */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-200 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              You May Also Like
            </h2>
            <Link to="/shop" className="text-xs font-bold text-amber-600 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
