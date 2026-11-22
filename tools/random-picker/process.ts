export type PickerMode = "pick" | "shuffle" | "coin" | "dice";

/**
 * Generates an unbiased random integer in range [min, max] using crypto.getRandomValues
 */
export function secureRandomInt(min: number, max: number): number {
  if (min >= max) return min;
  const range = max - min + 1;
  const maxSafe = Math.floor(0xffffffff / range) * range;

  const array = new Uint32Array(1);
  let randomVal = 0;
  do {
    crypto.getRandomValues(array);
    randomVal = array[0];
  } while (randomVal >= maxSafe);

  return min + (randomVal % range);
}

export function pickRandomItems(
  items: string[],
  count: number = 1,
  allowDuplicates: boolean = false
): string[] {
  if (!items.length) return [];
  const safeCount = Math.max(1, count);

  if (allowDuplicates) {
    const selected: string[] = [];
    for (let i = 0; i < safeCount; i++) {
      const idx = secureRandomInt(0, items.length - 1);
      selected.push(items[idx]);
    }
    return selected;
  } else {
    // Without replacement: copy and shuffle
    const pool = [...items];
    const picked: string[] = [];
    const iterations = Math.min(safeCount, pool.length);

    for (let i = 0; i < iterations; i++) {
      const idx = secureRandomInt(0, pool.length - 1);
      picked.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return picked;
  }
}

export function shuffleList(items: string[]): string[] {
  const result = [...items];
  // Modern Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(0, i);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export function flipCoin(): "Heads" | "Tails" {
  return secureRandomInt(0, 1) === 0 ? "Heads" : "Tails";
}

export function rollDice(sides: number = 6, count: number = 1): number[] {
  const rolls: number[] = [];
  const safeCount = Math.max(1, Math.min(count, 10));
  for (let i = 0; i < safeCount; i++) {
    rolls.push(secureRandomInt(1, sides));
  }
  return rolls;
}

export interface ProcessInput {
  mode: PickerMode;
  items?: string[];
  count?: number;
  diceSides?: number;
}

export interface ProcessResult {
  result: string[];
  summary: string;
}

export async function process(input: ProcessInput): Promise<ProcessResult> {
  switch (input.mode) {
    case "pick": {
      const list = input.items || [];
      if (!list.length) throw new Error("List me kam se kam ek item hona chahiye");
      const picked = pickRandomItems(list, input.count || 1);
      return {
        result: picked,
        summary: `Picked ${picked.length} item(s)`,
      };
    }
    case "shuffle": {
      const list = input.items || [];
      if (!list.length) throw new Error("List khali hai");
      const shuffled = shuffleList(list);
      return {
        result: shuffled,
        summary: `Shuffled ${shuffled.length} items`,
      };
    }
    case "coin": {
      const coin = flipCoin();
      return {
        result: [coin],
        summary: `Coin landed on ${coin}`,
      };
    }
    case "dice": {
      const rolls = rollDice(input.diceSides || 6, input.count || 1);
      return {
        result: rolls.map(String),
        summary: `Rolled ${rolls.join(", ")} (Total: ${rolls.reduce((a, b) => a + b, 0)})`,
      };
    }
    default:
      throw new Error("Invalid picker mode");
  }
}
