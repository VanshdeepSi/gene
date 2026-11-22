/**
 * Web Audio API synthesized mechanical keystroke and scan click.
 * Zero external audio files required. Completely offline & synthetic.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = false;

export function isAudioEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return soundEnabled;
}

export function setAudioEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem("gene_sound_enabled", enabled ? "1" : "0");
    // Trigger custom event so any UI listening can update
    window.dispatchEvent(new Event("gene_audio_toggle"));
  }
}

export function initAudioPreference(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("gene_sound_enabled");
  soundEnabled = stored === "1"; // OFF by default
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Generates a brief, soft mechanical typewriter tick (12-18ms)
 */
export function playKeyTick(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // High subtle bandpass click
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200 + Math.random() * 400, now);
    filter.Q.setValueAtTime(4, now);

    // Short burst
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.015);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.018);
  } catch {
    // Ignore audio context errors silently
  }
}

/**
 * Subtle low forensic confirmation tone for door entry / access granted
 */
export function playAccessGrantedBeep(): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.00, now + 0.08); // A5

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch {
    // Silently ignore
  }
}
