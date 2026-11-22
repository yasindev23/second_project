import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  limit 
} from 'firebase/firestore';
import { db } from './firebase';
import { initialBrands } from '../data/seedData';

const COLLECTION_NAME = 'brands';
const LOCAL_STORAGE_KEY = 'iqra_shoes_brands_cache';

const getLocalBrands = () => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn(e);
  }
  return initialBrands;
};

const saveLocalBrands = (brands) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(brands));
  } catch (e) {
    console.warn(e);
  }
};

export const getBrands = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return getLocalBrands();
  } catch (error) {
    console.warn('Firestore fetch brands failed, using fallback:', error.message);
    return getLocalBrands();
  }
};

export const getBrandBySlug = async (slug) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return getLocalBrands().find(b => b.slug === slug) || null;
  } catch (error) {
    return getLocalBrands().find(b => b.slug === slug) || null;
  }
};

export const createBrand = async (brandData) => {
  const id = brandData.id || `brand-${Date.now()}`;
  const newBrand = { ...brandData, id };
  try {
    await setDoc(doc(db, COLLECTION_NAME, id), newBrand);
  } catch (e) {
    console.warn('Brand create fallback to local', e);
  }
  const current = getLocalBrands();
  saveLocalBrands([...current, newBrand]);
  return newBrand;
};

export const updateBrand = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), data);
  } catch (e) {
    console.warn('Brand update fallback to local', e);
  }
  const current = getLocalBrands();
  saveLocalBrands(current.map(b => b.id === id ? { ...b, ...data } : b));
  return { id, ...data };
};

export const deleteBrand = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (e) {
    console.warn('Brand delete fallback to local', e);
  }
  const current = getLocalBrands();
  saveLocalBrands(current.filter(b => b.id !== id));
  return true;
};
