/**
 * Web Audio API based gentle notification chime
 * Safe for modern browsers without external asset requests.
 */
export function playGentleChime(type: 'focusComplete' | 'breakComplete' = 'focusComplete') {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (type === 'focusComplete') {
      // Gentle uplifting chime: G5 -> C6 (784Hz -> 1046Hz)
      playTone(ctx, 783.99, 0, 0.4, 0.15);
      playTone(ctx, 1046.50, 0.25, 0.8, 0.2);
    } else {
      // Gentle restorative chime: E5 -> A5 (659Hz -> 880Hz)
      playTone(ctx, 659.25, 0, 0.35, 0.15);
      playTone(ctx, 880.00, 0.22, 0.6, 0.18);
    }
  } catch (err) {
    console.warn('Audio chime play blocked or unsupported', err);
  }
}

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number, maxGain: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

  gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(maxGain, ctx.currentTime + startTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
}
