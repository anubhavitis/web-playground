import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  audioEngine,
  SOUND_PROFILES,
  type OscillatorShape,
  type SoundProfile,
} from "../lib/audio-engine";

const OSCILLATOR_TYPES: OscillatorShape[] = ["sine", "square", "sawtooth", "triangle"];

const PRESETS = [
  { label: "Bass Hit", f: 80, t: "sine" as const, d: 0.3, v: 0.2, r: 0.1 },
  { label: "Laser", f: 3000, t: "sawtooth" as const, d: 0.15, v: 0.08, r: 0.05 },
  { label: "Coin", f: 1400, t: "square" as const, d: 0.08, v: 0.06, r: 1.5 },
  { label: "Blip", f: 800, t: "sine" as const, d: 0.03, v: 0.1, r: 0.8 },
  { label: "Alarm", f: 1000, t: "square" as const, d: 0.5, v: 0.05, r: 2 },
  { label: "Deep Hum", f: 55, t: "triangle" as const, d: 1, v: 0.15, r: 0.9 },
  { label: "Chirp", f: 2000, t: "sine" as const, d: 0.05, v: 0.08, r: 0.1 },
  { label: "Buzz", f: 150, t: "sawtooth" as const, d: 0.2, v: 0.04, r: 1 },
];

export default function AudioPlayground() {
  const [unlocked, setUnlocked] = useState(false);
  const [profile, setProfile] = useState<SoundProfile>("mechanical");
  const [muted, setMuted] = useState(false);

  const [freq, setFreq] = useState(440);
  const [oscType, setOscType] = useState<OscillatorShape>("sine");
  const [duration, setDuration] = useState(0.15);
  const [volume, setVolume] = useState(0.12);
  const [ramp, setRamp] = useState(0.5);

  const handleUnlock = useCallback(async () => {
    const ok = await audioEngine.unlock();
    setUnlocked(ok);
    if (ok) audioEngine.playClick();
  }, []);

  useEffect(() => {
    audioEngine.setProfile(profile);
  }, [profile]);

  useEffect(() => {
    audioEngine.isMuted = muted;
  }, [muted]);

  const playFree = useCallback(() => {
    audioEngine.playTone({
      frequency: freq,
      type: oscType,
      duration,
      volume,
      rampMultiplier: ramp,
    });
  }, [freq, oscType, duration, volume, ramp]);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setFreq(p.f);
    setOscType(p.t);
    setDuration(p.d);
    setVolume(p.v);
    setRamp(p.r);
    audioEngine.playTone({
      frequency: p.f,
      type: p.t,
      duration: p.d,
      volume: p.v,
      rampMultiplier: p.r,
    });
  };

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto px-4 pt-[20vh] text-center font-sans">
        <h1 className="text-xl font-bold mb-1">Audio Playground</h1>
        <p className="text-zinc-500 text-sm mb-6">
          Browsers require a user gesture to enable audio.
        </p>
        <button
          onClick={handleUnlock}
          className="bg-zinc-900 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
        >
          Enable Audio
        </button>
        <div className="mt-8">
          <Link to="/" className="text-zinc-400 text-xs hover:text-zinc-600 transition-colors">
            &larr; Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-16 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/" className="text-zinc-400 text-[0.7rem] hover:text-zinc-600 transition-colors no-underline">
            &larr; Home
          </Link>
          <h1 className="text-xl font-bold mt-1">Audio Playground</h1>
        </div>
        <button
          onClick={() => setMuted((m) => !m)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            muted
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-green-50 text-green-600 border-green-200"
          }`}
        >
          {muted ? "Muted" : "Sound On"}
        </button>
      </div>

      <Section>
        <p className="text-sm text-zinc-600 leading-relaxed">
          <strong className="text-zinc-900">No audio files. Zero downloads.</strong>{" "}
          Every sound on this page is generated in real-time using the{" "}
          <strong>Web Audio API</strong> — the browser creates raw oscillator
          waveforms (sine, square, sawtooth, triangle), shapes them with gain
          nodes, and applies frequency ramps, all in under a millisecond.
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed mt-3">
          Unlike sample-based audio, procedural sounds are{" "}
          <strong>infinitely tunable</strong> — change the waveform, pitch,
          decay, and envelope on the fly. A single function replaces hundreds of
          .mp3 files. Each "sound profile" below is just a different set of
          parameters fed to the same oscillator — personality in UI sound is a
          matter of math, not media.
        </p>
      </Section>

      <Section>
        <SectionLabel>Sound Profile</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {SOUND_PROFILES.map((p) => (
            <Chip
              key={p}
              active={profile === p}
              onClick={() => {
                setProfile(p);
                audioEngine.playClick();
              }}
            >
              {p}
            </Chip>
          ))}
        </div>
      </Section>

      <Section>
        <SectionLabel>Profile Sounds</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <SoundBox label="Hover Me" sub="hover" onMouseEnter={() => audioEngine.playHover()} />
          <SoundBox label="Click Me" sub="click" onClick={() => audioEngine.playClick()} />
          <SoundBox label="Dismiss" sub="click" onClick={() => audioEngine.playDismiss()} />
          <SoundBox label="Scroll Tick" sub="click" onClick={() => audioEngine.playScroll()} />
        </div>
      </Section>

      <Section>
        <SectionLabel>Free Play</SectionLabel>
        <div className="mb-3">
          <SectionLabel sub>Waveform</SectionLabel>
          <div className="flex gap-1.5">
            {OSCILLATOR_TYPES.map((t) => (
              <Chip key={t} active={oscType === t} onClick={() => setOscType(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
        <SliderControl label="Frequency" value={freq} display={`${freq} Hz`} min={20} max={8000} step={1} onChange={setFreq} hint="20 Hz — 8000 Hz" />
        <SliderControl label="Duration" value={duration} display={`${duration.toFixed(2)}s`} min={0.01} max={2} step={0.01} onChange={setDuration} />
        <SliderControl label="Volume" value={volume} display={`${(volume * 100).toFixed(0)}%`} min={0} max={0.5} step={0.01} onChange={setVolume} />
        <SliderControl label="Freq Ramp" value={ramp} display={`${ramp.toFixed(2)}x`} min={0.05} max={2} step={0.01} onChange={setRamp} hint="<1 = pitch drops, >1 = pitch rises" />
        <button
          onClick={playFree}
          className="w-full bg-zinc-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-zinc-800 active:scale-95 transition-all mt-1 cursor-pointer"
        >
          Play Tone
        </button>
      </Section>

      <Section>
        <SectionLabel>Quick Presets</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <Chip key={p.label} active={false} onClick={() => applyPreset(p)}>
              {p.label}
            </Chip>
          ))}
        </div>
      </Section>

      <Section>
        <SectionLabel>Scroll Sound</SectionLabel>
        <ScrollBox />
      </Section>

      <Section>
        <SectionLabel>AudioContext Info</SectionLabel>
        <ContextInfo />
      </Section>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 mb-3">
      {children}
    </div>
  );
}

function SectionLabel({ children, sub }: { children: React.ReactNode; sub?: boolean }) {
  return (
    <span
      className={`block uppercase tracking-widest font-semibold text-zinc-400 mb-2 ${
        sub ? "text-[0.6rem]" : "text-[0.7rem]"
      }`}
    >
      {children}
    </span>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
        active
          ? "bg-zinc-900 text-white border-zinc-900"
          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
      }`}
    >
      {children}
    </button>
  );
}

