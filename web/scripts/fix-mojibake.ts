/*
 Heuristically fix mojibake (UTF-8 text mis-decoded as Latin-1/Windows-1252)
 across project text files. Safe-by-default: only rewrites when the fix
 reduces mojibake markers and doesn't increase replacement chars.

 Usage: npx tsx web/scripts/fix-mojibake.ts
*/
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.mdx', '.json', '.css']);
const EXCLUDE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build']);

// Common mojibake indicators found in FR content
const MOJIBAKE_MARKERS = /(?:Ã.|Â|ð|�)/g; // e.g., "Ã©", stray "Â", emoji gibberish, replacement char

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      const ext = path.extname(full);
      if (EXTENSIONS.has(ext)) yield full;
    }
  }
}

function countMarkers(s: string): number {
  const m = s.match(MOJIBAKE_MARKERS);
  return m ? m.length : 0;
}

function tryFixMojibake(content: string): string | null {
  const before = countMarkers(content);
  if (before === 0) return null; // nothing suspicious

  // Reverse the common failure: bytes of UTF-8 were decoded as latin1.
  // Convert current string's code points (0..255) back to bytes, then decode as UTF-8.
  const restored = Buffer.from(content, 'latin1').toString('utf8');

  const after = countMarkers(restored);
  const replBefore = (content.match(/�/g) || []).length;
  const replAfter = (restored.match(/�/g) || []).length;

  // Accept only when the fix meaningfully reduces markers and does not increase replacement chars.
  if (after < before && replAfter <= replBefore) {
    return restored;
  }
  return null;
}

let scanned = 0;
let changed = 0;
const modified: string[] = [];

for (const file of walk(ROOT)) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    scanned++;
    const fixed = tryFixMojibake(raw);
    if (fixed != null && fixed !== raw) {
      fs.writeFileSync(file, fixed, 'utf8');
      changed++;
      modified.push(path.relative(process.cwd(), file));
    }
  } catch (err) {
    // Ignore unreadable files
  }
}

console.log(`Scanned ${scanned} files; fixed ${changed}.`);
if (modified.length) {
  console.log('Modified:');
  for (const f of modified) console.log(' -', f);
}

