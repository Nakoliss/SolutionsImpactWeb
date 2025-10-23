// Helpers to repair common UTF-8/Latin-1 mojibake in strings.
// Use sparingly. The real fix is to keep all repository text UTF-8
// and store UI copy in `messages/` rather than inline literals.

function hasMojibake(s: string): boolean {
  // Detect frequent artifacts in broken FR text.
  // Examples: "MontrAcal" (Montréal), "QuAcbec" (Québec), "grA�ce" (grâce),
  // stray sequences like "A?", replacement char "�", and Latin-1 bytes like "Ã", "Â".
  return /(?:A�|A\?|A,|MontrA|QuAc|SantA|grA|\bAc\b|Ã.|Â.|Ò|Ô|�)/.test(s);
}

export function unmojibakeString(s: string): string {
  if (!hasMojibake(s)) return s;
  try {
    // Re-interpret current code points as Latin-1 bytes and decode as UTF-8.
    const decoded = Buffer.from(s, 'latin1').toString('utf8').normalize('NFC');
    return decoded;
  } catch {
    return s;
  }
}

export function unmojibakeDeep<T>(input: T): T {
  if (typeof input === 'string') return unmojibakeString(input) as unknown as T;
  if (Array.isArray(input)) return input.map(unmojibakeDeep) as unknown as T;
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) out[k] = unmojibakeDeep(v);
    return out as unknown as T;
  }
  return input;
}

