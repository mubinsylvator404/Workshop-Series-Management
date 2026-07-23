import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabase } from '../services/supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface RegistrationRecord {
  id?: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  institution?: string | null;
  department?: string | null;
  district?: string | null;
  emergency_contact?: string | null;
  facebook?: string | null;
  motivation?: string | null;
  debate_format?: string | null;
  bkash_trx_id?: string | null;
  payment_screenshot?: string | null;
  admission_letter_code?: string | null;
  status: string; // 'pending' | 'approved' | 'rejected' | 'suspended'
  approval_status?: string;
  chamberAccess?: boolean;
  created_at: string;
}

export type RegistrationStatus = 'none' | 'pending' | 'approved' | 'rejected' | 'suspended';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registration: RegistrationRecord | null;
  registrationStatus: RegistrationStatus;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string; user?: AuthUser | null; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: string; user?: AuthUser | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>;
  refreshRegistration: () => Promise<RegistrationRecord | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [registration, setRegistration] = useState<RegistrationRecord | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>('none');

  const isUuid = (id?: string | null) => !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  // 1. Ensure user profile exists in 'profiles' table without creating duplicates
  const ensureUserProfile = async (userId: string, email: string, fullName: string) => {
    const supabase = getSupabase() as any;
    if (!supabase || !isUuid(userId)) return;

    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!existingProfile) {
        await supabase.from('profiles').insert({
          id: userId,
          full_name: fullName || email.split('@')[0],
          email: email.toLowerCase(),
          role: 'student',
          created_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('Note checking/creating user profile:', e);
    }
  };

  // 2. Query registration table using auth.uid() (user_id) exclusively
  const queryRegistration = useCallback(async (userId: string): Promise<RegistrationRecord | null> => {
    if (!userId || !isUuid(userId)) return null;

    const supabase = getSupabase() as any;
    if (!supabase) return null;

    try {
      const { data: reg, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (reg && !error) {
        const rawStatus = (reg.approval_status || reg.status || 'pending').toLowerCase();
        let computedStatus: RegistrationStatus = 'pending';
        if (rawStatus === 'approved') computedStatus = 'approved';
        else if (rawStatus === 'rejected') computedStatus = 'rejected';
        else if (rawStatus === 'suspended') computedStatus = 'suspended';
        else computedStatus = 'pending';

        const updatedRecord: RegistrationRecord = {
          ...reg,
          status: computedStatus,
          approval_status: computedStatus,
          chamberAccess: computedStatus === 'approved'
        };

        setRegistration(updatedRecord);
        setRegistrationStatus(computedStatus);
        return updatedRecord;
      }
    } catch (e) {
      console.warn('Note querying registration in Supabase:', e);
    }

    setRegistration(null);
    setRegistrationStatus('none');
    return null;
  }, []);

  const refreshRegistration = useCallback(async (): Promise<RegistrationRecord | null> => {
    if (!user || !user.id) {
      setRegistration(null);
      setRegistrationStatus('none');
      return null;
    }
    return await queryRegistration(user.id);
  }, [user, queryRegistration]);

  // Handle Supabase Auth session & state changes
  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabase();

    async function initAuth() {
      setIsLoading(true);

      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Scholar'
            };
            setUser(authUser);
            await ensureUserProfile(authUser.id, authUser.email, authUser.name || '');
            await queryRegistration(authUser.id);
            if (isMounted) setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Note fetching Supabase session:', err);
        }
      }

      if (isMounted) {
        setUser(null);
        setRegistration(null);
        setRegistrationStatus('none');
        setIsLoading(false);
      }
    }

    initAuth();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Scholar'
          };
          setUser(authUser);
          await ensureUserProfile(authUser.id, authUser.email, authUser.name || '');
          await queryRegistration(authUser.id);
        } else if (_event === 'SIGNED_OUT') {
          setUser(null);
          setRegistration(null);
          setRegistrationStatus('none');
        }
        if (isMounted) setIsLoading(false);
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }
  }, [queryRegistration]);

  // Sign Up with Supabase Auth
  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const supabase = getSupabase();

    if (!supabase) {
      setIsLoading(false);
      return { error: 'Supabase is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName
          }
        }
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data?.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: cleanName || cleanEmail.split('@')[0]
        };

        await ensureUserProfile(authUser.id, authUser.email, authUser.name || '');

        if (data.session) {
          setUser(authUser);
          await queryRegistration(authUser.id);
          setIsLoading(false);
          return { user: authUser };
        } else {
          setIsLoading(false);
          return { user: authUser, needsVerification: true };
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Sign up failed.' };
    }

    setIsLoading(false);
    return { error: 'Sign up failed.' };
  };

  // Sign In with Supabase Auth
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabase();

    if (!supabase) {
      setIsLoading(false);
      return { error: 'Supabase is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data?.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0]
        };

        setUser(authUser);
        await ensureUserProfile(authUser.id, authUser.email, authUser.name || '');
        await queryRegistration(authUser.id);

        setIsLoading(false);
        return { user: authUser };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Sign in failed.' };
    }

    setIsLoading(false);
    return { error: 'Invalid email or password.' };
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase is not configured.' };

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) return { error: error.message };
      return { success: true };
    } catch (err: any) {
      return { error: err.message || 'Failed to send password reset email.' };
    }
  };

  // Sign Out
  const signOut = async () => {
    setIsLoading(true);
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Note on Supabase sign out:', err);
      }
    }
    setUser(null);
    setRegistration(null);
    setRegistrationStatus('none');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        registration,
        registrationStatus,
        signUp,
        signIn,
        signOut,
        resetPassword,
        refreshRegistration
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
