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
import { initialCategories } from '../data/seedData';

const COLLECTION_NAME = 'categories';
const LOCAL_STORAGE_KEY = 'iqra_shoes_categories_cache';

const getLocalCategories = () => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn(e);
  }
  return initialCategories;
};

const saveLocalCategories = (categories) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.warn(e);
  }
};

export const getCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return getLocalCategories();
  } catch (error) {
    console.warn('Firestore fetch categories failed, using fallback:', error.message);
    return getLocalCategories();
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return getLocalCategories().find(c => c.slug === slug) || null;
  } catch (error) {
    return getLocalCategories().find(c => c.slug === slug) || null;
  }
};

export const createCategory = async (catData) => {
  const id = catData.id || `cat-${Date.now()}`;
  const newCat = { ...catData, id };
  try {
    await setDoc(doc(db, COLLECTION_NAME, id), newCat);
  } catch (e) {
    console.warn('Category create fallback', e);
  }
  const current = getLocalCategories();
  saveLocalCategories([...current, newCat]);
  return newCat;
};

export const updateCategory = async (id, data) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), data);
  } catch (e) {
    console.warn('Category update fallback', e);
  }
  const current = getLocalCategories();
  saveLocalCategories(current.map(c => c.id === id ? { ...c, ...data } : c));
  return { id, ...data };
};

export const deleteCategory = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (e) {
    console.warn('Category delete fallback', e);
  }
  const current = getLocalCategories();
  saveLocalCategories(current.filter(c => c.id !== id));
  return true;
};
