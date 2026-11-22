export interface FontStyleItem {
  id: string;
  name: string;
  sample: string;
  text: string;
}

const SMALL_CAPS_MAP: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", i: "ɪ",
  j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ",
  s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
  A: "ᴀ", B: "ʙ", C: "ᴄ", D: "ᴅ", E: "ᴇ", F: "ғ", G: "ɢ", H: "ʜ", I: "ɪ",
  J: "ᴊ", K: "ᴋ", L: "ʟ", M: "ᴍ", N: "ɴ", O: "ᴏ", P: "ᴘ", Q: "ǫ", R: "ʀ",
  S: "s", T: "ᴛ", U: "ᴜ", V: "ᴠ", W: "ᴡ", X: "x", Y: "ʏ", Z: "ᴢ",
};

const INVERT_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ı",
  j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
  s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "𐐒", C: "Ɔ", D: "◖", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I",
  J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ",
  S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9",
  "7": "ㄥ", "8": "8", "9": "6", "?": "¿", "!": "¡", ".": "˙", ",": "'",
  "'": ",", "_": "‾",
};

function mapAlphabet(
  text: string,
  upperBase: number,
  lowerBase: number,
  digitBase?: number,
  exceptions: Record<string, number> = {}
): string {
  return text
    .split("")
    .map((char) => {
      if (exceptions[char]) {
        return String.fromCodePoint(exceptions[char]);
      }
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // Uppercase A-Z
        return String.fromCodePoint(upperBase + (code - 65));
      }
      if (code >= 97 && code <= 122) {
        // Lowercase a-z
        return String.fromCodePoint(lowerBase + (code - 97));
      }
      if (digitBase && code >= 48 && code <= 57) {
        // Digits 0-9
        return String.fromCodePoint(digitBase + (code - 48));
      }
      return char;
    })
    .join("");
}

export function convertToStyles(text: string): FontStyleItem[] {
  const safeText = text || "SourceLab";

  return [
    {
      id: "bold-serif",
      name: "Bold Serif",
      sample: "𝐁𝐨𝐥𝐝",
      text: mapAlphabet(safeText, 0x1D400, 0x1D41A, 0x1D7CE),
    },
    {
      id: "bold-sans",
      name: "Bold Sans",
      sample: "𝗕𝗼𝗹𝗱 𝗦𝗮𝗻𝘀",
      text: mapAlphabet(safeText, 0x1D5D4, 0x1D5EE, 0x1D7EC),
    },
    {
      id: "italic-sans",
      name: "Italic Sans",
      sample: "𝘐𝘵𝘢𝘭𝘪𝘤",
      text: mapAlphabet(safeText, 0x1D608, 0x1D622),
    },
    {
      id: "bold-italic",
      name: "Bold Italic",
      sample: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄",
      text: mapAlphabet(safeText, 0x1D468, 0x1D482),
    },
    {
      id: "monospace",
      name: "Monospace",
      sample: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎",
      text: mapAlphabet(safeText, 0x1D670, 0x1D68A, 0x1D7F6),
    },
    {
      id: "double-struck",
      name: "Double-Struck / Blackboard",
      sample: "𝔻𝕠𝕦𝕓𝕝𝕖",
      text: mapAlphabet(safeText, 0x1D538, 0x1D552, 0x1D7D8),
    },
    {
      id: "gothic",
      name: "Fraktur / Gothic",
      sample: "𝔊𝔬𝔱𝔥𝔦𝔠",
      text: mapAlphabet(safeText, 0x1D504, 0x1D51E),
    },
    {
      id: "bold-gothic",
      name: "Bold Gothic",
      sample: "𝕲𝖔𝖙𝖍𝖎𝖈",
      text: mapAlphabet(safeText, 0x1D56C, 0x1D586),
    },
    {
      id: "bubble",
      name: "Bubble / Circled",
      sample: "Ⓑⓤⓑⓑⓛⓔ",
      text: mapAlphabet(safeText, 0x24B6, 0x24D0),
    },
    {
      id: "small-caps",
      name: "Small Caps",
      sample: "Sᴍᴀʟʟ Cᴀᴘs",
      text: safeText
        .split("")
        .map((c) => SMALL_CAPS_MAP[c] || c)
        .join(""),
    },
    {
      id: "inverted",
      name: "Inverted / Upside Down",
      sample: "uʍop ǝpısd∩",
      text: safeText
        .split("")
        .reverse()
        .map((c) => INVERT_MAP[c] || c)
        .join(""),
    },
  ];
}

export interface ProcessInput {
  text: string;
}

export interface ProcessResult {
  result: string;
  styles: FontStyleItem[];
}

export async function process(input: ProcessInput): Promise<ProcessResult> {
  const raw = input.text.trim();
  if (!raw) {
    throw new Error("Input text khali hai");
  }

  const styles = convertToStyles(raw);
  return {
    result: styles[0].text,
    styles,
  };
}
