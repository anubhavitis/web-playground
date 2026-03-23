import { useState, useCallback, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Volume2,
  Minus,
  Wrench,
  Gamepad2,
  Clock,
  Leaf,
  Sparkles,
  Joystick,
  Factory,
  Music,
  Drum,
  Zap,
  CircleDollarSign,
  CircleDot,
  Siren,
  AudioWaveform,
  Bird,
  WavesLadder,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  audioEngine,
  SOUND_PROFILES,
  type OscillatorShape,
  type SoundProfile,
} from "@/lib/audio-engine";
import {
  MELODIES,
  MELODY_CATEGORIES,
  type Melody,
  type MelodyCategory,
} from "@/lib/melodies";

const PROFILE_ICONS: Record<SoundProfile, LucideIcon> = {
  minimalist: Minus,
  mechanical: Wrench,
  retro: Clock,
  organic: Leaf,
  cosmic: Sparkles,
  arcade: Joystick,
  vintage: Gamepad2,
  industrial: Factory,
};

const OSCILLATOR_TYPES: OscillatorShape[] = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
];

const PRESETS: {
  label: string;
  icon: LucideIcon;
  f: number;
  t: OscillatorShape;
  d: number;
  v: number;
  r: number;
}[] = [
  { label: "Bass Hit", icon: Drum, f: 80, t: "sine", d: 0.3, v: 0.2, r: 0.1 },
  {
    label: "Laser",
    icon: Zap,
    f: 3000,
    t: "sawtooth",
    d: 0.15,
    v: 0.08,
    r: 0.05,
  },
  {
    label: "Coin",
    icon: CircleDollarSign,
    f: 1400,
    t: "square",
    d: 0.08,
    v: 0.06,
    r: 1.5,
  },
  {
    label: "Blip",
    icon: CircleDot,
    f: 800,
    t: "sine",
    d: 0.03,
    v: 0.1,
    r: 0.8,
  },
  { label: "Alarm", icon: Siren, f: 1000, t: "square", d: 0.5, v: 0.05, r: 2 },
  {
    label: "Deep Hum",
    icon: AudioWaveform,
    f: 55,
    t: "triangle",
    d: 1,
    v: 0.15,
    r: 0.9,
  },
  { label: "Chirp", icon: Bird, f: 2000, t: "sine", d: 0.05, v: 0.08, r: 0.1 },
  {
    label: "Buzz",
    icon: WavesLadder,
    f: 150,
    t: "sawtooth",
    d: 0.2,
    v: 0.04,
    r: 1,
  },
];

