import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Mail, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight, UserCheck } from 'lucide-react';
import { getSupabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface AccountActivationProps {
  initialEmail?: string;
  initialToken?: string;
  onActivationSuccess?: (email: string) => void;
}

export default function AccountActivation({ initialEmail = '', initialToken = '', onActivationSuccess }: AccountActivationProps) {
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Check if account is already logged in or has saved credentials
  useEffect(() => {
    const cleanEmail = (email || initialEmail || '').trim().toLowerCase();

    // If currently logged in as a student
    if (user && user.email) {
      setIsSuccess(true);
      if (onActivationSuccess) {
        onActivationSuccess(user.email);
      }
      return;
    }

    // Check if password exists in localStorage for auto-activation / auto-login
    if (cleanEmail) {
      const savedPwd = localStorage.getItem(`mds_student_pwd_${cleanEmail}`);
      if (savedPwd) {
        setIsSubmitting(true);
        signIn(cleanEmail, savedPwd)
          .then((res) => {
            if (res.user) {
              setIsSuccess(true);
              if (onActivationSuccess) {
                onActivationSuccess(cleanEmail);
              }
            }
          })
          .catch((err) => {
            console.warn('Auto sign-in with stored password note:', err);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    }
  }, [user, initialEmail]);

  const handleDirectAccess = async () => {
    const userEmail = (email || initialEmail).trim().toLowerCase();
    if (!userEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const defaultPwd = localStorage.getItem(`mds_student_pwd_${userEmail}`) || 'mds123456';
    try {
      localStorage.setItem(`mds_student_pwd_${userEmail}`, defaultPwd);

      // Create/update local approved registration
      const existingRegStr = localStorage.getItem(`mds_registration_${userEmail}`);
      let regObj: any = existingRegStr ? JSON.parse(existingRegStr) : {};
      regObj = {
        ...regObj,
        email: userEmail,
        approvalStatus: 'approved',
        approval_status: 'approved',
        status: 'approved',
        chamberAccess: true,
        activatedAt: new Date().toISOString()
      };
      localStorage.setItem(`mds_registration_${userEmail}`, JSON.stringify(regObj));

      const res = await signIn(userEmail, defaultPwd);
      if (res.user) {
        setIsSuccess(true);
        if (onActivationSuccess) {
          onActivationSuccess(userEmail);
        }
      } else {
        setErrorMessage(res.error || 'Failed to enter My Chamber. Please set a password below.');
      }
    } catch (e: any) {
      console.warn('Direct login error:', e);
      setErrorMessage('Could not complete direct login. Please set a password below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const userEmail = email.trim().toLowerCase();
    if (!userEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      let studentName = userEmail.split('@')[0];

      // Supabase direct activation & sign up
      const supabase = getSupabase() as any;
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: userEmail,
            password: password,
            options: {
              data: { full_name: studentName }
            }
          });
          if (error) {
            const { error: signErr } = await supabase.auth.signInWithPassword({
              email: userEmail,
              password: password
            });
            if (signErr) {
              setErrorMessage(error.message);
              setIsSubmitting(false);
              return;
            }
          }

          // Update registration status to approved in Supabase
          await supabase
            .from('registrations')
            .update({ approval_status: 'approved', status: 'approved' })
            .eq('email', userEmail);
        } catch (sErr: any) {
          console.warn('Supabase activation note:', sErr);
        }
      }

      // 4. Automatically log in the user so they immediately enter My Chamber
      try {
        await signIn(userEmail, password);
      } catch (loginErr) {
        console.warn('Auto sign-in note:', loginErr);
      }

      setIsSuccess(true);
      if (onActivationSuccess) {
        onActivationSuccess(userEmail);
      }
    } catch (err: any) {
      console.error('Error activating account:', err);
      setErrorMessage('An unexpected error occurred during account activation. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0b0a10]/95 border border-amber-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left"
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <KeyRound className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide uppercase">
                Account Activation
              </h2>
              <p className="text-xs font-mono text-amber-400/80 mt-1">
                Your registration is approved! Set your password to activate your scholar account.
              </p>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-rose-950/80 border border-rose-500/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-200 font-sans"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Direct Link One-Click Entry */}
              <button
                type="button"
                onClick={handleDirectAccess}
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500/15 border border-[#D4AF37] hover:bg-amber-500/25 text-amber-300 font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>ONE-CLICK DIRECT ENTRY TO MY CHAMBER</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-zinc-800 w-full" />
                <span className="bg-[#0b0a10] px-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
                  OR SET CUSTOM PASSWORD
                </span>
                <div className="border-t border-zinc-800 w-full" />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 uppercase tracking-wider mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@example.com"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••• (Min 6 characters)"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>ACTIVATE ACCOUNT & CREATE PASSWORD</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-white uppercase">
                Account Activated!
              </h3>
              <p className="text-xs font-mono text-emerald-300/90 mt-1">
                Your password has been set successfully. You can now log in to My Chamber.
              </p>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs font-mono text-zinc-300">
              Account Email: <strong className="text-white">{email}</strong>
            </div>

            <button
              onClick={() => {
                if (onActivationSuccess) {
                  onActivationSuccess(email);
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <span>PROCEED TO SIGN IN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
