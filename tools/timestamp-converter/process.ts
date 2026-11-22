export interface TimestampConversionResult {
  epochSeconds: number;
  epochMilliseconds: number;
  isoString: string;
  utcString: string;
  localString: string;
  relativeTime: string;
  dayOfWeek: string;
  isLeapYear: boolean;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const isFuture = diffSec > 0;
  const absSec = Math.abs(diffSec);

  if (absSec < 10) return "just now";
  if (absSec < 60) return isFuture ? `in ${absSec} seconds` : `${absSec} seconds ago`;

  const absMin = Math.round(absSec / 60);
  if (absMin < 60) return isFuture ? `in ${absMin} minutes` : `${absMin} minutes ago`;

  const absHours = Math.round(absMin / 60);
  if (absHours < 24) return isFuture ? `in ${absHours} hours` : `${absHours} hours ago`;

  const absDays = Math.round(absHours / 24);
  if (absDays < 30) return isFuture ? `in ${absDays} days` : `${absDays} days ago`;

  const absMonths = Math.round(absDays / 30);
  if (absMonths < 12) return isFuture ? `in ${absMonths} months` : `${absMonths} months ago`;

  const absYears = Math.round(absDays / 365);
  return isFuture ? `in ${absYears} years` : `${absYears} years ago`;
}

export function createConversionResult(date: Date, now: Date = new Date()): TimestampConversionResult {
  const ms = date.getTime();
  const sec = Math.floor(ms / 1000);
  const year = date.getUTCFullYear();

  return {
    epochSeconds: sec,
    epochMilliseconds: ms,
    isoString: date.toISOString(),
    utcString: date.toUTCString(),
    localString: date.toString(),
    relativeTime: getRelativeTime(date, now),
    dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
    isLeapYear: isLeapYear(year),
  };
}

export function parseTimestamp(
  rawInput: string | number,
  unit: "sec" | "ms" | "auto" = "auto",
  now: Date = new Date()
): TimestampConversionResult | null {
  const str = String(rawInput).trim();
  if (!str) return null;

  const num = Number(str);
  if (isNaN(num) || !isFinite(num)) return null;

  let ms: number;
  if (unit === "sec") {
    ms = Math.round(num * 1000);
  } else if (unit === "ms") {
    ms = Math.round(num);
  } else {
    // Auto-detect: if > 100 billion (approx year 1973 in ms or 5138 in seconds)
    // Most current Unix timestamps in seconds are ~1.7e9 (10 digits)
    // In milliseconds they are ~1.7e12 (13 digits)
    if (Math.abs(num) >= 1e11) {
      ms = Math.round(num);
    } else {
      ms = Math.round(num * 1000);
    }
  }

  const date = new Date(ms);
  if (isNaN(date.getTime())) return null;

  return createConversionResult(date, now);
}

export function parseDateString(
  dateStr: string,
  now: Date = new Date()
): TimestampConversionResult | null {
  const str = dateStr.trim();
  if (!str) return null;

  const date = new Date(str);
  if (isNaN(date.getTime())) return null;

  return createConversionResult(date, now);
}

export function generateTimestampSummary(res: TimestampConversionResult): string {
  return [
    `Unix Epoch (Seconds): ${res.epochSeconds}`,
    `Unix Epoch (Milliseconds): ${res.epochMilliseconds}`,
    `ISO 8601: ${res.isoString}`,
    `UTC: ${res.utcString}`,
    `Local Time: ${res.localString}`,
    `Relative Time: ${res.relativeTime}`,
    `Day: ${res.dayOfWeek}`,
    `Leap Year: ${res.isLeapYear ? "Yes" : "No"}`,
  ].join("\n");
}
