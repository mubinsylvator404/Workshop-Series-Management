import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { getSupabase } from '../services/supabaseClient';
import { LogIn, UserPlus, ShieldCheck, AlertCircle, Loader2, KeyRound, Mail, User, ArrowLeft, Send, Phone, Building, CreditCard, Sparkles, Copy, Check } from 'lucide-react';

interface AcademyAuthProps {
  initialMode?: 'login' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export default function AcademyAuth({ initialMode = 'login', onSuccess }: AcademyAuthProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('Moulvibazar Govt College');
  const [transactionId, setTransactionId] = useState('');
  const [copiedBkash, setCopiedBkash] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const bkashNumber = "01787543379";

  const handleCopyBkash = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (mode !== 'forgot' && !password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!phone.trim()) {
        setErrorMessage('Please enter your phone number.');
        return;
      }
      if (!transactionId.trim()) {
        setErrorMessage('Please enter your bKash Transaction ID.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        // Submit full registration record to Supabase registrations table
        const supabase = getSupabase() as any;
        if (supabase) {
          try {
            await supabase.from('registrations').insert({
              full_name: fullName.trim(),
              email: cleanEmail,
              phone: phone.trim(),
              institution: institution.trim() || 'Moulvibazar Govt College',
              bkash_trx_id: transactionId.trim().toUpperCase(),
              approval_status: 'pending',
              status: 'pending'
            });
          } catch (regErr) {
            console.warn('Note on Supabase registration during sign up:', regErr);
          }
        }

        // Save local storage fallback cache
        try {
          const regRecord = {
            id: `reg_${Date.now()}`,
            fullName: fullName.trim(),
            full_name: fullName.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            institution: institution.trim() || 'Moulvibazar Govt College',
            bkash_trx_id: transactionId.trim().toUpperCase(),
            transactionId: transactionId.trim().toUpperCase(),
            approvalStatus: 'Pending',
            approval_status: 'Pending',
            status: 'Pending',
            chamberAccess: false,
            created_at: new Date().toISOString()
          };
          localStorage.setItem(`mds_registration_${cleanEmail}`, JSON.stringify(regRecord));
        } catch (lsErr) {
          console.warn('Note on local storage cache:', lsErr);
        }

        const res = await signUp(cleanEmail, password, fullName.trim());
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setInfoMessage('🎉 Registration & Account Request Received! Status: PENDING ADMIN APPROVAL. Once the administrator reviews your payment details, your activation link will be sent directly to your Gmail.');
          setMode('login');
          if (onSuccess) onSuccess();
        }
      } else if (mode === 'login') {
        const res = await signIn(cleanEmail, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          if (onSuccess) onSuccess();
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(cleanEmail);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setInfoMessage('Password reset instructions have been sent to your email address.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0b0a10] border border-amber-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Subtle Ambient Gold Gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {mode === 'signup' ? 'Create Scholar Account' : mode === 'forgot' ? 'Reset Password' : 'Portal Sign In'}
          </h2>
          <p className="text-xs text-zinc-400 font-serif mt-1">
            {mode === 'signup' 
              ? 'Join the Moulvibazar Debating Society Portal' 
              : mode === 'forgot'
              ? 'Enter your registered email to receive reset instructions'
              : 'Enter your credentials to access your academy chamber'}
          </p>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-xs text-rose-300 font-mono"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </motion.div>
        )}

        {infoMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-300 font-mono"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>{infoMessage}</div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abdullah Ahmed"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500/60 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01700000000"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500/60 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Institution / School / College
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Moulvibazar Govt College"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500/60 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* bKash Payment Info Box */}
              <div className="bg-gradient-to-r from-pink-950/40 via-amber-950/20 to-zinc-950 border border-pink-500/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-pink-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-pink-400" />
                    <span>BKASH PAYMENT NUMBER</span>
                  </span>
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded text-[10px] font-mono font-bold">
                    Send Money: ৳200
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-black/60 border border-pink-500/20 rounded-lg p-2.5">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono block">bKash Personal Number:</span>
                    <span className="text-sm font-mono font-bold text-white tracking-widest">{bkashNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyBkash}
                    className="px-2.5 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedBkash ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Number</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
                  💡 Send ৳200 via bKash <strong className="text-pink-300">Send Money</strong> to <strong className="text-white">{bkashNumber}</strong>, then enter the 10-digit TrxID below.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-amber-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>bKash Transaction ID (TrxID)</span>
                  <span className="text-[10px] text-zinc-500 lowercase">bKash Merchant/Personal Payment</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. BKS98765432"
                    className="w-full bg-[#050409] border border-amber-500/40 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-amber-200 font-mono placeholder-zinc-600 focus:outline-none transition-colors uppercase"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@domain.com"
                className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500/60 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMessage(null); setInfoMessage(null); }}
                    className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500/60 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-display font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : mode === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            ) : mode === 'forgot' ? (
              <>
                <Send className="w-4 h-4" />
                Send Reset Link
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center">
          {mode === 'signup' ? (
            <p className="text-xs text-zinc-400 font-serif">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); setInfoMessage(null); }}
                className="text-amber-400 hover:text-amber-300 font-mono font-medium underline underline-offset-4 cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          ) : mode === 'forgot' ? (
            <p className="text-xs text-zinc-400 font-serif flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); setInfoMessage(null); }}
                className="text-amber-400 hover:text-amber-300 font-mono font-medium flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </button>
            </p>
          ) : (
            <p className="text-xs text-zinc-400 font-serif">
              New candidate?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); setInfoMessage(null); }}
                className="text-amber-400 hover:text-amber-300 font-mono font-medium underline underline-offset-4 cursor-pointer ml-1"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
