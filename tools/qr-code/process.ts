import QRCode from "qrcode";

export type QrErrorCorrection = "L" | "M" | "Q" | "H";

export interface QrOptions {
  errorCorrectionLevel?: QrErrorCorrection;
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

export interface QrProcessInput {
  text: string;
  options?: QrOptions;
}

export interface QrProcessOutput {
  svg: string;
  dataUrl: string;
  stats: {
    textLength: number;
    errorCorrection: QrErrorCorrection;
    width: number;
  };
  result: string;
}

export async function generateQrSvg(text: string, options: QrOptions = {}): Promise<string> {
  const ec = options.errorCorrectionLevel || "M";
  const margin = options.margin ?? 3;
  const dark = options.darkColor || "#000000";
  const light = options.lightColor || "#ffffff";

  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: ec,
    margin,
    color: {
      dark,
      light,
    },
  });
}

export async function generateQrDataUrl(text: string, options: QrOptions = {}): Promise<string> {
  const ec = options.errorCorrectionLevel || "M";
  const width = options.width ?? 320;
  const margin = options.margin ?? 3;
  const dark = options.darkColor || "#000000";
  const light = options.lightColor || "#ffffff";

  return QRCode.toDataURL(text, {
    width,
    margin,
    errorCorrectionLevel: ec,
    color: {
      dark,
      light,
    },
  });
}

export async function processQrCode(input: QrProcessInput): Promise<QrProcessOutput> {
  const raw = (input.text ?? "").trim();

  if (!raw) {
    throw new Error("QR code banane ke liye text ya link enter karo.");
  }

  if (raw.length > 2500) {
    throw new Error(
      `Text bahut lamba hai (${raw.length} characters). QR code standard limit ke liye text 2500 characters se chhota hona chahiye.`
    );
  }

  const opts = input.options || {};
  const ec = opts.errorCorrectionLevel || "M";
  const width = opts.width ?? 320;

  const [svg, dataUrl] = await Promise.all([
    generateQrSvg(raw, opts),
    generateQrDataUrl(raw, opts),
  ]);

  return {
    svg,
    dataUrl,
    stats: {
      textLength: raw.length,
      errorCorrection: ec,
      width,
    },
    result: svg,
  };
}

export const process = processQrCode;
