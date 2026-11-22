import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Zap, 
  Sparkles,
  Archive,
  Image as ImageIcon
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import { formatINR, slugify, generateSKU } from '../../utils/formatters';
import { SIZES, SHOE_TYPES, GENDERS } from '../../utils/constants';
import { useNotification } from '../../context/NotificationContext';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { showToast } = useNotification();

  // Product form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    brandId: 'brand-iqra',
    brandName: 'Iqra Shoes',
    shoeType: 'Formal',
    gender: 'Men',
    price: 1499,
    compareAtPrice: 2499,
    description: '',
    material: 'Genuine Full-Grain Leather',
    soleMaterial: 'Anti-Skid Comfort TPR',
    imageUrl1: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    imageUrl2: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    isActive: true,
    variants: [
      { id: 'v1', sku: 'IQR-S6', size: '6', colour: 'Black', stock: 10, isActive: true },
      { id: 'v2', sku: 'IQR-S7', size: '7', colour: 'Black', stock: 15, isActive: true },
      { id: 'v3', sku: 'IQR-S8', size: '8', colour: 'Black', stock: 20, isActive: true },
      { id: 'v4', sku: 'IQR-S9', size: '9', colour: 'Black', stock: 12, isActive: true },
      { id: 'v5', sku: 'IQR-S10', size: '10', colour: 'Black', stock: 8, isActive: true },
    ]
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, b, c] = await Promise.all([getProducts(), getBrands(), getCategories()]);
      setProducts(p);
      setBrands(b);
      setCategories(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: `IQR-${Date.now().toString().slice(-4)}`,
      brandId: 'brand-iqra',
      brandName: 'Iqra Shoes',
      shoeType: 'Formal',
      gender: 'Men',
      price: 1499,
      compareAtPrice: 2499,
      description: 'Manufactured with high-grade durable materials, ergonomic insoles, and long-lasting stitching.',
      material: 'Genuine Leather',
      soleMaterial: 'Anti-Skid TPR',
      imageUrl1: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      imageUrl2: '',
      isFeatured: true,
      isActive: true,
      variants: [
        { id: 'v1', sku: 'IQR-S6', size: '6', colour: 'Black', stock: 10, isActive: true },
        { id: 'v2', sku: 'IQR-S7', size: '7', colour: 'Black', stock: 15, isActive: true },
        { id: 'v3', sku: 'IQR-S8', size: '8', colour: 'Black', stock: 20, isActive: true },
        { id: 'v4', sku: 'IQR-S9', size: '9', colour: 'Black', stock: 12, isActive: true },
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      sku: prod.sku,
      brandId: prod.brandId,
      brandName: prod.brandName,
      shoeType: prod.shoeType || 'Sneakers',
      gender: prod.gender || 'Men',
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || 0,
      description: prod.description || '',
      material: prod.material || '',
      soleMaterial: prod.soleMaterial || '',
      imageUrl1: prod.imageUrls?.[0] || '',
      imageUrl2: prod.imageUrls?.[1] || '',
      isFeatured: prod.isFeatured || false,
      isActive: prod.isActive !== false,
      variants: prod.variants || []
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const brandObj = brands.find(b => b.id === formData.brandId);

    const payload = {
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      sku: formData.sku,
      brandId: formData.brandId,
      brandName: brandObj?.name || formData.brandName,
      shoeType: formData.shoeType,
      gender: formData.gender,
      price: Number(formData.price),
      compareAtPrice: Number(formData.compareAtPrice),
      description: formData.description,
      material: formData.material,
      soleMaterial: formData.soleMaterial,
      imageUrls: [formData.imageUrl1, formData.imageUrl2].filter(Boolean),
      isFeatured: Boolean(formData.isFeatured),
      isActive: Boolean(formData.isActive),
      variants: formData.variants,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast('Shoe details updated successfully!', 'success');
      } else {
        await createProduct(payload);
        showToast('New shoe model added to catalogue!', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Error saving shoe model', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shoe model from catalogue?')) return;
    try {
      await deleteProduct(id);
      showToast('Product deleted', 'info');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Footwear Catalogue</h1>
          <p className="text-xs text-slate-400">Manage shoe models, specifications, pricing, and variants</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Shoe</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search by shoe name, SKU, or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Shoe</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Total Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.map(prod => {
                const totalStock = prod.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0;
                return (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                          <img src={prod.imageUrls?.[0]} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{prod.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-300">
                      {prod.brandName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                        {prod.shoeType}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-extrabold text-white">{formatINR(prod.price)}</span>
                      {prod.compareAtPrice > prod.price && (
                        <span className="text-[10px] text-slate-500 line-through block">
                          {formatINR(prod.compareAtPrice)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        totalStock <= 5 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-emerald-400'
                      }`}>
                        {totalStock} pairs
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {prod.isFeatured ? (
                        <span className="text-amber-400 flex items-center gap-1 font-bold text-[10px]">
                          <Zap className="w-3 h-3 fill-amber-400" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">No</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Shoe"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Shoe"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-black text-lg text-white">
                {editingProduct ? 'Edit Shoe Model' : 'Add New Shoe Model'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Shoe Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Iqra Handcrafted Oxford Brogue"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Brand *</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData(prev => ({ ...prev, brandId: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Shoe Type *</label>
                  <select
                    value={formData.shoeType}
                    onChange={(e) => setFormData(prev => ({ ...prev, shoeType: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    {SHOE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    {GENDERS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">MRP / Compare Price (₹)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl1}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl1: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Secondary Angle Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl2}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl2: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded text-amber-500"
                  />
                  <span>Mark as Featured Shoe</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded text-amber-500"
                  />
                  <span>Active & Visible in Store</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Save Shoe Model
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
