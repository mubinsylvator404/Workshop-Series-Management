// Web Audio API Sound Synthesizer for Moulvibazar Debating Society (MDS) Academy
// Provides rich, organic, magical sound effects programmatically without requiring external MP3 assets.

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Paper sound: a rustling high-frequency bandpassed white noise burst
export function playPaperSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.2; // 0.2 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.15);
    filter.Q.setValueAtTime(3, ctx.currentTime);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
  } catch (e) {
    console.warn('Audio play blocked or unsupported:', e);
  }
}

// 2. Magic Sound: A shimmering, rapid arpeggio of high-pitch pure sine waves
export function playMagicSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.05);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + index * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.05 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.05);
      osc.stop(now + index * 0.05 + 0.35);
    });
  } catch (e) {
    console.warn('Audio play blocked or unsupported:', e);
  }
}

// 3. Book Open Sound: A combination of a low-frequency paper rustle and a satisfying binding creak
export function playBookOpenSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Binding Creak (triangle wave sliding down)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
    
    // Paper ruffle burst
    setTimeout(() => {
      playPaperSound();
    }, 50);
  } catch (e) {
    console.warn('Audio play blocked or unsupported:', e);
  }
}

// 4. Bell Sound: A pure, resonant, long-decay glass/bell chime
export function playBellSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const fundamental = 880; // A5
    const partials = [1, 2, 3, 4.2, 5.4];
    
    partials.forEach((mult, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * mult, now);
      
      const volume = 0.08 / (i + 1);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5 / mult);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2.0);
    });
  } catch (e) {
    console.warn('Audio play blocked or unsupported:', e);
  }
}

// 5. Feather Sound: A very gentle, soft whirring wind sound
export function playFeatherSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.4);
    
    // Low frequency amplitude modulation for a soft flutter effect
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(8, now); // 8 Hz flutter
    lfoGain.gain.setValueAtTime(0.04, now);
    
    lfo.connect(lfoGain.gain);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    lfo.start(now);
    
    osc.stop(now + 0.5);
    lfo.stop(now + 0.5);
  } catch (e) {
    console.warn('Audio play blocked or unsupported:', e);
  }
}
