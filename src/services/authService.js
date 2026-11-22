import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  deleteDoc 
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

export const registerUser = async (email, password, displayName, phone) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Create user profile in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || 'Shoe Lover',
    phone: phone || '',
    role: email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@iqrashoes.com' ? 'admin' : 'customer',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(userDocRef, userData);
  } catch (err) {
    console.warn('Profile write notice:', err);
  }

  return { ...user, ...userData };
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Sync profile to Firestore
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userDocRef);
    if (!existing.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Shoe Customer',
        phone: user.phoneNumber || '',
        photoURL: user.photoURL || '',
        role: user.email?.toLowerCase().includes('admin') || user.email === 'admin@iqrashoes.com' ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Google sign-in firestore notice:', err);
  }

  return user;
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const sendResetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (err) {
    console.warn('Error reading user profile:', err);
  }
  return null;
};

export const updateUserProfile = async (uid, data) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
    return true;
  } catch (err) {
    console.warn('Profile update error:', err);
    return false;
  }
};

// Saved Addresses
export const getUserAddresses = async (uid) => {
  try {
    const colRef = collection(db, 'users', uid, 'addresses');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn('Address fetch fallback:', err);
  }
  // Local fallback
  const local = localStorage.getItem(`iqra_addresses_${uid}`);
  return local ? JSON.parse(local) : [];
};

export const saveUserAddress = async (uid, addressData) => {
  const addressId = addressData.id || `addr-${Date.now()}`;
  const newAddr = { ...addressData, id: addressId };

  try {
    const docRef = doc(db, 'users', uid, 'addresses', addressId);
    await setDoc(docRef, newAddr);
  } catch (err) {
    console.warn('Address save notice:', err);
  }

  // Local sync
  const current = await getUserAddresses(uid);
  const updated = [...current.filter(a => a.id !== addressId), newAddr];
  localStorage.setItem(`iqra_addresses_${uid}`, JSON.stringify(updated));
  return newAddr;
};

export const deleteUserAddress = async (uid, addressId) => {
  try {
    const docRef = doc(db, 'users', uid, 'addresses', addressId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Address delete notice:', err);
  }

  const current = await getUserAddresses(uid);
  const updated = current.filter(a => a.id !== addressId);
  localStorage.setItem(`iqra_addresses_${uid}`, JSON.stringify(updated));
  return true;
};
