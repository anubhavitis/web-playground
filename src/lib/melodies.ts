export interface Melody {
  id: string;
  name: string;
  category: string;
  notes: [number, number][]; // [frequency, duration]
}

// Note frequency reference
const C4 = 262, D4 = 294, E4 = 330, F4 = 349, G4 = 392, A4 = 440, B4 = 494;
const C5 = 523, D5 = 587, E5 = 659, F5 = 698, G5 = 784;
const Bb4 = 466, Eb4 = 311, Ab4 = 415, Fs4 = 370;
const C3 = 131, D3 = 147, E3 = 165, F3 = 175, G3 = 196, A3 = 220, B3 = 247;

export const MELODY_CATEGORIES = [
  "Classic Melodies",
  "Sound Design",
  "Musical Patterns",
] as const;

export type MelodyCategory = (typeof MELODY_CATEGORIES)[number];

export const MELODIES: Melody[] = [
  // ── Classic Melodies ──
  {
    id: "happy-birthday",
    name: "Happy Birthday",
    category: "Classic Melodies",
    notes: [
      [C4, 0.3], [C4, 0.15], [D4, 0.4], [C4, 0.4], [F4, 0.4], [E4, 0.6],
      [C4, 0.3], [C4, 0.15], [D4, 0.4], [C4, 0.4], [G4, 0.4], [F4, 0.6],
      [C4, 0.3], [C4, 0.15], [C5, 0.4], [A4, 0.4], [F4, 0.4], [E4, 0.4], [D4, 0.6],
      [Bb4, 0.3], [Bb4, 0.15], [A4, 0.4], [F4, 0.4], [G4, 0.4], [F4, 0.6],
    ],
  },
  {
    id: "twinkle",
    name: "Twinkle Twinkle",
    category: "Classic Melodies",
    notes: [
      [C4, 0.3], [C4, 0.3], [G4, 0.3], [G4, 0.3], [A4, 0.3], [A4, 0.3], [G4, 0.6],
      [F4, 0.3], [F4, 0.3], [E4, 0.3], [E4, 0.3], [D4, 0.3], [D4, 0.3], [C4, 0.6],
      [G4, 0.3], [G4, 0.3], [F4, 0.3], [F4, 0.3], [E4, 0.3], [E4, 0.3], [D4, 0.6],
      [G4, 0.3], [G4, 0.3], [F4, 0.3], [F4, 0.3], [E4, 0.3], [E4, 0.3], [D4, 0.6],
    ],
  },
  {
    id: "mary-lamb",
    name: "Mary Had a Little Lamb",
    category: "Classic Melodies",
    notes: [
      [E4, 0.3], [D4, 0.3], [C4, 0.3], [D4, 0.3], [E4, 0.3], [E4, 0.3], [E4, 0.6],
      [D4, 0.3], [D4, 0.3], [D4, 0.6], [E4, 0.3], [G4, 0.3], [G4, 0.6],
      [E4, 0.3], [D4, 0.3], [C4, 0.3], [D4, 0.3], [E4, 0.3], [E4, 0.3], [E4, 0.3], [E4, 0.3],
      [D4, 0.3], [D4, 0.3], [E4, 0.3], [D4, 0.3], [C4, 0.6],
    ],
  },
  {
    id: "ode-to-joy",
    name: "Ode to Joy",
    category: "Classic Melodies",
    notes: [
      [E4, 0.35], [E4, 0.35], [F4, 0.35], [G4, 0.35],
      [G4, 0.35], [F4, 0.35], [E4, 0.35], [D4, 0.35],
      [C4, 0.35], [C4, 0.35], [D4, 0.35], [E4, 0.35],
      [E4, 0.5], [D4, 0.2], [D4, 0.6],
      [E4, 0.35], [E4, 0.35], [F4, 0.35], [G4, 0.35],
      [G4, 0.35], [F4, 0.35], [E4, 0.35], [D4, 0.35],
      [C4, 0.35], [C4, 0.35], [D4, 0.35], [E4, 0.35],
      [D4, 0.5], [C4, 0.2], [C4, 0.6],
    ],
  },
  {
    id: "fur-elise",
    name: "Fur Elise (Opening)",
    category: "Classic Melodies",
    notes: [
      [E5, 0.2], [Eb4 * 2, 0.2], [E5, 0.2], [Eb4 * 2, 0.2], [E5, 0.2],
      [B4, 0.2], [D5, 0.2], [C5, 0.2], [A4, 0.4],
      [C4, 0.2], [E4, 0.2], [A4, 0.2], [B4, 0.4],
      [E4, 0.2], [Ab4, 0.2], [B4, 0.2], [C5, 0.4],
    ],
  },
  {
    id: "jingle-bells",
    name: "Jingle Bells",
    category: "Classic Melodies",
    notes: [
      [E4, 0.25], [E4, 0.25], [E4, 0.5],
      [E4, 0.25], [E4, 0.25], [E4, 0.5],
      [E4, 0.25], [G4, 0.25], [C4, 0.25], [D4, 0.25], [E4, 0.7],
      [F4, 0.25], [F4, 0.25], [F4, 0.25], [F4, 0.25],
      [F4, 0.25], [E4, 0.25], [E4, 0.25], [E4, 0.15], [E4, 0.15],
      [E4, 0.25], [D4, 0.25], [D4, 0.25], [E4, 0.25], [D4, 0.5], [G4, 0.5],
    ],
  },
  {
    id: "amazing-grace",
    name: "Amazing Grace",
    category: "Classic Melodies",
    notes: [
      [C4, 0.4], [E4, 0.3], [C4, 0.15], [E4, 0.4], [D4, 0.15],
      [C4, 0.4], [A3, 0.6],
      [G3, 0.4], [C4, 0.3], [C4, 0.15], [E4, 0.4], [D4, 0.15],
      [E4, 0.4], [G4, 0.6],
      [E4, 0.4], [G4, 0.3], [E4, 0.15], [G4, 0.4], [E4, 0.15],
      [C4, 0.4], [A3, 0.6],
      [G3, 0.4], [C4, 0.3], [C4, 0.15], [E4, 0.4], [D4, 0.15],
      [C4, 0.8],
    ],
  },

  // ── Sound Design ──
  {
    id: "ascending-scale",
    name: "Ascending Scale",
    category: "Sound Design",
    notes: [
      [C4, 0.25], [D4, 0.25], [E4, 0.25], [F4, 0.25],
      [G4, 0.25], [A4, 0.25], [B4, 0.25], [C5, 0.5],
      [C5, 0.25], [B4, 0.25], [A4, 0.25], [G4, 0.25],
      [F4, 0.25], [E4, 0.25], [D4, 0.25], [C4, 0.5],
    ],
  },
  {
    id: "alarm-siren",
    name: "Alarm Siren",
    category: "Sound Design",
    notes: [
      [800, 0.15], [600, 0.15], [800, 0.15], [600, 0.15],
      [800, 0.15], [600, 0.15], [800, 0.15], [600, 0.15],
      [900, 0.15], [500, 0.15], [900, 0.15], [500, 0.15],
      [900, 0.15], [500, 0.15], [900, 0.15], [500, 0.15],
      [1000, 0.1], [400, 0.1], [1000, 0.1], [400, 0.1],
      [1000, 0.1], [400, 0.1], [1000, 0.1], [400, 0.3],
    ],
  },
  {
    id: "doorbell",
    name: "Doorbell",
    category: "Sound Design",
    notes: [
      [E5, 0.4], [C5, 0.8],
      [E5, 0.4], [C5, 0.8],
    ],
  },
  {
    id: "coin-collect",
    name: "Coin Collect",
    category: "Sound Design",
    notes: [
      [988, 0.08], [1319, 0.3],
    ],
  },
  {
    id: "power-up",
    name: "Power Up",
    category: "Sound Design",
    notes: [
      [200, 0.08], [300, 0.08], [400, 0.08], [500, 0.08],
      [600, 0.08], [700, 0.08], [800, 0.08], [900, 0.08],
      [1000, 0.08], [1200, 0.08], [1400, 0.12], [1600, 0.15],
      [1800, 0.2], [2000, 0.3],
    ],
  },
  {
    id: "game-over",
    name: "Game Over",
    category: "Sound Design",
    notes: [
      [500, 0.3], [450, 0.3], [400, 0.3], [350, 0.3],
      [300, 0.4], [250, 0.5], [200, 0.8],
    ],
  },
  {
    id: "morse-hello",
    name: "Morse Code: HELLO",
    category: "Sound Design",
    // H=.... E=. L=.-.. L=.-.. O=---
    notes: [
      // H
      [700, 0.08], [700, 0.08], [700, 0.08], [700, 0.08],
      // gap
      [0.01, 0.2],
      // E
      [700, 0.08],
      // gap
      [0.01, 0.2],
      // L
      [700, 0.08], [700, 0.25], [700, 0.08], [700, 0.08],
      // gap
      [0.01, 0.2],
      // L
      [700, 0.08], [700, 0.25], [700, 0.08], [700, 0.08],
      // gap
      [0.01, 0.2],
      // O
      [700, 0.25], [700, 0.25], [700, 0.25],
    ],
  },

  // ── Musical Patterns ──
  {
    id: "arpeggio-major",
    name: "Major Arpeggio",
    category: "Musical Patterns",
    notes: [
      [C4, 0.2], [E4, 0.2], [G4, 0.2], [C5, 0.3],
      [G4, 0.2], [E4, 0.2], [C4, 0.3],
      [C4, 0.2], [E4, 0.2], [G4, 0.2], [C5, 0.3],
      [G4, 0.2], [E4, 0.2], [C4, 0.5],
    ],
  },
  {
    id: "arpeggio-minor",
    name: "Minor Arpeggio",
    category: "Musical Patterns",
    notes: [
      [A3, 0.2], [C4, 0.2], [E4, 0.2], [A4, 0.3],
      [E4, 0.2], [C4, 0.2], [A3, 0.3],
      [A3, 0.2], [C4, 0.2], [E4, 0.2], [A4, 0.3],
      [E4, 0.2], [C4, 0.2], [A3, 0.5],
    ],
  },
  {
    id: "pentatonic-riff",
    name: "Pentatonic Riff",
    category: "Musical Patterns",
    notes: [
      [C4, 0.15], [D4, 0.15], [E4, 0.15], [G4, 0.15], [A4, 0.3],
      [G4, 0.15], [E4, 0.15], [D4, 0.3],
      [C4, 0.15], [D4, 0.15], [E4, 0.3], [G4, 0.15], [A4, 0.15],
      [C5, 0.3], [A4, 0.15], [G4, 0.15], [E4, 0.3],
      [D4, 0.15], [C4, 0.15], [D4, 0.3], [C4, 0.5],
    ],
  },
  {
    id: "bass-line",
    name: "Bass Line Loop",
    category: "Musical Patterns",
    notes: [
      [C3, 0.2], [C3, 0.1], [E3, 0.2], [G3, 0.2], [C3, 0.3],
      [F3, 0.2], [F3, 0.1], [A3, 0.2], [C4, 0.2], [F3, 0.3],
      [G3, 0.2], [G3, 0.1], [B3, 0.2], [D4, 0.2], [G3, 0.3],
      [C3, 0.2], [E3, 0.1], [G3, 0.2], [C4, 0.5],
    ],
  },
  {
    id: "chromatic-run",
    name: "Chromatic Run",
    category: "Musical Patterns",
    notes: [
      [262, 0.1], [277, 0.1], [294, 0.1], [311, 0.1],
      [330, 0.1], [349, 0.1], [370, 0.1], [392, 0.1],
      [415, 0.1], [440, 0.1], [466, 0.1], [494, 0.1],
      [523, 0.3],
      [494, 0.1], [466, 0.1], [440, 0.1], [415, 0.1],
      [392, 0.1], [370, 0.1], [349, 0.1], [330, 0.1],
      [311, 0.1], [294, 0.1], [277, 0.1], [262, 0.3],
    ],
  },
  {
    id: "octave-bounce",
    name: "Octave Bounce",
    category: "Musical Patterns",
    notes: [
      [C3, 0.15], [C4, 0.15], [E3, 0.15], [E4, 0.15],
      [G3, 0.15], [G4, 0.15], [C4, 0.15], [C5, 0.3],
      [G3, 0.15], [G4, 0.15], [E3, 0.15], [E4, 0.15],
      [C3, 0.15], [C4, 0.15], [C3, 0.5],
    ],
  },
];
