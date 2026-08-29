// Web Audio API Sound Synthesizer for Imperial Portal

let audioCtx = null;
let soundEnabled = true;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const toggleAudio = (enabled) => {
  soundEnabled = enabled;
  if (enabled) {
    playImperialChime();
  }
  return soundEnabled;
};

export const isAudioEnabled = () => soundEnabled;

// Play crisp gold coin/chime tone
export const playImperialChime = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // A6

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn('Audio playback error', e);
  }
};

// Play royal seal stamp heavy thump & chime
export const playSealStampSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Heavy bass thump
    const oscBass = ctx.createOscillator();
    const gainBass = ctx.createGain();
    oscBass.type = 'triangle';
    oscBass.frequency.setValueAtTime(140, ctx.currentTime);
    oscBass.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);

    gainBass.gain.setValueAtTime(0.3, ctx.currentTime);
    gainBass.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    oscBass.connect(gainBass);
    gainBass.connect(ctx.destination);
    oscBass.start();
    oscBass.stop(ctx.currentTime + 0.25);

    // Gold sparkle after-chime
    setTimeout(() => {
      playImperialChime();
    }, 100);
  } catch (e) {
    console.warn('Audio playback error', e);
  }
};

// Play royal victory fanfare tune upon citizenship approval
export const playImperialFanfare = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { note: 523.25, time: 0, duration: 0.15 },    // C5
      { note: 659.25, time: 0.15, duration: 0.15 }, // E5
      { note: 783.99, time: 0.3, duration: 0.15 },  // G5
      { note: 1046.50, time: 0.45, duration: 0.4 }  // C6
    ];

    notes.forEach(({ note, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + duration);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
};
