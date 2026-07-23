import { Workshop, Professor, Achievement, BlogPost } from '../types';

export const MDS_PROFESSORS: Professor[] = [
  {
    id: 'prof-jil-jawsan',
    name: 'Jil Jawsan',
    title: 'Grand Debater & Adjudicator',
    house: 'Aurelius',
    houseColor: 'from-amber-500 to-yellow-600',
    houseBadge: 'Aurelius House',
    achievements: [
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
    favoriteMotions: [],
    teachingStyle: 'Championship Debate Strategy & Adjudication',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    socials: {}
  }
];

export const MDS_WORKSHOPS: Workshop[] = [
  {
    id: 'w-motion-analysis',
    title: 'Motion Analysis & The First Ward',
    slug: 'motion-analysis',
    description: 'Deconstruct motions into their fundamental spirits. Learn to identify the hidden clashes, the underlying policy goals, and specify the direct point of conflict in under 5 minutes.',
    objectives: [
      'Identify different motion types (Policy, Analysis, Value Judgment, Actor-focused)',
      'Uncover the "problem statement" that inspired the motion designers',
      'Determine standard definitions and counter-strategies'
    ],
    expectedLearning: [
      'Ability to isolate the core tension in any debate topic instantly',
      'Structured approach to prep time (the legendary 15-minute preparation spell)'
    ],
    prerequisites: 'None. Open to all aspiring debate wizards.',
    speakerId: '',
    duration: '2.5 Hours',
    assignments: ['Deconstruct three randomized motions from the AI Motion Generator', 'Write a 200-word definition setup for an actor-focused motion'],
    resources: [
      { title: 'The Scroll of Motion Analysis', type: 'scroll', url: '#' },
      { title: 'Potion of Quick Thinking Guide', type: 'potion', url: '#' }
    ]
  },
  {
    id: 'w-framing',
    title: 'Mystical Framing & Arena Definition',
    slug: 'framing',
    description: 'Control the soil on which the debate grows. Discover the art of strategic world-building, constructing urgency, and framing the debate so your team has a natural moral high ground.',
    objectives: [
      'Master the distinction between soft setup and hard framing',
      'Construct a highly compelling depiction of the status quo',
      'Build localized "clash points" that favor your argument structure'
    ],
    expectedLearning: [
      'Skills to completely shift the focus of a debate towards your key contentions',
      'Visual framing techniques that make abstract harms feel immediate and physical'
    ],
    prerequisites: 'Workshop 1 or basic understanding of motion types.',
    speakerId: '',
    duration: '2 Hours',
    assignments: ['Draft an opposing world setup for a highly biased environmental motion', 'Framing rebuttal drill'],
    resources: [
      { title: 'Arena Definition Codex', type: 'tome', url: '#' },
      { title: 'Wand of Attention Positioning', type: 'wand', url: '#' }
    ]
  },
  {
    id: 'w-characterization',
    title: 'Alchemical Characterization & Actor Motivation',
    slug: 'characterization',
    description: 'Transform stick figures into real human actors. Learn how to construct deep actor-incentive structures, showing judges exactly how marginalized communities, state entities, or magical organizations behave.',
    objectives: [
      'Deconstruct general actors into specific subgroups',
      'Incentive-map vulnerable stakeholders within policy change',
      'Identify subconscious biases that judges project onto actors'
    ],
    expectedLearning: [
      'The ability to win debates based on deep human sociology and psych-analysis rather than dry statistics',
      'Nuanced, multi-tiered actor vulnerability mapping'
    ],
    prerequisites: 'Basic understanding of logical structures.',
    speakerId: '',
    duration: '3 Hours',
    assignments: ['Map incentives for 4 complex actors in an international relations motion', 'Conduct an MDS Sorting Challenge'],
    resources: [
      { title: 'Incentive Alchemical Charts', type: 'scroll', url: '#' }
    ]
  },
  {
    id: 'w-impact-calculus',
    title: 'Impact Calculus & The Scale of Justice',
    slug: 'impact-calculus',
    description: 'Weigh your arguments on the cosmic scale. Learn to calibrate severity, probability, reversibility, and vulnerability to prove why your impacts are the most important in the round.',
    objectives: [
      'Understand the 4 pillars of impact weight (Magnitude, Likelihood, Reversibility, Timeframe)',
      'Convert minor moral contentions into absolute structural impacts',
      'Execute "even-if" comparisons to survive strongest opponent arguments'
    ],
    expectedLearning: [
      'How to win even if the opposition wins 70% of their logical links',
      'Direct structural calculus that leaves judges with a crystal clear ballot pathway'
    ],
    prerequisites: 'Deep familiarity with logical construction.',
    speakerId: '',
    duration: '2.5 Hours',
    assignments: ['Construct an impact comparison grid comparing climate preservation with economic livelihood', 'Provide calculus for a scenario with high likelihood but low magnitude vs low likelihood but high magnitude'],
    resources: [
      { title: 'Scale of Justice Calibration Scroll', type: 'scroll', url: '#' },
      { title: 'Tome of Impact Calculus', type: 'tome', url: '#' }
    ]
  },
  {
    id: 'w-rebuttal',
    title: 'Disenchanting Rebuttals & Spellbreaking',
    slug: 'rebuttal',
    description: 'Neutralize enemy arguments before they settle. Explore 6 distinct spellbreaking methods to dismantle opposing claims, expose logical leaps, and turn their own contentions against them.',
    objectives: [
      'Master mitigation, active rebuttal, and pre-emptive defenses',
      'Expose hidden assertions and logical jumps inside prime arguments',
      'Implement the "flip-strategy" where opposing benefits are proved to be harms'
    ],
    expectedLearning: [
      'A multi-layered defense mindset that leaves the opponent’s case structurally hollowed',
      'Speed-rebuttal skills for late-game speeches'
    ],
    prerequisites: 'Comfortable with basic presentation formats.',
    speakerId: '',
    duration: '3 Hours',
    assignments: ['Draft an instantaneous rebuttal video or notes for a 3-minute debate speech', 'Spellbreaking logical drills'],
    resources: [
      { title: 'Spellbreaker Defensive Manual', type: 'scroll', url: '#' }
    ]
  },
  {
    id: 'w-extension',
    title: 'The Great Extension Speech & Secret Runes',
    slug: 'extension',
    description: 'Command the back half of parliamentary rounds. Master the art of delivering a distinct, game-winning extension speech in British Parliamentary debate that completely outshines your opening house.',
    objectives: [
      'Identify the "strategic space" left open by the top half teams',
      'Differentiate between vertical (deeper analysis) and horizontal (new ideas) extensions',
      'Anchor the extension securely in the main clash of the round'
    ],
    expectedLearning: [
      'Knowing how to safely win from the closing bench without contradicting your opening team',
      'Discovering unique logical angles on seemingly exhausted motions'
    ],
    prerequisites: 'A strong understanding of British Parliamentary (BP) rules.',
    speakerId: '',
    duration: '2 Hours',
    assignments: ['Analyze a top-half transcript and draft 2 potential winning extension paths', 'Runic logical expansions'],
    resources: [
      { title: 'The Great Extension Scroll', type: 'scroll', url: '#' }
    ]
  },
  {
    id: 'w-speech-architecture',
    title: 'Speech Architecture & Rhetorical Wands',
    slug: 'speech-architecture',
    description: 'Engineer speeches that hold their ground like high castles. Design your presentation flow with symmetrical grouping, rhetorical anchors, gold transitions, and stunning tonal delivery.',
    objectives: [
      'Apply structural models like PEEL (Point, Explanation, Example, Link) with fluid delivery',
      'Create high-contrast hooks and rhetorical signposting that keep judges fully engaged',
      'Manage pacing, micro-pauses, and vocal dynamics to project ultimate confidence'
    ],
    expectedLearning: [
      'A presentation style that commands the entire room with high authority',
      'Clear, transparent speech organization that adjudicators can transcribe effortlessly'
    ],
    prerequisites: 'None. Perfect for developing personal elegance.',
    speakerId: '',
    duration: '3 Hours',
    assignments: ['Record a 5-minute speech outline using the Golden Ratio presentation format', 'Vocal dynamics exercises'],
    resources: [
      { title: 'The Castle Blueprint of Rhetoric', type: 'tome', url: '#' },
      { title: 'Wand of Vocal Enchantment', type: 'wand', url: '#' }
    ]
  },
  {
    id: 'w-judges-mind',
    title: 'Entering the Judge’s Mind & Scrying',
    slug: 'judges-mind',
    description: 'Look into the magical mirror of the adjudicator panel. Gain access to the hidden psychology of ballot decisions, average speaker score ranges, and how to write the ballot for them.',
    objectives: [
      'Unpack how judges compile speaker points (from 60 to 90 scale)',
      'Analyze and dismantle common adjudication biases',
      'Master "ballot-drafting" inside the final minute of summary speeches'
    ],
    expectedLearning: [
      'Ability to write the judge’s summary for them during your final speech',
      'Dramatically higher speaker points through targeted, bias-aware presentation'
    ],
    prerequisites: 'Workshop 4 and 5.',
    speakerId: '',
    duration: '2.5 Hours',
    assignments: ['Write an adjudication note comparing two opposing student speeches in our forum', 'Mirror-scrying scoring challenge'],
    resources: [
      { title: 'The Scrying Mirror of Ballots', type: 'potion', url: '#' }
    ]
  },
  {
    id: 'w-preparation',
    title: 'Advanced Prep & The Enchanted Forest',
    slug: 'preparation',
    description: 'Survive and thrive in the chaotic forest of the 15-minute prep room. Formulate an unbreakable team coordination ritual, optimize brainstorm dynamics, and map out your paper layouts.',
    objectives: [
      'Establish a precise 1-5-5-4 minute team prep timeline',
      'Structure clean prep papers (sheets divided by clash, definition, and timeline)',
      'Construct a high-speed logical shield against surprise counter-policies'
    ],
    expectedLearning: [
      'No more blanking or panic when the debate timer starts ticking',
      'A perfect, unified team mind that communicates telepathically in the prep room'
    ],
    prerequisites: 'Open to team partners.',
    speakerId: '',
    duration: '2 Hours',
    assignments: ['Execute a 15-minute prep session with a partner on an advanced AI motion', 'Draft a prep paper sketch'],
    resources: [
      { title: 'Preparation Ritual Codex', type: 'tome', url: '#' }
    ]
  },
  {
    id: 'w-championship-strategy',
    title: 'Championship Strategy & Grand Arcanum',
    slug: 'championship-strategy',
    description: 'The ultimate workshop on tournament game theory. Map out multi-round energy conservation, psychological resilience, ladder positioning, and tactical out-prepping on tournament weekends.',
    objectives: [
      'Establish a tournament mindset with physical and mental endurance protocols',
      'Leverage ladder brackets to analyze and adapt to specific pool biases',
      'Unlock the "Grand Arcanum" — the elite collection of secret strategy maneuvers'
    ],
    expectedLearning: [
      'How to win national tournament titles, maintain absolute focus in high-stress rounds, and lead MDS teams to glory'
    ],
    prerequisites: 'Exclusively for Advanced students (Scholar level and above).',
    speakerId: '',
    duration: '4 Hours',
    assignments: ['Draft an individual 6-month competitive tournament progression plan', 'The Grand Arcanum test'],
    resources: [
      { title: 'Grand Arcanum Strategy Map', type: 'scroll', url: '#' },
      { title: 'Master Debate Sigil of MDS', type: 'potion', url: '#' }
    ]
  }
];

export const ACADEMY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-spell',
    title: 'Initiate of Speech',
    description: 'Complete your registration and receive your official Wizard Admission Letter.',
    icon: '✉️',
    rewardXP: 150,
    rewardCoins: 50
  },
  {
    id: 'ai-motion-crafter',
    title: 'Scribe of Prophecy',
    description: 'Generate 3 customized debate motions using the AI Motion Spell generator.',
    icon: '🔮',
    rewardXP: 200,
    rewardCoins: 100
  },
  {
    id: 'debate-prep-wizard',
    title: 'Logic Shielder',
    description: 'Test your arguments against the AI Debate Assistant and refine your casing.',
    icon: '🛡️',
    rewardXP: 300,
    rewardCoins: 150
  },
  {
    id: 'sorting-ceremony',
    title: 'Sovereign House Sorting',
    description: 'Complete the Sorting Podium Quiz to find your MDS House Alignment.',
    icon: '🎓',
    rewardXP: 100,
    rewardCoins: 50
  },
  {
    id: 'scroll-reader',
    title: 'Archmage of Library',
    description: 'Explore the workshop materials and download a training spellbook scroll.',
    icon: '📖',
    rewardXP: 250,
    rewardCoins: 120
  }
];

