export const STORE_NAME = 'Iqra Shoes';
export const STORE_TAGLINE = 'Footwear Manufacturer, Shop & Showroom';
export const STORE_PHONE = '+91 98765 43210';
export const STORE_EMAIL = 'support@iqrashoes.com';
export const STORE_ADDRESS = 'Showroom No. 12-14, Leather Complex, MG Road, Mumbai - 400017';
export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 60;

export const SIZES = ['4', '5', '6', '7', '8', '9', '10', '11', '12'];

export const SHOE_TYPES = [
  'Sneakers',
  'Sports',
  'Running',
  'Formal',
  'Casual',
  'Loafers',
  'Sandals',
  'Slippers',
  'Boots',
  'School Shoes',
  'Kids Shoes'
];

export const GENDERS = ['Men', 'Women', 'Boys', 'Girls', 'Unisex', 'Kids'];

export const COLOURS = [
  { name: 'Black', hex: '#111827' },
  { name: 'Brown', hex: '#78350f' },
  { name: 'Tan', hex: '#b45309' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Grey', hex: '#64748b' },
  { name: 'Olive Green', hex: '#3f6212' },
  { name: 'Cherry Red', hex: '#991b1b' },
  { name: 'Beige', hex: '#d6c7a1' },
];

export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 499 },
  { label: '₹500 – ₹999', min: 500, max: 999 },
  { label: '₹1,000 – ₹1,999', min: 1000, max: 1999 },
  { label: '₹2,000 & Above', min: 2000, max: 999999 },
];

export const ORDER_STATUSES = [
  { id: 'placed', label: 'Order Placed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'confirmed', label: 'Confirmed', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'processing', label: 'Processing & Packing', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'delivered', label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-200' },
];

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery (COD)', desc: 'Pay when your shoes arrive at your doorstep' },
  { id: 'online_upi', label: 'UPI / QR Code / Net Banking', desc: 'Instant & secure checkout (Google Pay, PhonePe, Paytm)' },
  { id: 'online_card', label: 'Debit / Credit Card', desc: 'Visa, MasterCard, RuPay accepted' },
];

export const PROMO_CODES = {
  'WELCOME10': { type: 'percent', value: 10, minCart: 499, desc: '10% OFF on first order' },
  'IQRA100': { type: 'fixed', value: 100, minCart: 999, desc: 'Flat ₹100 OFF on orders above ₹999' },
  'FREESHIP': { type: 'free_shipping', value: 0, minCart: 499, desc: 'Free Shipping on all orders' },
};
