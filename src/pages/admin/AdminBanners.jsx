import React, { useState } from 'react';
import { initialBanners } from '../../data/seedData';
import { Image as ImageIcon, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AdminBanners = () => {
  const [banners, setBanners] = useState(initialBanners);
  const { showToast } = useNotification();

  const handleToggleActive = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    showToast('Banner visibility toggled', 'info');
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Home Page Banners</h1>
        <p className="text-xs text-slate-400">Manage promotional hero banners, manufacturer spotlights, and festival discounts</p>
      </div>

      <div className="space-y-4">
        {banners.map((banner, idx) => (
          <div key={banner.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-64 aspect-16/9 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  Slide {idx + 1}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${banner.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  {banner.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <h3 className="font-extrabold text-white text-base pt-1">{banner.title}</h3>
              <p className="text-slate-400 leading-relaxed">{banner.subtitle}</p>
              <p className="text-amber-400 font-mono text-[11px] pt-1">Link: {banner.targetUrl}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleActive(banner.id)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-300"
              >
                {banner.isActive ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
