import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Shield, Flame, BookOpen, Skull, Eye, Compass, Heart } from 'lucide-react';
import { playPaperSound, playMagicSound, playBellSound, playBookOpenSound } from '../utils/soundEffects';

interface EasterEggsProps {
  onHouseSorted: (house: 'Aurelius' | 'Sylph' | 'Ignis' | 'Tenebris' | 'Astra' | 'Verdant') => void;
  userEmail: string;
}

export default function EasterEggs({ onHouseSorted, userEmail }: EasterEggsProps) {
  const [showSortingQuiz, setShowSortingQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [houseScores, setHouseScores] = useState({ 
    Aurelius: 0, Sylph: 0, Ignis: 0, Tenebris: 0, Astra: 0, Verdant: 0 
  });
  const [sortedHouse, setSortedHouse] = useState<'Aurelius' | 'Sylph' | 'Ignis' | 'Tenebris' | 'Astra' | 'Verdant' | null>(null);
  const [prophecy, setProphecy] = useState<any>(null);
  const [isLoadingProphecy, setIsLoadingProphecy] = useState(false);
  
  // Sorting questions with 6 houses represented
  const quizQuestions = [
    {
      q: "In a high-intensity debate room, what is your ultimate weapon?",
      options: [
        { text: "Air-tight rhetorical structure and symmetrical delivery.", house: "Aurelius" },
        { text: "Dynamic, creative speaking styles and flying ideas.", house: "Sylph" },
        { text: "A blazing, unpredictable vertical extension speech that shifts the field.", house: "Ignis" },
        { text: "Predicting the exact adjudication scoring biases and exploiting them.", house: "Tenebris" },
        { text: "Deep empirical research, hard logical data, and analysis scrolls.", house: "Astra" },
        { text: "Unpacking human characterization and rich real-world stakeholder models.", house: "Verdant" }
      ]
    },
    {
      q: "Your opening bench team leaves a massive logical hole. How do you respond?",
      options: [
        { text: "Defend them systematically with robust structural links.", house: "Aurelius" },
        { text: "Refocus the round using a creative, narrative-driven shift of perspective.", house: "Sylph" },
        { text: "Pivot instantly and build an completely separate, aggressive casing paradigm.", house: "Ignis" },
        { text: "Use even-if comparison lines to keep our Closing bench safely isolated.", house: "Tenebris" },
        { text: "Show how a deeper, analytical principle overrides their initial material flaws.", house: "Astra" },
        { text: "Frame the issue strictly through the physical incentives of the real actors.", house: "Verdant" }
      ]
    },
    {
      q: "Which element of debate strategy excites your mind the most?",
      options: [
        { text: "Unbreakable first-principle logical proofs and direct leadership.", house: "Aurelius" },
        { text: "Uncapped verbal creativity and expressive, evocative arguments.", house: "Sylph" },
        { text: "Breaking the spell of opposing arguments with sharp rebuttals.", house: "Ignis" },
        { text: "The subtle art of ballot-scrying and strategic game-theory.", house: "Tenebris" },
        { text: "Deep, rigorous analysis and researching complex logical layers.", house: "Astra" },
        { text: "Constructing deep stakeholder incentives and realistic environments.", house: "Verdant" }
      ]
    }
  ];

  const handleOptionClick = (house: string) => {
    playPaperSound();
    setHouseScores((prev: any) => ({ ...prev, [house]: prev[house] + 1 }));
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate winner
      const scores = { ...houseScores, [house]: houseScores[house as keyof typeof houseScores] + 1 };
      let winner: 'Aurelius' | 'Sylph' | 'Ignis' | 'Tenebris' | 'Astra' | 'Verdant' = 'Aurelius';
      let maxScore = -1;
      
      Object.entries(scores).forEach(([h, s]) => {
        const scoreVal = s as number;
        if (scoreVal > maxScore) {
          maxScore = scoreVal;
          winner = h as any;
        }
      });
      
      playMagicSound();
      setSortedHouse(winner);
      onHouseSorted(winner);

      // Save sorted house to user stats if email is present
      if (userEmail) {
        try {
          localStorage.setItem(`mds_house_${userEmail}`, winner);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const loadProphecy = (_force = false) => {
    setIsLoadingProphecy(true);
    const prophecies = [
      {
        prophecy: "The golden scrolls foretell: clarity in speech shall overcome any counter-curse today.",
        fortune: "Aura of Golden Logic",
        spellTip: "Focus on framing the central clash before offering sub-points.",
        luckyMotionCategory: "Philosophy & Ethics"
      },
      {
        prophecy: "The runes speak of conviction: an undeniable principal argument shall shatter the opponent's counter-case.",
        fortune: "Unshakable Premise",
        spellTip: "Establish impact before delving into mechanical steps.",
        luckyMotionCategory: "International Relations"
      },
      {
        prophecy: "Celestial alignment favors strategic poise: listening closely to the opposing speaker reveals their hidden flaw.",
        fortune: "Ears of the Archmage",
        spellTip: "Turn the opponent's concede point into your main pillar of victory.",
        luckyMotionCategory: "Economics & Tech"
      }
    ];
    const todayIndex = new Date().getDate() % prophecies.length;
    setProphecy(prophecies[todayIndex]);
    setIsLoadingProphecy(false);
  };

  useEffect(() => {
    loadProphecy();
  }, []);

  const getHouseDetails = (houseName: 'Aurelius' | 'Sylph' | 'Ignis' | 'Tenebris' | 'Astra' | 'Verdant') => {
    switch(houseName) {
      case 'Aurelius':
        return {
          title: 'House of Aurelius (Golden Lion)',
          desc: 'Wizards of leadership, structure, and rhetoric. You stand with noble clarity and unwavering architectural proof.',
          color: 'text-amber-400 border-amber-500/40 bg-amber-950/20 shadow-amber-950/40',
          icon: <Trophy className="w-12 h-12 text-amber-400" />
        };
      case 'Sylph':
        return {
          title: 'House of Sylph (Emerald Eagle)',
          desc: 'Wizards of air, creativity, and speaking. You fly above dry facts to anchor debates in expressive, flowing style.',
          color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20 shadow-emerald-950/40',
          icon: <Shield className="w-12 h-12 text-emerald-400" />
        };
      case 'Ignis':
        return {
          title: 'House of Ignis (Crimson Dragon)',
          desc: 'Wizards of fire, aggression, and rebuttals. You ignite stagnant debates with blazing, high-tempo opposition.',
          color: 'text-red-400 border-red-500/40 bg-red-950/20 shadow-red-950/40',
          icon: <Flame className="w-12 h-12 text-red-400" />
        };
      case 'Tenebris':
        return {
          title: 'House of Tenebris (Obsidian Serpent)',
          desc: 'Wizards of darkness, judge scrying, and strategy. You understand the adjudicator mind perfectly, maneuvering to victory.',
          color: 'text-purple-400 border-purple-500/40 bg-purple-950/20 shadow-purple-950/40',
          icon: <Skull className="w-12 h-12 text-purple-400" />
        };
      case 'Astra':
        return {
          title: 'House of Astra (Astral Star)',
          desc: 'Wizards of stars, research, and deep logical analysis. You map the sky of knowledge to build complex, unbreakable truths.',
          color: 'text-blue-400 border-blue-500/40 bg-blue-950/20 shadow-blue-950/40',
          icon: <Eye className="w-12 h-12 text-blue-400" />
        };
      case 'Verdant':
        return {
          title: 'House of Verdant (Nature Scribe)',
          desc: 'Wizards of nature and human characterization. You ground abstract debates in rich organic stakeholder incentives and empathy.',
          color: 'text-teal-400 border-teal-500/40 bg-teal-950/20 shadow-teal-950/40',
          icon: <Compass className="w-12 h-12 text-teal-400" />
        };
    }
  };

  return (
    <div id="sorting-oracle-bento" className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 max-w-4xl mx-auto px-4">
      {/* Box 1: The Sorting Ceremony */}
      <div className="bg-zinc-950 border border-gold-500/20 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-950/10 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gold-500/10 rounded-lg text-gold-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-gold-200 tracking-wide">The Sorting Podium</h3>
          </div>
          
          <p className="text-sm text-zinc-400 font-serif leading-relaxed mb-6">
            Find which of the six ancient MDS Debate Houses corresponds to your intellectual spirit. Earn 100 XP upon completion.
          </p>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!showSortingQuiz && !sortedHouse ? (
              <motion.button
                key="start-quiz"
                onClick={() => { playBookOpenSound(); setShowSortingQuiz(true); }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-display font-bold text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-gold-950/30 cursor-pointer uppercase"
              >
                Mount The Podium
              </motion.button>
            ) : showSortingQuiz && !sortedHouse ? (
              <motion.div
                key={`q-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center text-xs font-mono text-gold-500">
                  <span>SPELL SELECTION</span>
                  <span>{currentQuestion + 1}/{quizQuestions.length}</span>
                </div>
                <h4 className="text-sm font-medium text-white font-serif italic mb-4">
                  "{quizQuestions[currentQuestion].q}"
                </h4>
                
                <div className="space-y-2">
                  {quizQuestions[currentQuestion].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionClick(opt.house)}
                      className="w-full text-left p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-gold-500/30 rounded-lg transition-all text-xs text-zinc-300 font-sans cursor-pointer flex items-center gap-3"
                    >
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-950 text-[10px] font-mono border border-zinc-800 text-gold-500">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              sortedHouse && (
                <motion.div
                  key="sorted"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-4 border rounded-xl flex flex-col items-center text-center ${getHouseDetails(sortedHouse)?.color}`}
                >
                  <div className="mb-3 animate-float">
                    {getHouseDetails(sortedHouse)?.icon}
                  </div>
                  <h4 className="font-display font-black text-sm tracking-widest uppercase mb-1">
                    {getHouseDetails(sortedHouse)?.title}
                  </h4>
                  <p className="text-xs font-serif italic text-zinc-300 leading-relaxed max-w-xs">
                    {getHouseDetails(sortedHouse)?.desc}
                  </p>
                  
                  <button
                    onClick={() => {
                      playPaperSound();
                      setSortedHouse(null);
                      setCurrentQuestion(0);
                      setShowSortingQuiz(false);
                      setHouseScores({ Aurelius: 0, Sylph: 0, Ignis: 0, Tenebris: 0, Astra: 0, Verdant: 0 });
                    }}
                    className="mt-4 text-[10px] font-mono tracking-widest text-gold-400 hover:text-gold-300 cursor-pointer underline decoration-dotted"
                  >
                    Resort alignment
                  </button>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Box 2: The Daily Debate Prophecy (Oracle of MDS) */}
      <div className="bg-zinc-950 border border-gold-500/20 p-6 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-950/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 animate-pulse">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-gold-200 tracking-wide">The Oracle’s Scroll</h3>
            </div>
            
            {prophecy && (
              <span className="font-mono text-[9px] tracking-widest px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 uppercase">
                {prophecy.fortune}
              </span>
            )}
          </div>

          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
            Direct from the Server Oracle
          </p>
        </div>

        <div className="min-h-[140px] flex flex-col justify-center">
          {isLoadingProphecy ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-6">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-mono text-zinc-500 animate-pulse">Consulting high-tier logical spirits...</span>
            </div>
          ) : prophecy ? (
            <div className="space-y-4">
              <p className="font-serif italic text-sm text-zinc-300 leading-relaxed border-l-2 border-purple-500/40 pl-3">
                "{prophecy.prophecy}"
              </p>
              
              <div className="bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-lg space-y-1">
                <span className="font-mono text-[9px] text-purple-400 tracking-widest block uppercase">INCANTATION TIP</span>
                <p className="text-xs font-sans text-zinc-400">
                  {prophecy.spellTip}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span>LUCKY CATEGORY:</span>
                <span className="text-gold-400">{prophecy.luckyMotionCategory}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs font-serif text-zinc-500 italic text-center">
              The scroll is sealed. Unfathomable error blocks the spirits.
            </p>
          )}
        </div>

        <button
          onClick={() => { playMagicSound(); loadProphecy(true); }}
          disabled={isLoadingProphecy}
          className="mt-4 w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-gold-500/10 hover:border-gold-500/30 text-gold-400/80 hover:text-gold-400 font-mono text-[10px] tracking-widest rounded-xl transition-all cursor-pointer uppercase"
        >
          Consult Daily Prophecy Again
        </button>
      </div>
    </div>
  );
}
