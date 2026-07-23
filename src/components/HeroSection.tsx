import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useCms } from '../context/CmsContext';
import { 
  ChevronRight, 
  ArrowUpRight,
  Compass,
  Calendar,
  Users,
  Video,
  Award,
  BookOpen,
  Coins
} from 'lucide-react';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  onExploreClick
}) => {
  const { cms } = useCms();
  const hero = cms.hero;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between items-center text-white overflow-hidden pt-8 pb-0 select-none bg-[#040308]">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#141028] via-[#070510] to-[#040308]" />
        
        {/* Soft Volumetric Light Beam */}
        <div 
          className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] bg-royal-gold/10 blur-[130px] rounded-full pointer-events-none"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 12}px), ${mousePos.y * 8}px)`
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-8 sm:pt-14 pb-14 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Minimalist Editorial Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start text-left space-y-7"
          >
            {/* Small Academy Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.03] border border-royal-gold/30 rounded-full text-amber-200/90 font-mono text-[11px] tracking-widest uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-royal-gold animate-pulse" />
              <span>{hero.badgeText || "Moulvibazar Debating Society • Elite Workshop Series"}</span>
            </div>

            {/* Editorial Heading */}
            <div className="space-y-3.5">
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.12] uppercase">
                {hero.headline || "The Elite Debate Academy Masterclass"}
              </h1>

              {/* Concise Impactful Subtitle */}
              <p className="font-sans text-sm sm:text-base text-zinc-300/90 max-w-lg leading-relaxed font-normal">
                {hero.description || "A 10-session masterclass engineered for championship WUDC & Asian Parliamentary debate mastery, led by 10 distinguished speakers."}
              </p>
            </div>

            {/* CTAs (52px Height, Clean & Minimal) */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-1">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 h-[52px] bg-royal-gold hover:bg-amber-300 text-midnight font-display font-bold text-xs tracking-widest rounded-xl transition-all duration-200 shadow-[0_0_25px_rgba(212,175,55,0.25)] cursor-pointer uppercase flex items-center justify-center gap-2.5 group"
              >
                <span>{hero.primaryButtonText || "Register Now"}</span>
                <ChevronRight className="w-4 h-4 text-midnight group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-7 h-[52px] bg-white/[0.04] border border-white/10 hover:border-royal-gold/40 text-zinc-200 hover:text-white font-mono text-xs tracking-widest rounded-xl transition-all duration-200 cursor-pointer uppercase flex items-center justify-center gap-2 backdrop-blur-sm group"
              >
                <span>{hero.secondaryButtonText || "View Curriculum"}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Event Key Information Metadata Row */}
            <div className="pt-6 border-t border-white/10 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
                  <BookOpen className="w-3.5 h-3.5 text-royal-gold shrink-0" />
                  <span>{hero.workshopsCount || "10 Workshops"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-royal-gold shrink-0" />
                  <span>{hero.speakersCount || "10 Speakers"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-royal-gold shrink-0" />
                  <span>Starts {hero.startDate || "10 Aug 2026"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
                  <Video className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{hero.googleMeetInfo || "Google Meet"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
                  <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Certificate Included</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-royal-gold/10 border border-royal-gold/30 rounded-lg text-amber-200 font-bold">
                  <Coins className="w-3.5 h-3.5 text-royal-gold shrink-0" />
                  <span>Fee: {hero.registrationFee || "BDT 200"}</span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* RIGHT: Cinematic Grand Debate Hall Concept Vector Artwork */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px]"
          >
            <div 
              className="relative w-full aspect-[16/11] max-w-lg transition-transform duration-500 ease-out flex items-center justify-center"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${mousePos.y * -3}deg)`
              }}
            >
              {/* Soft Ambient Light Glow Behind Illustration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-royal-gold/10 to-transparent blur-2xl rounded-full opacity-60 pointer-events-none" />

              {/* Grand Fantasy Debate Hall Vector Artwork */}
              <svg 
                viewBox="0 0 800 550" 
                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
              >
                <defs>
                  <radialGradient id="roseWindowLight" cx="50%" cy="35%" r="55%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#d4af37" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#040308" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#100d24" />
                    <stop offset="100%" stopColor="#05040a" />
                  </linearGradient>

                  <linearGradient id="podiumGold" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3d2f14" />
                    <stop offset="100%" stopColor="#100b1a" />
                  </linearGradient>
                </defs>

                {/* Rear Gothic Chamber Wall */}
                <rect x="40" y="30" width="720" height="490" rx="16" fill="url(#wallGradient)" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.3" />

                {/* Majestic Gothic Arches */}
                <path d="M 80 520 L 80 180 Q 400 20 720 180 L 720 520 Z" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.4" />
                <path d="M 120 520 L 120 200 Q 400 50 680 200 L 680 520 Z" fill="#090716" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.25" />

                {/* Stained Glass Rose Window */}
                <circle cx="400" cy="160" r="85" fill="#120e2a" stroke="#d4af37" strokeWidth="2" strokeOpacity="0.6" />
                <circle cx="400" cy="160" r="65" fill="url(#roseWindowLight)" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.5" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line 
                    key={i} 
                    x1="400" 
                    y1="160" 
                    x2={400 + 65 * Math.cos((angle * Math.PI) / 180)} 
                    y2={160 + 65 * Math.sin((angle * Math.PI) / 180)} 
                    stroke="#d4af37" 
                    strokeWidth="1.2" 
                    strokeOpacity="0.5" 
                  />
                ))}

                {/* Volumetric Rays onto Floor */}
                <polygon points="335,200 465,200 600,520 200,520" fill="url(#roseWindowLight)" opacity="0.3" />

                {/* Towering Library Shelves Flanking the Hall */}
                {/* Left Bookshelf */}
                <rect x="70" y="220" width="70" height="300" fill="#0d0a1d" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.3" />
                {[260, 310, 360, 410, 460, 510].map((y, i) => (
                  <g key={i}>
                    <line x1="70" y1={y} x2="140" y2={y} stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
                    <rect x="75" y={y - 18} width="10" height="18" fill="#9a6c18" />
                    <rect x="87" y={y - 22} width="12" height="22" fill="#3b2b81" />
                    <rect x="101" y={y - 16} width="14" height="16" fill="#815012" />
                    <rect x="117" y={y - 20} width="11" height="20" fill="#d4af37" opacity="0.7" />
                  </g>
                ))}

                {/* Right Bookshelf */}
                <rect x="660" y="220" width="70" height="300" fill="#0d0a1d" stroke="#d4af37" strokeWidth="0.8" strokeOpacity="0.3" />
                {[260, 310, 360, 410, 460, 510].map((y, i) => (
                  <g key={i}>
                    <line x1="660" y1={y} x2="730" y2={y} stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
                    <rect x="665" y={y - 20} width="11" height="20" fill="#d4af37" opacity="0.7" />
                    <rect x="678" y={y - 16} width="14" height="16" fill="#815012" />
                    <rect x="694" y={y - 22} width="12" height="22" fill="#3b2b81" />
                    <rect x="708" y={y - 18} width="10" height="18" fill="#9a6c18" />
                  </g>
                ))}

                {/* Ancient Stone Floor & Rune Floor Engravings */}
                <polygon points="120,520 680,520 620,410 180,410" fill="#0b0817" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.3" />
                <ellipse cx="400" cy="465" rx="130" ry="35" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3,3" />

                {/* Dual Speaker Lecterns / Debate Podiums */}
                {/* Government Podium (Left) */}
                <g>
                  <path d="M 230 490 L 290 490 L 280 410 L 240 410 Z" fill="url(#podiumGold)" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.7" />
                  <polygon points="225,410 295,410 290,400 230,400" fill="#3b2b18" stroke="#f5d76e" strokeWidth="1" />
                  <rect x="245" y="396" width="30" height="8" rx="2" fill="#fef3c7" stroke="#9a6c18" strokeWidth="0.8" />
                  <path d="M 275 392 L 285 375" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Opposition Podium (Right) */}
                <g>
                  <path d="M 510 490 L 570 490 L 560 410 L 520 410 Z" fill="url(#podiumGold)" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.7" />
                  <polygon points="505,410 575,410 570,400 510,400" fill="#3b2b18" stroke="#f5d76e" strokeWidth="1" />
                  <rect x="525" y="396" width="30" height="8" rx="2" fill="#fef3c7" stroke="#9a6c18" strokeWidth="0.8" />
                  <path d="M 555 392 L 565 375" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Floating Candle Light Particles */}
                {[
                  { cx: 220, cy: 200 },
                  { cx: 310, cy: 170 },
                  { cx: 490, cy: 170 },
                  { cx: 580, cy: 200 },
                  { cx: 360, cy: 260 },
                  { cx: 440, cy: 260 }
                ].map((candle, idx) => (
                  <g key={idx}>
                    <circle cx={candle.cx} cy={candle.cy - 10} r="10" fill="#fef08a" opacity="0.2" />
                    <circle cx={candle.cx} cy={candle.cy - 10} r="3.5" fill="#f5d76e" />
                    <rect x={candle.cx - 1} y={candle.cy - 6} width="2" height="10" fill="#fef3c7" rx="0.5" />
                  </g>
                ))}
              </svg>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle Bottom Section Divider */}
      <div className="relative w-full z-20 overflow-hidden pt-2">
        <div className="relative w-full flex flex-col items-center">
          <div className="w-full max-w-4xl px-4 flex flex-col items-center">
            <div className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-royal-gold/25 to-transparent" />
            <div className="w-full h-3 bg-gradient-to-r from-transparent via-[#080712] to-transparent flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-0.5 bg-[#040308] border border-royal-gold/25 rounded-full text-royal-gold text-[9px] font-mono tracking-widest uppercase -translate-y-1">
                <Compass className="w-3 h-3 text-royal-gold" />
                <span>Explore Workshop Curriculum</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



