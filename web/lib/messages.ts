import { unmojibakeDeep } from './unmojibake';

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function hasMojibake(s: string): boolean {
  return /(?:Ã.|Â|�)/.test(s);
}

// Merge primary and fallback message trees while repairing any mojibake.
// If a string in the primary still looks broken, prefer the fallback.
export function repairLocalizedMessages(primary: Json, fallback: Json): Json {
  const a = unmojibakeDeep(primary);
  const b = unmojibakeDeep(fallback);

  function merge(x: Json, y?: Json): Json {
    if (y === undefined) return x;
    if (typeof x === 'string') return hasMojibake(x) && typeof y === 'string' ? y : x;
    if (Array.isArray(x)) return x.map((v, i) => merge(v, Array.isArray(y) ? y[i] : undefined));
    if (x && typeof x === 'object' && !Array.isArray(x)) {
      const out: Record<string, Json> = {};
      const xRecord = x as Record<string, Json>;
      const yRecord = y && typeof y === 'object' && !Array.isArray(y)
        ? (y as Record<string, Json>)
        : ({} as Record<string, Json>);
      const keys = new Set([...Object.keys(xRecord), ...Object.keys(yRecord)]);
      for (const key of keys) {
        let primaryValue: Json;
        if (Object.prototype.hasOwnProperty.call(xRecord, key)) {
          primaryValue = xRecord[key] as Json;
        } else if (Object.prototype.hasOwnProperty.call(yRecord, key)) {
          primaryValue = yRecord[key] as Json;
        } else {
          continue;
        }
        const fallbackValue = Object.prototype.hasOwnProperty.call(yRecord, key) ? yRecord[key] : undefined;
        out[key] = merge(primaryValue, fallbackValue);
      }
      return out;
    }
    return x;
  }

  return merge(a, b);
}

