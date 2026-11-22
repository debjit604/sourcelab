import { describe, it, expect } from "vitest";
import { processQrCode } from "./process";

describe("QR Code Generator Process", () => {
  it("generates valid SVG and PNG DataURL for standard URL", async () => {
    const res = await processQrCode({ text: "https://sourcelab.app" });

    expect(res.svg).toContain("<svg");
    expect(res.svg).toContain("</svg>");
    expect(res.dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(res.stats.textLength).toBe("https://sourcelab.app".length);
    expect(res.stats.errorCorrection).toBe("M");
  });

  it("respects custom error correction levels (H, Q, L)", async () => {
    const resH = await processQrCode({
      text: "upi://pay?pa=sourcelab@upi&pn=SourceLab",
      options: { errorCorrectionLevel: "H" },
    });

    expect(resH.stats.errorCorrection).toBe("H");
    expect(resH.svg).toContain("<svg");
  });

  it("applies custom width and colors to QR code outputs", async () => {
    const res = await processQrCode({
      text: "SourceLab Privacy First",
      options: {
        width: 512,
        darkColor: "#22D3EE",
        lightColor: "#0B0F1A",
      },
    });

    expect(res.stats.width).toBe(512);
    expect(res.svg).toContain("#22D3EE");
    expect(res.svg).toContain("#0B0F1A");
  });

  it("throws friendly error when text exceeds capacity limit", async () => {
    const giantText = "A".repeat(2600);
    await expect(processQrCode({ text: giantText })).rejects.toThrow("Text bahut lamba hai");
  });

  it("throws friendly Hinglish error on empty input", async () => {
    await expect(processQrCode({ text: "" })).rejects.toThrow("QR code banane ke liye");
    await expect(processQrCode({ text: "   " })).rejects.toThrow("QR code banane ke liye");
  });
});
