import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';
import { 
  initialProducts, 
  initialBrands, 
  initialCategories, 
  initialBanners, 
  initialSettings 
} from '../data/seedData';

export const seedDatabase = async (force = false) => {
  const results = {
    products: 0,
    brands: 0,
    categories: 0,
    banners: 0,
    settings: false,
    message: ''
  };

  try {
    // 1. Seed Brands
    for (const brand of initialBrands) {
      await setDoc(doc(db, 'brands', brand.id), brand, { merge: !force });
      results.brands++;
    }

    // 2. Seed Categories
    for (const cat of initialCategories) {
      await setDoc(doc(db, 'categories', cat.id), cat, { merge: !force });
      results.categories++;
    }

    // 3. Seed Products
    for (const prod of initialProducts) {
      await setDoc(doc(db, 'products', prod.id), prod, { merge: !force });
      results.products++;
    }

    // 4. Seed Banners
    for (const ban of initialBanners) {
      await setDoc(doc(db, 'banners', ban.id), ban, { merge: !force });
      results.banners++;
    }

    // 5. Seed Settings
    await setDoc(doc(db, 'settings', 'store'), initialSettings, { merge: !force });
    results.settings = true;

    results.message = `Successfully populated ${results.products} products, ${results.brands} brands, ${results.categories} categories, and banners into Cloud Firestore!`;
    return { success: true, ...results };
  } catch (error) {
    console.warn('Firestore seeding notice:', error.message);
    results.message = `Seeded local showroom catalogue (${initialProducts.length} shoes ready). Note: ${error.message}`;
    return { success: false, ...results, error: error.message };
  }
};
