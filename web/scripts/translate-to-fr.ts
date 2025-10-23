/*
 Translate a JSON messages/content file from EN to FR using LibreTranslate.
 Usage: npx tsx web/scripts/translate-to-fr.ts messages/en.json messages/fr.auto.json
*/
import fs from 'fs';
import path from 'path';

const endpoint = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function* entriesDeep(obj: Json, prefix: string[] = []): Generator<[string[], string]> {
  if (typeof obj === 'string') {
    yield [prefix, obj];
    return;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) yield* entriesDeep(obj[i], prefix.concat(String(i)));
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) yield* entriesDeep(v, prefix.concat(k));
  }
}

function setDeep(obj: any, pathArr: string[], value: string) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) cur = cur[pathArr[i]];
  cur[pathArr[pathArr.length - 1]] = value;
}

function shouldTranslate(keyPath: string[], value: string): boolean {
  if (!value.trim()) return false;
  // Skip URLs, emails, pure numbers/currency
  if (/^https?:\/\//i.test(value)) return false;
  if (/^[\d\s$€£.,:+\-/%]+$/.test(value)) return false;
  // Avoid translating short UI tokens like FR/EN
  if (/^[A-Z]{2,3}$/.test(value)) return false;
  return true;
}

function protectPlaceholders(s: string): { text: string; map: Record<string, string> } {
  const map: Record<string, string> = {};
  let text = s;
  // Protect ICU placeholders {name}, {count}
  text = text.replace(/\{[^}]+\}/g, (m) => {
    const token = `__PH_${Object.keys(map).length}__`;
    map[token] = m;
    return token;
  });
  return { text, map };
}

function restorePlaceholders(s: string, map: Record<string, string>): string {
  let out = s;
  for (const [token, original] of Object.entries(map)) out = out.split(token).join(original);
  return out;
}

async function translate(text: string): Promise<string> {
  const { text: safe, map } = protectPlaceholders(text);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: safe, source: 'en', target: 'fr', format: 'text' })
  });
  if (!res.ok) throw new Error(`Translate HTTP ${res.status}`);
  const data: any = await res.json();
  const translated = data.translatedText || data[0]?.translatedText || data.result || '';
  return restorePlaceholders(translated, map);
}

async function main() {
  const [srcPath, dstPath] = process.argv.slice(2);
  if (!srcPath || !dstPath) {
    console.error('Usage: tsx scripts/translate-to-fr.ts <source.json> <dest.json>');
    process.exit(1);
  }
  const srcFull = path.resolve(process.cwd(), srcPath);
  const dstFull = path.resolve(process.cwd(), dstPath);
  const raw = fs.readFileSync(srcFull, 'utf8');
  const json: Json = JSON.parse(raw);

  const pairs: [string[], string][] = [];
  for (const [k, v] of entriesDeep(json)) if (shouldTranslate(k, v)) pairs.push([k, v]);

  const out = JSON.parse(raw);
  const cache = new Map<string, string>();

  for (const [k, v] of pairs) {
    try {
      if (!cache.has(v)) cache.set(v, await translate(v));
      setDeep(out, k, cache.get(v)!);
    } catch (err) {
      // Leave original English if translation fails
      // console.error('Failed to translate', k.join('.'), err);
    }
    // polite delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 100));
  }

  fs.writeFileSync(dstFull, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`Wrote: ${path.relative(process.cwd(), dstFull)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
