import React, { useState } from 'react';
import { initialSettings } from '../../data/seedData';
import { Settings, Save, CheckCircle2, ShieldCheck, Truck, Phone, MapPin } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const AdminSettings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const { showToast } = useNotification();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Storefront and delivery settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-3xl text-left space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Showroom & Store Settings</h1>
        <p className="text-xs text-slate-400">Configure factory showroom address, helpline, delivery thresholds, and announcements</p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs text-slate-300">
        
        {/* Basic Brand Details */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-white text-sm pb-2 border-b border-slate-800">
            Manufacturer & Showroom Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Store / Brand Name</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Phone Helpline</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">GSTIN</label>
              <input
                type="text"
                name="gstNumber"
                value={settings.gstNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Factory Showroom Address</label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>
        </div>

        {/* Shipping & Payment Rules */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="font-extrabold text-white text-sm pb-2 border-b border-slate-800">
            Delivery & Payment Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Free Shipping Cart Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                name="standardShippingFee"
                value={settings.standardShippingFee}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="codAvailable"
                checked={settings.codAvailable}
                onChange={handleChange}
                className="rounded text-amber-500"
              />
              <span className="font-bold text-white">Enable Cash On Delivery (COD) for all India pincodes</span>
            </label>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="font-extrabold text-white text-sm pb-2 border-b border-slate-800">
            Top Notification Bar Message
          </h3>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Announcement Text</label>
            <input
              type="text"
              name="announcementText"
              value={settings.announcementText}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
