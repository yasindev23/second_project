import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { generateOrderNumber } from '../utils/formatters';
import { updateVariantStock, getProductById } from './productService';

const COLLECTION_NAME = 'orders';
const LOCAL_STORAGE_KEY = 'iqra_shoes_orders_cache';

const getLocalOrders = () => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn(e);
  }
  return [];
};

const saveLocalOrders = (orders) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn(e);
  }
};

export const createOrder = async (orderPayload) => {
  const orderId = `order-${Date.now()}`;
  const orderNumber = generateOrderNumber();

  const newOrder = {
    ...orderPayload,
    id: orderId,
    orderNumber,
    paymentStatus: orderPayload.paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'placed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Attempt stock deduction for each ordered variant
  if (orderPayload.items && Array.isArray(orderPayload.items)) {
    for (const item of orderPayload.items) {
      if (item.productId && item.variantId) {
        try {
          const product = await getProductById(item.productId);
          if (product && product.variants) {
            const variant = product.variants.find(v => v.id === item.variantId);
            if (variant) {
              await updateVariantStock(item.productId, item.variantId, variant.stock - item.quantity);
            }
          }
        } catch (err) {
          console.warn('Stock decrement notice:', err);
        }
      }
    }
  }

  // Save to Firestore
  try {
    await setDoc(doc(db, COLLECTION_NAME, orderId), newOrder);
  } catch (error) {
    console.warn('Firestore order create fallback to local:', error);
  }

  // Update local cache
  const current = getLocalOrders();
  saveLocalOrders([newOrder, ...current]);

  return newOrder;
};

export const getOrdersByUser = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return orders;
    }
    return getLocalOrders().filter(o => o.userId === userId);
  } catch (error) {
    console.warn('Error fetching user orders:', error);
    return getLocalOrders().filter(o => o.userId === userId);
  }
};

export const getAllOrders = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (!snapshot.empty) {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return orders;
    }
    return getLocalOrders();
  } catch (error) {
    console.warn('Error fetching all orders:', error);
    return getLocalOrders();
  }
};

export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return getLocalOrders().find(o => o.id === orderId || o.orderNumber === orderId) || null;
  } catch (error) {
    return getLocalOrders().find(o => o.id === orderId || o.orderNumber === orderId) || null;
  }
};

export const updateOrderStatus = async (orderId, newStatus, extraData = {}) => {
  const updates = {
    orderStatus: newStatus,
    ...extraData,
    updatedAt: new Date().toISOString(),
  };

  try {
    await updateDoc(doc(db, COLLECTION_NAME, orderId), updates);
  } catch (error) {
    console.warn('Update order status fallback:', error);
  }

  const current = getLocalOrders();
  saveLocalOrders(current.map(o => (o.id === orderId || o.orderNumber === orderId) ? { ...o, ...updates } : o));
  return true;
};
