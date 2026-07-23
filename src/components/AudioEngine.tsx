import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Flame, Eye, CloudRain } from 'lucide-react';

export default function AudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAmbiance, setActiveAmbiance] = useState<'castle' | 'fireplace' | 'rain' | 'none'>('none');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<any[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playAmbiance = (type: 'castle' | 'fireplace' | 'rain') => {
    initAudio();
    stopAllSounds();

    if (!audioCtxRef.current) return;

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    gainNodeRef.current = ctx.createGain();
    gainNodeRef.current.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNodeRef.current.connect(ctx.destination);

    if (type === 'castle') {
      // Create a mystical warm backing pad with multiple detuned sine oscillators
      const freqs = [110, 165, 220, 275, 330];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + Math.sin(idx) * 2, ctx.currentTime);
        
        // Low frequency oscillator (LFO) to modulate amplitude gently
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.3, ctx.currentTime);
        
        lfo.connect(lfoGain.gain);
        oscGain.gain.setValueAtTime(0.04, ctx.currentTime);
        
        osc.connect(oscGain);
        if (gainNodeRef.current) {
          oscGain.connect(gainNodeRef.current);
        }
        
        osc.start();
        lfo.start();
        
        oscillatorsRef.current.push(osc, lfo);
      });
    } else if (type === 'fireplace') {
      // Fireplace crackle: high-pass filtered white noise combined with random pops
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.0, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.02, ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      if (gainNodeRef.current) {
        noiseGain.connect(gainNodeRef.current);
      }
      whiteNoise.start();
      oscillatorsRef.current.push(whiteNoise);

      // Procedural Crackle Pops
      const crackleInterval = setInterval(() => {
        if (!isPlaying || activeAmbiance !== 'fireplace') {
          clearInterval(crackleInterval);
          return;
        }
        if (Math.random() > 0.4) {
          const pop = ctx.createOscillator();
          const popGain = ctx.createGain();
          pop.type = 'triangle';
          pop.frequency.setValueAtTime(800 + Math.random() * 1200, ctx.currentTime);
          pop.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

          popGain.gain.setValueAtTime(0.2 * Math.random(), ctx.currentTime);
          popGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

          pop.connect(popGain);
          if (gainNodeRef.current) {
            popGain.connect(gainNodeRef.current);
          }
          pop.start();
          pop.stop(ctx.currentTime + 0.06);
        }
      }, 150);

      // Safe-keep interval ref inside oscillators list using a dummy object with clear function
      oscillatorsRef.current.push({
        stop: () => clearInterval(crackleInterval)
      });
    } else if (type === 'rain') {
      // Soft ambient rain soundscape
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const rainNoise = ctx.createBufferSource();
      rainNoise.buffer = noiseBuffer;
      rainNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.12, ctx.currentTime);

      rainNoise.connect(filter);
      filter.connect(rainGain);
      if (gainNodeRef.current) {
        rainGain.connect(gainNodeRef.current);
      }
      rainNoise.start();
      oscillatorsRef.current.push(rainNoise);
    }
  };

  const stopAllSounds = () => {
    oscillatorsRef.current.forEach((node) => {
      try {
        node.stop();
      } catch (e) {
        // Suppress errors if node already stopped or is interval helper
      }
    });
    oscillatorsRef.current = [];
  };

  const toggleSound = () => {
    initAudio();
    if (isPlaying) {
      stopAllSounds();
      setIsPlaying(false);
      setActiveAmbiance('none');
    } else {
      setIsPlaying(true);
      setActiveAmbiance('castle');
      playAmbiance('castle');
    }
  };

  const switchAmbiance = (type: 'castle' | 'fireplace' | 'rain') => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    setActiveAmbiance(type);
    playAmbiance(type);
  };

  useEffect(() => {
    return () => stopAllSounds();
  }, []);

  return (
    <div id="audio-engine-panel" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black/80 border border-gold-500/30 backdrop-blur-md px-3 py-2 rounded-full shadow-lg shadow-gold-950/20">
      <button
        onClick={toggleSound}
        className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
          isPlaying 
            ? 'bg-gold-500 text-black hover:bg-gold-400' 
            : 'bg-zinc-900 text-gold-400 hover:bg-zinc-800 border border-gold-500/20'
        }`}
        title={isPlaying ? 'Mute Castle Ambiance' : 'Enable Magic Audio Soundscape'}
      >
        {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {isPlaying && (
        <div className="flex items-center gap-1 border-l border-zinc-800 pl-2 animate-fade-in">
          <button
            onClick={() => switchAmbiance('castle')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              activeAmbiance === 'castle' ? 'bg-amber-950/60 text-gold-400 border border-gold-500/40' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Castle Whispers Sound"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => switchAmbiance('fireplace')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              activeAmbiance === 'fireplace' ? 'bg-amber-950/60 text-gold-400 border border-gold-500/40' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Crackling Fireplace"
          >
            <Flame className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => switchAmbiance('rain')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              activeAmbiance === 'rain' ? 'bg-amber-950/60 text-gold-400 border border-gold-500/40' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Mystic Forest Rain"
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
