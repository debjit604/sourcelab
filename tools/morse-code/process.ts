export const MORSE_TABLE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
};

export const REVERSE_MORSE_TABLE: Record<string, string> = Object.entries(
  MORSE_TABLE
).reduce((acc, [char, morse]) => {
  acc[morse] = char;
  return acc;
}, {} as Record<string, string>);

export function textToMorse(text: string): string {
  if (!text.trim()) return "";

  const words = text.trim().split(/\s+/);
  return words
    .map((word) =>
      word
        .toUpperCase()
        .split("")
        .map((char) => MORSE_TABLE[char] || char)
        .join(" ")
    )
    .join(" / ");
}

export function morseToText(morse: string): string {
  if (!morse.trim()) return "";

  // Split words by slash or 3+ spaces
  const words = morse.trim().split(/\s*\/\s*|\s{3,}/);
  return words
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((token) => REVERSE_MORSE_TABLE[token] || token)
        .join("")
    )
    .join(" ");
}

export interface ToneEvent {
  start: number; // in seconds
  duration: number; // in seconds
}

/**
 * Generates exact tone events for Web Audio API using international Paris timing
 */
export function getAudioSchedule(
  morse: string,
  wpm: number = 20
): { tones: ToneEvent[]; totalDuration: number } {
  const safeWpm = Math.max(5, Math.min(50, wpm));
  const dotTime = 1.2 / safeWpm; // seconds per dot
  const tones: ToneEvent[] = [];

  let currentTime = 0;
  const chars = morse.trim().split("");

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === ".") {
      tones.push({ start: currentTime, duration: dotTime });
      currentTime += dotTime + dotTime; // dot duration + 1 dot intra-character gap
    } else if (c === "-") {
      tones.push({ start: currentTime, duration: dotTime * 3 });
      currentTime += dotTime * 3 + dotTime; // dash duration + 1 dot intra-character gap
    } else if (c === " ") {
      // Space between letters: 3 dots total (1 gap already added after last symbol + 2 dots)
      currentTime += dotTime * 2;
    } else if (c === "/") {
      // Space between words: 7 dots total (1 gap already added + 6 dots)
      currentTime += dotTime * 6;
    }
  }

  return { tones, totalDuration: currentTime };
}

export interface MorseProcessInput {
  text: string;
  mode: "encode" | "decode";
  wpm?: number;
}

export interface MorseProcessResult {
  result: string;
  morse: string;
  text: string;
  totalCharacters: number;
  estimatedDurationSec: number;
}

export async function process(input: MorseProcessInput): Promise<MorseProcessResult> {
  const raw = input.text.trim();
  if (!raw) {
    throw new Error("Input text khali hai");
  }

  const isEncode = input.mode === "encode";
  const morse = isEncode ? textToMorse(raw) : raw;
  const decodedText = isEncode ? raw : morseToText(raw);
  const result = isEncode ? morse : decodedText;

  const wpm = input.wpm || 20;
  const schedule = getAudioSchedule(morse, wpm);

  return {
    result,
    morse,
    text: decodedText,
    totalCharacters: decodedText.length,
    estimatedDurationSec: Math.round(schedule.totalDuration * 10) / 10,
  };
}
