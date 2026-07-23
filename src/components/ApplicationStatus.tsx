import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getSupabase } from '../services/supabaseClient';
import { Clock, ShieldCheck, AlertCircle, RefreshCw, Search, CheckCircle2, User, Mail, CreditCard, School, Sparkles, KeyRound } from 'lucide-react';

export interface ApplicationData {
  id?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  institution?: string;
  debateFormat?: string;
  debate_format?: string;
  transactionId?: string;
  bkash_trx_id?: string;
  approvalStatus?: string;
  approval_status?: string;
  status?: string;
  joinedAt?: string;
  created_at?: string;
  activationToken?: string;
  activation_token?: string;
}

interface ApplicationStatusProps {
  initialData?: ApplicationData | null;
  initialEmail?: string;
  onApplyNew?: () => void;
  onGoToActivation?: (email: string, token: string) => void;
}

export default function ApplicationStatus({ initialData, initialEmail = '', onApplyNew, onGoToActivation }: ApplicationStatusProps) {
  const [searchEmail, setSearchEmail] = useState<string>(initialData?.email || initialEmail);
  const [appData, setAppData] = useState<ApplicationData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Auto-fetch if initialEmail provided without initialData
  useEffect(() => {
    if (initialEmail && !appData) {
      fetchStatus(initialEmail);
    }
  }, [initialEmail]);

  const fetchStatus = async (queryEmail: string) => {
    const q = queryEmail.trim().toLowerCase();
    if (!q) return;

    setIsLoading(true);
    setSearchError(null);
    setStatusMessage(null);

    try {
      const supabase = getSupabase() as any;
      if (supabase) {
        const { data: found, error } = await supabase
          .from('registrations')
          .select('*')
          .or(`email.eq.${q},bkash_trx_id.eq.${q}`)
          .maybeSingle();

        if (found && !error) {
          setAppData(found);
          setStatusMessage('Real-time application status updated from database.');
          setIsLoading(false);
          return;
        }
      }

      // If initialData exists and matches, keep it
      if (appData && (appData.email?.toLowerCase() === q || appData.transactionId?.toLowerCase() === q || appData.bkash_trx_id?.toLowerCase() === q)) {
        setStatusMessage('Status checked. Application is currently under review.');
      } else {
        setSearchError('No application found for this Email or Transaction ID. Please verify your details.');
      }
    } catch (err) {
      console.error('Error checking application status:', err);
      setSearchError('Failed to fetch status. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      fetchStatus(searchEmail.trim());
    }
  };

  const rawStatus = (appData?.approvalStatus || appData?.approval_status || appData?.status || 'Pending').toLowerCase();
  const status = rawStatus === 'approved' ? 'approved' : rawStatus === 'rejected' ? 'rejected' : rawStatus === 'suspended' ? 'suspended' : 'pending';

  const nameStr = appData?.fullName || appData?.full_name || 'Scholar Candidate';
  const emailStr = appData?.email || searchEmail;
  const trxStr = appData?.transactionId || appData?.bkash_trx_id || 'bKash Verified';
  const instStr = appData?.institution || 'Moulvibazar Govt College';
  const formatStr = appData?.debateFormat || appData?.debate_format || 'BP';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0b0a10]/95 border border-amber-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left"
      >
        {/* Top Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0" />

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] rounded-full uppercase tracking-wider">
                Live Status Tracker
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide uppercase mt-1">
              Application Status
            </h2>
          </div>

          <button
            onClick={() => fetchStatus(emailStr)}
            disabled={isLoading}
            className="px-3.5 py-2 bg-zinc-900 border border-amber-500/30 hover:border-amber-500/60 rounded-xl text-amber-300 font-mono text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Quick Search Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
            Check Status by Email or bKash Trx ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Enter email address or bKash Trx ID..."
                className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchEmail.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Verify</span>
            </button>
          </div>
        </form>

        {searchError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 bg-rose-950/80 border border-rose-500/40 rounded-xl flex items-center gap-2.5 text-xs text-rose-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{searchError}</span>
          </motion.div>
        )}

        {statusMessage && !searchError && (
          <div className="mb-4 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Status Badge & Main Card */}
        <div className="bg-[#050409] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                  status === 'approved'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : status === 'rejected' || status === 'suspended'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                    : 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                }`}
              >
                {status === 'approved' ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                ) : status === 'rejected' || status === 'suspended' ? (
                  <AlertCircle className="w-6 h-6 text-rose-400" />
                ) : (
                  <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                )}
              </div>

              <div>
                <span
                  className={`px-3 py-1 border font-mono text-[10px] rounded-full uppercase tracking-wider ${
                    status === 'approved'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                      : status === 'rejected' || status === 'suspended'
                      ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                      : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {status === 'approved'
                    ? 'Approved & Enrolled'
                    : status === 'rejected'
                    ? 'Application Rejected'
                    : status === 'suspended'
                    ? 'Account Suspended'
                    : 'Pending Admin Review'}
                </span>

                <h3 className="text-lg font-serif font-bold text-white uppercase mt-1">
                  {status === 'approved'
                    ? 'ADMISSION CONFIRMED'
                    : status === 'rejected'
                    ? 'APPLICATION REJECTED'
                    : status === 'suspended'
                    ? 'ACCOUNT SUSPENDED'
                    : 'APPLICATION SAVED AS PENDING'}
                </h3>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-zinc-400">
              <div className="text-[10px] uppercase text-zinc-500">Registration ID</div>
              <div className="text-amber-300 font-bold">{appData?.id || 'PENDING-VERIFICATION'}</div>
            </div>
          </div>

          {/* Visual Step Process Tracker */}
          <div className="py-2 border-y border-zinc-800/80">
            <div className="text-[11px] font-mono text-zinc-400 mb-3 uppercase tracking-wider">
              Application Progress Lifecycle
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              {/* Step 1 */}
              <div className="p-2 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-emerald-300">
                <div className="font-bold flex items-center justify-center gap-1 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Step 1</span>
                </div>
                <div>Submitted</div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-2 border rounded-xl ${
                  status === 'approved'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : status === 'rejected' || status === 'suspended'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-300 animate-pulse'
                }`}
              >
                <div className="font-bold flex items-center justify-center gap-1 mb-1">
                  {status === 'approved' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-amber-400" />
                  )}
                  <span>Step 2</span>
                </div>
                <div>Admin Review</div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-2 border rounded-xl ${
                  status === 'approved'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                <div className="font-bold flex items-center justify-center gap-1 mb-1">
                  {status === 'approved' ? (
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <KeyRound className="w-3 h-3 text-zinc-500" />
                  )}
                  <span>Step 3</span>
                </div>
                <div>Account Setup</div>
              </div>
            </div>
          </div>

          {/* Applicant & Payment Summary details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-zinc-300">
            <div className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <User className="w-3 h-3 text-amber-400" />
                <span>Participant Name</span>
              </div>
              <div className="text-white font-bold truncate">{nameStr}</div>
            </div>

            <div className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <Mail className="w-3 h-3 text-amber-400" />
                <span>Contact Email</span>
              </div>
              <div className="text-amber-300 font-bold truncate">{emailStr}</div>
            </div>

            <div className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-amber-400" />
                <span>bKash Transaction ID</span>
              </div>
              <div className="text-amber-300 font-bold">{trxStr}</div>
            </div>

            <div className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <School className="w-3 h-3 text-amber-400" />
                <span>Institution & Format</span>
              </div>
              <div className="text-white truncate">{instStr} ({formatStr})</div>
            </div>
          </div>

          {/* Real-time Guidance / Workflow Notice */}
          {status === 'pending' && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-200/90 space-y-2 leading-relaxed">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Application Pending Admin Review</span>
                </div>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded border border-pink-500/30">
                  bKash: 01787543379 (৳200)
                </span>
              </div>
              <p>
                Your registration data and bKash payment transaction (<strong className="text-amber-300">{trxStr}</strong>) are safely recorded for review against bKash number <strong className="text-pink-300">01787543379</strong>.
              </p>
              <p>
                As soon as an administrator verifies your payment, an <strong>Account Activation & Password Setup link</strong> will be sent to your Gmail (<strong className="text-white">{emailStr}</strong>).
              </p>
            </div>
          )}

          {status === 'approved' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-200 space-y-2 leading-relaxed">
              <div className="font-bold text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Application Approved! Account Ready for Activation</span>
              </div>
              <p>
                Congratulations! Your application and payment have been verified by administration. You can now set up your account password and access <strong>My Chamber</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
          {onApplyNew && (
            <button
              onClick={onApplyNew}
              className="px-4 py-2.5 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider cursor-pointer transition-all"
            >
              + Submit New Application
            </button>
          )}

          {status === 'approved' && onGoToActivation && (
            <button
              onClick={() => onGoToActivation(emailStr, appData?.activationToken || appData?.activation_token || '')}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-2 ml-auto"
            >
              <KeyRound className="w-4 h-4" />
              <span>Activate Account / Set Password</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
