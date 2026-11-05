/**
 * Web Audio API synthesizer for sound effects.
 * Requires no external audio files, works completely offline, and operates with zero latency.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Gentle click sound on selecting or deselecting a word
 */
export function playClickSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Audio context may be blocked before first user gesture
  }
}

/**
 * Cheerful rising chord (C5 -> E5 -> G5 -> C6) on correct sentence
 */
export function playCorrectSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.07);

      gain.gain.setValueAtTime(0.001, startTime + index * 0.07);
      gain.gain.linearRampToValueAtTime(0.18, startTime + index * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.07 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.07);
      osc.stop(startTime + index * 0.07 + 0.24);
    });
  } catch {
    // Ignore
  }
}

/**
 * Soft retry chime (friendly double descending tone, not harsh for young children)
 */
export function playErrorSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(290, startTime);
    osc.frequency.exponentialRampToValueAtTime(210, startTime + 0.16);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.18);
  } catch {
    // Ignore
  }
}

/**
 * Celebration fanfare on game victory or finishing all target sentences
 */
export function playFanfare(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [
      { notes: [523.25, 659.25], delay: 0 },
      { notes: [659.25, 783.99], delay: 0.14 },
      { notes: [783.99, 1046.5], delay: 0.28 },
      { notes: [1046.5, 1318.51], delay: 0.44 },
    ];

    const start = ctx.currentTime;
    chords.forEach(({ notes, delay }) => {
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start + delay);

        gain.gain.setValueAtTime(0.001, start + delay);
        gain.gain.linearRampToValueAtTime(0.16, start + delay + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + delay + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start + delay);
        osc.stop(start + delay + 0.38);
      });
    });
  } catch {
    // Ignore
  }
}

/**
 * Speak Arabic text using Web Speech Synthesis API
 */
export function speakArabic(text: string, enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85; // slightly slower for early grades children
    utterance.pitch = 1.05;

    // Pick an Arabic voice if present
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic')
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech errors
  }
}
