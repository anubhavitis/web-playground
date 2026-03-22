export type OscillatorShape = "sine" | "square" | "sawtooth" | "triangle";

export type SoundProfile =
  | "minimalist"
  | "mechanical"
  | "retro"
  | "organic"
  | "cosmic"
  | "arcade"
  | "vintage"
  | "industrial";

export const SOUND_PROFILES: SoundProfile[] = [
  "minimalist",
  "mechanical",
  "retro",
  "organic",
  "cosmic",
  "arcade",
  "vintage",
  "industrial",
];

interface ToneParams {
  frequency: number;
  type: OscillatorShape;
  duration: number;
  volume: number;
  rampMultiplier?: number;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private _isMuted = false;
  private _profile: SoundProfile = "minimalist";
  private lastScrollY = 0;
  private scrollThreshold = 60;

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) this.ctx = new AC({ sampleRate: 44100 });
    }
  }

  get isUnlocked() {
    return this.ctx?.state === "running";
  }

  get isMuted() {
    return this._isMuted;
  }

  set isMuted(val: boolean) {
    this._isMuted = val;
  }

  get profile() {
    return this._profile;
  }

  async unlock(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;
    try {
      await this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
      // Safari may not flip state instantly — give it a tick
      if (this.ctx.state !== "running") {
        await new Promise((r) => setTimeout(r, 50));
      }
      return this.ctx.state === "running";
    } catch {
      return false;
    }
  }

  setProfile(profile: SoundProfile) {
    this._profile = profile;
    if (this.ctx?.state === "suspended") this.ctx.resume().catch(() => {});
  }

  getContext(): AudioContext | null {
    return this.ctx;
  }

  playTone(params: ToneParams) {
    if (this._isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    const { frequency, type, duration, volume, rampMultiplier = 0.5 } = params;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(0.1, frequency * rampMultiplier),
      this.ctx.currentTime + duration,
    );

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      this.ctx.currentTime + duration,
    );

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playHover() {
    const presets: Record<SoundProfile, ToneParams> = {
      minimalist: {
        frequency: 1600,
        type: "sine",
        duration: 0.02,
        volume: 0.06,
      },
      arcade: {
        frequency: 2200,
        type: "square",
        duration: 0.02,
        volume: 0.04,
        rampMultiplier: 1.1,
      },
      vintage: {
        frequency: 120,
        type: "sine",
        duration: 0.05,
        volume: 0.06,
        rampMultiplier: 1,
      },
      industrial: {
        frequency: 4000,
        type: "sawtooth",
        duration: 0.01,
        volume: 0.03,
        rampMultiplier: 0.8,
      },
      mechanical: {
        frequency: 600,
        type: "square",
        duration: 0.01,
        volume: 0.05,
        rampMultiplier: 0.95,
      },
      retro: {
        frequency: 1100,
        type: "triangle",
        duration: 0.03,
        volume: 0.04,
        rampMultiplier: 1.2,
      },
      organic: {
        frequency: 200,
        type: "sine",
        duration: 0.03,
        volume: 0.07,
        rampMultiplier: 0.9,
      },
      cosmic: {
        frequency: 2800,
        type: "sine",
        duration: 0.05,
        volume: 0.03,
        rampMultiplier: 0.5,
      },
    };
    this.playTone(presets[this._profile]);
  }

  playClick() {
    const presets: Record<SoundProfile, ToneParams> = {
      minimalist: {
        frequency: 800,
        type: "sine",
        duration: 0.05,
        volume: 0.12,
      },
      arcade: {
        frequency: 1400,
        type: "square",
        duration: 0.06,
        volume: 0.08,
        rampMultiplier: 0.5,
      },
      vintage: {
        frequency: 250,
        type: "sine",
        duration: 0.1,
        volume: 0.12,
        rampMultiplier: 0.7,
      },
      industrial: {
        frequency: 600,
        type: "sawtooth",
        duration: 0.04,
        volume: 0.06,
        rampMultiplier: 0.5,
      },
      mechanical: {
        frequency: 400,
        type: "square",
        duration: 0.03,
        volume: 0.08,
        rampMultiplier: 0.8,
      },
      retro: {
        frequency: 660,
        type: "triangle",
        duration: 0.08,
        volume: 0.08,
        rampMultiplier: 0.6,
      },
      organic: {
        frequency: 300,
        type: "sine",
        duration: 0.05,
        volume: 0.12,
        rampMultiplier: 0.4,
      },
      cosmic: {
        frequency: 1800,
        type: "sine",
        duration: 0.15,
        volume: 0.06,
        rampMultiplier: 0.2,
      },
    };
    this.playTone(presets[this._profile]);
  }

  playDismiss() {
    const presets: Record<SoundProfile, ToneParams> = {
      minimalist: {
        frequency: 800,
        type: "sine",
        duration: 0.05,
        volume: 0.12,
      },
      arcade: {
        frequency: 800,
        type: "square",
        duration: 0.1,
        volume: 0.05,
        rampMultiplier: 0.2,
      },
      vintage: {
        frequency: 180,
        type: "sine",
        duration: 0.15,
        volume: 0.15,
        rampMultiplier: 0.8,
      },
      industrial: {
        frequency: 400,
        type: "sawtooth",
        duration: 0.05,
        volume: 0.05,
        rampMultiplier: 0.5,
      },
      mechanical: {
        frequency: 300,
        type: "square",
        duration: 0.04,
        volume: 0.05,
        rampMultiplier: 0.8,
      },
      retro: {
        frequency: 440,
        type: "triangle",
        duration: 0.12,
        volume: 0.1,
        rampMultiplier: 0.5,
      },
      organic: {
        frequency: 200,
        type: "sine",
        duration: 0.06,
        volume: 0.15,
        rampMultiplier: 0.3,
      },
      cosmic: {
        frequency: 1200,
        type: "sine",
        duration: 0.2,
        volume: 0.05,
        rampMultiplier: 0.1,
      },
    };
    this.playTone(presets[this._profile]);
  }

  playScroll() {
    const presets: Record<SoundProfile, ToneParams> = {
      minimalist: { frequency: 300, type: "sine", duration: 0.06, volume: 0.1 },
      arcade: {
        frequency: 2000,
        type: "square",
        duration: 0.04,
        volume: 0.08,
        rampMultiplier: 1,
      },
      vintage: {
        frequency: 150,
        type: "sine",
        duration: 0.08,
        volume: 0.1,
        rampMultiplier: 1,
      },
      industrial: {
        frequency: 3500,
        type: "sawtooth",
        duration: 0.03,
        volume: 0.06,
        rampMultiplier: 1,
      },
      mechanical: {
        frequency: 200,
        type: "sawtooth",
        duration: 0.05,
        volume: 0.08,
        rampMultiplier: 0.9,
      },
      retro: {
        frequency: 440,
        type: "triangle",
        duration: 0.06,
        volume: 0.08,
        rampMultiplier: 1,
      },
      organic: {
        frequency: 250,
        type: "sine",
        duration: 0.06,
        volume: 0.12,
        rampMultiplier: 0.8,
      },
      cosmic: {
        frequency: 2400,
        type: "sine",
        duration: 0.05,
        volume: 0.08,
        rampMultiplier: 1,
      },
    };
    this.playTone(presets[this._profile]);
  }

  handleScroll(scrollY: number) {
    if (Math.abs(scrollY - this.lastScrollY) > this.scrollThreshold) {
      this.playScroll();
      this.lastScrollY = scrollY;
    }
  }
}

export const audioEngine = new AudioEngine();
