import { describe, it, expect } from "vitest";
import {
  textToMorse,
  morseToText,
  getAudioSchedule,
  process,
} from "./process";

describe("Morse Code Process", () => {
  it("encodes standard text to international Morse code", () => {
    expect(textToMorse("SOS")).toBe("... --- ...");
    expect(textToMorse("HELLO WORLD")).toBe(
      ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
    );
    expect(textToMorse("2026.")).toBe("..--- ----- ..--- -.... .-.-.-");
  });

  it("decodes Morse code back to uppercase text", () => {
    expect(morseToText("... --- ...")).toBe("SOS");
    expect(
      morseToText(".... . .-.. .-.. --- / .-- --- .-. .-.. -..")
    ).toBe("HELLO WORLD");
    expect(morseToText("..--- ----- ..--- -.... .-.-.-")).toBe("2026.");
  });

  it("generates correct audio timing schedule for Web Audio synthesis", () => {
    // SOS is 3 dots, 3 dashes, 3 dots = 9 tones
    const schedule = getAudioSchedule("... --- ...", 20);
    expect(schedule.tones.length).toBe(9);
    expect(schedule.totalDuration).toBeGreaterThan(0);
    // At 20 WPM, dotTime = 1.2 / 20 = 0.06s
    expect(schedule.tones[0].duration).toBeCloseTo(0.06, 3);
    // Dash duration = 3 * 0.06 = 0.18s
    expect(schedule.tones[3].duration).toBeCloseTo(0.18, 3);
  });

  it("handles round-trip encoding and decoding seamlessly", () => {
    const input = "SOURCELAB PRIVACY FIRST";
    const morse = textToMorse(input);
    const decoded = morseToText(morse);
    expect(decoded).toBe(input);
  });

  it("process function handles encode, decode, and throws on empty input", async () => {
    const encodeRes = await process({ text: "SOURCELAB", mode: "encode" });
    expect(encodeRes.morse).toBe(
      "... --- ..- .-. -.-. . .-.. .- -..."
    );

    const decodeRes = await process({
      text: "... --- ...",
      mode: "decode",
    });
    expect(decodeRes.result).toBe("SOS");

    await expect(process({ text: "", mode: "encode" })).rejects.toThrow(
      "Input text khali hai"
    );
  });
});
