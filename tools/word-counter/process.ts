export interface KeywordDensity {
  word: string;
  count: number;
  percentage: string;
}

export interface WordCounterStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
  speakingTime: string;
  avgWordLength: number;
  topKeywords: KeywordDensity[];
}

export interface WordCounterProcessInput {
  text: string;
}

export interface WordCounterProcessOutput {
  stats: WordCounterStats;
  result: string;
}

export function formatTimeEstimate(words: number, wpm: number): string {
  if (words <= 0) return "0 sec";
  const totalSeconds = Math.round((words / wpm) * 60);
  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
}

export function computeKeywordDensity(words: string[]): KeywordDensity[] {
  if (words.length === 0) return [];

  const freqMap: Record<string, number> = {};
  for (const rawWord of words) {
    const clean = rawWord.toLowerCase().replace(/^[^\w\u0900-\u097F]+|[^\w\u0900-\u097F]+$/g, "");
    if (clean.length >= 2) {
      freqMap[clean] = (freqMap[clean] || 0) + 1;
    }
  }

  const sorted = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalWords = words.length;
  return sorted.map(([word, count]) => ({
    word,
    count,
    percentage: `${((count / totalWords) * 100).toFixed(1)}%`,
  }));
}

export function processWordCounter(input: WordCounterProcessInput): WordCounterProcessOutput {
  const raw = input.text ?? "";
  const trimmed = raw.trim();

  if (!trimmed) {
    throw new Error("Text input khali hai. Kripya pehle text likho ya document upload karo.");
  }

  const characters = raw.length;
  const charactersNoSpaces = raw.replace(/\s/g, "").length;

  // Words array
  const wordArray = trimmed.split(/\s+/).filter(Boolean);
  const words = wordArray.length;

  // Sentences (split on punctuation followed by space or line end)
  const sentenceMatches = trimmed.split(/[.!?]+(?:\s+|$)/).filter((s) => s.trim().length > 0);
  const sentences = Math.max(1, sentenceMatches.length);

  // Paragraphs (blocks separated by 1 or more blank lines)
  const paragraphs = raw.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || 1;

  // Lines
  const lines = raw.split(/\r\n|\r|\n/).length;

  // Average word length
  const totalWordCharLength = wordArray.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength = words > 0 ? parseFloat((totalWordCharLength / words).toFixed(1)) : 0;

  // Reading time (200 wpm) & Speaking time (130 wpm)
  const readingTime = formatTimeEstimate(words, 200);
  const speakingTime = formatTimeEstimate(words, 130);

  // Top keywords
  const topKeywords = computeKeywordDensity(wordArray);

  const stats: WordCounterStats = {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTime,
    speakingTime,
    avgWordLength,
    topKeywords,
  };

  const summary = [
    `--- Text Analysis Summary ---`,
    `Words:                  ${stats.words}`,
    `Characters:             ${stats.characters}`,
    `Characters (no spaces): ${stats.charactersNoSpaces}`,
    `Sentences:              ${stats.sentences}`,
    `Paragraphs:             ${stats.paragraphs}`,
    `Lines:                  ${stats.lines}`,
    `Reading Time (200 wpm): ${stats.readingTime}`,
    `Speaking Time (130 wpm):${stats.speakingTime}`,
    `Avg Word Length:        ${stats.avgWordLength} chars`,
    ...(topKeywords.length > 0
      ? [
          `\nTop Keywords:`,
          ...topKeywords.map((k) => `  - ${k.word}: ${k.count} (${k.percentage})`),
        ]
      : []),
  ].join("\n");

  return {
    stats,
    result: summary,
  };
}

export const process = processWordCounter;
