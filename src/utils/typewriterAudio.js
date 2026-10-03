// Web Audio API synthesized vintage mechanical typewriter sound engine
// No external audio files or network requests required.

let audioCtx = null;
let isAudioEnabled = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const setTypewriterAudioEnabled = (enabled) => {
  isAudioEnabled = enabled;
  if (enabled) {
    getAudioContext();
  }
};

export const getTypewriterAudioEnabled = () => isAudioEnabled;

/**
 * Synthesizes an authentic mechanical typewriter keystroke
 * Combines a noise burst (metal key hit) with a wooden platen resonance thump
 */
export const playKeystroke = (variant = 'normal') => {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Noise burst for metal typebar hitting ribbon & paper
    const bufferSize = ctx.sampleRate * 0.035; // 35ms burst
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Bandpass filter to simulate mechanical snap
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    const baseFreq = variant === 'space' ? 650 : variant === 'heavy' ? 1400 : 1800 + (Math.random() * 400 - 200);
    filter.frequency.setValueAtTime(baseFreq, now);
    filter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    const peakVolume = variant === 'space' ? 0.09 : 0.12;
    noiseGain.gain.setValueAtTime(peakVolume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);

    // 2. Low-frequency platen thump (the roller vibration)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    const pitch = variant === 'space' ? 95 : 125 + (Math.random() * 20 - 10);
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.045);

    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    // Graceful silent fallback if Web Audio is restricted
  }
};

/**
 * Vintage typewriter carriage return bell ('Ding!')
 */
export const playBell = () => {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Clear metallic brass bell resonance
    osc.frequency.setValueAtTime(2180, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {
    // Silent fallback
  }
};

/**
 * Mechanical carriage return ratchet sound
 */
export const playCarriageReturn = () => {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Series of 3 quick clicks
    for (let i = 0; i < 3; i++) {
      const clickTime = now + (i * 0.035);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420 - (i * 40), clickTime);
      gain.gain.setValueAtTime(0.06, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(clickTime);
      osc.stop(clickTime + 0.025);
    }
  } catch (e) {
    // Silent fallback
  }
};
