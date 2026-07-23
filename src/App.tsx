import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  UserCheck, 
  Cpu, 
  HelpCircle, 
  Scroll, 
  Compass, 
  Trophy, 
  Menu,
  X,
  Wand2,
  Lock
} from 'lucide-react';

import LoadingScreen from './components/LoadingScreen';
import MagicWand from './components/MagicWand';
import AudioEngine from './components/AudioEngine';
import WorkshopSeries from './components/WorkshopSeries';
import SpeakerPage from './components/SpeakerPage';
import RegistrationForm from './components/RegistrationForm';
import AccountActivation from './components/AccountActivation';
import InteractiveAIPanel from './components/InteractiveAIPanel';
import Dashboard from './components/Dashboard';
import EasterEggs from './components/EasterEggs';
import { HeroSection } from './components/HeroSection';
import { AdminApp } from './components/admin/AdminApp';
import { ACADEMY_BLOG_POSTS, ACADEMY_FAQS } from './data/academyData';
import { StudentProfile } from './types';

const VIEW_PATHS: Record<string, string> = {
  home: '/',
  workshops: '/workshops',
  professors: '/professors',
  registration: '/registration',
  dashboard: '/my-chamber',
  admin: '/admin',
  activate: '/activate'
};

const getViewFromPath = (): 'home' | 'workshops' | 'professors' | 'registration' | 'dashboard' | 'admin' | 'activate' => {
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (search.includes('activate_token') || search.includes('activate_email') || path.startsWith('/activate') || hash.includes('activate')) {
    return 'activate';
  }
  if (path.startsWith('/admin') || search.includes('view=admin') || search.includes('admin=true') || hash.includes('admin')) {
    return 'admin';
  }
  if (path.startsWith('/my-chamber') || path.startsWith('/dashboard') || path.startsWith('/login') || search.includes('view=dashboard') || hash.includes('my-chamber') || hash.includes('dashboard')) {
    return 'dashboard';
  }
  if (path.startsWith('/workshops') || search.includes('view=workshops') || hash.includes('workshops')) {
    return 'workshops';
  }
  if (path.startsWith('/professors') || search.includes('view=professors') || hash.includes('professors')) {
    return 'professors';
  }
  if (path.startsWith('/registration') || path.startsWith('/post-office') || search.includes('view=registration') || hash.includes('registration')) {
    return 'registration';
  }
  return 'home';
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'home' | 'workshops' | 'professors' | 'registration' | 'dashboard' | 'admin' | 'activate'>(getViewFromPath);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sync route with browser location and listen to popstate & hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      setActiveView(getViewFromPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToView = (view: 'home' | 'workshops' | 'professors' | 'registration' | 'dashboard' | 'admin' | 'activate') => {
    setActiveView(view);
    setShowMobileMenu(false);
    const targetPath = VIEW_PATHS[view] || '/';
    if (window.location.pathname.toLowerCase() !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }
  };
  
  // Parallax mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Scroll depth for portal opening
  const [scrollProgress, setScrollProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tracks cursor/mouse coordinates for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Tracks scroll progress for the Magic Portal
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setScrollProgress(window.scrollY / maxScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Setup animated background canvas (Fireflies and shooting stars)
  useEffect(() => {
    if (isLoading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Firefly Particles (reduced on mobile for 60fps performance)
    const isMobile = width < 768;
    const fireflyCount = isMobile ? 18 : 40;
    const fireflies: Array<{ x: number; y: number; r: number; speed: number; alpha: number; angle: number }> = [];
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2
      });
    }

    // Shooting stars
    const shootingStars: Array<{ x: number; y: number; len: number; speed: number; active: boolean }> = [];
    const createStar = () => {
      return {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 5,
        active: true
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Procedural Fireflies
      fireflies.forEach((p) => {
        p.y -= p.speed;
        p.x += Math.sin(p.angle) * 0.2;
        p.angle += 0.01;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#D4AF37';
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha * (Math.sin(p.angle * 2) * 0.3 + 0.7)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Periodic Shooting Stars
      if (Math.random() < 0.005 && shootingStars.length < 2) {
        shootingStars.push(createStar());
      }

      shootingStars.forEach((star, idx) => {
        if (!star.active) return;
        ctx.save();
        ctx.strokeStyle = 'rgba(89, 225, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x + star.len, star.y + star.len * 0.5);
        ctx.stroke();
        ctx.restore();

        star.x += star.speed;
        star.y += star.speed * 0.5;

        if (star.x > width || star.y > height) {
          star.active = false;
        }
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, [isLoading]);

  const handleRegisterSuccess = (student: StudentProfile) => {
    setStudentProfile(student);
    navigateToView('dashboard');
  };

  const handleXpBoost = (xpGained: number, coinsGained: number) => {
    if (!studentProfile) return;
    const updated = {
      ...studentProfile,
      xp: (studentProfile.xp || 0) + xpGained,
      coins: (studentProfile.coins || 0) + coinsGained
    };
    setStudentProfile(updated);
    localStorage.setItem('mds_student_session', JSON.stringify(updated));
  };

  const handleHouseSorted = (house: string) => {
    if (studentProfile) {
      handleXpBoost(100, 50);
    }
  };

  return (
    <div id="academy-app-root" className="min-h-screen flex flex-col justify-between relative bg-[#05060f] text-[#e0d8d0] overflow-x-hidden selection:bg-royal-gold selection:text-black">
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <MagicWand />
          <AudioEngine />

          {/* Core Atmospheric Glow elements */}
          <div className="absolute inset-0 opacity-45 pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-950/40 blur-[130px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-950/30 blur-[110px]"></div>
          </div>

          <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Navbar with glassmorphism and magic rune animations */}
          <header
            id="academy-glass-navbar"
            className={`fixed top-0 inset-x-0 z-45 transition-all duration-500 px-4 py-3.5 ${
              scrolled
                ? 'bg-black/85 border-b border-royal-gold/20 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                : 'bg-transparent border-b border-transparent'
            }`}
          >
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              {/* Logo with enchanted aura */}
              <div 
                onClick={() => navigateToView('home')}
                className="flex items-center gap-3.5 cursor-pointer relative group"
              >
                <div className="w-9 h-9 border-2 border-royal-gold rotate-45 flex items-center justify-center shrink-0 shadow-lg shadow-royal-gold/10 group-hover:scale-110 transition-transform">
                  <div className="-rotate-45 text-royal-gold flex items-center justify-center">
                    <BookOpen className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div className="text-left">
                  <span className="font-display font-black text-xs md:text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-royal-gold via-warm-candle to-royal-gold block uppercase group-hover:tracking-wider transition-all">
                    MDS
                  </span>
                  <span className="font-serif italic text-[9px] text-zinc-500 block leading-none">
                    Moulvibazar Debating Society
                  </span>
                </div>
              </div>

              {/* Navigation links with golden rune animations */}
              <nav className="hidden lg:flex items-center gap-1">
                {[
                  { id: 'home', label: 'Grand Hall', icon: <Compass className="w-3.5 h-3.5" /> },
                  { id: 'workshops', label: 'Scroll Classes', icon: <Scroll className="w-3.5 h-3.5" /> },
                  { id: 'professors', label: 'Professors', icon: <Compass className="w-3.5 h-3.5" /> },
                  { id: 'registration', label: 'Post Office', icon: <UserCheck className="w-3.5 h-3.5" /> },
                  { id: 'dashboard', label: 'My Chamber', icon: <Trophy className="w-3.5 h-3.5" /> }
                ].map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateToView(item.id as any)}
                      className={`relative px-4 py-2 rounded-full font-mono text-[9px] tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'text-black bg-gradient-to-r from-royal-gold to-warm-candle font-black shadow-lg shadow-royal-gold/20'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      
                      {/* Magical hover golden rune lines */}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[5px] text-royal-gold/60 opacity-0 hover:opacity-100 transition-opacity font-bold">
                        ᚛᚜᚛᚜
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Toggle mobile menu button with 48px touch target */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-3 min-w-[48px] min-h-[48px] flex items-center justify-center text-royal-gold hover:text-warm-candle transition-all cursor-pointer rounded-xl bg-zinc-900/40 border border-royal-gold/20"
                aria-label="Toggle navigation menu"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile menu slide-over drawer */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden absolute top-full inset-x-0 bg-[#08070F]/95 border-b border-royal-gold/30 backdrop-blur-2xl px-4 py-5 space-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  {[
                    { id: 'home', label: 'Grand Hall', icon: <Compass className="w-4 h-4 text-royal-gold" /> },
                    { id: 'workshops', label: 'Scroll Classes', icon: <Scroll className="w-4 h-4 text-royal-gold" /> },
                    { id: 'professors', label: 'Professors', icon: <Compass className="w-4 h-4 text-royal-gold" /> },
                    { id: 'registration', label: 'Post Office', icon: <UserCheck className="w-4 h-4 text-royal-gold" /> },
                    { id: 'dashboard', label: 'My Chamber', icon: <Trophy className="w-4 h-4 text-royal-gold" /> }
                  ].map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateToView(item.id as any)}
                        className={`w-full text-left py-3.5 px-4 min-h-[48px] rounded-xl font-mono text-xs tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer border ${
                          isActive
                            ? 'bg-gradient-to-r from-royal-gold to-warm-candle text-midnight font-black border-royal-gold/60 shadow-lg shadow-royal-gold/20'
                            : 'bg-zinc-950/60 text-zinc-300 border-royal-gold/10 hover:border-royal-gold/30 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {isActive && <Sparkles className="w-4 h-4 text-midnight animate-pulse" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          <main className="flex-grow pt-24 z-10 relative">
            <AnimatePresence mode="wait">
              {activeView === 'home' && (
                <motion.div
                  key="home-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-16"
                >
                  {/* Redesigned Cinematic Fantasy Hero Section */}
                  <HeroSection
                    onRegisterClick={() => navigateToView('registration')}
                    onExploreClick={() => navigateToView('workshops')}
                  />

                  {/* MAGICAL PORTAL AREA */}
                  {/* Opens wide as user scrolls down! */}
                  <section className="relative py-24 flex flex-col items-center justify-center overflow-hidden border-t border-zinc-900/40">
                    <div className="text-center space-y-2 mb-12">
                      <h3 className="font-display font-black text-lg text-royal-gold uppercase tracking-widest">
                        The Portal of Scribes
                      </h3>
                      <p className="font-serif italic text-xs text-zinc-400 max-w-sm mx-auto">
                        "Scroll downwards or click below to trigger the golden seal and cross the barrier."
                      </p>
                    </div>

                    {/* Grand Vector Glowing Portal */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                      {/* Glowing Ring 1 (Rotates) */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border-4 border-dashed border-royal-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.15)]"
                      />
                      
                      {/* Glowing Ring 2 (Counter Rotates) */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-4 rounded-full border border-double border-magic-cyan/30"
                      />

                      {/* Portal Inner Gate (Scales open as scroll progress increases or when hovered) */}
                      <motion.button
                        onClick={() => navigateToView('workshops')}
                        whileHover={{ scale: 1.05 }}
                        className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-[#1A1830] via-[#0D0C16] to-[#1A1830] border border-royal-gold/60 flex flex-col items-center justify-center shadow-[inset_0_0_30px_rgba(89,225,255,0.2)] text-center relative z-20 overflow-hidden cursor-pointer group"
                      >
                        {/* Particle stream in portal */}
                        <div className="absolute inset-0 bg-[radial-gradient(#59e1ff_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                        
                        <Sparkles className="w-6 h-6 text-royal-gold mb-2 group-hover:animate-spin" />
                        <span className="font-display font-black text-[10px] tracking-widest text-royal-gold uppercase">
                          Workshop World
                        </span>
                        <span className="font-serif italic text-[9px] text-[#CFCFCF] px-4 block">
                          "Break the barrier"
                        </span>
                      </motion.button>
                    </div>
                  </section>

                  {/* Meet the Professors Section */}
                  <section className="border-t border-amber-500/20">
                    <SpeakerPage />
                  </section>

                  {/* Interactive House Sorting & Daily Prophecy Section */}
                  <section className="border-t border-zinc-900/60 pt-10">
                    <div className="text-center space-y-2 mb-6">
                      <h3 className="font-display font-bold text-lg text-royal-gold uppercase tracking-widest">
                        Academy Dormitory Sorting
                      </h3>
                      <p className="font-serif italic text-xs text-zinc-400 max-w-sm mx-auto">
                        "Sort your logical alignments, and fetch your daily horoscope scroll."
                      </p>
                    </div>

                    <EasterEggs 
                      onHouseSorted={handleHouseSorted}
                      userEmail={studentProfile?.email || ''}
                    />
                  </section>

                  {/* Library Strategy Scrolls (Blog Posts) */}
                  <section className="max-w-5xl mx-auto px-4 space-y-8 border-t border-zinc-900/60 pt-12">
                    <div className="text-center space-y-2">
                      <span className="font-mono text-[9px] text-royal-gold tracking-widest block uppercase">THE ARCHIVE ROOM</span>
                      <h3 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wider">Library Strategy Scrolls</h3>
                      <p className="font-serif italic text-xs text-zinc-400">"Read actual journals recorded by MDS professors."</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ACADEMY_BLOG_POSTS.map((post) => (
                        <div
                          key={post.id}
                          className="bg-gradient-to-b from-[#1A1830]/30 to-[#0D0C16] border border-royal-gold/15 p-6 rounded-2xl space-y-4 hover:border-royal-gold/30 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-mono text-royal-gold">
                              <span>{post.category}</span>
                              <span>{post.readTime}</span>
                            </div>
                            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide leading-tight">
                              {post.title}
                            </h4>
                            <p className="text-xs text-zinc-400 font-serif leading-relaxed line-clamp-3">
                              {post.content}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-zinc-900/60 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                            <span>BY {post.author.toUpperCase()}</span>
                            <span>{post.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* FAQ Accordion */}
                  <section className="max-w-3xl mx-auto px-4 pb-16 space-y-8 border-t border-zinc-900/60 pt-12">
                    <div className="text-center space-y-2">
                      <h3 className="font-display font-black text-xl text-white uppercase tracking-wider">
                        Frequently Whispered
                      </h3>
                      <p className="font-serif italic text-xs text-zinc-400">"Answers to the most common queries about MDS Elite workshops."</p>
                    </div>

                    <div className="space-y-3">
                      {ACADEMY_FAQS.map((faq, idx) => (
                        <div key={idx} className="bg-[#0D0C16]/80 border border-royal-gold/15 p-4.5 rounded-xl space-y-1.5">
                          <h4 className="font-display font-bold text-xs text-royal-gold uppercase tracking-wider flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-royal-gold shrink-0" />
                            {faq.q}
                          </h4>
                          <p className="text-xs text-zinc-450 font-serif leading-relaxed pl-6">
                            {faq.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeView === 'workshops' && (
                <motion.div
                  key="workshops-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <WorkshopSeries />
                </motion.div>
              )}

              {activeView === 'professors' && (
                <motion.div
                  key="professors-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <SpeakerPage />
                </motion.div>
              )}

              {activeView === 'registration' && (
                <motion.div
                  key="registration-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <RegistrationForm onRegisterSuccess={handleRegisterSuccess} />
                </motion.div>
              )}

              {activeView === 'activate' && (() => {
                const getQueryParam = (name: string) => {
                  const searchParams = new URLSearchParams(window.location.search);
                  if (searchParams.get(name)) return searchParams.get(name) || '';
                  if (window.location.hash.includes('?')) {
                    const hashSearch = new URLSearchParams(window.location.hash.split('?')[1]);
                    if (hashSearch.get(name)) return hashSearch.get(name) || '';
                  }
                  return '';
                };

                const emailParam = getQueryParam('activate_email') || getQueryParam('email');
                const tokenParam = getQueryParam('activate_token') || getQueryParam('token');

                return (
                  <motion.div
                    key="activate-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <AccountActivation
                      initialEmail={emailParam}
                      initialToken={tokenParam}
                      onActivationSuccess={() => {
                        navigateToView('dashboard');
                      }}
                    />
                  </motion.div>
                );
              })()}

              {activeView === 'dashboard' && (
                <motion.div
                  key="dashboard-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <Dashboard
                    studentProfile={studentProfile}
                    onXpBoost={handleXpBoost}
                    onNavigateToRegister={() => navigateToView('registration')}
                  />
                </motion.div>
              )}

              {activeView === 'admin' && (
                <motion.div
                  key="admin-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <AdminApp />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer - Ancient Library design */}
          <footer className="border-t border-royal-gold/15 bg-black/85 py-10 text-center text-zinc-500 font-mono text-[9px] tracking-widest uppercase z-0 relative">
            <div className="max-w-6xl mx-auto px-4 space-y-3">
              <p>© 2026 Moulvibazar Debating Society (MDS). All logical rights preserved.</p>
              <div className="flex items-center justify-center gap-4 text-zinc-600">
                <span>The Scribe Academy is fully protected under logic-linkage wards.</span>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
