export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  errorChars: number;
  elapsedSeconds: number;
  mode: "standard" | "actual-words";
}

export interface PersonalBest {
  date: string;
  netWpm: number;
  accuracy: number;
  timeLimit: number;
}

export const SAMPLE_TEXTS = {
  english:
    "The quick brown fox jumps over the lazy dog. Technology is best when it brings people together, and privacy ensures our digital freedom is protected across the modern web.",
  hindi:
    "भारत एक विशाल और विविधता से भरपूर देश है। यहाँ कई भाषाएँ और संस्कृतियाँ प्रेम से साथ रहती हैं। तकनीक के इस युग में अपनी निजता को सुरक्षित रखना सबसे महत्वपूर्ण अधिकार है।",
  bengali:
    "আমাদের মাতৃভাষা বাংলা অতি মধুর ও সমৃদ্ধ। প্রযুক্তির সঠিক ব্যবহারের মাধ্যমে আমরা নতুন দিগন্ত উন্মোচন করতে পারি। গোপনীয়তা রক্ষা করা প্রতি নাগরিকের মৌলিক অধিকার।",
};

export function splitGraphemes(text: string): string[] {
  if (!text) return [];
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    } catch {
      return Array.from(text);
    }
  }
  return Array.from(text);
}

export function calculateMetrics(
  typedCount: number,
  errorCount: number,
  totalKeystrokes: number,
  elapsedSeconds: number,
  mode: "standard" | "actual-words" = "standard",
  actualWordsCount = 0
): TypingMetrics {
  const safeSeconds = Math.max(elapsedSeconds, 1);
  const minutes = safeSeconds / 60;

  let grossWpm = 0;
  if (mode === "actual-words") {
    grossWpm = Math.round(actualWordsCount / minutes);
  } else {
    grossWpm = Math.round(typedCount / 5 / minutes);
  }

  const errorPenalty = errorCount / minutes;
  const netWpm = Math.max(0, Math.round(grossWpm - errorPenalty));

  const safeTotalKeystrokes = Math.max(totalKeystrokes, typedCount);
  const accuracy =
    safeTotalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round(((safeTotalKeystrokes - errorCount) / safeTotalKeystrokes) * 1000) / 10))
      : 100;

  return {
    grossWpm,
    netWpm,
    accuracy,
    totalChars: typedCount,
    correctChars: Math.max(0, typedCount - errorCount),
    errorChars: errorCount,
    elapsedSeconds: Math.round(elapsedSeconds),
    mode,
  };
}

export function getMostMissedKeys(
  missedMap: Record<string, number>,
  limit = 5
): Array<{ key: string; count: number }> {
  return Object.entries(missedMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key: key === " " ? "Space" : key, count }));
}

export function generateChartPoints(
  data: number[],
  width = 320,
  height = 80,
  padding = 10
): { path: string; min: number; max: number } {
  if (!data || data.length === 0) {
    return { path: "", min: 0, max: 0 };
  }
  const min = Math.min(...data);
  const max = Math.max(...data, min + 10);
  const range = max - min || 1;

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data.map((val, i) => {
    const x = padding + i * step;
    const y = height - padding - ((val - min) / range) * innerH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const path = `M ${points.join(" L ")}`;
  return { path, min, max };
}

const PB_KEY = "sl_typing_personal_bests";

export function loadPersonalBests(): PersonalBest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PB_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePersonalBest(pb: PersonalBest): void {
  if (typeof window === "undefined") return;
  try {
    const list = loadPersonalBests();
    list.unshift(pb);
    const trimmed = list.slice(0, 10);
    localStorage.setItem(PB_KEY, JSON.stringify(trimmed));
  } catch {
    // Graceful fallback for private/restricted modes
  }
}
