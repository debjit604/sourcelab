import { describe, it, expect } from "vitest";
import { convertToStyles, process } from "./process";

describe("Fancy Fonts Process", () => {
  it("converts text to bold serif and bold sans styles", () => {
    const styles = convertToStyles("ABC");
    const boldSerif = styles.find((s) => s.id === "bold-serif");
    expect(boldSerif?.text).toBe("𝐀𝐁𝐂");

    const boldSans = styles.find((s) => s.id === "bold-sans");
    expect(boldSans?.text).toBe("𝗔𝗕𝗖");
  });

  it("converts text to monospace Unicode characters", () => {
    const styles = convertToStyles("hi 123");
    const mono = styles.find((s) => s.id === "monospace");
    expect(mono?.text).toBe("𝚑𝚒 𝟷𝟸𝟹");
  });

  it("converts text to circled bubble characters", () => {
    const styles = convertToStyles("Cat");
    const bubble = styles.find((s) => s.id === "bubble");
    expect(bubble?.text).toBe("Ⓒⓐⓣ");
  });

  it("converts text to small caps", () => {
    const styles = convertToStyles("Privacy");
    const smallCaps = styles.find((s) => s.id === "small-caps");
    expect(smallCaps?.text).toBe("ᴘʀɪᴠᴀᴄʏ");
  });

  it("process function returns all converted styles and throws on empty input", async () => {
    const res = await process({ text: "SourceLab" });
    expect(res.styles.length).toBeGreaterThanOrEqual(10);
    expect(res.result).toBe("𝐒𝐨𝐮𝐫𝐜𝐞𝐋𝐚𝐛");

    await expect(process({ text: "" })).rejects.toThrow("Input text khali hai");
  });
});
