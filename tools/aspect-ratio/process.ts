export interface RatioResult {
  ratioString: string;
  decimalRatio: number;
  wRatio: number;
  hRatio: number;
}

export function getGcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function calculateRatio(width: number, height: number): RatioResult {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));

  const gcd = getGcd(w, h);
  const wRatio = w / gcd;
  const hRatio = h / gcd;

  return {
    ratioString: `${wRatio}:${hRatio}`,
    decimalRatio: Math.round((w / h) * 1000) / 1000,
    wRatio,
    hRatio,
  };
}

export function scaleDimension(
  origW: number,
  origH: number,
  targetW?: number,
  targetH?: number
): { width: number; height: number } {
  const w = Math.max(1, Math.round(origW));
  const h = Math.max(1, Math.round(origH));
  const ratio = w / h;

  if (targetW !== undefined && targetW > 0) {
    return {
      width: Math.round(targetW),
      height: Math.max(1, Math.round(targetW / ratio)),
    };
  }

  if (targetH !== undefined && targetH > 0) {
    return {
      width: Math.max(1, Math.round(targetH * ratio)),
      height: Math.round(targetH),
    };
  }

  return { width: w, height: h };
}
