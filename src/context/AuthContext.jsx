import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { 
  loginUser, 
  registerUser, 
  loginWithGoogle, 
  logoutUser, 
  sendResetPassword, 
  getUserProfile 
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status helper
  const verifyAdminStatus = (currentUser, profile, tokenResult) => {
    if (!currentUser) return false;
    
    // Check custom claims
    if (tokenResult?.claims?.admin) return true;
    
    // Check Firestore user profile role
    if (profile?.role === 'admin') return true;

    // Check designated admin emails
    const email = currentUser.email?.toLowerCase() || '';
    if (email === 'admin@iqrashoes.com' || email.includes('admin') || email === 'yasin@iqrashoes.com') {
      return true;
    }

    // Check showroom staff demo flag
    const staffSession = sessionStorage.getItem('iqra_staff_admin_active');
    if (staffSession === 'true') return true;

    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const tokenResult = await currentUser.getIdTokenResult(true);
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
          setIsAdmin(verifyAdminStatus(currentUser, profile, tokenResult));
        } catch (error) {
          console.warn('Auth token/profile verification error:', error);
          const profile = { email: currentUser.email, displayName: currentUser.displayName };
          setUserProfile(profile);
          setIsAdmin(verifyAdminStatus(currentUser, profile, null));
        }
      } else {
        setUserProfile(null);
        // Check if showroom staff session is active even for demo access
        const staffSession = sessionStorage.getItem('iqra_staff_admin_active');
        setIsAdmin(staffSession === 'true');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await loginUser(email, password);
  };

  const register = async (email, password, displayName, phone) => {
    return await registerUser(email, password, displayName, phone);
  };

  const googleLogin = async () => {
    return await loginWithGoogle();
  };

  const logout = async () => {
    sessionStorage.removeItem('iqra_staff_admin_active');
    setIsAdmin(false);
    return await logoutUser();
  };

  const resetPassword = async (email) => {
    return await sendResetPassword(email);
  };

  // Staff admin bypass toggle for quick previewing / showroom staff demo
  const toggleStaffDemoAdmin = (enable) => {
    if (enable) {
      sessionStorage.setItem('iqra_staff_admin_active', 'true');
      setIsAdmin(true);
    } else {
      sessionStorage.removeItem('iqra_staff_admin_active');
      if (!user?.email?.includes('admin')) {
        setIsAdmin(false);
      }
    }
  };

  const value = {
    user,
    userProfile,
    isAdmin,
    loading,
    login,
    register,
    googleLogin,
    logout,
    resetPassword,
    toggleStaffDemoAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
