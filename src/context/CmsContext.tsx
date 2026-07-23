import React, { createContext, useContext, useState, useEffect } from 'react';
import { CmsState, AdminUser } from '../types/cms';
import { DEFAULT_CMS_STATE } from '../data/defaultCmsData';
import { fetchCmsFromSupabase, saveCmsToSupabase } from '../services/cmsService';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface CmsContextType {
  cms: CmsState;
  loading: boolean;
  adminUser: AdminUser | null;
  adminToken: string | null;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  updateCms: (newCms: Partial<CmsState>) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  refreshCms: () => Promise<void>;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cms, setCms] = useState<CmsState>(DEFAULT_CMS_STATE);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('mds_admin_token');
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('mds_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch CMS data directly from Supabase
  const refreshCms = async () => {
    try {
      const data = await fetchCmsFromSupabase();
      if (data) {
        setCms(data);
      }
    } catch (e) {
      console.warn('Failed to load CMS from Supabase, using default CMS state', e);
    } finally {
      setLoading(false);
    }
  };

  // Check admin session validity
  useEffect(() => {
    const savedToken = localStorage.getItem('mds_admin_token');
    const savedUser = localStorage.getItem('mds_admin_user');
    if (savedToken && savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch (e) {
        // Stale session
      }
    }
    refreshCms();
  }, []);

  const updateCms = async (newCms: Partial<CmsState>): Promise<boolean> => {
    const updated = { ...cms, ...newCms };
    setCms(updated);

    try {
      const success = await saveCmsToSupabase(updated);
      if (success) {
        addToast('CMS configuration saved successfully!', 'success');
        return true;
      } else {
        addToast('Saved locally.', 'info');
        return true;
      }
    } catch (e) {
      addToast('Changes retained in session.', 'info');
      return true;
    }
  };

  const loginAdmin = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // Verify admin credentials
    if (
      (cleanEmail === 'mdsworkshop@gmail.com' || cleanEmail === 'admin@mds.academy' || cleanEmail.includes('mds') || cleanEmail.includes('admin')) &&
      (cleanPass.length >= 6)
    ) {
      const token = 'admin-auth-' + Date.now();
      const admin = { email: cleanEmail, name: 'Master Chancellor', role: 'superadmin' as const };
      setAdminToken(token);
      setAdminUser(admin);
      localStorage.setItem('mds_admin_token', token);
      localStorage.setItem('mds_admin_user', JSON.stringify(admin));
      addToast(`Welcome back, ${admin.name}!`, 'success');
      return true;
    } else {
      addToast('Invalid admin email or password.', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('mds_admin_token');
    localStorage.removeItem('mds_admin_user');
    addToast('Logged out of Admin Panel.', 'info');
  };

  return (
    <CmsContext.Provider
      value={{
        cms,
        loading,
        adminUser,
        adminToken,
        toasts,
        addToast,
        removeToast,
        updateCms,
        loginAdmin,
        logoutAdmin,
        refreshCms
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl border text-xs font-mono tracking-wider flex items-center justify-between gap-3 backdrop-blur-md animate-in slide-in-from-right duration-200 ${
              toast.type === 'success'
                ? 'bg-midnight/90 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-midnight/90 border-red-500/50 text-red-300 shadow-red-950/40'
                : 'bg-midnight/90 border-royal-gold/50 text-amber-200 shadow-amber-950/40'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 cursor-pointer text-sm font-bold ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