export default function AudioPlayground() {
  const [unlocked, setUnlocked] = useState(false);
  const [profile, setProfile] = useState<SoundProfile>("minimalist");
  const [muted, setMuted] = useState(false);

  const [freq, setFreq] = useState(440);
  const [oscType, setOscType] = useState<OscillatorShape>("sine");
  const [duration, setDuration] = useState(0.15);
  const [volume, setVolume] = useState(0.12);
  const [ramp, setRamp] = useState(0.5);

  useEffect(() => {
    document.title = "Audio Playground — Web Playground";
  }, []);

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

  useEffect(() => {
    const onScroll = () => audioEngine.handleScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const inSilentZone = (el: HTMLElement) => !!el.closest("[data-no-sound]");
    const onHover = (e: Event) => {
      const el = e.target as HTMLElement;
      if (inSilentZone(el)) return;
      if (el.matches("button, a, [role='button'], .cursor-pointer")) {
        audioEngine.playHover();
      }
    };
    const onClick = (e: Event) => {
      const el = e.target as HTMLElement;
      if (inSilentZone(el)) return;
      if (el.closest("button, a, [role='button'], .cursor-pointer")) {
        audioEngine.playClick();
      }
    };
    document.addEventListener("mouseenter", onHover, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mouseenter", onHover, true);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

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

  const [playing, setPlaying] = useState(false);
  const [selectedMelody, setSelectedMelody] = useState<Melody>(MELODIES[0]);
  const [melodyCategory, setMelodyCategory] =
    useState<MelodyCategory>("Classic Melodies");
  const [activeNote, setActiveNote] = useState<{
    freq: number;
    dur: number;
    index: number;
    wave: OscillatorShape;
  } | null>(null);
  const [noteHistory, setNoteHistory] = useState<
    { freq: number; dur: number; time: number; wave: OscillatorShape }[]
  >([]);
  const timeoutsRef = useRef<number[]>([]);

  const PROFILE_WAVEFORM: Record<SoundProfile, OscillatorShape> = {
    minimalist: "sine",
    mechanical: "square",
    retro: "triangle",
    organic: "sine",
    cosmic: "sine",
    arcade: "square",
    vintage: "sine",
    industrial: "sawtooth",
  };

  const stopTune = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setPlaying(false);
    setActiveNote(null);
  }, []);

  const playTune = useCallback(
    (melody: Melody) => {
      // Stop current tune if playing
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];

      setPlaying(true);
      setNoteHistory([]);
      setActiveNote(null);
      setSelectedMelody(melody);

      const wave = PROFILE_WAVEFORM[profile];
      let time = 0;
      const startTime = Date.now();
      const ids: number[] = [];

      melody.notes.forEach(([f, dur], i) => {
        const id = window.setTimeout(() => {
          audioEngine.playTone({
            frequency: f,
            type: wave,
            duration: dur * 0.9,
            volume: 0.15,
            rampMultiplier: 0.85,
          });
          setActiveNote({ freq: f, dur, index: i, wave });
          setNoteHistory((prev) => [
            ...prev,
            { freq: f, dur, time: Date.now() - startTime, wave },
          ]);
        }, time * 1000);
        ids.push(id);
        time += dur + 0.05;
      });

      const endId = window.setTimeout(() => {
        setPlaying(false);
        setActiveNote(null);
      }, time * 1000);
      ids.push(endId);
      timeoutsRef.current = ids;
    },
    [profile],
  );

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  return (
    <div className="dark min-h-screen w-full bg-[#000000] relative text-white">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
          `,
          backgroundSize: "24px 24px, 24px 24px, 8px 8px",
        }}
      />

      {/* Hero header — full width */}
      <section className="relative z-10 px-6 lg:px-16 pt-12 lg:pt-16 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex-col gap-4">
            <div className="mb-4">
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
                sound is math, not media
              </h1>
              <p className="text-zinc-400 leading-relaxed mb-4">
                <strong className="text-white">
                  No audio files. Zero downloads.
                </strong>{" "}
                Every sound is generated in real-time using the{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline underline-offset-2 text-white hover:text-zinc-400 transition-colors"
                >
                  Web Audio API
                </a>
                . The browser creates raw oscillator waveforms, shapes them with
                gain nodes, and applies frequency ramps — all in under a
                millisecond.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                A single function replaces hundreds of .mp3 files. Each sound
                profile is just a different parameter set fed to the same
                oscillator — personality in UI sound is math, not media.
              </p>
            </div>

            <div className="lg:mt-0 shrink-0 my-auto">
              <div className="flex items-center gap-3 mb-4">
                {!unlocked ? (
                  <Button
                    variant="destructive"
                    onClick={handleUnlock}
                    className="animate-pulse gap-1.5"
                  >
                    <Volume2 className="size-4" />
                    Enable Audio
                  </Button>
                ) : (
                  <Badge
                    variant={muted ? "destructive" : "secondary"}
                    className="cursor-pointer select-none"
                    onClick={() => setMuted((m) => !m)}
                  >
                    {muted ? "Muted" : "Sound On"}
                  </Badge>
                )}
              </div>
              {unlocked && <ContextInfo />}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive controls — 2 cols on desktop */}
      <section className="relative z-10 px-6 lg:px-16 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left: profiles + try it */}
          <div className="space-y-6 mb-8 lg:mb-0">
            <div>
              <SliderLabel>Sound Profile</SliderLabel>
              <div className="flex flex-wrap gap-2">
                {SOUND_PROFILES.map((p) => {
                  const Icon = PROFILE_ICONS[p];
                  return (
                    <Button
                      key={p}
                      size="default"
                      variant={profile === p ? "default" : "outline"}
                      className="gap-1.5 capitalize"
                      onClick={() => {
                        setProfile(p);
                        audioEngine.playClick();
                      }}
                    >
                      <Icon className="size-3.5" />
                      {p}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div>
              <SliderLabel>Try It</SliderLabel>
              <div className="grid grid-cols-2 gap-2">
                <SoundBox
                  label="Hover Me"
                  sub="hover"
                  onMouseEnter={() => audioEngine.playHover()}
                />
                <SoundBox
                  label="Click Me"
                  sub="click"
                  onClick={() => audioEngine.playClick()}
                />
                <SoundBox
                  label="Dismiss"
                  sub="click"
                  onClick={() => audioEngine.playDismiss()}
                />
                <SoundBox
                  label="Scroll Tick"
                  sub="click"
                  onClick={() => audioEngine.playScroll()}
                />
              </div>
            </div>
          </div>

          {/* Right: melodies */}
          <div>
            <SliderLabel>Demo Melodies</SliderLabel>

            <div className="flex border-b border-zinc-800 mb-4">
              {MELODY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMelodyCategory(cat)}
                  className={`px-3 py-2 text-[0.7rem] font-medium transition-all border-b-2 -mb-px ${
                    melodyCategory === cat
                      ? "border-green-500 text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {MELODIES.filter((m) => m.category === melodyCategory).map(
                (m) => {
                  const isActive = selectedMelody.id === m.id && playing;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => (isActive ? stopTune() : playTune(m))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                        isActive
                          ? "bg-green-500/10 border border-green-500/30 text-green-400"
                          : "border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      <Music
                        className={`size-3.5 shrink-0 ${isActive ? "text-green-400" : "text-zinc-600"}`}
                      />
                      <span className="truncate">{m.name}</span>
                    </button>
                  );
                },
              )}
            </div>

            <p className="text-[0.6rem] text-zinc-600 mb-1">
              {playing
                ? `Playing: ${selectedMelody.name}`
                : "Switch profiles to hear tunes in different styles"}
            </p>
          </div>
        </div>

        {/* Visualizer — full width */}
        <div className="max-w-5xl mx-auto mt-6">
          <MelodyVisualizer
            melody={selectedMelody.notes}
            activeNote={activeNote}
            noteHistory={noteHistory}
            playing={playing}
            wave={PROFILE_WAVEFORM[profile]}
          />
        </div>
      </section>

      {/* Free Play */}
      <section data-no-sound className="relative z-10 px-6 lg:px-16 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-zinc-950/80 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Free Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row lg:gap-10">
                {/* Left: controls */}
                <div className="space-y-5 lg:w-2/5 shrink-0">
                  <div>
                    <SliderLabel>Waveform</SliderLabel>
                    <div className="flex gap-1.5">
                      {OSCILLATOR_TYPES.map((t) => (
                        <Button
                          key={t}
                          size="sm"
                          variant={oscType === t ? "default" : "outline"}
                          onClick={() => setOscType(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-zinc-800" />

                  <SliderRow
                    label="Frequency"
                    value={freq}
                    display={`${freq} Hz`}
                    min={20}
                    max={8000}
                    step={1}
                    onChange={setFreq}
                    hint="20 Hz — 8000 Hz"
                  />
                  <SliderRow
                    label="Duration"
                    value={duration}
                    display={`${duration.toFixed(2)}s`}
                    min={0.01}
                    max={2}
                    step={0.01}
                    onChange={setDuration}
                  />
                  <SliderRow
                    label="Volume"
                    value={volume}
                    display={`${(volume * 100).toFixed(0)}%`}
                    min={0}
                    max={0.5}
                    step={0.01}
                    onChange={setVolume}
                  />
                  <SliderRow
                    label="Freq Ramp"
                    value={ramp}
                    display={`${ramp.toFixed(2)}x`}
                    min={0.05}
                    max={2}
                    step={0.01}
                    onChange={setRamp}
                    hint="<1 pitch drops · >1 pitch rises"
                  />

                  <Button className="w-full" size="lg" onClick={playFree}>
                    Play Tone
                  </Button>
                </div>

                {/* Right: presets */}
                <div className="mt-6 lg:mt-0 flex-1">
                  <SliderLabel>Quick Presets</SliderLabel>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => applyPreset(p)}
                          className="flex-1 basis-[calc(25%-0.5rem)] min-w-[calc(25%-0.5rem)] flex flex-col items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/60 py-4 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white transition-all active:scale-95 cursor-pointer"
                        >
                          <Icon className="size-5 text-zinc-500" />
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function SliderLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="block text-[0.65rem] uppercase tracking-widest font-semibold text-zinc-500 mb-2">
      {children}
    </span>
  );
}

function SliderRow({
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: Readonly<{
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}>) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <SliderLabel>{label}</SliderLabel>
        <span className="text-xs font-bold text-white">{display}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
      {hint && <p className="text-[0.6rem] text-zinc-600 mt-1.5">{hint}</p>}
    </div>
  );
}

function SoundBox({
  label,
  sub,
  onMouseEnter,
  onClick,
}: Readonly<{
  label: string;
  sub: string;
  onMouseEnter?: () => void;
  onClick?: () => void;
}>) {
  return (
    <button
      type="button"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="rounded-lg border border-zinc-800 p-5 text-center cursor-pointer bg-zinc-950/60 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all select-none active:scale-95"
    >
      <div className="text-sm font-semibold text-white">{label}</div>
      <div className="text-[0.65rem] text-zinc-500 mt-1">{sub}</div>
    </button>
  );
}

function ContextInfo() {
  const ctx = audioEngine.getContext();
  if (!ctx) return <p className="text-xs text-zinc-500">No context</p>;

  const items = [
    ["State", ctx.state],
    ["Sample Rate", `${ctx.sampleRate} Hz`],
    ["Base Latency", `${(ctx.baseLatency * 1000).toFixed(1)} ms`],
    ["Current Time", `${ctx.currentTime.toFixed(2)}s`],
    ["Destination Channels", ctx.destination.maxChannelCount],
  ] as const;

  return (
    <div className="text-xs text-zinc-500 leading-7 flex gap-4 justify-between">
      {items.map(([key, val]) => (
        <div key={key}>
          <strong className="text-zinc-300">{key}:</strong> {val}
        </div>
      ))}
    </div>
  );
}

function MelodyVisualizer({
  melody,
  activeNote,
  noteHistory,
  playing,
  wave,
}: Readonly<{
  melody: [number, number][];
  activeNote: {
    freq: number;
    dur: number;
    index: number;
    wave: OscillatorShape;
  } | null;
  noteHistory: {
    freq: number;
    dur: number;
    time: number;
    wave: OscillatorShape;
  }[];
  playing: boolean;
  wave: OscillatorShape;
}>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const minFreq = Math.min(...melody.map(([f]) => f));
  const maxFreq = Math.max(...melody.map(([f]) => f));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    const freqToY = (freq: number) => {
      const pad = 24;
      return h - pad - ((freq - minFreq) / (freqRange || 1)) * (h - pad * 2);
    };
    const freqRange = maxFreq - minFreq;
    const stepX = w / Math.max(melody.length - 1, 1);

    const points = melody.map(([freq], i) => ({
      x: i * stepX,
      y: freqToY(freq),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        const y = (h / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Freq labels
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`${maxFreq}Hz`, 4, 12);
      ctx.fillText(`${minFreq}Hz`, 4, h - 4);

      // Gradient fill under the line
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(0, 255, 65, 0.12)");
      grad.addColorStop(1, "rgba(0, 255, 65, 0)");

      ctx.beginPath();
      ctx.moveTo(points[0].x, h);
      // Smooth curve through points
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.lineTo(points[i].x, points[i].y);
        } else {
          const prev = points[i - 1];
          const cpx = (prev.x + points[i].x) / 2;
          ctx.bezierCurveTo(
            cpx,
            prev.y,
            cpx,
            points[i].y,
            points[i].x,
            points[i].y,
          );
        }
      }
      ctx.lineTo(points[points.length - 1].x, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Unplayed line (dim)
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(points[i].x, points[i].y);
        } else {
          const prev = points[i - 1];
          const cpx = (prev.x + points[i].x) / 2;
          ctx.bezierCurveTo(
            cpx,
            prev.y,
            cpx,
            points[i].y,
            points[i].x,
            points[i].y,
          );
        }
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Played line (green glow)
      if (noteHistory.length > 0) {
        const playedEnd = Math.min(noteHistory.length, points.length);
        ctx.beginPath();
        for (let i = 0; i < playedEnd; i++) {
          if (i === 0) {
            ctx.moveTo(points[i].x, points[i].y);
          } else {
            const prev = points[i - 1];
            const cpx = (prev.x + points[i].x) / 2;
            ctx.bezierCurveTo(
              cpx,
              prev.y,
              cpx,
              points[i].y,
              points[i].x,
              points[i].y,
            );
          }
        }
        ctx.shadowColor = "rgba(0, 255, 65, 0.5)";
        ctx.shadowBlur = 8;
        ctx.strokeStyle = "rgba(0, 255, 65, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Dots on each note
      points.forEach((pt, i) => {
        const isActive = activeNote?.index === i;
        const isPlayed = i < noteHistory.length;

        if (isActive) {
          // Outer glow
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 255, 65, 0.15)";
          ctx.fill();
          // Inner dot
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 255, 65, 1)";
          ctx.shadowColor = "rgba(0, 255, 65, 0.8)";
          ctx.shadowBlur = 16;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (isPlayed) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 255, 65, 0.5)";
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
          ctx.fill();
        }
      });

      // Info text
      if (activeNote) {
        ctx.fillStyle = "rgba(0, 255, 65, 0.9)";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "right";
        ctx.fillText(
          `${activeNote.freq}Hz  ${activeNote.wave}  ${activeNote.dur.toFixed(2)}s`,
          w - 4,
          12,
        );
      } else if (!playing && noteHistory.length > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.font = "10px monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${wave}  ${noteHistory.length} notes played`, w - 4, 12);
      } else if (!playing) {
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Play the tune to see the visualizer", w / 2, h / 2);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [melody, activeNote, noteHistory, playing, wave, minFreq, maxFreq]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32 mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60"
    />
  );
}
