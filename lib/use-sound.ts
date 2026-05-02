"use client";

import { useCallback, useRef } from "react";

/**
 * 極輕量 UI 音效 — 用 Web Audio API 直接合成，不需要任何 audio 檔案
 *
 * 設計原則：
 *   - 只在 user gesture 後才創 AudioContext（避免 autoplay 政策警告）
 *   - 全部音色短促 < 80ms，不會煩
 *   - 觸發頻率限制（200ms 內不重複）
 *   - localStorage `finora-sound-off=1` 可關閉
 */

type SoundKind = "click" | "tick" | "success" | "warn";

interface SoundConfig {
  freq: number;       // 主頻率 Hz
  freq2?: number;     // 第二個 freq (chord-like)
  duration: number;   // 秒
  type: OscillatorType;
  volume: number;     // 0-1
}

const SOUND_CONFIG: Record<SoundKind, SoundConfig> = {
  click:   { freq: 880, duration: 0.045, type: "triangle", volume: 0.06 },
  tick:    { freq: 1320, freq2: 1980, duration: 0.06, type: "sine", volume: 0.04 },
  success: { freq: 660, freq2: 990, duration: 0.10, type: "triangle", volume: 0.08 },
  warn:    { freq: 220, duration: 0.08, type: "sawtooth", volume: 0.05 },
};

/**
 * Hook：returns play(kind) 函式
 *
 * Usage:
 *   const playSound = useSound();
 *   <button onClick={() => playSound("click")}>...</button>
 */
export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastTriggerRef = useRef<number>(0);

  const play = useCallback((kind: SoundKind = "click") => {
    if (typeof window === "undefined") return;

    // localStorage opt-out
    try {
      if (window.localStorage.getItem("finora-sound-off") === "1") return;
    } catch { /* SSR or restricted: ignore */ }

    // Throttle
    const now = Date.now();
    if (now - lastTriggerRef.current < 200) return;
    lastTriggerRef.current = now;

    // Lazy AudioContext
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return;
      }
    }
    const ctx = ctxRef.current!;

    const config = SOUND_CONFIG[kind];
    playOscillator(ctx, config.freq, config.duration, config.type, config.volume);
    if (config.freq2) {
      // slight delay for chord effect
      setTimeout(() => playOscillator(ctx, config.freq2!, config.duration * 0.8, config.type, config.volume * 0.7), 12);
    }
  }, []);

  return play;
}

function playOscillator(
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType,
  volume: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.connect(gain);
  gain.connect(ctx.destination);

  // ADSR 包絡（快速 attack + 指數衰減）
  const t0 = ctx.currentTime;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.start(t0);
  osc.stop(t0 + duration);
}

/**
 * Sound preference toggle —— 用在 nav 或 settings：
 *   const [soundOn, toggleSound] = useSoundPref();
 */
export function setSoundPref(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (on) window.localStorage.removeItem("finora-sound-off");
    else window.localStorage.setItem("finora-sound-off", "1");
  } catch { /* ignore */ }
}

export function isSoundOn(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem("finora-sound-off") !== "1";
  } catch { return true; }
}
