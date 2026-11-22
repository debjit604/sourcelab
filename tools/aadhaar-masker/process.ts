/**
 * Normalizes and masks a 12-digit Aadhaar number to standard XXXX XXXX 1234 format
 */
export function maskAadhaarString(input: string): string {
  if (!input) return "";

  // Replace any 12-digit sequence with or without spaces/hyphens
  const cleaned = input.replace(/\s|-/g, "");
  if (/^\d{12}$/.test(cleaned)) {
    return `XXXX XXXX ${cleaned.slice(8)}`;
  }

  // Replace within free-form text
  return input.replace(/\b(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})\b/g, "XXXX XXXX $3");
}

export function isValidAadhaarNumber(input: string): boolean {
  const digits = input.replace(/\s|-/g, "");
  if (!/^\d{12}$/.test(digits)) return false;
  // Aadhaar numbers do not start with 0 or 1
  if (digits.startsWith("0") || digits.startsWith("1")) return false;
  return true;
}

export interface MaskCoordinates {
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  width: number; // percentage (0 - 100)
  height: number; // percentage (0 - 100)
}

export function getDefaultAadhaarMask(): MaskCoordinates {
  // Standard position for front Aadhaar card number strip
  return {
    x: 25,
    y: 78,
    width: 32,
    height: 7,
  };
}
