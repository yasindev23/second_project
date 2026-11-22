# Iqra Shoes — Footwear Manufacturer, Shop & Showroom

A responsive, production-ready e-commerce platform built for **Iqra Shoes** (footwear manufacturer, retail shop, and showroom). Customers can browse in-house handcrafted footwear and partner brands, filter by size, category, price, and gender, check pincode delivery, add shoes to their cart, and place Cash on Delivery (COD) or Online orders. Showroom staff manage the catalogue, variants, stock levels, and order fulfillment in a separate, secure admin panel.

---

## 🌟 Key Features

### 🛍️ Customer Storefront
- **Dynamic Navigation & Search:**
  - Fast search with instant suggestions by shoe style, brand, or occasion
  - Category navigation: Sneakers, Sports & Running, Formal Shoes, Casual & Loafers, Sandals & Floaters, Slippers, Boots, School Shoes, and Kids' Shoes
  - Special factory highlights for *Iqra Shoes Own Handcrafted Collection*
- **Catalogue & Filtering (`/shop`):**
  - Brand filter (Iqra Shoes, Nike, Adidas, Puma, Sparx, Bata, Campus)
  - Price filter: Under ₹500, ₹500–₹999, ₹1,000–₹1,999, ₹2,000+, and custom min/max
  - UK / India standard shoe size filter (UK 4 to 12)
  - Gender & age group (Men, Women, Kids, Unisex)
  - Availability & in-stock filter
  - Sorting (Featured, Price: Low to High, Price: High to Low, Newest, Rating)
- **Interactive Product Details (`/product/:slug`):**
  - High-resolution photo gallery with thumbnail selection
  - UK shoe size selector with live variant stock count
  - Interactive **Size Conversion Guide Modal** (UK/IND, US, EU, and CM measurement tips)
  - Colorway selector & quantity controls
  - Real-time Pincode delivery estimator & Cash on Delivery check
  - Specifications table (Upper material, Sole type, Care instructions)
  - Related shoes recommendations
- **Cart & Slide-Over Drawer (`/cart`):**
  - Slide-over mini-cart drawer on add-to-cart
  - Free delivery progress bar (Free shipping on orders above ₹999)
  - Promo code discounts (`WELCOME10` for 10% off, `IQRA100` for ₹100 off)
- **Streamlined Checkout (`/checkout`):**
  - Saved addresses support for logged-in accounts + Guest checkout
  - Cash on Delivery (COD) & Online Payment support
  - Auto-generated order numbers (e.g., `IQRA-2026-4892`)
  - Real-time inventory deduction on order placement
- **Customer Account & Orders (`/account` & `/account/orders`):**
  - Address book management (Add, edit, remove shipping addresses)
  - Full order history with live fulfillment status badges (`Placed`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`)
  - Printable invoice receipt with QR/WhatsApp showroom support link

### 🛡️ Showroom Staff Admin Panel (`/admin`)
- **Dashboard Overview:** Live revenue counter, total orders, low-stock variant alerts, and recent orders.
- **Product Management (`/admin/products`):** Full CRUD for shoe models with multi-variant configuration (UK sizes, colours, SKU, pricing, MRP, and photos).
- **Stock & Inventory Matrix (`/admin/inventory`):** Real-time stock adjustment (+ / -) by shoe size and colour, with instant low-stock indicators.
- **Order Processing (`/admin/orders`):** Filter by order state, view customer delivery address and phone, update status, and enter courier tracking numbers (e.g., BlueDart, Delhivery).
- **Brand & Category Managers (`/admin/brands` & `/admin/categories`):** Manage brand logos, manufacturer badges, and category hero banners.
- **Store Settings (`/admin/settings`):** Configure showroom address, phone helpline, delivery thresholds, and announcement banner.
- **One-Click Demo Catalogue Sync:** Built-in seed trigger in the Admin sidebar to immediately populate Cloud Firestore with high-quality shoe styles and variants.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, React Router v7
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **Authentication:** Firebase Authentication (Email/Password & Google Provider)
- **Database:** Cloud Firestore (with local fallback cache)
- **Storage:** Firebase Cloud Storage
- **Forms & Validation:** Zod and React form utilities

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 2. Installation
```bash
# Clone or navigate to the directory
cd second_project

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=AIzaSyCCbDbHeT09ytzrbbFhSTJUvEJKZY4Uyo8
VITE_FIREBASE_AUTH_DOMAIN=iqra-shoes.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=iqra-shoes
VITE_FIREBASE_STORAGE_BUCKET=iqra-shoes.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=221188017381
VITE_FIREBASE_APP_ID=1:221188017381:web:a879cf6fa1942e1417d80c
VITE_FIREBASE_MEASUREMENT_ID=G-SNM2NHF63W
```

### 4. Running the Development Server
```bash
npm run dev
```

### 5. Building for Production
```bash
npm run build
npm run preview
```

---

## 🔒 Security & Deployment Rules

- `firestore.rules`: Public reads on active catalogue (`products`, `brands`, `categories`, `banners`, `settings`); write access restricted to staff/admins; users restricted to their own carts, orders, and addresses.
- `storage.rules`: Authenticated uploads for product photography and showroom assets.
- `firebase.json`: Single-Page Application rewrites for Firebase Hosting.

---

## 🏬 Showroom Details

**Iqra Shoes**  
Showroom No. 12-14, Leather Complex, MG Road, Mumbai - 400017  
Helpline: +91 98765 43210  
Email: support@iqrashoes.com  
GSTIN: 27AABCI1234F1Z8