export const ACADEMY_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b-spells-of-logic',
    title: 'The Magic of First Principle Reasoning in Debating',
    excerpt: 'When standard logic fails, the ancient arts of first-principle reasoning act as the ultimate spell. Learn how to reconstruct models from scratch.',
    content: `In the deep dungeons of debate preparation, many students find themselves lost in a forest of specialized terms and complex statistics. But what happens when you are faced with a motion on a topic you have never researched? Here is where **First Principle Reasoning** becomes your ultimate magical wand.

Rather than trying to recall memorized case study facts, we break down any complex state action into two primary components:
1. **The Core Incentives of the Actor**: What does the agent want (survival, resources, power, moral validation)?
2. **The Natural Constraints of the Environment**: What limits their choices (laws of economics, social pressure, physics of information)?

By casting your thoughts from these foundational laws, you can construct an unbroken, robust argument chain. For example, in a motion about artificial cognitive enhancements, ask yourself: Why does a state regulate any drug? They regulate it to preserve worker stability and maintain social cohesion. By framing your casing on these simple principles, no amount of technical counter-arguments can easily breach your defenses.`,
    category: 'Spells of Logic',
    author: 'MDS Editorial',
    readTime: '5 mins',
    date: 'July 18, 2026',
    tags: ['First Principles', 'BP Format', 'Logic']
  },
  {
    id: 'b-ballot-secrets',
    title: 'The Invisible ink on Adjudication Sheets',
    excerpt: 'What do judges write down when you are speaking? Uncover the subconscious filters through which MDS adjudicators record your performance.',
    content: `Every debater wishes they possessed a potion of telepathy to read the mind of the chief adjudicator during a grand final. While we cannot bottle that elixir, we can read the "invisible ink" of their training manuals.

Judges are instructed to operate as **ordinary, average reasonable college students**. However, they are also human. They process speeches using several prominent filters:
- **Signposting Clarity**: If a judge has to guess which argument you are currently rebuilding, their notes will become chaotic. Use bright, golden signposts (e.g., "Clash One: Physical Accessibility; Point Two: Democratic Accountability").
- **The Plausibility Check**: A massive impact (like total economic collapse) with a thin link is scored far lower than a modest, realistic impact with an airtight link. Keep your logical links robust!
- **Tonal Authority**: Confidence triggers a positive feedback loop. When you speak with elegance and rhythmic pauses, the judge subconsciously begins to credit your assertions with higher validity.`,
    category: 'Strategy scrolls',
    author: 'MDS Editorial',
    readTime: '6 mins',
    date: 'July 15, 2026',
    tags: ['Judges', 'Scoring', 'Preparation']
  }
];

export const ACADEMY_FAQS = [
  {
    q: 'Who can join the Elite Debate Workshop Series?',
    a: ' Aspiring debaters of all backgrounds, from absolute novices (who have never spoken in public) to experienced national-tier masters. Our ranking and sorting system ensures you are matched with equal-caliber wizards.'
  },
  {
    q: 'What is the Moulvibazar Debating Society (MDS)?',
    a: 'MDS is the premier debate academy and network in the region, dedicated to cultivating critical thinking, logical framing, and elite public speaking skills through immersive competitive scenarios and wizard-tier training.'
  },
  {
    q: 'How does the gamified XP and Coins system work?',
    a: 'As you register, use our AI tools, explore workshop scrolls, and complete assignments, you earn experience points (XP) and Gold Coins. Accumulating XP unlocks legendary titles (such as Master, Archmage, or Debate Wizard) which appear directly on your Digital Admission Pass!'
  },
  {
    q: 'Is there an actual certificate generated?',
    a: 'Yes, every participant who completes the workshop curriculum receives a premium, high-resolution magical certificate with an authentic Gold MDS seal, downloadable in PDF style with custom verification QR codes.'
  }
];
