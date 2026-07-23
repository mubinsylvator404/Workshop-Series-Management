import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCms } from '../context/CmsContext';
import {
  Compass,
  Scale,
  Drama,
  Target,
  Shield,
  Feather,
  Mic,
  Gavel,
  BookOpen,
  Crown,
  Clock,
  User,
  Award,
  Check,
  X,
  ChevronRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { playPaperSound, playMagicSound, playBookOpenSound } from '../utils/soundEffects';

export interface Workshop {
  id: string;
  scrollNumber: string; // e.g. "SCROLL I"
  scrollCode: string;   // e.g. "01"
  chamberName: string;  // e.g. "The Chamber of Logic"
  title: string;
  speakerName: string;
  speakerTitle: string;
  duration: string;
  icon: 'compass' | 'scale' | 'mask' | 'target' | 'shield' | 'quill' | 'podium' | 'gavel' | 'book' | 'crown';
  overview: string;
  objectives: string[];
  learningOutcomes: string[];
  prerequisites: string;
}

export const WORKSHOPS_DATA: Workshop[] = [
  {
    id: 'w-01',
    scrollNumber: 'SCROLL I',
    scrollCode: '01',
    chamberName: 'The Chamber of Logic',
    title: 'Motion Analysis & Strategic Case Building',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '2.5 Hours',
    icon: 'compass',
    overview: 'Deconstruct any debate motion within the 15-minute preparation window. Master the problem-statement extraction method, identify core value tensions, and build robust case structures that withstand initial opposition attacks.',
    objectives: [
      'Identify Policy, Analysis, Value Judgment, and Actor-focused motion types instantly',
      'Isolate the problem statement and status quo context driving the motion',
      'Build a structured 15-minute preparation framework for first-speaker case delivery'
    ],
    learningOutcomes: [
      'Instant motion deconstruction under strict time constraints',
      'Structured case definition and definition-barrier construction'
    ],
    prerequisites: 'Open to all debaters. No prior tournament experience required.'
  },
  {
    id: 'w-02',
    scrollNumber: 'SCROLL II',
    scrollCode: '02',
    chamberName: 'The Chamber of Reason',
    title: 'Framing, Burdens & Comparative Analysis',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '2.5 Hours',
    icon: 'scale',
    overview: 'Establish the strategic battleground of the debate round. Learn how to set explicit burdens of proof, frame societal status-quos, and construct persuasive comparative worldviews that give your side the natural moral high ground.',
    objectives: [
      'Master the distinction between soft setup and hard strategic framing',
      'Define explicit burdens of proof for both Government and Opposition benches',
      'Construct localized clash points that favor your team\'s argument structure'
    ],
    learningOutcomes: [
      'Ability to shift adjudicator focus to your key strategic contentions',
      'High-level comparative framing techniques for complex policy motions'
    ],
    prerequisites: 'Completion of Scroll I or foundational motion deconstruction knowledge.'
  },
  {
    id: 'w-03',
    scrollNumber: 'SCROLL III',
    scrollCode: '03',
    chamberName: 'The Chamber of Character',
    title: 'Characterization, Modeling & Mechanism Design',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '3.0 Hours',
    icon: 'mask',
    overview: 'Move beyond abstract concepts by building realistic human characterization and policy mechanisms. Analyze how governments, marginalized communities, and international actors make decisions under systemic pressure.',
    objectives: [
      'Deconstruct general stakeholder groups into specific socio-economic subgroups',
      'Map actor incentives, vulnerabilities, and behavioral patterns',
      'Design feasible policy mechanisms that prevent implementation loopholes'
    ],
    learningOutcomes: [
      'Deep sociological actor-characterization that resonates with adjudicators',
      'Foolproof mechanism design for complex policy implementation'
    ],
    prerequisites: 'Understanding of basic argument structure and motion types.'
  },
  {
    id: 'w-04',
    scrollNumber: 'SCROLL IV',
    scrollCode: '04',
    chamberName: 'The Chamber of Impact',
    title: 'Advanced Argumentation & Impact Calculus',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '3.0 Hours',
    icon: 'target',
    overview: 'Weigh your team\'s impacts on the cosmic scale of debate logic. Calibrate argument severity, likelihood, reversibility, and vulnerability to prove why your impacts outrank every competing claim in the round.',
    objectives: [
      'Apply the 4 Pillars of Impact Calculus (Magnitude, Likelihood, Reversibility, Timeframe)',
      'Transform minor contentions into structural, irreversible impacts',
      'Execute "even-if" comparative weighing to win even under worst-case assumptions'
    ],
    learningOutcomes: [
      'Crystal clear ballot pathways for judges even in messy, multi-clash rounds',
      'Mastery of comparative impact calibration under intense pressure'
    ],
    prerequisites: 'Completion of Scroll II or familiarity with core logical link-chains.'
  },
  {
    id: 'w-05',
    scrollNumber: 'SCROLL V',
    scrollCode: '05',
    chamberName: 'The Chamber of Rebuttal',
    title: 'Rebuttal, Engagement & POI Strategy',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '2.5 Hours',
    icon: 'shield',
    overview: 'Neutralize opposing cases with surgical precision before they settle. Explore active rebuttal methods, expose logical leaps, and master Points of Information (POIs) to disrupt opponent momentum.',
    objectives: [
      'Master active rebuttal, pre-emptive defense, and argument flip strategies',
      'Identify hidden assertions and unproven premises in opponent speeches',
      'Formulate high-impact 15-second POIs that force concessions'
    ],
    learningOutcomes: [
      'Multi-layered defense mindset that dismantles opposing cases systematically',
      'Rapid-fire engagement skills during live floor debate'
    ],
    prerequisites: 'Comfort with public presentation and core debate formats.'
  },
  {
    id: 'w-06',
    scrollNumber: 'SCROLL VI',
    scrollCode: '06',
    chamberName: 'The Chamber of Narrative',
    title: 'Extension Theory & Narrative Control',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '3.0 Hours',
    icon: 'quill',
    overview: 'Command the back half of British Parliamentary (BP) debate rounds. Learn how to extract winning extension speeches that stand out from your opening house without risking contradiction or repetition.',
    objectives: [
      'Identify strategic gaps left unaddressed by top-half teams',
      'Execute vertical (deeper analysis) and horizontal (new dimension) extensions',
      'Anchor your extension securely to the decisive clash of the debate'
    ],
    learningOutcomes: [
      'Winning from Closing Government or Closing Opposition with distinct narrative authority',
      'Finding novel logical angles on heavily debated motions'
    ],
    prerequisites: 'Solid understanding of British Parliamentary (BP) debate rules.'
  },
  {
    id: 'w-07',
    scrollNumber: 'SCROLL VII',
    scrollCode: '07',
    chamberName: 'The Chamber of Eloquence',
    title: 'Speech Architecture & Strategic Prioritization',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '2.5 Hours',
    icon: 'podium',
    overview: 'Engineer speeches with structural elegance and commanding presence. Design speech flow with clear signposting, priority grouping, micro-pauses, and gold rhetorical transitions.',
    objectives: [
      'Apply advanced structural frameworks for seamless, effortless speech delivery',
      'Build high-contrast hooks and signposts that adjudicators transcribe easily',
      'Master vocal dynamics, pacing, and strategic prioritization under time constraints'
    ],
    learningOutcomes: [
      'Commanding room presence and flawless speech organization',
      'Effortless time management across complex 7-minute speeches'
    ],
    prerequisites: 'Open to debaters seeking to refine presentation style.'
  },
  {
    id: 'w-08',
    scrollNumber: 'SCROLL VIII',
    scrollCode: '08',
    chamberName: 'The Chamber of Judgement',
    title: 'Inside the Judge\'s Mind: Adjudication & Ballot Writing',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '3.5 Hours',
    icon: 'gavel',
    overview: 'Step behind the curtain of the adjudication panel. Understand how judges evaluate rounds, calculate speaker scores (60-90 scale), manage panel discussions, and how debaters can write the ballot for them.',
    objectives: [
      'Deconstruct the mechanics of speaker score calibration and ballot writing',
      'Analyze cognitive biases and implicit preferences of adjudication panels',
      'Craft summary speeches that mirror the judge\'s exact decision matrix'
    ],
    learningOutcomes: [
      'Predict ballot outcomes with high precision and raise speaker points',
      'Deliver whip and summary speeches that dictate panel deliberations'
    ],
    prerequisites: 'Scroll IV and Scroll V or active competitive tournament experience.'
  },
  {
    id: 'w-09',
    scrollNumber: 'SCROLL IX',
    scrollCode: '09',
    chamberName: 'The Chamber of Preparation',
    title: 'Motion Preparation, Research & Prep Room Dynamics',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '2.5 Hours',
    icon: 'book',
    overview: 'Survive and excel during the intense 15-minute preparation period. Establish an optimized team preparation ritual, streamline research knowledge, and coordinate with your debate partner.',
    objectives: [
      'Implement a structured minute-by-minute prep time protocol (1-5-5-4 model)',
      'Organize prep notes by clash points, actor maps, and rebuttal triggers',
      'Develop high-speed non-verbal communication and partner synchronization'
    ],
    learningOutcomes: [
      'Eliminate prep-room panic and blanking during unexpected motions',
      'Unified team synergy and clean, legible speech notes'
    ],
    prerequisites: 'Partnered debate practice or tournament preparation.'
  },
  {
    id: 'w-10',
    scrollNumber: 'SCROLL X',
    scrollCode: '10',
    chamberName: 'The Chamber of Champions',
    title: 'Championship Strategy: Winning at the Highest Level',
    speakerName: 'MDS Trainer',
    speakerTitle: 'Workshop Speaker',
    duration: '4.0 Hours',
    icon: 'crown',
    overview: 'The flagship masterclass on tournament game theory. Map out multi-round energy conservation, psychological resilience under pressure, ladder positioning, and tactical adaptation for grand finals.',
    objectives: [
      'Develop physical and mental endurance protocols for multi-day tournaments',
      'Analyze tournament brackets, panel compositions, and team tendencies',
      'Execute high-stakes tactical adaptations in break rounds and grand finals'
    ],
    learningOutcomes: [
      'Championship mindset, peak performance under high pressure, and tournament title contention'
    ],
    prerequisites: 'Advanced debaters and national team squad members.'
  }
];

function ChamberEmblemIcon({ icon, className }: { icon: Workshop['icon']; className?: string }) {
  switch (icon) {
    case 'compass':
      return <Compass className={className} />;
    case 'scale':
      return <Scale className={className} />;
    case 'mask':
      return <Drama className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'quill':
      return <Feather className={className} />;
    case 'podium':
      return <Mic className={className} />;
    case 'gavel':
      return <Gavel className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'crown':
      return <Crown className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

// Academy Chamber Card
function AcademyChamberCard({
  workshop,
  onSelect
}: {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
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
      onClick={() => onSelect(workshop)}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#06060a] border rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-colors duration-500 select-none ${
        isHovered
          ? 'border-amber-400/60 shadow-[0_15px_40px_rgba(212,175,55,0.15)]'
          : 'border-amber-500/20 shadow-lg'
      }`}
    >
      {/* Top Golden Shimmer Line */}
      <div
        className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dynamic Cursor Light Reflection Overlay */}
      {isHovered && (
        <div
          className="absolute pointer-events-none rounded-full transition-all duration-75 ease-out opacity-25 mix-blend-screen"
          style={{
            width: '260px',
            height: '260px',
            left: `${mousePos.x - 130}px`,
            top: `${mousePos.y - 130}px`,
            background: 'radial-gradient(circle, rgba(245,215,110,0.5) 0%, transparent 70%)'
          }}
        />
      )}

      {/* Faint Magical Doorway Backdrop Outline */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ease-out ${
          isHovered ? 'opacity-40' : 'opacity-0'
        }`}
        viewBox="0 0 200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M 20,290 L 20,80 A 80,80 0 0,1 180,80 L 180,290"
          stroke="url(#doorway-grad)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <defs>
          <linearGradient id="doorway-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5d76e" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient Gold Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Card Content Stack */}
      <div className="space-y-4 relative z-10">
        {/* Top Header Row: Scroll Number & Engraved Golden Chamber Label + Glowing Chamber Emblem */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            {/* Scroll Number */}
            <span className="font-mono text-[10px] text-amber-400 font-semibold tracking-widest uppercase block">
              {workshop.scrollNumber}
            </span>

            {/* Engraved Golden Chamber Name Label */}
            <div className="inline-block px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500/15 via-yellow-600/10 to-amber-500/15 border border-amber-400/30 text-amber-200 font-display text-[11px] font-semibold tracking-wider uppercase shadow-inner">
              {workshop.chamberName}
            </div>
          </div>

          {/* Unique Glowing Chamber Emblem */}
          <div
            className={`w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 transition-all duration-500 ${
              isHovered
                ? 'scale-110 rotate-12 bg-amber-500/20 border-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] text-amber-200'
                : 'shadow-md'
            }`}
          >
            <ChamberEmblemIcon icon={workshop.icon} className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>

        {/* Workshop Title */}
        <h3 className="font-display font-semibold text-base sm:text-lg text-amber-100 group-hover:text-amber-300 transition-colors tracking-wide leading-snug line-clamp-2">
          {workshop.title}
        </h3>

        {/* Metadata Row: Assigned Professor & Duration */}
        <div className="space-y-2 pt-2 border-t border-amber-500/10">
          <div className="flex items-center justify-between text-xs text-zinc-300 font-sans">
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              <span className="truncate font-medium text-amber-100/90">{workshop.speakerName}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300/90 font-mono text-[11px] pt-0.5">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{workshop.duration}</span>
          </div>
        </div>
      </div>

      {/* Action Button: Enter Chamber */}
      <div className="pt-4 mt-4 border-t border-amber-500/15 relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(workshop);
          }}
          className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/25 border border-amber-500/30 group-hover:border-amber-400/60 text-amber-300 group-hover:text-amber-200 text-xs font-sans uppercase tracking-widest flex items-center justify-center gap-2 transition-all font-medium cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>Enter Chamber</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

export default function WorkshopSeries() {
  const { cms } = useCms();
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isOpeningDoor, setIsOpeningDoor] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Map CMS workshops if provided, fallback to WORKSHOPS_DATA with dynamic speaker assignment
  const workshopsList: Workshop[] = (cms.workshops && cms.workshops.length > 0)
    ? cms.workshops.map((w, idx) => {
        const defaultW = WORKSHOPS_DATA[idx] || WORKSHOPS_DATA[0];
        
        // Find assigned speaker object from CMS
        const speakerByObj = w.speakerId ? cms.speakers?.find((s) => s.id === w.speakerId) : null;
        const sessionVidSpeakerName = cms.sessionVideos?.[idx]?.assignedSpeaker;
        const speakerBySessionName = (sessionVidSpeakerName && sessionVidSpeakerName !== 'Unassigned') 
          ? cms.speakers?.find((s) => s.name === sessionVidSpeakerName) 
          : null;

        const speakerObj = speakerByObj || speakerBySessionName;

        let speakerName = 'Unassigned';
        let speakerTitle = 'To Be Announced';

        if (speakerObj) {
          speakerName = speakerObj.name;
          speakerTitle = speakerObj.title || 'Workshop Leader';
        } else if (sessionVidSpeakerName && sessionVidSpeakerName !== 'Unassigned' && sessionVidSpeakerName !== 'MDS Trainer') {
          speakerName = sessionVidSpeakerName;
          speakerTitle = 'Workshop Leader';
        } else if (w.speakerName && w.speakerName !== 'Unassigned' && w.speakerName !== 'MDS Trainer') {
          speakerName = w.speakerName;
          speakerTitle = w.speakerTitle || 'Workshop Leader';
        }

        return {
          id: w.id || `w-0${idx + 1}`,
          scrollNumber: `SCROLL ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][idx] || idx + 1}`,
          scrollCode: (idx + 1).toString().padStart(2, '0'),
          chamberName: defaultW?.chamberName || `The Chamber of ${w.title ? w.title.split(' ')[0] : 'Logic'}`,
          title: w.title || defaultW.title,
          speakerName,
          speakerTitle,
          duration: w.duration || defaultW.duration || '2.5 Hours',
          icon: (['compass', 'scale', 'mask', 'target', 'shield', 'quill', 'podium', 'gavel', 'book', 'crown'][idx % 10]) as any,
          overview: w.description || defaultW.overview,
          objectives: w.objectives || defaultW.objectives,
          learningOutcomes: w.expectedLearning || defaultW.learningOutcomes,
          prerequisites: w.prerequisites || defaultW.prerequisites
        };
      })
    : WORKSHOPS_DATA.map((defaultW, idx) => {
        const cmsW = cms.workshops?.[idx];
        const speakerByObj = cmsW?.speakerId ? cms.speakers?.find((s) => s.id === cmsW.speakerId) : null;
        const sessionVidSpeakerName = cms.sessionVideos?.[idx]?.assignedSpeaker;
        const speakerBySessionName = (sessionVidSpeakerName && sessionVidSpeakerName !== 'Unassigned') 
          ? cms.speakers?.find((s) => s.name === sessionVidSpeakerName) 
          : null;

        const speakerObj = speakerByObj || speakerBySessionName;

        let speakerName = 'Unassigned';
        let speakerTitle = 'To Be Announced';

        if (speakerObj) {
          speakerName = speakerObj.name;
          speakerTitle = speakerObj.title || 'Workshop Leader';
        } else if (sessionVidSpeakerName && sessionVidSpeakerName !== 'Unassigned' && sessionVidSpeakerName !== 'MDS Trainer') {
          speakerName = sessionVidSpeakerName;
          speakerTitle = 'Workshop Leader';
        }

        return {
          ...defaultW,
          speakerName,
          speakerTitle
        };
      });

  // Background subtle gold dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 1200);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 1200;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{ x: number; y: number; radius: number; vy: number; vx: number; alpha: number }> = [];
    for (let i = 0; i < 35; i++) {
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

  const openWorkshopDetail = (workshop: Workshop) => {
    playMagicSound();
    playBookOpenSound();
    setIsOpeningDoor(true);
    setSelectedWorkshop(workshop);
  };

  const closeWorkshopDetail = () => {
    playPaperSound();
    setSelectedWorkshop(null);
    setIsOpeningDoor(false);
  };

  return (
    <div
      id="workshop-series-section"
      className="relative min-h-screen py-20 px-4 sm:px-6 md:px-12 bg-[#030306] text-[#f4efe8] overflow-hidden select-none font-sans"
    >
      {/* Soft Ambient Radial Gold Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_75%)]" />

      {/* Particle Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Minimal Luxury Editorial Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-amber-400/90 font-medium block">
            ACADEMY CHAMBERS
          </span>

          <h2 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl text-amber-100 tracking-wider uppercase">
            Elite Debate Workshops
          </h2>

          <div className="w-12 h-[1px] bg-amber-400/40 mx-auto" />

          <p className="font-serif italic text-amber-200/70 text-base md:text-lg leading-relaxed font-light">
            Traverse 10 ancient chambers of rhetoric and master the art of competitive debate logic.
          </p>
        </div>

        {/* Clean Editorial Academy Chamber Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
          {workshopsList.map((workshop) => (
            <AcademyChamberCard
              key={workshop.id}
              workshop={workshop}
              onSelect={openWorkshopDetail}
            />
          ))}
        </div>
      </div>

      {/* Ancient Chamber Door Opening Modal Experience */}
      <AnimatePresence>
        {selectedWorkshop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            {/* Dark Backdrop with Warm Radial Glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-lg"
              onClick={closeWorkshopDetail}
            />

            {/* Radiant Golden Light Flare Center Behind Doors */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.6, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute pointer-events-none w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(245,215,110,0.35)_0%,rgba(212,175,55,0.1)_50%,transparent_70%)] blur-2xl"
            />

            {/* Ancient Chamber Door Left Panel */}
            <motion.div
              initial={{ x: '0%' }}
              animate={{ x: '-102%' }}
              exit={{ x: '0%' }}
              transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
              className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#09080e] border-r-2 border-amber-400/40 shadow-[20px_0_50px_rgba(0,0,0,0.9)] z-20 flex items-center justify-end pr-8"
            >
              <div className="opacity-20 border border-amber-500/30 rounded-full p-8">
                <div className="w-16 h-16 rounded-full border border-amber-400/50 flex items-center justify-center">
                  <span className="font-serif italic text-amber-200 text-xs">MDS</span>
                </div>
              </div>
            </motion.div>

            {/* Ancient Chamber Door Right Panel */}
            <motion.div
              initial={{ x: '0%' }}
              animate={{ x: '102%' }}
              exit={{ x: '0%' }}
              transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
              className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#09080e] border-l-2 border-amber-400/40 shadow-[-20px_0_50px_rgba(0,0,0,0.9)] z-20 flex items-center justify-start pl-8"
            >
              <div className="opacity-20 border border-amber-500/30 rounded-full p-8">
                <div className="w-16 h-16 rounded-full border border-amber-400/50 flex items-center justify-center">
                  <span className="font-serif italic text-amber-200 text-xs">MDS</span>
                </div>
              </div>
            </motion.div>

            {/* Illuminated Parchment Workshop Details Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="bg-[#07070b] border border-amber-400/40 rounded-2xl max-w-3xl w-full p-6 sm:p-8 md:p-10 relative z-30 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-8 max-h-[88vh] overflow-y-auto m-4"
            >
              {/* Close Button */}
              <button
                onClick={closeWorkshopDetail}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 min-w-[48px] min-h-[48px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Close Chamber"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header: Scroll Number, Chamber Emblem, Workshop Title */}
              <div className="space-y-4 border-b border-amber-500/20 pb-6 pr-10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs text-amber-400 font-semibold tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
                    {selectedWorkshop.scrollNumber} • MODULE {selectedWorkshop.scrollCode}
                  </span>
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-600/15 to-amber-500/20 border border-amber-400/40 text-amber-200 font-display text-xs font-semibold tracking-wider uppercase">
                    {selectedWorkshop.chamberName}
                  </div>
                </div>

                {/* Workshop Title - Largest and Most Prominent Element */}
                <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-amber-100 tracking-wide leading-tight">
                  {selectedWorkshop.title}
                </h2>

                {/* Assigned Professor & Duration Row */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-300 font-sans pt-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    <span className="font-medium text-amber-100">{selectedWorkshop.speakerName}</span>
                    <span className="text-zinc-500">• {selectedWorkshop.speakerTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 font-mono">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{selectedWorkshop.duration}</span>
                  </div>
                </div>
              </div>

              {/* Workshop Overview Section */}
              <div className="space-y-2">
                <span className="font-sans text-xs uppercase tracking-widest text-amber-400 font-semibold block">
                  Chamber Overview
                </span>
                <p className="font-sans text-sm sm:text-base text-zinc-200 leading-relaxed">
                  {selectedWorkshop.overview}
                </p>
              </div>

              {/* Learning Objectives Section */}
              <div className="space-y-3 pt-2 border-t border-amber-500/15">
                <h4 className="font-sans text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Learning Objectives
                </h4>
                <div className="space-y-2">
                  {selectedWorkshop.objectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-900/60 border border-amber-500/15 rounded-xl flex items-start gap-3"
                    >
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="font-sans text-xs sm:text-sm text-zinc-200 leading-snug">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Learning Outcomes */}
              <div className="space-y-3 pt-2 border-t border-amber-500/15">
                <h4 className="font-sans text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Key Learning Outcomes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedWorkshop.learningOutcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-500/[0.04] border border-amber-500/20 rounded-xl space-y-1"
                    >
                      <span className="font-sans text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                        SKILL MASTERY #{idx + 1}
                      </span>
                      <p className="font-sans text-xs text-zinc-200 leading-snug">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="p-4 bg-zinc-900/80 border border-amber-500/20 rounded-xl space-y-1">
                <span className="font-sans text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                  Prerequisites
                </span>
                <p className="font-sans text-xs text-zinc-300">{selectedWorkshop.prerequisites}</p>
              </div>

              {/* Return to Curriculum Button */}
              <div className="pt-4 border-t border-amber-500/20 flex justify-end">
                <button
                  onClick={closeWorkshopDetail}
                  className="px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl font-sans text-xs tracking-widest uppercase transition-colors flex items-center gap-2 font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Academy Chambers</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
