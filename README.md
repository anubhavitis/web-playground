# Sound is Math, Not Media

Every sound on your phone — every tap, swipe, notification — is generated from math. Oscillators, gain curves, frequency ramps. No `.mp3` files. I wanted to see if browsers could do the same thing, using nothing but the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

Turns out, they can.

**[Try it live](https://web-playground-black.vercel.app/)**

## What this is

A browser-based audio playground that generates every sound in real-time. A single function — `playTone()` — creates an oscillator, shapes it with a gain node, applies a frequency ramp, and stops it. That's it. One function replaces hundreds of audio files.

## How it works

The Web Audio API gives you raw signal processing primitives:

- **Oscillators** generate waveforms (sine, square, sawtooth, triangle)
- **Gain nodes** control volume with exponential ramps for natural decay
- **Frequency ramps** shift pitch over time — this is what makes a laser sound different from a coin sound

Every sound is just a different parameter set fed to the same oscillator. A coin pickup is a high-frequency sine with an upward ramp. A laser is a sawtooth with a steep downward ramp. Same math, different personality.

## What you can do

- **8 sound profiles** — minimalist, mechanical, retro, organic, cosmic, arcade, vintage, industrial — each one remaps every UI interaction to a different parameter set
- **20 demo melodies** across classic tunes, sound design patterns, and musical sequences — all synthesized live
- **Free play mode** — pick a waveform, set frequency/duration/volume/ramp, and hear exactly what the math produces
- **Real-time visualizer** — watch the waveform as it plays

## The idea

I was reverse engineering how devices generate UI sounds — the clicks, the haptics, the notification tones. It's all procedural. No one is shipping `.wav` files for a button tap. It's oscillators and envelopes, computed on the fly.

Browsers have had the same primitives sitting in the Web Audio API for years. So I built this to prove the point: you don't need audio files to make a UI feel alive. You need math.
