import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CompleteRegistration from './CompleteRegistration';
import ApplicationStatus, { ApplicationData } from './ApplicationStatus';
import { FileText, Search } from 'lucide-react';

interface RegistrationFormProps {
  onRegisterSuccess: (studentData: any) => void;
}

export default function RegistrationForm({ onRegisterSuccess }: RegistrationFormProps) {
  const [activeTab, setActiveTab] = useState<'apply' | 'status'>('apply');
  const [submittedData, setSubmittedData] = useState<ApplicationData | null>(null);

  const handleRegistrationComplete = (regData: any) => {
    setSubmittedData(regData || { approvalStatus: 'Pending', status: 'Pending' });
    setActiveTab('status');
    onRegisterSuccess({ approvalStatus: 'Pending', chamberAccess: false, ...regData });
  };

  return (
    <div id="wizard-admission-container" className="py-8 px-4 max-w-3xl mx-auto relative">
      {/* Top Navigation Bar for Form vs Status Check */}
      <div className="flex items-center justify-center gap-2 mb-8 bg-[#0b0a10]/90 border border-amber-500/30 p-1.5 rounded-2xl max-w-md mx-auto shadow-lg backdrop-blur-md">
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'apply'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>New Application</span>
        </button>

        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'status'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Check Status</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'apply' ? (
          <motion.div
            key="apply-tab"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <CompleteRegistration
              onSuccess={(regData) => {
                handleRegistrationComplete(regData);
              }}
              onGoToDashboard={() => {
                handleRegistrationComplete(null);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="status-tab"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <ApplicationStatus
              initialData={submittedData}
              initialEmail={submittedData?.email || ''}
              onApplyNew={() => setActiveTab('apply')}
              onGoToActivation={(email, token) => {
                window.location.href = `/?activate_email=${encodeURIComponent(email)}&activate_token=${encodeURIComponent(token)}`;
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


