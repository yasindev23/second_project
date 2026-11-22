import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Package, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  Phone 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getUserAddresses, saveUserAddress, deleteUserAddress, updateUserProfile } from '../../services/authService';

export const AccountPage = () => {
  const { user, userProfile, isAdmin } = useAuth();
  const { showToast } = useNotification();

  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.displayName || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (user?.uid) {
      getUserAddresses(user.uid).then(setAddresses);
    }
  }, [user]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.pincode) {
      showToast('Please fill all required address fields', 'error');
      return;
    }

    try {
      await saveUserAddress(user.uid, newAddress);
      showToast('Address saved successfully!', 'success');
      setIsAddingAddress(false);
      setNewAddress({
        fullName: user?.displayName || '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: 'Maharashtra',
        pincode: '',
        isDefault: false,
      });
      const updated = await getUserAddresses(user.uid);
      setAddresses(updated);
    } catch (err) {
      showToast('Error saving address', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteUserAddress(user.uid, id);
      showToast('Address deleted', 'info');
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      showToast('Error deleting address', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Account</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your shoe delivery addresses, profile details, and orders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Col: Profile Details & Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'IS'}
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-base truncate">
                  {user?.displayName || 'Valued Customer'}
                </h3>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                {isAdmin && (
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    Showroom Staff / Admin
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user?.email}</span>
              </div>
              {userProfile?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/account/orders"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>View All Orders</span>
                </div>
                <span>&rarr;</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Staff Admin Panel</span>
                  </div>
                  <span>&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Saved Delivery Addresses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Saved Shipping Addresses</h3>
                <p className="text-xs text-slate-400">Used for 1-click checkout on your footwear orders</p>
              </div>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  New Shipping Destination
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name *"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Phone Number *"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <input
                  type="text"
                  required
                  placeholder="Address Line (Flat / Building / Road) *"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Landmark"
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City *"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="PIN Code *"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards List */}
            {addresses.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No saved addresses found. Add an address to speed up your shoe orders.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2 relative">
                    <div className="flex items-start justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">{addr.fullName}</span>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600">{addr.addressLine1}</p>
                    {addr.landmark && <p className="text-xs text-slate-400">Near: {addr.landmark}</p>}
                    <p className="text-xs text-slate-600">{addr.city}, PIN - {addr.pincode}</p>
                    <p className="text-xs text-slate-800 font-semibold pt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
