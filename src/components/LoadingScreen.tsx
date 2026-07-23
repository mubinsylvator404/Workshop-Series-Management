import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'closed' | 'opening' | 'flipping' | 'glow' | 'logo'>('closed');
  const [statusText, setStatusText] = useState('Opening the registries...');

  useEffect(() => {
    // Stage-based animation trigger
    const timer1 = setTimeout(() => setStage('opening'), 400);
    const timer2 = setTimeout(() => setStage('flipping'), 1500);
    const timer3 = setTimeout(() => setStage('glow'), 2500);
    const timer4 = setTimeout(() => setStage('logo'), 3500);

    const statuses = [
      'Retrieving the Ancient Ledger...',
      'Breaking the wax seal of MDS...',
      'Casting the Lumos Spell...',
      'Summoning the Great Hall of Debate...',
      'Unveiling the castle towers...',
      'Academy gates are open!'
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 6) + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 1200);
          return 100;
        }

        const index = Math.min(
          Math.floor((next / 100) * statuses.length),
          statuses.length - 1
        );
        setStatusText(statuses[index]);

        return next;
      });
    }, 100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        id="academy-loading-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
        className="fixed inset-0 bg-[#0D0C16] z-[99999] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Magic Purple & Cyan Atmospheric Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1A1830] rounded-full blur-[140px] opacity-60 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#59E1FF]/10 rounded-full blur-[100px] opacity-40 pointer-events-none animate-pulse" />

        {/* 3D perspective wrapper */}
        <div className="perspective-[1200px] w-80 h-96 flex items-center justify-center relative z-10 scale-90 md:scale-100">
          
          {/* Glowing Aura emanating from the book */}
          <AnimatePresence>
            {(stage === 'glow' || stage === 'logo') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.3, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-royal-gold/20 via-warm-candle/30 to-magic-cyan/10 blur-3xl"
              />
            )}
          </AnimatePresence>

          {/* Magical Light Rays */}
          <AnimatePresence>
            {stage === 'glow' && (
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 0.6, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
                className="absolute inset-0 pointer-events-none mix-blend-screen"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full stroke-warm-candle/15 stroke-[0.5]">
                  <line x1="100" y1="0" x2="100" y2="200" />
                  <line x1="0" y1="100" x2="200" y2="100" />
                  <line x1="30" y1="30" x2="170" y2="170" />
                  <line x1="170" y1="30" x2="30" y2="170" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Grimoire: 3D Animated Book */}
          <motion.div
            className="w-64 h-80 relative transform-style-3d select-none"
            animate={{
              rotateX: stage === 'closed' ? 15 : 0,
              rotateY: stage === 'closed' ? -25 : 0,
              rotateZ: stage === 'closed' ? -5 : 0,
              y: stage === 'closed' ? 20 : [0, -8, 0],
            }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              default: { duration: 1.5, ease: 'easeOut' }
            }}
          >
            {/* Left Cover (underneath, rotates out) */}
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-l from-[#4a3a1f] to-[#1e1405] border-y-2 border-l-2 border-royal-gold/40 rounded-l-lg origin-right shadow-2xl z-20 flex items-center justify-end pr-4"
              style={{ backfaceVisibility: 'hidden' }}
              animate={{ rotateY: stage !== 'closed' ? -180 : 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <div className="w-1.5 h-full bg-royal-gold/20 absolute left-2" />
            </motion.div>

            {/* Right Cover */}
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-[#4a3a1f] to-[#1e1405] border-y-2 border-r-2 border-royal-gold/40 rounded-r-lg shadow-2xl z-10 flex items-center justify-start pl-4">
              <div className="w-1.5 h-full bg-royal-gold/20 absolute right-2" />
            </div>

            {/* Spine */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-[#1c1204] via-[#423319] to-[#1c1204] z-30 shadow-inner" />

            {/* Flipping Pages Stack (Central) */}
            <div className="absolute inset-y-1 left-[8px] right-[8px] bg-[#f7eed3] rounded-sm z-15 shadow-inner border border-stone-300">
              {/* Paper Texture lines */}
              <div className="absolute inset-0 bg-gradient-to-r from-stone-400/20 via-transparent to-stone-400/20" />
              <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-[1px] bg-stone-500/30" />
            </div>

            {/* Dynamic Flipping Page 1 */}
            <AnimatePresence>
              {stage === 'flipping' && (
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: -180 }}
                  exit={{ rotateY: -180 }}
                  transition={{ duration: 0.8, ease: 'easeInOut', repeat: 2 }}
                  className="absolute inset-y-1 right-1/2 w-[120px] bg-[#eedeb3] border-r border-stone-300 origin-right z-18 shadow-md"
                  style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-stone-400/20 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ancient Runes appearing on Pages */}
            <AnimatePresence>
              {(stage === 'glow' || stage === 'logo') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-y-4 inset-x-6 z-25 flex justify-between pointer-events-none text-[#5a4831]"
                >
                  {/* Left open page text */}
                  <div className="w-[45%] font-serif italic text-[6px] md:text-[8px] leading-relaxed text-left space-y-1">
                    <p className="font-display font-bold text-[#9e2a2b] border-b border-[#5a4831]/20 pb-0.5">CHAMBER SPELLS</p>
                    <p>I. Mitigatio Linkages</p>
                    <p>II. Even-If Armor</p>
                    <p>III. First Principle Sigil</p>
                    <p className="pt-2 text-[5px] text-[#816543] font-mono">"In public eloquence, words forge reality, logic anchors truth."</p>
                  </div>
                  {/* Right open page text */}
                  <div className="w-[45%] font-serif italic text-[6px] md:text-[8px] leading-relaxed text-right space-y-1">
                    <p className="font-display font-bold text-[#9e2a2b] border-b border-[#5a4831]/20 pb-0.5 text-right">ORACLE LAWS</p>
                    <p>1. Rule of Adjudicator Mind</p>
                    <p>2. Pre-emptive Counter Wards</p>
                    <p>3. Extension Blazing Runes</p>
                    <p className="pt-2 text-[5px] text-[#816543] font-mono text-right">"Cast thy argument with peerless structure."</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Rising MDS LOGO & Spread Magic */}
        <div className="h-28 flex flex-col items-center justify-center mt-6 z-20 text-center px-4 max-w-sm">
          <AnimatePresence mode="wait">
            {stage === 'logo' ? (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2 justify-center text-royal-gold">
                  <Sparkles className="w-5 h-5 text-royal-gold animate-bounce" />
                  <span className="font-display text-xl md:text-2xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-royal-gold via-warm-candle to-royal-gold block uppercase">
                    MDS
                  </span>
                  <Sparkles className="w-5 h-5 text-royal-gold animate-pulse" />
                </div>
                <p className="font-marcellus text-[10px] text-magic-cyan tracking-[0.3em] uppercase">
                  Chamber of Elite Debate
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="loading-percentage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs text-royal-gold tracking-[0.2em] uppercase"
              >
                Tuning Magical Frequencies...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar with Magic Fill */}
        <div className="w-64 bg-[#1A1830] border border-royal-gold/20 h-1 rounded-full overflow-hidden mb-3 relative z-10">
          <motion.div
            className="bg-gradient-to-r from-royal-gold via-warm-candle to-magic-cyan h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Whispers */}
        <div className="flex items-center gap-1.5 justify-center z-10 h-6">
          <span className="font-mono text-[10px] text-royal-gold/80 tracking-widest font-bold">{progress}%</span>
          <span className="text-zinc-600 font-mono text-[10px]">•</span>
          <span className="font-serif italic text-xs text-[#CFCFCF] tracking-wide animate-pulse">
            {statusText}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
