import React, { createContext, useContext, useState, useEffect } from 'react';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, PROMO_CODES } from '../utils/constants';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CART_STORAGE_KEY = 'iqra_shoes_cart_v1';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Error saving cart to local storage', e);
    }
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    if (!variant || !variant.id) {
      throw new Error('Please select a shoe size');
    }

    const itemId = `${product.id}-${variant.id}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const finalQty = variant.stock ? Math.min(newQty, variant.stock) : newQty;
        return prev.map(item => item.id === itemId ? { ...item, quantity: finalQty } : item);
      } else {
        const newItem = {
          id: itemId,
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          slug: product.slug,
          brandName: product.brandName,
          brandId: product.brandId,
          size: variant.size,
          colour: variant.colour,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          imageUrl: product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
          sku: variant.sku || product.sku,
          maxStock: variant.stock || 10,
          quantity: Math.min(quantity, variant.stock || 10),
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const safeQty = item.maxStock ? Math.min(quantity, item.maxStock) : quantity;
          return { ...item, quantity: safeQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code?.trim().toUpperCase();
    setCouponError('');
    
    if (!cleanCode) {
      setCouponError('Please enter a coupon code');
      return false;
    }

    const promo = PROMO_CODES[cleanCode];
    if (!promo) {
      setCouponError('Invalid promo code');
      return false;
    }

    if (subtotal < promo.minCart) {
      setCouponError(`Minimum cart value for this coupon is ₹${promo.minCart}`);
      return false;
    }

    setAppliedCoupon({ code: cleanCode, ...promo });
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Computations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Shipping logic
  let shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  if (appliedCoupon?.type === 'free_shipping') {
    shippingCharge = 0;
  }

  // Discount logic
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'fixed') {
      discount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const total = Math.max(0, subtotal - discount + shippingCharge);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingCharge,
    discount,
    total,
    totalItems,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
