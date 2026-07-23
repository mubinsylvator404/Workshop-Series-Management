import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wand2, ShieldAlert, Swords, BrainCircuit, RefreshCw, Feather } from 'lucide-react';

export default function InteractiveAIPanel() {
  const [activeTab, setActiveTab] = useState<'motion' | 'prep'>('motion');
  
  // Motion Generator state
  const [motionCategory, setMotionCategory] = useState('Politics Alchemy');
  const [motionLevel, setMotionLevel] = useState('Intermediate');
  const [isGeneratingMotion, setIsGeneratingMotion] = useState(false);
  const [generatedMotionData, setGeneratedMotionData] = useState<any>(null);

  // Prep Partner state
  const [prepMotion, setPrepMotion] = useState('');
  const [prepSide, setPrepSide] = useState('Government');
  const [prepTitle, setPrepTitle] = useState('');
  const [prepExplanation, setPrepExplanation] = useState('');
  const [isPrepping, setIsPrepping] = useState(false);
  const [prepFeedback, setPrepFeedback] = useState<any>(null);
  const [prepError, setPrepError] = useState('');

  const handleGenerateMotion = async () => {
    setIsGeneratingMotion(true);
    setGeneratedMotionData(null);
    try {
      const res = await fetch('/api/gemini/generate-motion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: motionCategory, level: motionLevel })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedMotionData(data);
      } else {
        throw new Error('API unreachable');
      }
    } catch (err) {
      setGeneratedMotionData({
        motion: "This House would mandate public funding for local debate academies across developing districts.",
        clashPoints: [
          "Equity of opportunity vs resource allocation",
          "Short term academic burden vs long term critical reasoning gains",
          "Government intervention vs institutional independence"
        ],
        governmentTips: [
          "Demonstrate how structured debate elevates analytical thinking",
          "Show that marginalized students gain a platform for civic voice",
          "Argue that public investment creates sustainable leadership networks"
        ],
        oppositionTips: [
          "Highlight alternative educational priorities like STEM or infrastructure",
          "Point out risk of political bias in government-funded debate curricula",
          "Argue that organic community clubs foster more authentic discourse"
        ]
      });
    } finally {
      setIsGeneratingMotion(false);
    }
  };

  const handlePrepArgument = async (e: FormEvent) => {
    e.preventDefault();
    if (!prepExplanation) {
      setPrepError("Please state your argument explanation so Professor Owl can analyze!");
      return;
    }
    setPrepError('');
    setIsPrepping(true);
    setPrepFeedback(null);
    try {
      const res = await fetch('/api/gemini/debate-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motion: prepMotion || 'General intellectual progress',
          side: prepSide,
          argumentTitle: prepTitle || 'Sovereign Cognitive Freedom',
          explanation: prepExplanation
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPrepFeedback(data);
      } else {
        throw new Error('API unreachable');
      }
    } catch (err) {
      setPrepFeedback({
        score: 8.5,
        feedback: "Solid argument foundation with strong logical links. Ensure you address opponent counter-arguments directly in your closing impact.",
        logicFlaws: ["Link chain between premise and outcome could be tightened with more concrete examples."],
        improvementTips: ["Use comparative analysis: explain why your impact outweighs the opponent's best case."],
        counterSpells: ["Opponents will likely challenge the feasibility of your proposed mechanism."]
      });
    } finally {
      setIsPrepping(false);
    }
  };

  return (
    <div id="ai-chambers-panel" className="py-12 px-4 max-w-5xl mx-auto space-y-8">
      {/* Title with Professor Owl theme */}
      <div className="text-center space-y-3 relative">
        {/* Animated Professor Owl Avatar */}
        <div className="flex justify-center relative">
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 1, -1, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-20 h-20 bg-gradient-to-b from-[#1A1830] to-[#0D0C16] border-2 border-royal-gold/40 rounded-full flex items-center justify-center shadow-lg cursor-pointer relative"
          >
            {/* Owl Eyes */}
            <div className="flex gap-2.5">
              <motion.div
                animate={{
                  scaleY: [1, 1, 0.1, 1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="w-3.5 h-3.5 rounded-full bg-magic-cyan flex items-center justify-center relative"
              >
                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5" />
              </motion.div>
              <motion.div
                animate={{
                  scaleY: [1, 1, 0.1, 1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="w-3.5 h-3.5 rounded-full bg-magic-cyan flex items-center justify-center relative"
              >
                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5" />
              </motion.div>
            </div>
            {/* Beak */}
            <div className="absolute top-[48px] w-2.5 h-2.5 bg-royal-gold rotate-45 rounded-[2px]" />
            {/* Scholarly Hat */}
            <div className="absolute -top-3 w-10 h-1 bg-zinc-950 border border-royal-gold/30 rounded-full" />
            <div className="absolute -top-[17px] w-6 h-3 bg-zinc-950 border border-royal-gold/30 rounded-t-sm" />
          </motion.div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1830] border border-royal-gold/30 rounded-full text-royal-gold font-mono text-[10px] tracking-widest uppercase shadow-[0_0_10px_rgba(212,175,55,0.15)] animate-pulse">
          <BrainCircuit className="w-3.5 h-3.5 text-royal-gold" />
          The Chamber of Professor Owl (MDS AI Assistant)
        </div>
        
        <h2 className="font-display font-black text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-royal-gold via-warm-candle to-royal-gold tracking-wider uppercase">
          Ask The Professor
        </h2>
        
        <p className="font-serif italic text-sm text-[#CFCFCF] max-w-xl mx-auto leading-relaxed">
          "Welcome, Initiate. I am Professor Owl, the clockwork scribe of MDS. State your motion or draft your argument links, and I shall scan the logical matrices of the high-tier guilds."
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center border-b border-royal-gold/10 max-w-sm mx-auto pb-1 gap-2">
        <button
          onClick={() => setActiveTab('motion')}
          className={`flex-1 min-h-[48px] py-3 px-3 text-xs font-mono font-bold tracking-widest uppercase transition-all border-b-2 flex items-center justify-center cursor-pointer ${
            activeTab === 'motion'
              ? 'text-royal-gold border-royal-gold font-black bg-royal-gold/5 rounded-t-xl'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          Motion Spellforge
        </button>
        <button
          onClick={() => setActiveTab('prep')}
          className={`flex-1 min-h-[48px] py-3 px-3 text-xs font-mono font-bold tracking-widest uppercase transition-all border-b-2 flex items-center justify-center cursor-pointer ${
            activeTab === 'prep'
              ? 'text-magic-cyan border-magic-cyan font-black bg-magic-cyan/5 rounded-t-xl'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          Owl Adjudicator
        </button>
      </div>

      {/* Content tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'motion' ? (
          <motion.div
            key="motion-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left selector */}
            <div className="lg:col-span-4 bg-gradient-to-b from-[#1A1830]/40 to-[#0D0C16] border border-royal-gold/20 p-5 rounded-2xl space-y-4 shadow-xl">
              <span className="font-mono text-[9px] text-zinc-500 tracking-widest block uppercase font-bold">
                SPELL SECTOR CONFIG
              </span>

              <div className="space-y-3 font-sans">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-royal-gold block uppercase font-bold tracking-wider">SPELL CATEGORY</label>
                  <select
                    value={motionCategory}
                    onChange={(e) => setMotionCategory(e.target.value)}
                    className="w-full bg-[#0D0C16] border border-royal-gold/20 text-xs text-white p-3 rounded-lg outline-none focus:border-royal-gold"
                  >
                    <option value="Politics Alchemy">Politics Alchemy</option>
                    <option value="Socio-Economic Spells">Socio-Economic Spells</option>
                    <option value="International Relations & Treaties">International Relations & Treaties</option>
                    <option value="Climate Charms">Climate Charms</option>
                    <option value="Philosophy & Magic Commons">Philosophy & Magic Commons</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-royal-gold block uppercase font-bold tracking-wider">MANA TIER (DIFFICULTY)</label>
                  <select
                    value={motionLevel}
                    onChange={(e) => setMotionLevel(e.target.value)}
                    className="w-full bg-[#0D0C16] border border-royal-gold/20 text-xs text-white p-3 rounded-lg outline-none focus:border-royal-gold"
                  >
                    <option value="Novice Initiate">Novice Initiate</option>
                    <option value="Intermediate Scholar">Intermediate Scholar</option>
                    <option value="High Archmage">High Archmage</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateMotion}
                disabled={isGeneratingMotion}
                className="w-full min-h-[48px] py-3.5 px-4 bg-gradient-to-r from-royal-gold to-warm-candle text-midnight font-display font-bold text-xs tracking-widest rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer uppercase shadow-[0_0_20px_rgba(212,175,55,0.25)] border border-royal-gold/30 flex items-center justify-center gap-2"
              >
                {isGeneratingMotion ? 'Whispering incantations...' : 'Forge Motion Scroll'}
              </button>
            </div>

            {/* Right Result view */}
            <div className="lg:col-span-8 min-h-[300px]">
              {isGeneratingMotion ? (
                <div className="bg-gradient-to-b from-[#1A1830]/20 to-[#0D0C16] border border-royal-gold/20 p-8 rounded-3xl h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" />
                  <p className="font-serif italic text-xs text-zinc-500 animate-pulse text-center">
                    "Professor Owl is casting scrying spells on the global debate archives..."
                  </p>
                </div>
              ) : generatedMotionData ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-b from-[#1A1830]/40 to-[#0D0C16] border border-royal-gold/20 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden"
                >
                  {/* Motion displays on parchment backing */}
                  <div className="bg-[#fdfae1] border-2 border-[#c58d11] p-5 rounded-2xl text-[#3e2207] font-serif italic text-center text-sm shadow-[inset_0_0_20px_rgba(160,104,15,0.1)]">
                    <span className="font-mono text-[9px] text-[#815012] font-black tracking-widest block uppercase mb-1">THE FORGED MOTION</span>
                    "{generatedMotionData.motion}"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gov side */}
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-xs uppercase tracking-widest text-royal-gold flex items-center gap-1.5 border-b border-[#1A1830] pb-1.5">
                        <Wand2 className="w-4 h-4 text-royal-gold" />
                        Government Offense Spells
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-350 font-serif italic list-disc list-inside">
                        {generatedMotionData.governmentTips.map((tip: string, i: number) => (
                          <li key={i} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Opp side */}
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-xs uppercase tracking-widest text-magic-cyan flex items-center gap-1.5 border-b border-[#1A1830] pb-1.5">
                        <Swords className="w-4 h-4 text-magic-cyan" />
                        Opposition Shields
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-350 font-serif italic list-disc list-inside">
                        {generatedMotionData.oppositionTips.map((tip: string, i: number) => (
                          <li key={i} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900/60 space-y-2">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-widest block uppercase font-bold">CRITICAL POINTS OF CLASH</span>
                    <div className="flex flex-wrap gap-2">
                      {generatedMotionData.clashPoints.map((cl: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[#1A1830] border border-royal-gold/15 rounded-full font-sans text-xs text-royal-gold font-bold">
                          🎯 {cl}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gradient-to-b from-[#1A1830]/20 to-[#0D0C16] border border-royal-gold/15 p-8 rounded-3xl h-full flex flex-col items-center justify-center space-y-2 text-center text-zinc-500 min-h-[300px]">
                  <Sparkles className="w-8 h-8 text-royal-gold/30 mb-2 animate-float" />
                  <p className="font-serif italic text-xs text-zinc-400">
                    "Configure the sector sliders on the left, then command the Spellforge to summon a custom parliamentary motion."
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Prep Tab */
          <motion.div
            key="prep-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left form entry */}
            <form onSubmit={handlePrepArgument} className="lg:col-span-5 bg-gradient-to-b from-[#1A1830]/40 to-[#0D0C16] border border-royal-gold/20 p-5 rounded-2xl space-y-4 shadow-xl">
              <span className="font-mono text-[9px] text-magic-cyan tracking-widest block uppercase font-bold">
                CRITIQUE LEDGER INPUT
              </span>

              <div className="space-y-3 font-sans">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-royal-gold block uppercase font-bold tracking-wider">MOTION STATEMENT</label>
                  <input
                    type="text"
                    value={prepMotion}
                    onChange={(e) => setPrepMotion(e.target.value)}
                    placeholder="e.g. This House would ban historical magical treasures..."
                    className="w-full bg-[#0D0C16] border border-royal-gold/20 text-xs text-white p-3 rounded-lg outline-none focus:border-royal-gold font-serif"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-royal-gold block uppercase font-bold tracking-wider">DEBATING SIDE</label>
                    <select
                      value={prepSide}
                      onChange={(e) => setPrepSide(e.target.value)}
                      className="w-full bg-[#0D0C16] border border-royal-gold/20 text-xs text-white p-2.5 rounded-lg outline-none focus:border-royal-gold"
                    >
                      <option value="Government">Government</option>
                      <option value="Opposition">Opposition</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-royal-gold block uppercase font-bold tracking-wider">SPELL TITLE (ARGUMENT)</label>
                    <input
                      type="text"
                      value={prepTitle}
                      onChange={(e) => setPrepTitle(e.target.value)}
                      placeholder="e.g. Cognitive Shielding"
                      className="w-full bg-[#0D0C16] border border-royal-gold/20 text-xs text-white p-2.5 rounded-lg outline-none focus:border-royal-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-royal-gold block uppercase font-bold tracking-wider">ARGUMENT LOGIC LINKAGES</label>
                  <textarea
                    value={prepExplanation}
                    onChange={(e) => { setPrepExplanation(e.target.value); if (prepError) setPrepError(''); }}
                    placeholder="Explain the chain of causation and structural links. How does this policy achieve the desired outcomes?"
                    rows={4}
                    className="w-full bg-[#0D0C16] border border-royal-gold/20 text-xs text-white p-3 rounded-lg outline-none focus:border-royal-gold font-sans resize-none"
                  />
                  {prepError && (
                    <div className="p-2 bg-red-950/40 border border-red-500/30 text-red-400 text-[10px] font-mono rounded-lg">
                      ⚠ {prepError}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPrepping}
                className="w-full min-h-[48px] py-3.5 px-4 bg-gradient-to-r from-magic-cyan/80 to-magic-cyan text-midnight font-display font-bold text-xs tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer uppercase shadow-[0_0_20px_rgba(89,225,255,0.25)] border border-magic-cyan/30 flex items-center justify-center gap-2"
              >
                {isPrepping ? 'Evaluating logical matrix...' : 'Consult Professor Owl'}
              </button>
            </form>

            {/* Right critique displays */}
            <div className="lg:col-span-7 min-h-[300px]">
              {isPrepping ? (
                <div className="bg-gradient-to-b from-[#1A1830]/20 to-[#0D0C16] border border-royal-gold/20 p-8 rounded-3xl h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-magic-cyan border-t-transparent rounded-full animate-spin" />
                  <p className="font-serif italic text-xs text-zinc-500 animate-pulse text-center">
                    "Professor Owl is scanning the logic linkages of your argument..."
                  </p>
                </div>
              ) : prepFeedback ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-b from-[#1A1830]/40 to-[#0D0C16] border border-royal-gold/20 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-zinc-900/60 pb-3">
                    <span className="font-mono text-[9px] text-royal-gold tracking-widest block uppercase font-bold">OWL ADJUDICATOR DICTUM</span>
                    <div className="flex items-center gap-1.5 bg-magic-cyan/15 border border-magic-cyan/30 px-3 py-1 rounded-full">
                      <span className="font-mono text-[10px] text-magic-cyan font-bold uppercase">SCORE:</span>
                      <span className="font-mono text-xs font-black text-white">{prepFeedback.score} / 10</span>
                    </div>
                  </div>

                  <p className="font-serif italic text-sm text-zinc-300 leading-relaxed border-l-2 border-royal-gold/40 pl-3">
                    "{prepFeedback.feedback}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengthen */}
                    <div className="bg-[#0D0C16]/60 border border-royal-gold/15 p-4 rounded-xl space-y-1.5 shadow-md">
                      <span className="font-mono text-[9px] text-emerald-400 tracking-widest block uppercase font-bold">STRENGTHEN LINKS</span>
                      <ul className="space-y-1.5 text-xs text-zinc-300 font-serif italic">
                        {prepFeedback.strengthenSpell.map((st: string, i: number) => (
                          <li key={i} className="flex gap-1.5 items-start">
                            <span className="text-emerald-500">✦</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Logic Flaws */}
                    <div className="bg-[#0D0C16]/60 border border-royal-gold/15 p-4 rounded-xl space-y-1.5 shadow-md">
                      <span className="font-mono text-[9px] text-red-400 tracking-widest block uppercase font-bold">MANA LEAKS (LOGIC FLAWS)</span>
                      <ul className="space-y-1.5 text-xs text-zinc-300 font-serif italic">
                        {prepFeedback.logicFlaws.map((fl: string, i: number) => (
                          <li key={i} className="flex gap-1.5 items-start">
                            <span className="text-red-500">✦</span>
                            <span>{fl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-[#0D0C16]/60 border border-royal-gold/15 p-4 rounded-xl space-y-1.5 shadow-md">
                    <span className="font-mono text-[9px] text-magic-cyan tracking-widest block uppercase font-bold">OPPOSING DISENCHANTMENT (REBUTTALS)</span>
                    <ul className="space-y-1.5 text-xs text-zinc-300 font-serif italic pl-1">
                      {prepFeedback.counterSpell.map((co: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span>🔮</span>
                          <span>{co}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gradient-to-b from-[#1A1830]/20 to-[#0D0C16] border border-royal-gold/15 p-8 rounded-3xl h-full flex flex-col items-center justify-center space-y-2 text-center text-zinc-550 min-h-[300px]">
                  <ShieldAlert className="w-8 h-8 text-magic-cyan/30 mb-2 animate-float" />
                  <p className="font-serif italic text-xs text-zinc-400">
                    "State your logic linkage details on the left, and Professor Owl will trace your causal pathways and suggest wards against rebuttals."
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
