import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  CheckCircle2, 
  Play, 
  X, 
  Download, 
  User, 
  Mail, 
  Award, 
  RefreshCw, 
  LogOut, 
  ShieldCheck, 
  Video, 
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StudentProfile } from '../types';
import { useCms } from '../context/CmsContext';
import { useAuth } from '../context/AuthContext';
import AcademyAuth from './AcademyAuth';
import CompleteRegistration from './CompleteRegistration';
import ApplicationStatus from './ApplicationStatus';
import { getSupabase } from '../services/supabaseClient';

interface MyChamberProps {
  onNavigateToRegister?: () => void;
}

export default function MyChamber({ onNavigateToRegister }: MyChamberProps) {
  const { cms: cmsData } = useCms();
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading, 
    registration, 
    registrationStatus, 
    signOut, 
    refreshRegistration 
  } = useAuth();

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync Auth state and registration record into StudentProfile format
  useEffect(() => {
    if (user) {
      const isApproved = registrationStatus === 'approved';
      let savedCompleted: number[] = [];
      let savedCourseCompleted = false;

      try {
        const saved = localStorage.getItem(`mds_student_session_${user.email}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.completedSessions)) {
            savedCompleted = parsed.completedSessions;
          }
          if (typeof parsed.courseCompleted === 'boolean') {
            savedCourseCompleted = parsed.courseCompleted;
          }
        }
      } catch (e) {
        console.warn('LocalStorage session parse error:', e);
      }

      const mappedStudent: StudentProfile = {
        id: user.id,
        fullName: registration?.full_name || user.name || 'MDS Scholar',
        email: user.email,
        institution: registration?.institution || 'Moulvibazar Debating Society',
        debateFormat: registration?.debate_format || 'BP',
        experienceYears: registration?.experience_years || 1,
        xp: 250,
        coins: 100,
        crystals: 2,
        rank: 'Scholar',
        achievements: [],
        streak: 1,
        joinedAt: registration?.created_at || new Date().toISOString(),
        admissionLetterCode: registration?.admission_letter_code || 'MDS-ADMIT-1001',
        approvalStatus: isApproved ? 'Approved' : registrationStatus === 'rejected' ? 'Rejected' : 'Pending',
        chamberAccess: isApproved,
        courseCompleted: savedCourseCompleted || savedCompleted.length >= 10,
        completedSessions: savedCompleted
      };
      setStudent(mappedStudent);
    } else {
      setStudent(null);
    }
  }, [user, registration, registrationStatus]);

  // Selected session for video modal
  const [activeSessionVideo, setActiveSessionVideo] = useState<{
    sessionNumber: number;
    title: string;
    assignedSpeaker: string;
    embedUrl: string;
    videoType: 'youtube' | 'gdrive';
  } | null>(null);

  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'jpg' | null>(null);

  // Handle Logout
  const handleLogout = async () => {
    await signOut();
    setStudent(null);
  };

  // Toggle completed session
  const handleToggleSessionComplete = async (sessionNumber: number) => {
    if (!student) return;

    const currentCompleted = student.completedSessions || [];
    const updatedCompleted = currentCompleted.includes(sessionNumber)
      ? currentCompleted.filter((s) => s !== sessionNumber)
      : [...currentCompleted, sessionNumber];

    const updatedStudent: StudentProfile = {
      ...student,
      completedSessions: updatedCompleted,
      courseCompleted: updatedCompleted.length >= 10 || student.courseCompleted
    };

    setStudent(updatedStudent);
    localStorage.setItem(`mds_student_session_${student.email}`, JSON.stringify(updatedStudent));
    localStorage.setItem('mds_student_session', JSON.stringify(updatedStudent));
  };

  // Helper to format embed URL safely
  const getEmbedUrl = (url: string) => {
    if (!url) return 'https://www.youtube.com/embed/S2C_A3S8k8I';
    
    // YouTube watch link conversion
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // Google Drive share link conversion
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.split('/file/d/')[1]?.split('/')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  // Generate Certificate JPG Canvas
  const handleDownloadJPG = () => {
    if (!student) return;
    setDownloadingFormat('jpg');

    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Dark Gold / Parchment Background
      ctx.fillStyle = '#06050b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold Outer Border
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // Inner Fine Gold Line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      // Certificate Header
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('MOULVIBAZAR DEBATING SOCIETY', canvas.width / 2, 160);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 54px serif';
      ctx.fillText(cmsData.certificate?.title || 'CERTIFICATE OF DEBATE MASTERY', canvas.width / 2, 280);

      // Subtitle
      ctx.fillStyle = '#94A3B8';
      ctx.font = '24px sans-serif';
      ctx.fillText('THIS IS TO CERTIFY THAT THE SCHOLAR', canvas.width / 2, 380);

      // Student Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 64px serif';
      ctx.fillText(student.fullName.toUpperCase(), canvas.width / 2, 480);

      // Divider Line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 300, 520);
      ctx.lineTo(canvas.width / 2 + 300, 520);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Certificate Body Text
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '26px sans-serif';
      ctx.fillText(
        cmsData.certificate?.subtitle ||
          'has successfully completed the 10-Session Elite Masterclass Series in WUDC & Parliamentary Debate',
        canvas.width / 2,
        600
      );

      ctx.font = '22px sans-serif';
      ctx.fillText(`Admission ID: ${student.admissionLetterCode} • Email: ${student.email}`, canvas.width / 2, 660);

      // MDS Seal Badge
      ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 850, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 22px serif';
      ctx.fillText('OFFICIAL SEAL', canvas.width / 2, 840);
      ctx.font = 'bold 26px serif';
      ctx.fillText('MDS', canvas.width / 2, 875);

      // Signatory Section
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'italic bold 32px serif';
      ctx.fillText(cmsData.certificate?.signatoryName || 'MDS Chancellor', canvas.width / 2 - 400, 1120);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '20px sans-serif';
      ctx.fillText(cmsData.certificate?.signatoryTitle || 'MDS Executive Committee', canvas.width / 2 - 400, 1160);

      // Date Section
      const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 28px serif';
      ctx.fillText(issueDate, canvas.width / 2 + 400, 1120);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '20px sans-serif';
      ctx.fillText('Date of Completion', canvas.width / 2 + 400, 1160);

      // Convert to image and trigger download
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `Certificate_${student.fullName.replace(/\s+/g, '_')}_MDS.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
        setDownloadingFormat(null);
      }, 500);
    }
  };

  // Trigger Print for PDF Download
  const handleDownloadPDF = () => {
    window.print();
  };

  // Default Session Videos fallback array from CMS or default state
  const sessions = cmsData.sessionVideos && cmsData.sessionVideos.length === 10 
    ? cmsData.sessionVideos 
    : Array.from({ length: 10 }, (_, i) => ({
        id: `session-${i + 1}`,
        sessionNumber: i + 1,
        title: cmsData.workshops?.[i]?.title || `Session 0${i + 1}: Debate Mastery`,
        assignedSpeaker: cmsData.speakers?.[i % (cmsData.speakers?.length || 1)]?.name || 'MDS Trainer',
        videoType: 'youtube' as const,
        embedUrl: 'https://www.youtube.com/embed/S2C_A3S8k8I'
      }));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#040308] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <p className="text-amber-200/70 font-mono text-sm tracking-widest uppercase">Verifying Chamber Credentials...</p>
        </div>
      </div>
    );
  }

  // ================= STATE 1: UNAUTHENTICATED (LOGIN / REGISTER PORTAL) =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-[#040308] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Soft Gold Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <AcademyAuth 
          initialMode="login"
          onSuccess={() => {
            refreshRegistration();
          }}
        />
      </div>
    );
  }

  // ================= STATE 2: REJECTED OR SUSPENDED ACCESS =================
  if (registrationStatus === 'rejected' || registrationStatus === 'suspended') {
    const isRejected = registrationStatus === 'rejected';

    return (
      <div className="min-h-[85vh] bg-[#040308] flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl bg-[#0b0a10]/95 border border-amber-500/30 rounded-2xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl text-center relative z-10"
        >
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-6 ${
            isRejected 
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' 
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
          }`}>
            <RefreshCw className={`w-3.5 h-3.5 ${isRejected ? '' : 'animate-spin'}`} />
            {isRejected ? 'Registration Rejected' : 'Pending Approval'}
          </div>

          {/* Student Profile Overview */}
          <div className="mb-6 pb-6 border-b border-amber-900/30 text-left bg-[#050409]/80 p-5 rounded-xl border border-amber-900/20">
            <h2 className="text-lg font-serif text-white font-semibold mb-1">
              {registration?.full_name || user?.name || 'Scholar Candidate'}
            </h2>
            <p className="text-xs text-amber-200/60 font-mono mb-3">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-amber-300/80">
              <span>Trx ID: <strong className="text-white">{registration?.bkash_trx_id || 'bKash Verified'}</strong></span>
              <span>•</span>
              <span>Status: <strong className={isRejected ? 'text-rose-400' : 'text-amber-400'}>{registrationStatus.toUpperCase()}</strong></span>
            </div>
          </div>

          {/* STATUS MESSAGES */}
          {isRejected ? (
            <div className="p-6 bg-rose-950/30 border border-rose-500/40 rounded-xl mb-8 text-center space-y-2">
              <p className="text-rose-200 text-base sm:text-lg font-serif tracking-wide font-medium">
                Your registration has not been approved.
              </p>
              <p className="text-xs font-mono text-zinc-400">
                Please contact MDS administration if you believe this is an error.
              </p>
            </div>
          ) : (
            <div className="p-6 bg-amber-950/30 border border-amber-500/40 rounded-xl mb-8 text-left space-y-3">
              <p className="text-amber-100 text-sm sm:text-base font-serif leading-relaxed font-medium">
                Thank you for registering.
              </p>
              <p className="text-amber-100 text-sm sm:text-base font-serif leading-relaxed">
                Your registration has been received successfully.
              </p>
              <p className="text-amber-100 text-sm sm:text-base font-serif leading-relaxed font-semibold text-amber-300">
                Your account is currently under review.
              </p>
              <p className="text-amber-200/90 text-sm sm:text-base font-serif leading-relaxed pt-1 border-t border-amber-900/40">
                You will gain access to My Chamber after an administrator approves your registration.
              </p>
            </div>
          )}

          {/* Detailed Application Information Breakdown */}
          <div className="my-6 text-left">
            <ApplicationStatus initialData={registration} initialEmail={user?.email || ''} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isRejected && (
              <button
                onClick={() => refreshRegistration()}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500/20 border border-[#D4AF37] hover:bg-amber-500/30 text-amber-200 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Check Status
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 bg-rose-950/30 border border-rose-500/30 hover:bg-rose-900/40 text-rose-300 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ================= STATE 3: APPROVED STUDENT LEARNING PORTAL =================
  if (!student) {
    return (
      <div className="min-h-screen bg-[#040308] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <p className="text-amber-200/70 font-mono text-sm tracking-widest uppercase">Loading Student Chamber...</p>
        </div>
      </div>
    );
  }

  const completedCount = student.completedSessions?.length || 0;
  const isCourseCompleted = student.courseCompleted || completedCount >= 10;

  return (
    <div className="min-h-screen bg-[#040308] text-slate-100 pb-20">
      {/* Background Subtle Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/10 via-[#040308] to-[#040308] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-12">
        
        {/* ================= 1. WELCOME HEADER ================= */}
        <div className="bg-[#0a0814]/80 border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Chamber Approved
                </span>
                <span className="text-xs font-mono text-amber-200/50">
                  ID: <strong className="text-amber-300">{student?.admissionLetterCode || 'MDS-ADMIT-1001'}</strong>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-white font-bold tracking-tight mb-2">
                Welcome, {student?.fullName || user?.name || 'MDS Scholar'}
              </h1>
              <p className="text-sm text-amber-200/70 font-sans tracking-wide">
                Elite Debate Workshop Series • Private Student Portal
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-zinc-900 border border-zinc-700/60 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="mt-8 pt-6 border-t border-amber-900/20">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-amber-200/80">
                COURSE PROGRESS: <strong className="text-[#D4AF37]">{completedCount} of 10 Workshops Completed</strong>
              </span>
              <span className="text-amber-400 font-bold">
                {Math.round((completedCount / 10) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/60 border border-amber-900/30 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / 10) * 100}%` }}
                className="h-full bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-300 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* ================= 2. WORKSHOP SESSIONS ================= */}
        <section id="workshop-sessions">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif text-white font-bold tracking-wide flex items-center gap-2">
                <Video className="w-6 h-6 text-[#D4AF37]" />
                Workshop Sessions
              </h2>
              <p className="text-xs text-amber-200/60 font-mono uppercase tracking-wider mt-1">
                Embedded Masterclass Video Stream (Sessions 01 – 10)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => {
              const isCompleted = student.completedSessions?.includes(session.sessionNumber);
              return (
                <div
                  key={session.id || session.sessionNumber}
                  className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                    isCompleted
                      ? 'bg-amber-950/10 border-amber-500/40 shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                      : 'bg-[#0a0814]/70 border-zinc-800/80 hover:border-amber-500/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[#D4AF37] font-mono text-[11px] font-bold">
                        SESSION {session.sessionNumber < 10 ? `0${session.sessionNumber}` : session.sessionNumber}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      ) : (
                        <span className="text-amber-200/40 text-xs font-mono">Available</span>
                      )}
                    </div>

                    <h3 className="text-base font-serif text-white font-semibold mb-1 line-clamp-2">
                      {session.title}
                    </h3>
                    <p className="text-xs text-amber-200/60 font-sans mb-4">
                      Speaker: <span className="text-amber-100 font-medium">{session.assignedSpeaker}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-amber-900/20">
                    <button
                      onClick={() =>
                        setActiveSessionVideo({
                          sessionNumber: session.sessionNumber,
                          title: session.title,
                          assignedSpeaker: session.assignedSpeaker,
                          embedUrl: getEmbedUrl(session.embedUrl),
                          videoType: session.videoType || 'youtube'
                        })
                      }
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-[#D4AF37]/50 hover:bg-amber-500/30 text-amber-200 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                      Watch Session
                    </button>

                    <button
                      onClick={() => handleToggleSessionComplete(session.sessionNumber)}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                      className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                          : 'bg-zinc-900 border-zinc-700/50 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 3. CERTIFICATION ================= */}
        <section id="certification">
          <div className="mb-6">
            <h2 className="text-2xl font-serif text-white font-bold tracking-wide flex items-center gap-2">
              <Award className="w-6 h-6 text-[#D4AF37]" />
              Certification
            </h2>
            <p className="text-xs text-amber-200/60 font-mono uppercase tracking-wider mt-1">
              Official MDS Masterclass Completion Certificate
            </p>
          </div>

          {!isCourseCompleted ? (
            /* LOCKED CERTIFICATE STATE */
            <div className="bg-[#0a0814]/90 border border-amber-900/40 rounded-2xl p-8 text-center relative overflow-hidden backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-serif text-white font-semibold mb-2">Certificate Locked</h3>
              <p className="text-sm text-amber-200/70 max-w-lg mx-auto mb-6">
                This certificate will become available after successfully completing the workshop series.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-950/30 border border-amber-900/50 rounded-lg text-xs font-mono text-amber-300/80">
                <span>Progress: {completedCount} / 10 Sessions</span>
              </div>
            </div>
          ) : (
            /* UNLOCKED CERTIFICATE PREVIEW STATE */
            <div className="bg-[#0a0814]/90 border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-900/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm font-serif text-amber-200 font-bold tracking-wide">
                    Certificate Unlocked & Verified
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-amber-500/20 border border-[#D4AF37] hover:bg-amber-500/30 text-amber-200 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                  <button
                    onClick={handleDownloadJPG}
                    disabled={downloadingFormat === 'jpg'}
                    className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E6C247] hover:to-[#C49F33] text-black font-semibold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {downloadingFormat === 'jpg' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Download JPG
                  </button>
                </div>
              </div>

              {/* Print-Ready Certificate Card */}
              <div className="bg-[#06050b] border-8 border-[#D4AF37] rounded-xl p-8 sm:p-12 text-center relative shadow-2xl">
                <div className="border-2 border-amber-500/30 rounded-lg p-6 sm:p-8">
                  <p className="text-xs font-serif text-[#D4AF37] tracking-[0.3em] uppercase mb-4">
                    MOULVIBAZAR DEBATING SOCIETY
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-serif text-white font-bold mb-6 tracking-wide">
                    {cmsData.certificate?.title || 'CERTIFICATE OF DEBATE MASTERY'}
                  </h2>
                  <p className="text-xs font-mono text-amber-200/60 uppercase tracking-widest mb-2">
                    THIS IS TO CERTIFY THAT THE SCHOLAR
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#D4AF37] font-bold mb-4 underline decoration-[#D4AF37]/40 underline-offset-8">
                    {student.fullName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8 font-sans leading-relaxed">
                    {cmsData.certificate?.subtitle ||
                      'has successfully completed the 10-Session Elite Masterclass Series in WUDC & Parliamentary Debate.'}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-amber-900/30 text-xs font-mono text-amber-200/70">
                    <div className="text-left">
                      <p className="text-white font-serif font-bold text-sm">
                        {cmsData.certificate?.signatoryName || 'MDS Chancellor'}
                      </p>
                      <p className="text-[11px] text-amber-200/50">
                        {cmsData.certificate?.signatoryTitle || 'Academy Chancellor'}
                      </p>
                    </div>

                    <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] bg-amber-500/10 flex items-center justify-center font-serif text-[10px] font-bold text-[#D4AF37] leading-tight">
                      MDS<br />SEAL
                    </div>

                    <div className="text-right">
                      <p className="text-white font-mono font-bold text-sm">
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-[11px] text-amber-200/50">Date of Completion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ================= 4. PROFILE ================= */}
        <section id="profile">
          <div className="mb-6">
            <h2 className="text-2xl font-serif text-white font-bold tracking-wide flex items-center gap-2">
              <User className="w-6 h-6 text-[#D4AF37]" />
              Profile
            </h2>
            <p className="text-xs text-amber-200/60 font-mono uppercase tracking-wider mt-1">
              Student Registration Record
            </p>
          </div>

          <div className="bg-[#0a0814]/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-[#040308]/60 border border-zinc-800">
                <span className="text-[11px] font-mono text-amber-200/50 uppercase tracking-wider block mb-1">
                  Student Name
                </span>
                <p className="text-base font-serif text-white font-semibold">{student.fullName}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#040308]/60 border border-zinc-800">
                <span className="text-[11px] font-mono text-amber-200/50 uppercase tracking-wider block mb-1">
                  Email
                </span>
                <p className="text-sm font-sans text-white font-medium truncate">{student.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#040308]/60 border border-zinc-800">
                <span className="text-[11px] font-mono text-amber-200/50 uppercase tracking-wider block mb-1">
                  Registration ID
                </span>
                <p className="text-sm font-mono text-[#D4AF37] font-bold">{student.admissionLetterCode}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#040308]/60 border border-zinc-800">
                <span className="text-[11px] font-mono text-amber-200/50 uppercase tracking-wider block mb-1">
                  Approval Status
                </span>
                <p className="text-sm font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {isCourseCompleted ? 'Course Completed' : student.approvalStatus}
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ================= EMBEDDED VIDEO MODAL ================= */}
      <AnimatePresence>
        {activeSessionVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#0a0814] border border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-[#040308] border-b border-amber-900/30 flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[#D4AF37] font-mono text-xs font-bold mr-2">
                    SESSION {activeSessionVideo.sessionNumber}
                  </span>
                  <h3 className="text-lg font-serif text-white font-bold inline-block">
                    {activeSessionVideo.title}
                  </h3>
                  <p className="text-xs text-amber-200/60 font-sans mt-0.5">
                    Speaker: {activeSessionVideo.assignedSpeaker}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSessionVideo(null)}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Embedded Player Body (NO DOWNLOAD BUTTONS, CLEAN LEARNING CONTENT) */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={activeSessionVideo.embedUrl}
                  title={activeSessionVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#040308] border-t border-amber-900/30 flex items-center justify-between">
                <button
                  onClick={() => {
                    handleToggleSessionComplete(activeSessionVideo.sessionNumber);
                  }}
                  className={`py-2 px-4 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    student.completedSessions?.includes(activeSessionVideo.sessionNumber)
                      ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                      : 'bg-amber-500/20 border border-[#D4AF37] text-amber-200 hover:bg-amber-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {student.completedSessions?.includes(activeSessionVideo.sessionNumber)
                    ? 'Session Completed ✓'
                    : 'Mark Session as Completed'}
                </button>

                <button
                  onClick={() => setActiveSessionVideo(null)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-zinc-800"
                >
                  Close Player
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