function SoundBox({
  label,
  sub,
  onMouseEnter,
  onClick,
}: {
  label: string;
  sub: string;
  onMouseEnter?: () => void;
  onClick?: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="border border-zinc-200 rounded-lg p-5 text-center cursor-pointer bg-white hover:border-zinc-400 transition-all select-none active:scale-95"
    >
      <div className="text-sm font-semibold text-zinc-900">{label}</div>
      <div className="text-[0.65rem] text-zinc-400 mt-1">{sub}</div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center">
        <span className="text-[0.6rem] uppercase tracking-widest font-semibold text-zinc-400">
          {label}
        </span>
        <span className="text-xs font-bold text-zinc-900">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-zinc-900"
      />
      {hint && <div className="text-[0.6rem] text-zinc-400 mt-0.5">{hint}</div>}
    </div>
  );
}

function ScrollBox() {
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    audioEngine.handleScroll(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      onScroll={handleScroll}
      className="h-30 overflow-y-scroll border border-zinc-200 rounded-lg bg-white"
    >
      <div className="h-[800px] p-4">
        <p className="text-xs text-zinc-500 mb-2">
          Scroll here to hear tick sounds (~60px intervals).
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`scroll-row-${i}`}
            className="py-2 border-b border-zinc-100 text-xs text-zinc-400"
          >
            Row {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContextInfo() {
  const ctx = audioEngine.getContext();
  if (!ctx) return <p className="text-xs text-zinc-400">No context</p>;

  return (
    <div className="text-xs text-zinc-600 leading-7">
      <div>
        <strong>State:</strong> {ctx.state}
      </div>
      <div>
        <strong>Sample Rate:</strong> {ctx.sampleRate} Hz
      </div>
      <div>
        <strong>Base Latency:</strong> {(ctx.baseLatency * 1000).toFixed(1)} ms
      </div>
      <div>
        <strong>Current Time:</strong> {ctx.currentTime.toFixed(2)}s
      </div>
      <div>
        <strong>Destination Channels:</strong> {ctx.destination.maxChannelCount}
      </div>
    </div>
  );
}
