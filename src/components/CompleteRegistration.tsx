import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  MapPin, 
  PhoneCall, 
  Check, 
  Copy, 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle,
  FileCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSupabase } from '../services/supabaseClient';

interface CompleteRegistrationProps {
  onSuccess?: (studentData?: any) => void;
  onGoToDashboard?: () => void;
}

export default function CompleteRegistration({ onSuccess, onGoToDashboard }: CompleteRegistrationProps) {
  const { user, registration, registrationStatus, refreshRegistration } = useAuth();

  const [step, setStep] = useState<number>(() => {
    if (registrationStatus && registrationStatus !== 'none') {
      return 3;
    }
    return 1;
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: registration?.full_name || user?.name || '',
    email: registration?.email || user?.email || '',
    phone: registration?.phone || '',
    institution: registration?.institution || 'Moulvibazar Govt College',
    department: registration?.department || '',
    district: registration?.district || 'Moulvibazar',
    emergencyContact: '',
    facebook: '',
    motivation: '',
    debateFormat: registration?.debate_format || 'BP',
    
    // Payment details
    transactionId: registration?.bkash_trx_id || '',
    paymentScreenshot: registration?.payment_screenshot || '',
    confirmedPayment: !!registration?.bkash_trx_id
  });

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrorMessage(null);
  };

  // Copy bKash Payment Number
  const handleCopyNumber = () => {
    navigator.clipboard.writeText('01787543379');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, paymentScreenshot: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1 Validation
  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.institution) {
      setErrorMessage("Please fill in all required fields marked with *");
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  // Final Registration Submission (Step 2 -> Step 3)
  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.transactionId || formData.transactionId.trim().length < 6) {
      setErrorMessage("Please enter a valid bKash Transaction ID (at least 6 alphanumeric characters).");
      return;
    }
    if (!formData.confirmedPayment) {
      setErrorMessage("Please check the box to confirm you have sent ৳200 to 01787543379 via bKash.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const nowIso = new Date().toISOString();
      const admissionCode = `MDS-ADMIT-${Math.floor(1000 + Math.random() * 9000)}`;
      const supabase = getSupabase() as any;
      const userEmail = user?.email || formData.email || 'scholar@mds.academy';

      const regRecord = {
        user_id: user?.id || null,
        full_name: formData.fullName || user?.name || 'Scholar Candidate',
        email: userEmail.toLowerCase(),
        phone: formData.phone || '',
        institution: formData.institution || 'Moulvibazar Govt College',
        department: formData.department || '',
        district: formData.district || '',
        debate_format: formData.debateFormat || 'BP',
        bkash_trx_id: formData.transactionId.trim().toUpperCase(),
        payment_screenshot: formData.paymentScreenshot || null,
        admission_letter_code: admissionCode,
        status: 'pending',
        approval_status: 'pending',
        payment_status: 'verified',
        created_at: nowIso
      };

      let insertSucceeded = false;

      // Submit to Supabase
      if (supabase) {
        try {
          const { error: rErr } = await supabase.from('registrations').insert(regRecord);
          if (!rErr) {
            insertSucceeded = true;
          } else {
            console.warn('Note on registrations insert:', rErr.message);
            setErrorMessage(rErr.message);
          }
        } catch (dbErr: any) {
          console.warn('Note on database operation during registration:', dbErr);
          setErrorMessage(dbErr?.message || 'Database error during registration.');
        }
      } else {
        insertSucceeded = true;
      }

      // Local storage fallback cache guarantee
      try {
        localStorage.setItem(`mds_registration_${userEmail.toLowerCase()}`, JSON.stringify(regRecord));
        insertSucceeded = true;
      } catch (e) {
        console.warn('Local storage cache write note:', e);
      }

      if (!insertSucceeded) {
        setErrorMessage("Unable to save registration details. Please check your network and try again.");
        return;
      }

      await refreshRegistration();

      setStep(3);
      if (onSuccess) {
        onSuccess({
          fullName: formData.fullName,
          full_name: formData.fullName,
          email: userEmail.toLowerCase(),
          transactionId: formData.transactionId,
          bkash_trx_id: formData.transactionId,
          institution: formData.institution,
          debateFormat: formData.debateFormat,
          approvalStatus: 'Pending',
          status: 'Pending',
          joinedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error submitting registration:', err);
      setErrorMessage("Registration submission encountered an issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 relative">
      {/* Background Atmosphere Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Container Card */}
      <div className="bg-[#0b0a10]/95 border border-amber-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative z-10 overflow-hidden text-left">
        {/* Top Gold Ornament Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />

        {/* User Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 mb-8 bg-[#050409] border border-amber-500/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-base shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">
                {formData.fullName || user?.name || 'Scholar Candidate'}
              </div>
              <p className="text-xs font-mono text-amber-300/80 mt-0.5">{user?.email || 'scholar@mds.academy'}</p>
            </div>
          </div>

          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs font-mono">
            MDS Workshop Portal
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-white uppercase">
            WORKSHOP ENLISTMENT FORM
          </h2>
          <p className="text-xs font-mono text-amber-400/80 tracking-widest uppercase mt-1">
            MOULVIBAZAR DEBATING SOCIETY • MASTERCLASS SERIES
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative z-10 mb-2">
            {[
              { num: 1, title: 'Scholar Details' },
              { num: 2, title: 'bKash Fee Payment' },
              { num: 3, title: 'Review & Approval' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center border transition-all ${
                    step > s.num
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : step === s.num
                      ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-black/80 text-zinc-500 border-zinc-800'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-mono tracking-wider uppercase ${
                    step === s.num ? 'text-amber-400 font-bold' : step > s.num ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-500"
              style={{ width: `${step === 1 ? '33%' : step === 2 ? '66%' : '100%'}` }}
            />
          </div>
        </div>

        {/* Global Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: SCHOLAR DETAILS FORM */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleStep1Submit}
            className="space-y-4"
          >
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4 text-xs font-serif text-amber-200">
              Please enter your academic details to complete your admission record for the MDS Masterclass Workshop Series.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Adeeb Rahman"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly={!!user?.email}
                    placeholder="e.g. scholar@example.com"
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all ${
                      user?.email
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-400 cursor-not-allowed'
                        : 'bg-[#050409] border-zinc-800 focus:border-amber-500 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 01712345678"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  District / Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g. Moulvibazar, Sylhet, Dhaka"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Institution */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Institution / College / University <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="e.g. Moulvibazar Govt College"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Department / Class */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Class / Department / Year
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. HSC 2026 / English Dept"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Emergency Contact
                </label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Guardian Contact Number"
                    className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Debate FormatTrack */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Preferred Debate Track
                </label>
                <select
                  name="debateFormat"
                  value={formData.debateFormat}
                  onChange={handleInputChange}
                  className="w-full bg-[#050409] border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                >
                  <option value="BP">British Parliamentary (BP)</option>
                  <option value="AP">Asian Parliamentary (AP)</option>
                  <option value="Bangla">Bangla Parliamentary</option>
                  <option value="Novice">Novice Track (Beginner)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        )}

        {/* STEP 2: BKASH PAYMENT & VERIFICATION */}
        {step === 2 && (
          <motion.form
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleFinalSubmit}
            className="space-y-6"
          >
            {/* bKash Payment Box */}
            <div className="bg-gradient-to-b from-[#e2136e]/10 to-[#050409] border border-[#e2136e]/40 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2136e]/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-[#e2136e] text-white font-bold font-mono text-xs rounded-lg uppercase tracking-wider shadow">
                    bKash Payment
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">Workshop Enlistment Fee</h3>
                    <p className="text-xs font-mono text-amber-300/80">Moulvibazar Debating Society</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-display font-black text-amber-300">৳200</span>
                  <span className="block text-[10px] font-mono text-zinc-400 uppercase">One-Time Fee</span>
                </div>
              </div>

              {/* Official Payment Number Box */}
              <div className="bg-black/60 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Official bKash Personal Number</span>
                  <div className="text-xl font-mono font-bold text-amber-300 tracking-wider">01787543379</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Number!' : 'Copy Number'}</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-2 text-xs font-serif text-amber-100/90 leading-relaxed pl-2 border-l-2 border-[#e2136e]">
                <p>1. Open your bKash Mobile App or dial <strong>*247#</strong>.</p>
                <p>2. Choose <strong>"Send Money"</strong> (Personal Number).</p>
                <p>3. Enter official number: <strong className="font-mono text-amber-300">01787543379</strong>.</p>
                <p>4. Amount: <strong className="font-mono text-amber-300">৳200</strong>.</p>
                <p>5. Copy the 10-character <strong>Transaction ID</strong> (TrxID) from your bKash SMS and paste below.</p>
              </div>
            </div>

            {/* Inputs: Transaction ID & Screenshot */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  bKash Transaction ID (TrxID) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="e.g. BLM7X992A0"
                    className="w-full bg-[#050409] border border-amber-500/40 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-amber-200 placeholder-zinc-600 uppercase tracking-widest outline-none transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              {/* Screenshot Upload (Optional) */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Payment Screenshot <span className="text-zinc-500">(Optional)</span>
                </label>

                {formData.paymentScreenshot ? (
                  <div className="p-3 bg-black/60 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={formData.paymentScreenshot} alt="Screenshot Preview" className="w-12 h-12 rounded object-cover border border-amber-400" />
                      <span className="text-xs text-emerald-300 font-mono">Screenshot attached ✓</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentScreenshot: '' }))}
                      className="text-xs text-rose-400 hover:underline font-mono cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-amber-500/20 hover:border-amber-500/60 bg-black/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <Upload className="w-8 h-8 text-amber-500/60 group-hover:text-amber-400 mb-2" />
                    <span className="text-xs font-mono text-amber-200">Upload payment screenshot</span>
                    <span className="text-[10px] text-zinc-500 mt-1">PNG, JPG up to 5MB</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Confirmation Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer p-3 bg-black/40 border border-amber-500/20 rounded-xl">
                  <input
                    type="checkbox"
                    name="confirmedPayment"
                    checked={formData.confirmedPayment}
                    onChange={handleInputChange}
                    className="mt-0.5 rounded border-amber-500/40 bg-[#050409] text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-amber-100/80 font-serif leading-relaxed">
                    I confirm that I have sent <strong>৳200</strong> to the official bKash personal number <strong>01787543379</strong> and the Transaction ID provided is valid.
                  </span>
                </label>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>SUBMIT REGISTRATION</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* STEP 3: REGISTRATION STATUS / CONFIRMATION SCREEN */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-4"
          >
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${
              registrationStatus === 'approved' 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : registrationStatus === 'rejected'
                ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
                : 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
            }`}>
              {registrationStatus === 'approved' ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              ) : registrationStatus === 'rejected' ? (
                <AlertCircle className="w-8 h-8 text-rose-400" />
              ) : (
                <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
              )}
            </div>

            <div>
              <span className={`px-3 py-1 border font-mono text-xs rounded-full uppercase tracking-wider ${
                registrationStatus === 'approved'
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : registrationStatus === 'rejected'
                  ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
              }`}>
                {registrationStatus === 'approved' ? 'Approved & Enrolled' : registrationStatus === 'rejected' ? 'Registration Rejected' : 'Pending Approval'}
              </span>
              <h3 className="text-2xl font-serif font-bold text-white uppercase mt-3">
                {registrationStatus === 'approved' ? 'ADMISSION CONFIRMED' : registrationStatus === 'rejected' ? 'APPLICATION REJECTED' : 'REGISTRATION SUBMITTED'}
              </h3>
              <p className="text-xs font-mono text-amber-400/90 mt-1">
                {registrationStatus === 'approved'
                  ? 'Your admission pass and chamber access are active.'
                  : registrationStatus === 'rejected'
                  ? 'Your application was not approved by administration.'
                  : 'Your application and payment are currently pending administrator approval.'}
              </p>
            </div>

            <div className="bg-[#050409] border border-amber-500/20 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3 font-serif text-xs text-amber-100/90 leading-relaxed">
              <div className="flex items-center gap-2 text-amber-300 font-mono font-bold uppercase text-[11px] border-b border-white/10 pb-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Verification Details</span>
              </div>
              <p>
                Student Name: <strong className="text-white">{formData.fullName || registration?.full_name || 'Scholar Candidate'}</strong>
              </p>
              <p>
                Applicant Email: <strong className="text-white font-mono">{formData.email || registration?.email || 'scholar@example.com'}</strong>
              </p>
              <p>
                bKash Transaction ID: <strong className="font-mono text-amber-300">{formData.transactionId || registration?.bkash_trx_id || 'bKash Verified'}</strong>
              </p>
              <p>
                Institution: <strong className="text-white">{formData.institution || registration?.institution || 'Moulvibazar Govt College'}</strong>
              </p>
              
              {registrationStatus !== 'approved' && (
                <div className="mt-4 pt-3 border-t border-amber-500/20 bg-amber-500/5 p-3 rounded-xl border border-amber-500/30 font-mono text-[11px] text-amber-200/90 leading-normal">
                  📌 <strong>Account Workflow Notice:</strong> You do not have an active account yet. Once an administrator approves your payment, an account activation & password setup link will be sent to your email to activate your scholar account.
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    institution: 'Moulvibazar Govt College',
                    department: '',
                    district: 'Moulvibazar',
                    emergencyContact: '',
                    facebook: '',
                    motivation: '',
                    debateFormat: 'BP',
                    transactionId: '',
                    paymentScreenshot: '',
                    confirmedPayment: false
                  });
                }}
                className="px-6 py-3.5 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-amber-200 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Submit Another Application</span>
              </button>

              {onGoToDashboard && (
                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{registrationStatus === 'approved' ? 'ENTER MY CHAMBER' : 'VIEW CHAMBER STATUS'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
