import React, { useState, useEffect } from 'react';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../../services/brandService';
import { Plus, Edit, Trash2, Award, X } from 'lucide-react';
import { slugify } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logoUrl: '',
    description: '',
    isManufactured: false,
    isActive: true,
  });
  const { showToast } = useNotification();

  const loadData = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      slug: '',
      logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
      description: '',
      isManufactured: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setFormData(brand);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.slug || slugify(formData.name),
    };

    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, payload);
        showToast('Brand updated successfully', 'success');
      } else {
        await createBrand(payload);
        showToast('New brand created', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Error saving brand', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return;
    try {
      await deleteBrand(id);
      showToast('Brand deleted', 'info');
      setBrands(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      showToast('Error deleting brand', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Shoe Brands</h1>
          <p className="text-xs text-slate-400">Manage internal manufacturing brand & third-party partner labels</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map(brand => (
          <div key={brand.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden p-1 flex items-center justify-center">
                <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(brand)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">{brand.name}</h3>
                {brand.isManufactured && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Workshop
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{brand.description}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Logo Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.logoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isManufactured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isManufactured: e.target.checked }))}
                    className="rounded text-amber-500"
                  />
                  <span>Mark as Iqra In-House Manufactured Brand</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
