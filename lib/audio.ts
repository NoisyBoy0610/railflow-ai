import { IndicLanguage } from './types';

export const INDIC_LANGUAGES: { code: IndicLanguage; name: string; nativeName: string; speechLocale: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechLocale: 'or-IN' },
];

let activeAudioElement: HTMLAudioElement | null = null;

export async function speakMessage(text: string, lang: IndicLanguage = 'en') {
  if (typeof window === 'undefined') {
    return;
  }

  // Stop any currently playing speech audio
  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement.currentTime = 0;
    activeAudioElement = null;
  }

  // Step 1: Attempt Server-side Neural Studio Human Voice Generation (OpenAI Nova / Shimmer)
  try {
    const response = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang })
    });

    if (response.ok && response.headers.get('Content-Type')?.includes('audio')) {
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      activeAudioElement = audio;
      audio.playbackRate = 1.0;
      await audio.play();
      return;
    }
  } catch (err) {
    console.debug('Neural TTS fallback to enhanced browser synthesis:', err);
  }

  // Step 2: High-Quality Natural Human Voice Browser Synthesizer
  if (!('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = INDIC_LANGUAGES.find(l => l.code === lang) || INDIC_LANGUAGES[0];
    utterance.lang = langObj.speechLocale;

    // Natural human conversational pacing
    utterance.rate = 0.92;
    utterance.pitch = 1.04;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();

    // Priority filter for natural, human-sounding neural voices
    const preferredVoice = voices.find(v => {
      const name = v.name.toLowerCase();
      const isTargetLang = v.lang.startsWith(langObj.speechLocale.split('-')[0]) || v.lang === langObj.speechLocale;
      const isNatural = name.includes('natural') || name.includes('neural') || name.includes('google') || 
                        name.includes('veena') || name.includes('lekha') || name.includes('rishi') || 
                        name.includes('neerja') || name.includes('swara') || name.includes('siri') || 
                        name.includes('samantha') || name.includes('premium') || name.includes('enhanced');
      return isTargetLang && isNatural;
    }) || voices.find(v => v.lang.startsWith(langObj.speechLocale.split('-')[0])) || voices.find(v => v.name.toLowerCase().includes('google'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

// Audio FX synthesizer using Web Audio API (Zero external assets needed!)
class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // IRCTC Confirmation Chime (Melodic Railway Ding-Dong)
  playConfirmationChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.5);
    });
  }

  // Indian Railway Diesel/Electric Horn sound effect
  playTrainHorn() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [311.13, 370.00, 466.16]; // Dual-tone resonant chord

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain.gain.setValueAtTime(0.12, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    });
  }

  // Tatkal Countdown Tick
  playTick() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Urgent Alert Tone (for >3hr train delay or high severity grievance)
  playAlert() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [600, 900].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);

      gain.gain.setValueAtTime(0.15, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.16);
    });
  }
}

export const soundEffects = new SoundSynthesizer();
