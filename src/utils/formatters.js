// Currency formatting for Indian Rupees (₹)
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Date formatting
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  let date;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Relative date / delivery estimate
export const getEstimatedDelivery = (daysToAdd = 4) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Slugify string for clean SEO URLs
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Generate Order ID (e.g., IQRA-2026-4892)
export const generateOrderNumber = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `IQRA-${year}-${random}`;
};

// Generate SKU
export const generateSKU = (brand, category, size) => {
  const b = (brand || 'IQRA').substring(0, 3).toUpperCase();
  const c = (category || 'SHO').substring(0, 3).toUpperCase();
  const s = size ? `S${size}` : 'UNI';
  const rand = Math.floor(100 + Math.random() * 900);
  return `${b}-${c}-${s}-${rand}`;
};
