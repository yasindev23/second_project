import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { initialProducts } from '../data/seedData';

const COLLECTION_NAME = 'products';
const LOCAL_STORAGE_KEY = 'iqra_shoes_products_cache';

// Helper to get local fallback products
const getLocalProducts = () => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn('Local storage read error', e);
  }
  return initialProducts;
};

// Helper to save local fallback products
const saveLocalProducts = (products) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Local storage write error', e);
  }
};

export const getProducts = async (filters = {}) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    let q = query(productsRef);

    // Try fetching from Firestore
    const snapshot = await getDocs(q);
    let products = [];

    if (!snapshot.empty) {
      products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      // Empty Firestore, use local cache/seed
      products = getLocalProducts();
    }

    // Apply Client/Query Filtering
    if (filters.brand) {
      products = products.filter(p => p.brandId === filters.brand || p.brandName?.toLowerCase() === filters.brand.toLowerCase() || p.brandId?.includes(filters.brand.toLowerCase()));
    }

    if (filters.category) {
      products = products.filter(p => 
        p.categoryIds?.includes(filters.category) || 
        p.categoryNames?.some(c => c.toLowerCase().includes(filters.category.toLowerCase())) ||
        p.shoeType?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.gender && filters.gender !== 'All') {
      products = products.filter(p => p.gender === filters.gender || p.gender === 'Unisex');
    }

    if (filters.shoeType && filters.shoeType !== 'All') {
      products = products.filter(p => p.shoeType?.toLowerCase() === filters.shoeType.toLowerCase());
    }

    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (filters.size) {
      products = products.filter(p => p.variants?.some(v => v.size === String(filters.size) && (v.stock > 0 || !filters.inStockOnly)));
    }

    if (filters.inStockOnly) {
      products = products.filter(p => p.variants?.some(v => v.stock > 0));
    }

    if (filters.isFeatured !== undefined) {
      products = products.filter(p => Boolean(p.isFeatured) === Boolean(filters.isFeatured));
    }

    if (filters.search) {
      const term = filters.search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.brandName?.toLowerCase().includes(term) ||
        p.shoeType?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.searchKeywords?.some(k => k.toLowerCase().includes(term))
      );
    }

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'rating':
          products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'featured':
        default:
          products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    if (filters.limitCount) {
      products = products.slice(0, filters.limitCount);
    }

    return products;
  } catch (error) {
    console.warn('Firestore fetch failed, using fallback data:', error.message);
    let products = getLocalProducts();
    // apply basic filter
    if (filters.search) {
      const term = filters.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(term) || p.brandName?.toLowerCase().includes(term));
    }
    if (filters.limitCount) products = products.slice(0, filters.limitCount);
    return products;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docData = snapshot.docs[0];
      return { id: docData.id, ...docData.data() };
    }

    // fallback
    const local = getLocalProducts().find(p => p.slug === slug);
    if (local) return local;

    return null;
  } catch (error) {
    console.warn('Error fetching product by slug:', error);
    return getLocalProducts().find(p => p.slug === slug) || null;
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return getLocalProducts().find(p => p.id === id) || null;
  } catch (error) {
    return getLocalProducts().find(p => p.id === id) || null;
  }
};

export const createProduct = async (productData) => {
  const id = productData.id || `prod-${Date.now()}`;
  const newProduct = {
    ...productData,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await setDoc(docRef, newProduct);
  } catch (error) {
    console.warn('Firestore write error, saving to local state:', error);
  }

  // Update local cache
  const current = getLocalProducts();
  saveLocalProducts([newProduct, ...current]);
  return newProduct;
};

export const updateProduct = async (id, updates) => {
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.warn('Firestore update error, updating local state:', error);
  }

  // Update local cache
  const current = getLocalProducts();
  const updated = current.map(p => p.id === id ? { ...p, ...updatedData } : p);
  saveLocalProducts(updated);
  return { id, ...updatedData };
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete error, deleting from local state:', error);
  }

  const current = getLocalProducts();
  saveLocalProducts(current.filter(p => p.id !== id));
  return true;
};

export const updateVariantStock = async (productId, variantId, newStock) => {
  const product = await getProductById(productId);
  if (!product) return false;

  const updatedVariants = product.variants.map(v => 
    v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
  );

  return await updateProduct(productId, { variants: updatedVariants });
};
