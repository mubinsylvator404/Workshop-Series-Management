import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, Award, Check, X, Twitter, Linkedin } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { playPaperSound, playBookOpenSound } from '../utils/soundEffects';

interface Speaker {
  id: string;
  name: string;
  designation: string;
  topic: string;
  credentials: string[];
  bio: string;
  avatar: string;
  socials?: { twitter?: string; linkedin?: string };
}

const SPEAKERS_DATA: Speaker[] = [
  {
    id: 'prof-jil-jawsan',
    name: 'Jil Jawsan',
    designation: 'Grand Debater & Adjudicator',
    topic: 'Championship Debate Strategy & Adjudication',
    credentials: [
      'Champion — MGBSDC Nationals 2025',
      'Champion — MISTDS Nationals 2025',
      'Champion — JUDO Nationals 2025',
      'Champion — BUTEXDC Nationals 2024',
      'Champion — DIUDC বিতর্ক মহাযজ্ঞ ২০২৪',
      'Champion — NITER IV',
      'Champion — DCU Women\'s Debate Championship',
      'Champion — 3rd Krishi Debate Festival'
    ],
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    socials: {}
  }
];

// Single Clean Editorial Speaker Card component
function SpeakerCard({
  speaker,
  onSelect
}: {
  speaker: Speaker;
  onSelect: (speaker: Speaker) => void;
  key?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        playPaperSound();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(speaker)}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#06060a] border rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-colors duration-500 select-none ${
        isHovered
          ? 'border-amber-400/60 shadow-[0_15px_35px_rgba(212,175,55,0.12)]'
          : 'border-amber-500/20 shadow-lg'
      }`}
    >
      {/* Subtle Golden Shimmer Line at Top */}
      <div
        className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dynamic Cursor Light Reflection Overlay */}
      {isHovered && (
        <div
          className="absolute pointer-events-none rounded-full transition-all duration-75 ease-out opacity-20 mix-blend-screen"
          style={{
            width: '260px',
            height: '260px',
            left: `${mousePos.x - 130}px`,
            top: `${mousePos.y - 130}px`,
            background: 'radial-gradient(circle, rgba(245,215,110,0.5) 0%, transparent 70%)'
          }}
        />
      )}

      {/* Soft Gold Gradient Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Card Content Stack: ONLY Portrait, Name, Designation, Workshop Topic */}
      <div className="space-y-4 relative z-10">
        {/* Professional Portrait */}
        <div className="w-full aspect-[4/5] rounded-xl overflow-hidden relative border border-amber-500/20 group-hover:border-amber-400/50 transition-colors duration-500 bg-black shadow-xl">
          <img
            src={speaker.avatar}
            alt={speaker.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-105 brightness-95 group-hover:brightness-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-transparent to-transparent opacity-50" />
        </div>

        {/* Full Name & Designation */}
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-lg sm:text-xl text-amber-100 group-hover:text-amber-300 transition-colors tracking-wide leading-tight">
            {speaker.name}
          </h3>
          <p className="font-sans text-[11px] uppercase tracking-wider text-amber-400/90 font-medium leading-tight">
            {speaker.designation}
          </p>
        </div>

        {/* Assigned Workshop Topic */}
        <div className="p-3 bg-amber-500/[0.04] border-l-2 border-amber-400/80 rounded-r border-y border-r border-amber-500/10 space-y-0.5">
          <span className="font-sans text-[9px] uppercase tracking-widest text-amber-400/80 font-semibold block">
            Workshop Topic
          </span>
          <p className="font-serif italic text-xs text-zinc-200 leading-snug line-clamp-2">
            "{speaker.topic}"
          </p>
        </div>
      </div>

      {/* View Profile Action Button */}
      <div className="pt-4 mt-4 border-t border-amber-500/15 relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(speaker);
          }}
          className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 border border-amber-500/30 group-hover:border-amber-400/60 text-amber-300 text-xs font-sans uppercase tracking-widest flex items-center justify-center gap-2 transition-all font-medium cursor-pointer"
        >
          <span>View Profile</span>
          <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

export default function SpeakerPage() {
  const { cms } = useCms();
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const speakersList: Speaker[] = (cms.speakers && cms.speakers.length > 0)
    ? cms.speakers.map((s) => ({
        id: s.id,
        name: s.name,
        designation: s.title || 'Senior Fellow',
        topic: s.assignedTopic || s.topic || s.achievements?.[0] || 'Championship Debate Strategy',
        credentials: s.achievements || ['Faculty Adjudicator'],
        bio: s.bio || '',
        avatar: s.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        socials: s.socials || {}
      }))
    : SPEAKERS_DATA;

  // Background subtle gold dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 800;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{ x: number; y: number; radius: number; vy: number; vx: number; alpha: number }> = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.4,
        vy: -(Math.random() * 0.2 + 0.08),
        vx: Math.random() * 0.3 - 0.15,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = '#d4af37';
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#d4af37';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openSpeakerDetail = (speaker: Speaker) => {
    playBookOpenSound();
    setSelectedSpeaker(speaker);
  };

  const closeSpeakerDetail = () => {
    playPaperSound();
    setSelectedSpeaker(null);
  };

  useEffect(() => {
    if (selectedSpeaker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSpeaker]);

  return (
    <div
      id="speakers-section"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:px-12 bg-[#030306] text-[#f4efe8] overflow-hidden select-none font-sans"
    >
      {/* Soft Ambient Radial Gold Background Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_70%)]" />

      {/* Particle Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Minimal Luxury Editorial Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-amber-400/90 font-medium block">
            FACULTY & LECTURERS
          </span>

          <h2 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl text-amber-100 tracking-wider uppercase">
            Featured Speakers
          </h2>

          <div className="w-12 h-[1px] bg-amber-400/40 mx-auto" />

          <p className="font-serif italic text-amber-200/70 text-base md:text-lg leading-relaxed font-light">
            Champion debaters and adjudicators conducting masterclasses at the academy.
          </p>
        </div>

        {/* Clean Speaker Cards Grid with Generous Whitespace */}
        {speakersList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
            {speakersList.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                onSelect={openSpeakerDetail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 border border-amber-500/20 rounded-2xl bg-black/40 backdrop-blur-md max-w-lg mx-auto space-y-3">
            <p className="font-display uppercase tracking-widest text-amber-200 text-sm">No Professors Listed</p>
            <p className="font-serif italic text-xs text-zinc-400">Professors and speakers can be added manually via the Admin Dashboard (/admin).</p>
          </div>
        )}
      </div>

      {/* Dedicated Speaker Profile View Modal */}
      <AnimatePresence>
        {selectedSpeaker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-[#040307]/95 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-[#0b0a11] border border-amber-500/40 rounded-2xl max-w-2xl w-full p-5 sm:p-8 md:p-10 relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.98)] space-y-6 my-auto max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeSpeakerDetail}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 min-w-[48px] min-h-[48px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Portrait & Name Header */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-xl overflow-hidden border border-amber-500/35 shrink-0 bg-black shadow-2xl mx-auto sm:mx-0">
                  <img
                    src={selectedSpeaker.avatar}
                    alt={selectedSpeaker.name}
                    className="w-full h-full object-cover filter contrast-105 brightness-95"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-3">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-amber-400 font-semibold px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full inline-block">
                    Faculty Profile
                  </span>
                  <h3 className="font-display font-semibold text-2xl sm:text-3xl text-amber-100 tracking-wide">
                    {selectedSpeaker.name}
                  </h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-amber-400 font-medium leading-relaxed">
                    {selectedSpeaker.designation}
                  </p>

                  {/* Social Links with min 48px touch target */}
                  {selectedSpeaker.socials && (
                    <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                      {selectedSpeaker.socials.twitter && (
                        <a
                          href={selectedSpeaker.socials.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="min-w-[48px] min-h-[48px] rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors flex items-center justify-center"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {selectedSpeaker.socials.linkedin && (
                        <a
                          href={selectedSpeaker.socials.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="min-w-[48px] min-h-[48px] rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors flex items-center justify-center"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Workshop Topic */}
              <div className="p-4 bg-amber-500/[0.04] border-l-2 border-amber-400 rounded-r border-y border-r border-amber-500/10 space-y-1">
                <span className="font-sans text-xs uppercase tracking-widest text-amber-400 font-semibold block">
                  Assigned Workshop Topic
                </span>
                <p className="font-serif italic text-base text-zinc-100">
                  "{selectedSpeaker.topic}"
                </p>
              </div>

              {/* Complete Credentials & Achievements */}
              <div className="space-y-3 pt-2 border-t border-amber-500/20">
                <h4 className="font-sans text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Key Credentials & Achievements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSpeaker.credentials.map((cred, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-900/60 border border-amber-500/15 rounded-xl flex items-center gap-2.5"
                    >
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-sans text-xs text-zinc-200">{cred}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return to Directory Button */}
              <div className="pt-4 border-t border-amber-500/20 flex justify-end">
                <button
                  onClick={closeSpeakerDetail}
                  className="px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl font-sans text-xs tracking-widest uppercase transition-colors flex items-center gap-2 font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Faculty Directory</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
