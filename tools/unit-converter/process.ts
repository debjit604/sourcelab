export type UnitCategory = "length" | "weight" | "temperature" | "digital" | "area";

export interface UnitDef {
  id: string;
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export const UNIT_CONFIG: Record<UnitCategory, { name: string; units: Record<string, UnitDef> }> = {
  length: {
    name: "Length",
    units: {
      m: { id: "m", name: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
      km: { id: "km", name: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm: { id: "cm", name: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      mm: { id: "mm", name: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      ft: { id: "ft", name: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      in: { id: "in", name: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      yd: { id: "yd", name: "Yard (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      mi: { id: "mi", name: "Mile (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    },
  },
  weight: {
    name: "Weight",
    units: {
      kg: { id: "kg", name: "Kilogram (kg)", toBase: (v) => v, fromBase: (v) => v },
      g: { id: "g", name: "Gram (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mg: { id: "mg", name: "Milligram (mg)", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      lb: { id: "lb", name: "Pound (lb)", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      oz: { id: "oz", name: "Ounce (oz)", toBase: (v) => v * 0.02834952, fromBase: (v) => v / 0.02834952 },
      ton: { id: "ton", name: "Metric Ton (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      C: { id: "C", name: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
      F: { id: "F", name: "Fahrenheit (°F)", toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
      K: { id: "K", name: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    },
  },
  digital: {
    name: "Digital Data",
    units: {
      B: { id: "B", name: "Bytes (B)", toBase: (v) => v, fromBase: (v) => v },
      KB: { id: "KB", name: "Kilobytes (KB)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      MB: { id: "MB", name: "Megabytes (MB)", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      GB: { id: "GB", name: "Gigabytes (GB)", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      TB: { id: "TB", name: "Terabytes (TB)", toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
    },
  },
  area: {
    name: "Area",
    units: {
      sqm: { id: "sqm", name: "Square Meter (m²)", toBase: (v) => v, fromBase: (v) => v },
      sqft: { id: "sqft", name: "Square Foot (sq ft)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      acre: { id: "acre", name: "Acre", toBase: (v) => v * 4046.856, fromBase: (v) => v / 4046.856 },
      hectare: { id: "hectare", name: "Hectare (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      sqkm: { id: "sqkm", name: "Square Kilometer (km²)", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    },
  },
};

export interface ConversionItem {
  unitId: string;
  unitName: string;
  value: number;
  formatted: string;
}

export interface UnitConversionResult {
  convertedValue: number;
  formattedResult: string;
  fromUnitName: string;
  toUnitName: string;
  allConversions: ConversionItem[];
}

export function convertUnits(
  val: number,
  fromId: string,
  toId: string,
  category: UnitCategory
): UnitConversionResult {
  const catConfig = UNIT_CONFIG[category];
  if (!catConfig) throw new Error("Invalid unit category");

  const fromUnit = catConfig.units[fromId];
  const toUnit = catConfig.units[toId];

  if (!fromUnit || !toUnit) throw new Error("Invalid unit selection");

  // Base conversion
  const baseVal = fromUnit.toBase(val);
  const targetVal = toUnit.fromBase(baseVal);

  const rounded = Math.round(targetVal * 100000) / 100000;
  const formatted = rounded.toLocaleString("en-IN", { maximumFractionDigits: 6 });

  // Generate all other units in this category
  const allConversions: ConversionItem[] = Object.values(catConfig.units).map((u) => {
    const v = u.fromBase(baseVal);
    const r = Math.round(v * 100000) / 100000;
    return {
      unitId: u.id,
      unitName: u.name,
      value: r,
      formatted: r.toLocaleString("en-IN", { maximumFractionDigits: 6 }),
    };
  });

  return {
    convertedValue: rounded,
    formattedResult: formatted,
    fromUnitName: fromUnit.name,
    toUnitName: toUnit.name,
    allConversions,
  };
}

export interface ProcessInput {
  value: number;
  fromUnit: string;
  toUnit: string;
  category: UnitCategory;
}

export async function process(input: ProcessInput): Promise<UnitConversionResult> {
  return convertUnits(input.value, input.fromUnit, input.toUnit, input.category);
}
