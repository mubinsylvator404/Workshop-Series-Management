import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Lock, Mail, ShieldCheck, KeyRound, Sparkles, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { loginAdmin, addToast } = useCms();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in both email and password.', 'error');
      return;
    }
    setLoading(true);
    const success = await loginAdmin(email, password);
    setLoading(false);
    if (success) {
      onLoginSuccess();
    }
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Password reset instructions sent to ${resetEmail}.`, 'info');
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-[#040308] text-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-royal-gold/10 blur-[130px] rounded-full" />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#0f0c1e] to-[#070510] border border-royal-gold/30 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
        
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-royal-gold/10 border border-royal-gold/40 flex items-center justify-center text-royal-gold shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-white uppercase tracking-wider">
              MDS Admin Portal
            </h1>
            <p className="font-mono text-xs text-amber-200/70 mt-1">
              Protected Chancellor Dashboard • /admin
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-300">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mdsworkshop@gmail.com"
                className="w-full bg-black/60 border border-white/15 focus:border-royal-gold rounded-xl pl-10 pr-4 py-3 text-sm font-sans text-white placeholder:text-zinc-600 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-[10px] font-mono text-royal-gold hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-white/15 focus:border-royal-gold rounded-xl pl-10 pr-4 py-3 text-sm font-sans text-white placeholder:text-zinc-600 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-royal-gold hover:bg-amber-300 text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <a
            href="/"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            ← Return to Public Site
          </a>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0817] border border-royal-gold/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-royal-gold">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-display font-bold text-base text-white uppercase">Reset Admin Password</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Enter your registered administrator email to receive password recovery instructions or reset token.
            </p>
            <form onSubmit={handleResetRequest} className="space-y-3">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white"
                required
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-royal-gold text-midnight font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
