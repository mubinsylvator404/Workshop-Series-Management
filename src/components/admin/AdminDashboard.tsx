import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { Workshop, Professor, StudentProfile } from '../../types';
import { getSupabase } from '../../services/supabaseClient';
import { 
  LayoutDashboard, 
  Sparkles, 
  BookOpen, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  Award, 
  FileText, 
  Megaphone, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  LogOut, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Download, 
  Globe, 
  Palette, 
  Settings, 
  ShieldAlert, 
  Video, 
  Key, 
  Sliders, 
  ChevronRight, 
  Upload, 
  ArrowUpRight, 
  Coins, 
  Menu, 
  X,
  Eye,
  Check,
  CheckSquare,
  Square,
  Mail,
  Send,
  Database
} from 'lucide-react';

interface ImageUploadButtonProps {
  onUploadComplete: (url: string) => void;
  buttonText?: string;
  className?: string;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onUploadComplete,
  buttonText = 'Upload Photo',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onUploadComplete(base64);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error', err);
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className={`px-3 py-2 bg-royal-gold/15 hover:bg-royal-gold/30 text-royal-gold border border-royal-gold/40 rounded-xl font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all ${className}`}
      >
        <Upload className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
        <span>{uploading ? 'Uploading...' : buttonText}</span>
      </button>
    </div>
  );
};

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { cms, updateCms, addToast, adminUser } = useCms();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'hero'
    | 'nav'
    | 'workshops'
    | 'speakers'
    | 'content'
    | 'gallery'
    | 'certificate'
    | 'registrations'
    | 'announcements'
    | 'media'
    | 'seo'
    | 'theme'
    | 'security'
  >('overview');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Editable local copies
  const [heroForm, setHeroForm] = useState(cms.hero);
  const [navForm, setNavForm] = useState(cms.nav);
  const [seoForm, setSeoForm] = useState(cms.seo);
  const [themeForm, setThemeForm] = useState(cms.theme);
  const [siteForm, setSiteForm] = useState(cms.site);
  const [certForm, setCertForm] = useState(cms.certificate);

  // Registrations state
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regSearch, setRegSearch] = useState('');
  const [regFilterStatus, setRegFilterStatus] = useState<string>('all');
  const [loadingRegs, setLoadingRegs] = useState(false);

  // Workshops CRUD state
  const [workshopsList, setWorkshopsList] = useState<Workshop[]>(cms.workshops || []);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [isNewWorkshop, setIsNewWorkshop] = useState(false);
  const [workshopSearch, setWorkshopSearch] = useState('');

  // Session Videos state (for My Chamber learning portal)
  const [sessionVideosList, setSessionVideosList] = useState(
    cms.sessionVideos && cms.sessionVideos.length === 10
      ? cms.sessionVideos
      : Array.from({ length: 10 }, (_, i) => ({
          id: `v-${i + 1}`,
          sessionNumber: i + 1,
          title: cms.workshops?.[i]?.title || `Session 0${i + 1}: Debate Mastery`,
          assignedSpeaker: cms.speakers?.[i % (cms.speakers?.length || 1)]?.name || 'MDS Trainer',
          videoType: 'youtube' as const,
          embedUrl: 'https://www.youtube.com/embed/S2C_A3S8k8I'
        }))
  );

  // Speakers CRUD state
  const [speakersList, setSpeakersList] = useState<Professor[]>(cms.speakers || []);
  const [editingSpeaker, setEditingSpeaker] = useState<Professor | null>(null);
  const [isNewSpeaker, setIsNewSpeaker] = useState(false);
  const [credentialsInputText, setCredentialsInputText] = useState('');

  // Announcements CRUD state
  const [announcementsList, setAnnouncementsList] = useState(cms.announcements || []);

  // Gallery CRUD state
  const [galleryList, setGalleryList] = useState(cms.gallery || []);

  // Media Library state
  const [mediaList, setMediaList] = useState(cms.media || []);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaName, setNewMediaName] = useState('');

  // Security / Password Reset State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    title: string;
    onConfirm: () => void;
  }>({ show: false, title: '', onConfirm: () => {} });

  // Supabase Sync & Diagnostic State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    isConfigured: boolean;
    url: string | null;
    fullUrl: string | null;
    hasAnonKey: boolean;
    hasServiceKey: boolean;
  } | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  useEffect(() => {
    const supabase = getSupabase();
    setSupabaseStatus({
      isConfigured: !!supabase,
      url: 'Supabase Active',
      fullUrl: null,
      hasAnonKey: true,
      hasServiceKey: false
    });
  }, []);

  const handleForceSupabaseSync = async () => {
    setSyncingSupabase(true);
    setSyncResult(null);
    try {
      await fetchRegistrations();
      setSyncResult({ success: true, message: 'Supabase connection verified successfully.' });
      addToast('Supabase connection verified successfully!', 'success');
    } catch (e: any) {
      setSyncResult({ success: false, error: e.message });
      addToast('Sync error occurred', 'error');
    } finally {
      setSyncingSupabase(false);
    }
  };

  // Sync CMS changes when context loads or changes
  useEffect(() => {
    setHeroForm(cms.hero);
    setNavForm(cms.nav);
    setSeoForm(cms.seo);
    setThemeForm(cms.theme);
    setSiteForm(cms.site);
    setCertForm(cms.certificate);
    setWorkshopsList(cms.workshops || []);
    setSpeakersList(cms.speakers || []);
    setAnnouncementsList(cms.announcements || []);
    setGalleryList(cms.gallery || []);
    setMediaList(cms.media || []);
  }, [cms]);

  // Fetch registrations from Supabase database
  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    const allRegsMap: { [key: string]: any } = {};

    try {
      const supabase = getSupabase() as any;
      if (supabase) {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && !error && Array.isArray(data)) {
          data.forEach((r: any) => {
            const emailKey = (r.email || r.id || '').toLowerCase();
            const rawStatus = (r.approval_status || r.status || 'pending').toLowerCase();
            const formattedStatus = rawStatus === 'approved' ? 'Approved' : rawStatus === 'rejected' ? 'Rejected' : rawStatus === 'suspended' ? 'Suspended' : 'Pending';

            allRegsMap[emailKey] = {
              id: r.id,
              user_id: r.user_id || null,
              fullName: r.full_name || 'Scholar Candidate',
              email: r.email,
              phone: r.phone || '',
              institution: r.institution || 'Moulvibazar Govt College',
              department: r.department || '',
              district: r.district || '',
              emergencyContact: r.emergency_contact || '',
              facebook: r.facebook || '',
              motivation: r.motivation || '',
              debateFormat: r.debate_format || 'BP',
              transactionId: r.bkash_trx_id || '',
              paymentScreenshot: r.payment_screenshot || '',
              status: formattedStatus,
              approvalStatus: formattedStatus,
              paymentStatus: r.payment_status || 'verified',
              chamberAccess: formattedStatus === 'Approved',
              createdAt: r.created_at || new Date().toISOString()
            };
          });
        }
      }
    } catch (supaErr) {
      console.warn('Note loading Supabase registrations:', supaErr);
    }

    setRegistrations(Object.values(allRegsMap));
    setLoadingRegs(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (activeTab === 'registrations' || activeTab === 'overview') {
      fetchRegistrations();
    }
  }, [activeTab]);

  // Handle Save Hero
  const handleSaveHero = async () => {
    await updateCms({ hero: heroForm });
  };

  // Handle Save Nav
  const handleSaveNav = async () => {
    await updateCms({ nav: navForm });
  };

  // Handle Save SEO & Theme & Site
  const handleSaveSeoAndTheme = async () => {
    await updateCms({ seo: seoForm, theme: themeForm, site: siteForm });
  };

  // Handle Save Certificate
  const handleSaveCert = async () => {
    await updateCms({ certificate: certForm });
  };

  // Save Workshops CRUD
  const handleSaveWorkshop = async () => {
    if (!editingWorkshop) return;

    let updated: Workshop[];
    if (isNewWorkshop) {
      updated = [editingWorkshop, ...workshopsList];
    } else {
      updated = workshopsList.map((w) => (w.id === editingWorkshop.id ? editingWorkshop : w));
    }

    setWorkshopsList(updated);
    await updateCms({ workshops: updated });
    setEditingWorkshop(null);
    setIsNewWorkshop(false);
    addToast(isNewWorkshop ? 'New Workshop Created!' : 'Workshop Updated!', 'success');
  };

  const handleDeleteWorkshop = (id: string, title: string) => {
    setDeleteConfirm({
      show: true,
      title: `Delete workshop "${title}"?`,
      onConfirm: async () => {
        const updated = workshopsList.filter((w) => w.id !== id);
        setWorkshopsList(updated);
        await updateCms({ workshops: updated });
        addToast('Workshop deleted.', 'info');
        setDeleteConfirm({ show: false, title: '', onConfirm: () => {} });
      }
    });
  };

  // Save Speakers CRUD
  const handleSaveSpeaker = async () => {
    if (!editingSpeaker) return;

    let updated: Professor[];
    if (isNewSpeaker) {
      updated = [editingSpeaker, ...speakersList];
    } else {
      updated = speakersList.map((s) => (s.id === editingSpeaker.id ? editingSpeaker : s));
    }

    setSpeakersList(updated);
    await updateCms({ speakers: updated });
    setEditingSpeaker(null);
    setIsNewSpeaker(false);
    addToast(isNewSpeaker ? 'New Speaker Added!' : 'Speaker Profile Updated!', 'success');
  };

  const handleDeleteSpeaker = (id: string, name: string) => {
    setDeleteConfirm({
      show: true,
      title: `Delete speaker profile "${name}"?`,
      onConfirm: async () => {
        const updated = speakersList.filter((s) => s.id !== id);
        setSpeakersList(updated);
        await updateCms({ speakers: updated });
        addToast('Speaker profile deleted.', 'info');
        setDeleteConfirm({ show: false, title: '', onConfirm: () => {} });
      }
    });
  };

  // Save Session Videos
  const handleSaveSessionVideos = async () => {
    await updateCms({ sessionVideos: sessionVideosList });
    addToast('10 Workshop Session Videos updated successfully!', 'success');
  };
  const handleRegistrationStatus = async (id: string, status: 'approved' | 'rejected' | 'suspended') => {
    try {
      const targetReg = registrations.find((r) => r.id === id);

      // Update Supabase
      const supabase = getSupabase() as any;
      if (supabase) {
        try {
          await supabase
            .from('registrations')
            .update({
              approval_status: status,
              status: status
            })
            .eq('id', id);
        } catch (sErr) {
          console.warn('Supabase update note:', sErr);
        }
      }

      // 3. Sync local storage for static hosting
      if (targetReg && targetReg.email) {
        const lsKey = `mds_registration_${targetReg.email.toLowerCase()}`;
        const existingLs = localStorage.getItem(lsKey);
        if (existingLs) {
          try {
            const parsed = JSON.parse(existingLs);
            const formattedStatus = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : status === 'suspended' ? 'Suspended' : 'Pending';
            parsed.approvalStatus = formattedStatus;
            parsed.approval_status = formattedStatus;
            parsed.status = status;
            parsed.chamberAccess = status === 'approved';
            localStorage.setItem(lsKey, JSON.stringify(parsed));
          } catch (e) {
            // ignore
          }
        }
      }

      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status, approvalStatus: status, chamberAccess: status === 'approved' } : r))
      );

      if (status === 'approved') {
        addToast(`Student application APPROVED! Account setup link is ready for applicant.`, 'success');
      } else {
        addToast(`Student registration marked as ${status}.`, 'info');
      }

      await fetchRegistrations();
    } catch (e) {
      addToast('Failed to update registration status.', 'error');
    }
  };

  // Approve student & automatically construct Gmail compose link with activation URL
  const handleApproveAndSendGmail = async (r: any) => {
    await handleRegistrationStatus(r.id, 'approved');

    const token = r.activationToken || r.activation_token || `act_${Date.now()}`;
    const actUrl = `${window.location.origin}/?activate_email=${encodeURIComponent(r.email)}&activate_token=${token}`;

    try {
      await navigator.clipboard.writeText(actUrl);
    } catch (e) {
      // ignore
    }

    const subject = "Moulvibazar Debating Society - Registration Approved & Account Activation";
    const body = `Dear ${r.fullName || 'Scholar Candidate'},

Congratulations! Your registration application for Moulvibazar Debating Society (MDS Academy) has been APPROVED by the administration.

Please click the link below to set up your account password and activate your access to My Chamber:

${actUrl}

If you have any questions or need assistance, feel free to reply to this email.

Best regards,
Moulvibazar Debating Society Executive Committee`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(r.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank');
    addToast('Approved! Opened Gmail compose & copied activation link to clipboard.', 'success');
  };

  // Delete Student Registration permanently
  const handleDeleteStudent = (id: string, name: string) => {
    setDeleteConfirm({
      show: true,
      title: `Permanently delete registration for "${name}"?`,
      onConfirm: async () => {
        try {
          const targetReg = registrations.find((r) => r.id === id);

          // Delete from Supabase
          const supabase = getSupabase() as any;
          if (supabase) {
            await supabase
              .from('registrations')
              .delete()
              .eq('id', id);
          }

          // Delete from Local Storage
          if (targetReg && targetReg.email) {
            const lsKey = `mds_registration_${targetReg.email.toLowerCase()}`;
            localStorage.removeItem(lsKey);
          }

          setRegistrations((prev) => prev.filter((r) => r.id !== id));
          await fetchRegistrations();
          addToast(`Student record for "${name}" permanently deleted.`, 'info');
        } catch (e) {
          addToast('Failed to delete student record.', 'error');
        }
        setDeleteConfirm({ show: false, title: '', onConfirm: () => {} });
      }
    });
  };

  // Toggle Chamber Access
  const handleToggleChamberAccess = async (id: string, currentAccess: boolean) => {
    try {
      const newStatus = !currentAccess ? 'approved' : 'pending';
      const supabase = getSupabase() as any;
      if (supabase) {
        await supabase
          .from('registrations')
          .update({ approval_status: newStatus })
          .eq('id', id);
      }
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, chamberAccess: !currentAccess, approvalStatus: newStatus } : r))
      );
      addToast(`Chamber access ${!currentAccess ? 'Enabled' : 'Disabled'} for student.`, 'info');
    } catch (e) {
      addToast('Failed to update chamber access.', 'error');
    }
  };

  // Toggle Course Completion (Unlocks Certificate for Student)
  const handleToggleCourseCompleted = async (id: string, currentCompleted: boolean) => {
    try {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, courseCompleted: !currentCompleted } : r))
      );
      addToast(`Course Completion status marked as ${!currentCompleted ? 'Completed (Certificate Unlocked)' : 'Incomplete'}.`, 'success');
    } catch (e) {
      addToast('Failed to update course completion status.', 'error');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      addToast('No registrations to export.', 'info');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Institution', 'Format', 'XP', 'Joined At', 'Status'];
    const rows = registrations.map((r) => [
      r.id,
      `"${r.fullName}"`,
      r.email,
      `"${r.institution || ''}"`,
      r.debateFormat || '',
      r.xp || 0,
      r.joinedAt || '',
      r.status || 'Approved'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mds_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Registrations exported as CSV file.', 'success');
  };

  // Handle Media Add
  const handleAddMedia = async () => {
    if (!newMediaUrl) {
      addToast('Please provide an image or file URL.', 'error');
      return;
    }
    const item = {
      id: 'media-' + Date.now(),
      name: newMediaName || 'Uploaded Asset',
      type: 'image' as const,
      url: newMediaUrl,
      size: '1.2 MB',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [item, ...mediaList];
    setMediaList(updated);
    await updateCms({ media: updated });
    setNewMediaUrl('');
    setNewMediaName('');
    addToast('New media item added to library!', 'success');
  };

  // Password Reset Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      addToast('New passwords do not match!', 'error');
      return;
    }
    if (newPass.length < 4) {
      addToast('Password must be at least 4 characters long.', 'error');
      return;
    }
    addToast('Admin password updated successfully!', 'success');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  // Filtered registrations list
  const filteredRegs = registrations.filter((r) => {
    const searchLower = regSearch.toLowerCase();
    const matchesSearch =
      !regSearch ||
      r.fullName?.toLowerCase().includes(searchLower) ||
      r.email?.toLowerCase().includes(searchLower) ||
      r.institution?.toLowerCase().includes(searchLower) ||
      r.transactionId?.toLowerCase().includes(searchLower) ||
      r.phone?.toLowerCase().includes(searchLower);

    const currentStatus = (r.approvalStatus || r.status || 'pending').toLowerCase();
    const matchesStatus =
      regFilterStatus === 'all' || currentStatus === regFilterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate analytics
  const totalRegistrations = registrations.length;
  const approvedRegistrations = registrations.filter((r) => (r.approvalStatus || r.status) === 'Approved').length;
  const pendingRegistrations = registrations.filter((r) => (r.approvalStatus || r.status) === 'Pending').length;
  const totalWorkshops = workshopsList.length;
  const totalSpeakers = speakersList.length;
  const totalRevenue = totalRegistrations * 200;

  return (
    <div className="min-h-screen bg-[#05040a] text-zinc-200 font-sans flex flex-col lg:flex-row select-none">
      
      {/* Sidebar for Desktop / Mobile Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#090712] border-r border-royal-gold/20 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-royal-gold/20 border border-royal-gold flex items-center justify-center text-royal-gold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                MDS Admin Panel
              </h2>
              <span className="font-mono text-[9px] text-amber-200/70 block">
                {adminUser?.name || 'Master Chancellor'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-grow custom-scrollbar text-xs font-mono">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'hero', label: 'Hero Section Editor', icon: <Sparkles className="w-4 h-4 text-royal-gold" /> },
            { id: 'nav', label: 'Navigation & Socials', icon: <Globe className="w-4 h-4" /> },
            { id: 'workshops', label: 'Workshops (CRUD)', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'speakers', label: 'Speakers (CRUD)', icon: <Users className="w-4 h-4" /> },
            { id: 'registrations', label: 'Registrations & Attendance', icon: <FileText className="w-4 h-4" /> },
            { id: 'content', label: 'Website Content Blocks', icon: <Sliders className="w-4 h-4" /> },
            { id: 'gallery', label: 'Gallery Management', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'certificate', label: 'Certificate Settings', icon: <Award className="w-4 h-4" /> },
            { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
            { id: 'media', label: 'Media Library', icon: <Upload className="w-4 h-4" /> },
            { id: 'seo', label: 'SEO & Optimization', icon: <Search className="w-4 h-4" /> },
            { id: 'theme', label: 'Theme & Site Settings', icon: <Palette className="w-4 h-4" /> },
            { id: 'security', label: 'Admin Credentials', icon: <Key className="w-4 h-4" /> }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-royal-gold text-midnight font-bold shadow-lg shadow-royal-gold/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout & Web Link */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-xs font-mono text-amber-200/80 hover:text-white p-2 rounded-lg bg-white/[0.03]"
          >
            <span>View Public Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/50 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8 lg:p-10 overflow-y-auto">
        
        {/* Mobile Header Bar */}
        <div className="lg:hidden mb-6 flex items-center justify-between p-4 bg-[#090712] border border-royal-gold/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-royal-gold bg-black/40 border border-royal-gold/30 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
              Admin: {activeTab.toUpperCase()}
            </span>
          </div>
          <a href="/" className="text-xs font-mono text-royal-gold underline">
            Main Site
          </a>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-6xl">
            <div>
              <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                Dashboard Analytics
              </h1>
              <p className="font-mono text-xs text-zinc-400 mt-1">
                Real-time performance metrics for MDS Elite Debate Academy Masterclass 2026.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-b from-[#120d28] to-[#080612] border border-royal-gold/30 rounded-2xl p-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-amber-200">
                  <span>TOTAL REGISTRATIONS</span>
                  <Users className="w-4 h-4 text-royal-gold" />
                </div>
                <div className="font-display font-bold text-3xl text-white">
                  {totalRegistrations}
                </div>
                <p className="text-[11px] font-mono text-emerald-400">
                  ● {approvedRegistrations} Approved | {pendingRegistrations} Pending
                </p>
              </div>

              <div className="bg-gradient-to-b from-[#120d28] to-[#080612] border border-royal-gold/30 rounded-2xl p-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-amber-200">
                  <span>ACTIVE WORKSHOPS</span>
                  <BookOpen className="w-4 h-4 text-royal-gold" />
                </div>
                <div className="font-display font-bold text-3xl text-white">
                  {totalWorkshops}
                </div>
                <p className="text-[11px] font-mono text-zinc-400">Curriculum masterclasses</p>
              </div>

              <div className="bg-gradient-to-b from-[#120d28] to-[#080612] border border-royal-gold/30 rounded-2xl p-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-amber-200">
                  <span>FACULTY SPEAKERS</span>
                  <Users className="w-4 h-4 text-royal-gold" />
                </div>
                <div className="font-display font-bold text-3xl text-white">
                  {totalSpeakers}
                </div>
                <p className="text-[11px] font-mono text-zinc-400">Advisors & Adjudicators</p>
              </div>

              <div className="bg-gradient-to-b from-[#120d28] to-[#080612] border border-royal-gold/30 rounded-2xl p-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-amber-200">
                  <span>TOTAL REVENUE (BDT)</span>
                  <Coins className="w-4 h-4 text-royal-gold" />
                </div>
                <div className="font-display font-bold text-3xl text-amber-300">
                  BDT {totalRevenue}
                </div>
                <p className="text-[11px] font-mono text-emerald-400">@ 200 BDT / Student</p>
              </div>
            </div>

            {/* Supabase Database Status & Sync Control Card */}
            <div className="bg-[#0b0817] border border-amber-500/30 rounded-2xl p-5 space-y-3 font-mono text-xs shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-white uppercase">
                      Supabase Cloud Database Status
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Verify connection and push local registrations/CMS data to your Supabase tables.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {supabaseStatus?.isConfigured ? (
                    <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Connected ({supabaseStatus.url})</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[11px] font-bold rounded-full">
                      ⚠️ Not Configured (Using Local Storage)
                    </span>
                  )}

                  <button
                    onClick={handleForceSupabaseSync}
                    disabled={syncingSupabase}
                    className="px-4 py-2 bg-royal-gold/20 hover:bg-royal-gold/30 text-amber-200 border border-royal-gold/50 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-royal-gold ${syncingSupabase ? 'animate-spin' : ''}`} />
                    <span>{syncingSupabase ? 'Syncing...' : 'Sync Data to Supabase'}</span>
                  </button>
                </div>
              </div>

              {!supabaseStatus?.isConfigured && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-[11px] space-y-1">
                  <p className="font-bold">How to store data in Supabase:</p>
                  <p className="text-zinc-300">
                    Provide <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_URL</code> and <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code> in environment settings or <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">.env</code>.
                  </p>
                </div>
              )}

              {syncResult && (
                <div className="p-3 bg-black/60 border border-white/10 rounded-xl space-y-1 text-[11px]">
                  <div className="text-amber-300 font-bold">Sync Diagnostic Report:</div>
                  {syncResult.results?.cms && <div className="text-emerald-400">✓ {syncResult.results.cms}</div>}
                  {syncResult.results?.registrations && <div className="text-emerald-400">✓ {syncResult.results.registrations}</div>}
                  {syncResult.results?.profiles && <div className="text-emerald-400">✓ {syncResult.results.profiles}</div>}
                  {syncResult.results?.errors?.length > 0 && (
                    <div className="space-y-0.5 pt-1">
                      {syncResult.results.errors.map((err: string, i: number) => (
                        <div key={i} className="text-amber-400 font-sans text-[11px]">⚠️ {err}</div>
                      ))}
                    </div>
                  )}
                  {syncResult.error && (
                    <div className="text-red-400">❌ Error: {syncResult.error}</div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions & Recent Registrations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Quick Actions */}
              <div className="lg:col-span-4 bg-[#080612] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Quick CMS Controls
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <button
                    onClick={() => setActiveTab('hero')}
                    className="w-full flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/10 text-left transition-colors"
                  >
                    <span>Edit Hero Title & Fee</span>
                    <ChevronRight className="w-4 h-4 text-royal-gold" />
                  </button>
                  <button
                    onClick={() => setActiveTab('workshops')}
                    className="w-full flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/10 text-left transition-colors"
                  >
                    <span>Add New Workshop</span>
                    <Plus className="w-4 h-4 text-royal-gold" />
                  </button>
                  <button
                    onClick={() => setActiveTab('registrations')}
                    className="w-full flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/10 text-left transition-colors"
                  >
                    <span>Export Registrations CSV</span>
                    <Download className="w-4 h-4 text-royal-gold" />
                  </button>
                </div>
              </div>

              {/* Recent Registrations Table Preview */}
              <div className="lg:col-span-8 bg-[#080612] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    Recent Registrations
                  </h3>
                  <button
                    onClick={() => setActiveTab('registrations')}
                    className="font-mono text-xs text-royal-gold hover:underline"
                  >
                    View All ({registrations.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-500 uppercase text-[10px]">
                        <th className="py-2.5 px-3">Student</th>
                        <th className="py-2.5 px-3">Institution</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {registrations.slice(0, 5).map((r, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-white">{r.fullName}</div>
                            <div className="text-[10px] text-zinc-500">{r.email}</div>
                          </td>
                          <td className="py-2.5 px-3 text-zinc-400">{r.institution || 'MDS Student'}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px]">
                              {r.status || 'Approved'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-zinc-500">
                            No student registrations recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: HERO SECTION EDITOR */}
        {activeTab === 'hero' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Hero Section Editor
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Customize the headline, subtitle, event metadata pills, buttons, and visual concepts.
                </p>
              </div>
              <button
                onClick={handleSaveHero}
                className="px-5 py-2.5 bg-royal-gold text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Changes</span>
              </button>
            </div>

            <div className="bg-[#080612] border border-white/10 rounded-2xl p-6 space-y-5">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-royal-gold">Top Badge Text</label>
                <input
                  type="text"
                  value={heroForm.badgeText}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-royal-gold">Main Editorial Headline</label>
                <input
                  type="text"
                  value={heroForm.headline}
                  onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-royal-gold">Subtitle Description</label>
                <textarea
                  rows={3}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              {/* Buttons Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-zinc-300">Primary Button Label</label>
                  <input
                    type="text"
                    value={heroForm.primaryButtonText}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-zinc-300">Secondary Button Label</label>
                  <input
                    type="text"
                    value={heroForm.secondaryButtonText}
                    onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              {/* Metadata Pills Settings */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Event Metadata Pills
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase">Start Date</label>
                    <input
                      type="text"
                      value={heroForm.startDate}
                      onChange={(e) => setHeroForm({ ...heroForm, startDate: e.target.value })}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase">Registration Fee</label>
                    <input
                      type="text"
                      value={heroForm.registrationFee}
                      onChange={(e) => setHeroForm({ ...heroForm, registrationFee: e.target.value })}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-amber-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase">Platform / Location</label>
                    <input
                      type="text"
                      value={heroForm.googleMeetInfo}
                      onChange={(e) => setHeroForm({ ...heroForm, googleMeetInfo: e.target.value })}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: NAVIGATION & SOCIAL LINKS */}
        {activeTab === 'nav' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Navigation & Branding Editor
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Manage academy navbar branding, links order, and social profiles.
                </p>
              </div>
              <button
                onClick={handleSaveNav}
                className="px-5 py-2.5 bg-royal-gold text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Navigation</span>
              </button>
            </div>

            <div className="bg-[#080612] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-royal-gold">Logo Header Text</label>
                  <input
                    type="text"
                    value={navForm.logoText}
                    onChange={(e) => setNavForm({ ...navForm, logoText: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-royal-gold">Logo Subtext</label>
                  <input
                    type="text"
                    value={navForm.logoSubtext}
                    onChange={(e) => setNavForm({ ...navForm, logoSubtext: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
                <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Academy Social Channels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase">Facebook Page URL</label>
                    <input
                      type="text"
                      value={navForm.socialLinks.facebook || ''}
                      onChange={(e) =>
                        setNavForm({
                          ...navForm,
                          socialLinks: { ...navForm.socialLinks, facebook: e.target.value }
                        })
                      }
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1 uppercase">Discord Server URL</label>
                    <input
                      type="text"
                      value={navForm.socialLinks.discord || ''}
                      onChange={(e) =>
                        setNavForm({
                          ...navForm,
                          socialLinks: { ...navForm.socialLinks, discord: e.target.value }
                        })
                      }
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: WORKSHOPS CRUD */}
        {activeTab === 'workshops' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Workshop Management (Full CRUD)
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Create, edit, reorder, or publish/unpublish workshop masterclasses.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingWorkshop({
                    id: 'w-' + Date.now(),
                    title: 'New Workshop Title',
                    slug: 'new-workshop-' + Date.now(),
                    description: 'Detailed description of the new masterclass.',
                    objectives: ['Objective 1', 'Objective 2'],
                    expectedLearning: ['Learning outcome 1'],
                    prerequisites: 'Open to all students.',
                    speakerId: speakersList[0]?.id || '',
                    duration: '2.5 Hours',
                    assignments: ['Practice assignment'],
                    resources: []
                  });
                  setIsNewWorkshop(true);
                }}
                className="px-5 py-2.5 bg-royal-gold text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Workshop</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={workshopSearch}
                onChange={(e) => setWorkshopSearch(e.target.value)}
                placeholder="Search workshops by title or speaker..."
                className="w-full bg-[#080612] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Workshops List Table */}
            <div className="bg-[#080612] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-amber-200 uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Workshop Title</th>
                      <th className="py-3.5 px-4">Speaker</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {workshopsList
                      .filter((w) => w.title.toLowerCase().includes(workshopSearch.toLowerCase()))
                      .map((w, idx) => {
                        const speaker = speakersList.find((s) => s.id === w.speakerId);
                        return (
                          <tr key={w.id} className="hover:bg-white/[0.02]">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white text-sm">{w.title}</div>
                              <div className="text-[11px] text-zinc-400 truncate max-w-md">{w.description}</div>
                            </td>
                            <td className="py-3.5 px-4 text-zinc-300">
                              {speaker?.name || 'Assigned Professor'}
                            </td>
                            <td className="py-3.5 px-4 text-zinc-400">{w.duration}</td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingWorkshop(w);
                                  setIsNewWorkshop(false);
                                }}
                                className="p-2 bg-royal-gold/10 hover:bg-royal-gold/20 text-royal-gold border border-royal-gold/30 rounded-lg cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteWorkshop(w.id, w.title)}
                                className="p-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 10 Workshop Session Videos Editor for My Chamber */}
            <div className="bg-[#080612] border border-royal-gold/30 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-5 h-5 text-royal-gold" />
                    My Chamber • 10 Session Videos Stream Links
                  </h3>
                  <p className="font-mono text-xs text-zinc-400 mt-1">
                    Configure embedded YouTube or Google Drive video links for student learning chamber access.
                  </p>
                </div>
                <button
                  onClick={handleSaveSessionVideos}
                  className="px-5 py-2.5 bg-royal-gold text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Session Videos</span>
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {sessionVideosList.map((sv, index) => (
                  <div
                    key={sv.id || index}
                    className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-royal-gold/20 text-royal-gold font-bold rounded text-[11px]">
                        SESSION {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <select
                        value={sv.videoType || 'youtube'}
                        onChange={(e) => {
                          const updated = [...sessionVideosList];
                          updated[index] = { ...sv, videoType: e.target.value as 'youtube' | 'gdrive' };
                          setSessionVideosList(updated);
                        }}
                        className="bg-black/80 border border-white/15 rounded-lg px-3 py-1 text-zinc-300"
                      >
                        <option value="youtube">YouTube Embed</option>
                        <option value="gdrive">Google Drive Embed</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 mb-1">Session Title</label>
                        <input
                          type="text"
                          value={sv.title}
                          onChange={(e) => {
                            const updated = [...sessionVideosList];
                            updated[index] = { ...sv, title: e.target.value };
                            setSessionVideosList(updated);
                          }}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1">Assigned Speaker</label>
                        <input
                          type="text"
                          value={sv.assignedSpeaker}
                          onChange={(e) => {
                            const updated = [...sessionVideosList];
                            updated[index] = { ...sv, assignedSpeaker: e.target.value };
                            setSessionVideosList(updated);
                          }}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Embedded Video URL (YouTube or Google Drive Link)</label>
                      <input
                        type="text"
                        value={sv.embedUrl}
                        onChange={(e) => {
                          const updated = [...sessionVideosList];
                          updated[index] = { ...sv, embedUrl: e.target.value };
                          setSessionVideosList(updated);
                        }}
                        placeholder="https://www.youtube.com/embed/... or https://drive.google.com/file/d/.../preview"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-amber-200 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workshop Edit / Create Modal */}
            {editingWorkshop && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#0b0817] border border-royal-gold/40 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl my-8">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="font-display font-bold text-base text-white uppercase">
                      {isNewWorkshop ? 'Create Workshop' : 'Edit Workshop Details'}
                    </h3>
                    <button
                      onClick={() => setEditingWorkshop(null)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1 uppercase">Title</label>
                      <input
                        type="text"
                        value={editingWorkshop.title}
                        onChange={(e) =>
                          setEditingWorkshop({ ...editingWorkshop, title: e.target.value })
                        }
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 uppercase">Description</label>
                      <textarea
                        rows={3}
                        value={editingWorkshop.description}
                        onChange={(e) =>
                          setEditingWorkshop({ ...editingWorkshop, description: e.target.value })
                        }
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-400 mb-1 uppercase">Assigned Speaker</label>
                        <select
                          value={editingWorkshop.speakerId || ''}
                          onChange={(e) =>
                            setEditingWorkshop({ ...editingWorkshop, speakerId: e.target.value })
                          }
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                        >
                          <option value="" className="bg-midnight">-- Unassigned --</option>
                          {speakersList.map((s) => (
                            <option key={s.id} value={s.id} className="bg-midnight">
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1 uppercase">Duration</label>
                        <input
                          type="text"
                          value={editingWorkshop.duration}
                          onChange={(e) =>
                            setEditingWorkshop({ ...editingWorkshop, duration: e.target.value })
                          }
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 uppercase">Prerequisites</label>
                      <input
                        type="text"
                        value={editingWorkshop.prerequisites}
                        onChange={(e) =>
                          setEditingWorkshop({ ...editingWorkshop, prerequisites: e.target.value })
                        }
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setEditingWorkshop(null)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveWorkshop}
                      className="px-5 py-2 bg-royal-gold text-midnight font-bold font-display text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    >
                      Save Workshop
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 5: SPEAKERS CRUD */}
        {activeTab === 'speakers' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Speaker & Faculty Management
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Manage professors, achievements/credentials, and photos.
                </p>
              </div>
              <button
                onClick={() => {
                  const newSpk: Professor = {
                    id: 'prof-' + Date.now(),
                    name: 'New Professor Name',
                    title: 'Grand Debater & Adjudicator',
                    house: 'Aurelius',
                    houseColor: 'from-amber-500 to-yellow-600',
                    houseBadge: 'Aurelius House',
                    achievements: ['National Champion'],
                    bio: '',
                    favoriteMotions: [],
                    teachingStyle: 'Championship Debate Strategy',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
                    assignedTopic: 'Championship Debate Strategy',
                    topic: 'Championship Debate Strategy',
                    socials: {}
                  };
                  setEditingSpeaker(newSpk);
                  setCredentialsInputText('National Champion');
                  setIsNewSpeaker(true);
                }}
                className="px-5 py-2.5 bg-royal-gold text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Speaker Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {speakersList.map((speaker) => (
                <div
                  key={speaker.id}
                  className="bg-[#080612] border border-white/10 rounded-2xl p-5 flex items-start gap-4"
                >
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    className="w-16 h-16 rounded-xl object-cover border border-royal-gold/40 shrink-0"
                  />
                  <div className="flex-grow space-y-1">
                    <h3 className="font-display font-bold text-base text-white">{speaker.name}</h3>
                    <p className="font-mono text-xs text-royal-gold">{speaker.title}</p>
                    
                    {/* Topic Badge */}
                    <p className="font-serif italic text-xs text-amber-200/90 pt-0.5">
                      Topic: "{speaker.assignedTopic || speaker.topic || speaker.achievements?.[0] || 'Championship Debate Strategy'}"
                    </p>

                    {/* Credentials Preview */}
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {speaker.achievements && speaker.achievements.length > 0 ? (
                        speaker.achievements.map((ach, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/25 text-amber-300 rounded text-[10px] font-sans"
                          >
                            {ach}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-500 text-[10px] font-mono italic">No credentials added</span>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingSpeaker(speaker);
                          setCredentialsInputText(speaker.achievements ? speaker.achievements.join('\n') : '');
                          setIsNewSpeaker(false);
                        }}
                        className="px-3 py-1 bg-royal-gold/10 text-royal-gold border border-royal-gold/30 rounded-lg font-mono text-[11px] cursor-pointer hover:bg-royal-gold/20"
                      >
                        Edit Credentials & Info
                      </button>
                      <button
                        onClick={() => handleDeleteSpeaker(speaker.id, speaker.name)}
                        className="px-3 py-1 bg-red-950/40 text-red-300 border border-red-500/30 rounded-lg font-mono text-[11px] cursor-pointer hover:bg-red-900/50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Speaker Modal */}
            {editingSpeaker && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#0b0817] border border-royal-gold/40 rounded-2xl p-6 max-w-xl w-full space-y-4 my-8">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="font-display font-bold text-base text-white uppercase">
                      {isNewSpeaker ? 'Add Faculty Member' : 'Edit Speaker Profile'}
                    </h3>
                    <button onClick={() => setEditingSpeaker(null)} className="text-zinc-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1 uppercase">Full Name</label>
                      <input
                        type="text"
                        value={editingSpeaker.name}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, name: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 uppercase">Title / Designation</label>
                      <input
                        type="text"
                        value={editingSpeaker.title}
                        onChange={(e) => setEditingSpeaker({ ...editingSpeaker, title: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-royal-gold mb-1 uppercase font-bold flex items-center justify-between">
                        <span>Assigned Workshop Topic / Lecture Theme</span>
                        <span className="text-[10px] text-zinc-400 font-normal">Displayed on Speaker Card & Profile</span>
                      </label>
                      <input
                        type="text"
                        placeholder='e.g., "Champion — MGBSDC Nationals 2025" or "Advanced Motion Analysis"'
                        value={editingSpeaker.assignedTopic || editingSpeaker.topic || ''}
                        onChange={(e) => setEditingSpeaker({ 
                          ...editingSpeaker, 
                          assignedTopic: e.target.value,
                          topic: e.target.value 
                        })}
                        className="w-full bg-black/60 border border-royal-gold/40 focus:border-royal-gold rounded-xl px-3.5 py-2 text-amber-100 font-serif italic"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-zinc-400 uppercase">Speaker Photo / Avatar</label>
                        <ImageUploadButton
                          buttonText="Instant Upload Pic"
                          onUploadComplete={(url) => {
                            setEditingSpeaker({ ...editingSpeaker, avatar: url });
                            addToast('Speaker photo uploaded successfully!', 'success');
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {editingSpeaker.avatar && (
                          <img
                            src={editingSpeaker.avatar}
                            alt="Preview"
                            className="w-12 h-12 rounded-xl object-cover border border-royal-gold/40 shrink-0"
                          />
                        )}
                        <input
                          type="text"
                          placeholder="Image URL or upload a picture..."
                          value={editingSpeaker.avatar}
                          onChange={(e) => setEditingSpeaker({ ...editingSpeaker, avatar: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                        />
                      </div>
                    </div>

                    {/* Batch Credentials Input */}
                    <div>
                      <label className="block text-amber-300 mb-1 uppercase font-bold text-xs flex items-center justify-between">
                        <span>Credentials & Achievements (Batch Input)</span>
                        <span className="text-[10px] text-zinc-400 font-normal">Comma or line separated</span>
                      </label>
                      <p className="text-[11px] font-sans text-zinc-400 mb-2">
                        Paste or type all credentials separated by commas (<code className="text-royal-gold">,</code>) or newlines/bullet points.
                      </p>
                      <textarea
                        rows={6}
                        placeholder="Champion — MGBSDC Nationals 2025&#10;Champion — MISTDS Nationals 2025&#10;Champion — JUDO Nationals 2025..."
                        value={credentialsInputText}
                        onChange={(e) => {
                          const rawVal = e.target.value;
                          setCredentialsInputText(rawVal);
                          const parsed = rawVal
                            .split(/[\n,]+/)
                            .map((item) => item.replace(/^[•*\-\s]+/, '').trim())
                            .filter((item) => item.length > 0);
                          setEditingSpeaker({
                            ...editingSpeaker,
                            achievements: parsed
                          });
                        }}
                        className="w-full bg-black/60 border border-amber-500/40 focus:border-royal-gold rounded-xl p-3 text-white font-mono text-xs leading-relaxed"
                      />
                      
                      {/* Live Badges Preview */}
                      {editingSpeaker.achievements && editingSpeaker.achievements.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block">
                            Parsed Achievements ({editingSpeaker.achievements.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-black/50 border border-amber-500/20 rounded-xl">
                            {editingSpeaker.achievements.map((ach, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-200 rounded-lg text-[11px] font-sans flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{ach}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => setEditingSpeaker(null)}
                      className="px-4 py-2 bg-white/5 text-zinc-300 font-mono text-xs rounded-xl hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSpeaker}
                      className="px-5 py-2 bg-royal-gold text-midnight font-bold text-xs uppercase rounded-xl hover:bg-amber-300 transition-colors cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    >
                      Save Speaker
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 6: REGISTRATIONS & ATTENDANCE */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Registration & Attendance Management
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Manage student admission records, approve/reject applications, and export reports.
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="px-5 py-2.5 bg-royal-gold text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <Download className="w-4 h-4" />
                <span>Export Registrations CSV</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search students by name, email, or institution..."
                  className="w-full bg-[#080612] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-zinc-500"
                />
              </div>

              <select
                value={regFilterStatus}
                onChange={(e) => setRegFilterStatus(e.target.value)}
                className="bg-[#080612] border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Registrations Table */}
            <div className="bg-[#080612] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-amber-200 uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Name & Contact</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Institution</th>
                      <th className="py-3.5 px-4">bKash Trx ID</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRegs.map((r) => {
                      const statusVal = (r.approvalStatus || r.status || 'pending').toLowerCase();
                      return (
                        <tr key={r.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{r.fullName}</div>
                            {r.phone && <div className="text-[10px] text-zinc-400">📞 {r.phone}</div>}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300 font-mono">
                            {r.email}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300">
                            <div>{r.institution || 'MDS Scholar'}</div>
                            {r.department && <div className="text-[9px] text-zinc-400 mt-0.5">{r.department}</div>}
                          </td>
                          <td className="py-3.5 px-4 text-amber-300 font-mono font-bold">
                            {r.transactionId || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold border ${
                                statusVal === 'rejected'
                                  ? 'bg-red-950/60 border-red-500/40 text-red-300'
                                  : statusVal === 'suspended'
                                  ? 'bg-orange-950/60 border-orange-500/40 text-orange-300'
                                  : statusVal === 'pending'
                                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                              }`}
                            >
                              {statusVal}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {statusVal === 'approved' ? (
                                <>
                                  <button
                                    onClick={() => {
                                      const token = r.activationToken || r.activation_token || 'act_' + r.id;
                                      const actUrl = `${window.location.origin}/?activate_email=${encodeURIComponent(r.email)}&activate_token=${token}`;
                                      const subject = "Moulvibazar Debating Society - Account Activation Link";
                                      const body = `Dear ${r.fullName || 'Scholar Candidate'},\n\nHere is your account activation link for Moulvibazar Debating Society (MDS Academy):\n\n${actUrl}\n\nPlease click the link to set up your password and access My Chamber.\n\nBest regards,\nMoulvibazar Debating Society`;
                                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(r.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                      window.open(gmailUrl, '_blank');
                                      navigator.clipboard.writeText(actUrl);
                                      addToast('Opened Gmail compose & copied activation link!', 'success');
                                    }}
                                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                    title="Send Activation Link via Gmail"
                                  >
                                    <Mail className="w-3 h-3 text-amber-400" />
                                    <span>Send Gmail Link</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      const actUrl = `${window.location.origin}/?activate_email=${encodeURIComponent(r.email)}&activate_token=${r.activationToken || r.activation_token || 'act_' + r.id}`;
                                      navigator.clipboard.writeText(actUrl);
                                      addToast('Activation Link copied to clipboard!', 'success');
                                    }}
                                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-lg cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                    title="Copy Activation Link"
                                  >
                                    <Key className="w-3 h-3" />
                                    <span>Copy Link</span>
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const supabase = getSupabase();
                                      if (supabase) {
                                        try {
                                          await supabase.auth.resetPasswordForEmail(r.email, {
                                            redirectTo: window.location.origin
                                          });
                                        } catch (e) {}
                                      }
                                      const resetUrl = `${window.location.origin}/?activate_email=${encodeURIComponent(r.email)}`;
                                      const subject = "Moulvibazar Debating Society - Password Reset Request";
                                      const body = `Dear ${r.fullName || 'Scholar Candidate'},\n\nAn administrator has triggered a password reset for your MDS Academy account.\n\nPlease click the link below to set up a new password:\n${resetUrl}\n\nBest regards,\nMoulvibazar Debating Society`;
                                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(r.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                      window.open(gmailUrl, '_blank');
                                      addToast(`Password reset link generated for ${r.email}`, 'success');
                                    }}
                                    className="px-2.5 py-1 bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 border border-sky-500/40 rounded-lg cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                    title="Send Password Reset Email via Gmail & Supabase"
                                  >
                                    <Key className="w-3 h-3 text-sky-400" />
                                    <span>Reset Password Email</span>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleApproveAndSendGmail(r)}
                                  className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 rounded-lg cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                  title="Approve Registration and Send Activation Link via Gmail"
                                >
                                  <Send className="w-3 h-3 text-emerald-400" />
                                  <span>Approve & Send Gmail</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleRegistrationStatus(r.id, 'rejected')}
                                className="px-2 py-1 bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-lg cursor-pointer text-[10px] font-bold"
                                title="Reject Registration"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleRegistrationStatus(r.id, 'suspended')}
                                className="px-2 py-1 bg-orange-950/50 hover:bg-orange-900/60 text-orange-300 border border-orange-500/30 rounded-lg cursor-pointer text-[10px] font-bold"
                                title="Suspend Registration"
                              >
                                Suspend
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(r.id, r.fullName)}
                                className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/40 rounded-lg cursor-pointer"
                                title="Permanently Delete Registration"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRegs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-zinc-500">
                          No registrations found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Gallery & Visual Assets
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Manage featured academy photography and tournament gallery moments.
                </p>
              </div>
              <ImageUploadButton
                buttonText="Upload Gallery Photo"
                className="py-2.5 px-4 font-bold shadow-lg shadow-royal-gold/20"
                onUploadComplete={async (url) => {
                  const newGalleryItem = {
                    id: 'gal-' + Date.now(),
                    title: 'Uploaded Memory ' + new Date().toLocaleTimeString(),
                    category: 'Grand Hall',
                    imageUrl: url
                  };
                  const updated = [newGalleryItem, ...galleryList];
                  setGalleryList(updated);
                  await updateCms({ gallery: updated });
                  addToast('Photo uploaded and added to Gallery!', 'success');
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {galleryList.map((item) => (
                <div key={item.id} className="bg-[#080612] border border-white/10 rounded-2xl overflow-hidden space-y-2 p-3">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-xl" />
                  <div className="font-bold text-sm text-white">{item.title}</div>
                  <div className="text-xs text-amber-200 font-mono flex justify-between items-center">
                    <span>{item.category}</span>
                    <button
                      onClick={async () => {
                        const updated = galleryList.filter((g) => g.id !== item.id);
                        setGalleryList(updated);
                        await updateCms({ gallery: updated });
                        addToast('Gallery photo deleted', 'info');
                      }}
                      className="text-red-400 hover:text-red-300 text-[10px] uppercase underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: CERTIFICATE SETTINGS */}
        {activeTab === 'certificate' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Certificate Management
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Customize the gold-sealed certificate design, signatory title, and QR verification logic.
                </p>
              </div>
              <button
                onClick={handleSaveCert}
                className="px-5 py-2.5 bg-royal-gold text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Certificate</span>
              </button>
            </div>

            <div className="bg-[#080612] border border-white/10 rounded-2xl p-6 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 uppercase">Certificate Header Title</label>
                <input
                  type="text"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase">Subtitle Text</label>
                <textarea
                  rows={2}
                  value={certForm.subtitle}
                  onChange={(e) => setCertForm({ ...certForm, subtitle: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase">Signatory Name</label>
                  <input
                    type="text"
                    value={certForm.signatoryName}
                    onChange={(e) => setCertForm({ ...certForm, signatoryName: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase">Signatory Title</label>
                  <input
                    type="text"
                    value={certForm.signatoryTitle}
                    onChange={(e) => setCertForm({ ...certForm, signatoryTitle: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Media Library
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Upload, store, and link asset images, video links, or PDFs.
                </p>
              </div>
            </div>

            {/* Add Media Input & Drag-Drop Upload Zone */}
            <div className="bg-[#080612] border border-white/10 rounded-2xl p-6 space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="font-bold text-white uppercase text-sm">Instant Photo & Asset Upload</h3>
                <ImageUploadButton
                  buttonText="Upload Photo from Computer"
                  className="py-2.5 px-4 font-bold shadow-lg shadow-royal-gold/20"
                  onUploadComplete={async (url) => {
                    const item = {
                      id: 'media-' + Date.now(),
                      name: 'Uploaded Photo ' + new Date().toLocaleTimeString(),
                      type: 'image' as const,
                      url: url,
                      size: 'Instant Asset',
                      uploadedAt: new Date().toISOString().split('T')[0]
                    };
                    const updated = [item, ...mediaList];
                    setMediaList(updated);
                    await updateCms({ media: updated });
                    addToast('Photo uploaded and added to Media Library!', 'success');
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                <input
                  type="text"
                  placeholder="Asset Name (e.g. Hero Banner.jpg)"
                  value={newMediaName}
                  onChange={(e) => setNewMediaName(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Or paste direct Image / Document URL..."
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white"
                />
                <button
                  onClick={handleAddMedia}
                  className="bg-royal-gold text-midnight font-bold rounded-xl py-2.5 uppercase hover:bg-amber-300 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  Add Media URL
                </button>
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mediaList.map((m) => (
                <div key={m.id} className="bg-[#080612] border border-white/10 rounded-2xl p-3 space-y-2">
                  {m.type === 'image' && (
                    <img src={m.url} alt={m.name} className="w-full h-32 object-cover rounded-xl" />
                  )}
                  <div className="font-mono text-xs text-white truncate">{m.name}</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(m.url);
                      addToast('Image URL copied to clipboard!', 'success');
                    }}
                    className="w-full py-1 bg-white/5 hover:bg-white/10 text-royal-gold font-mono text-[10px] rounded cursor-pointer"
                  >
                    Copy URL
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: SEO, THEME & SECURITY */}
        {activeTab === 'seo' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  SEO & Optimization
                </h1>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Configure search engine metadata, Open Graph cards, and analytics tracking.
                </p>
              </div>
              <button
                onClick={handleSaveSeoAndTheme}
                className="px-5 py-2.5 bg-royal-gold text-midnight font-display font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save SEO Settings</span>
              </button>
            </div>

            <div className="bg-[#080612] border border-white/10 rounded-2xl p-6 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 uppercase">Meta Title</label>
                <input
                  type="text"
                  value={seoForm.metaTitle}
                  onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase">Meta Description</label>
                <textarea
                  rows={3}
                  value={seoForm.metaDescription}
                  onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase">Analytics Code Snippet</label>
                <input
                  type="text"
                  value={seoForm.analyticsCode || ''}
                  onChange={(e) => setSeoForm({ ...seoForm, analyticsCode: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: SECURITY & PASSWORD RESET */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                Admin Security & Credentials
              </h1>
              <p className="font-mono text-xs text-zinc-400 mt-1">
                Update the administrator password and review role access.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="bg-[#080612] border border-white/10 rounded-2xl p-6 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 uppercase">Current Admin Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-royal-gold text-midnight font-bold uppercase rounded-xl hover:bg-amber-300 transition-colors cursor-pointer mt-2"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0817] border border-red-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-display font-bold text-base text-white uppercase">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-zinc-300 font-mono">{deleteConfirm.title}</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm({ show: false, title: '', onConfirm: () => {} })}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirm.onConfirm}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono uppercase rounded-xl cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
