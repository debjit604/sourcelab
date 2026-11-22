export type LoremUnit = "paragraphs" | "sentences" | "words";

export interface LoremOptions {
  count: number;
  unit: LoremUnit;
  startWithLorem?: boolean;
  asHtml?: boolean;
}

export interface LoremResult {
  output: string;
  wordCount: number;
  charCount: number;
  paragraphCount: number;
}

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "curabitur", "pretium",
  "tincidunt", "lacus", "nulla", "gravida", "orci", "a", "odio", "nullam", "varius",
  "turpis", "et", "commodo", "pharetra", "est", "eros", "bibendum", "elit", "nec",
  "luctus", "magna", "felis", "sollicitudin", "mauris", "integer", "in", "mauris",
  "eu", "nibh", "euismod", "gravida", "duis", "ac", "tellus", "et", "risus", "vulputate",
  "vehicula", "donec", "lobortis", "risus", "a", "elit", "etiam", "tempor", "ut",
  "ullamcorper", "pellentesque", "aenean", "lectus", "pellentesque", "eget", "faucibus",
  "vel", "aliquet", "nec", "ante", "fusce", "neque", "massa", "quisque", "cursus",
  "sagittis", "augue", "morbi", "semper", "mattis", "dui", "cras", "vulputate",
];

const STANDARD_INTRO = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

export function generateSentence(minWords = 8, maxWords = 14): string {
  const count = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord());
  }
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

export function generateParagraph(minSentences = 4, maxSentences = 6): string {
  const count = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

export function generateLorem(options: Partial<LoremOptions> = {}): LoremResult {
  const count = Math.max(1, Math.min(100, options.count || 3));
  const unit = options.unit || "paragraphs";
  const startWithLorem = options.startWithLorem ?? true;
  const asHtml = options.asHtml ?? false;

  let output = "";

  if (unit === "words") {
    const words: string[] = [];
    if (startWithLorem) {
      const introWords = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"];
      for (let i = 0; i < Math.min(count, introWords.length); i++) {
        words.push(introWords[i]);
      }
    }
    while (words.length < count) {
      words.push(getRandomWord());
    }
    output = words.join(" ");
    if (asHtml) output = `<p>${output}</p>`;
  } else if (unit === "sentences") {
    const sentences: string[] = [];
    if (startWithLorem && count > 0) {
      sentences.push(STANDARD_INTRO);
    }
    while (sentences.length < count) {
      sentences.push(generateSentence());
    }
    output = asHtml
      ? sentences.map((s) => `<p>${s}</p>`).join("\n")
      : sentences.join(" ");
  } else {
    // Paragraphs
    const paras: string[] = [];
    if (startWithLorem && count > 0) {
      const firstPara = STANDARD_INTRO + " " + generateParagraph(3, 4);
      paras.push(firstPara);
    }
    while (paras.length < count) {
      paras.push(generateParagraph());
    }
    output = asHtml
      ? paras.map((p) => `<p>${p}</p>`).join("\n\n")
      : paras.join("\n\n");
  }

  const rawWords = output.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean);
  const rawParas = unit === "paragraphs" ? count : 1;

  return {
    output,
    wordCount: rawWords.length,
    charCount: output.length,
    paragraphCount: rawParas,
  };
}
