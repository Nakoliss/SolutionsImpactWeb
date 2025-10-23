/*
  Repair mojibake across the tree by trying a Latin‑1 → UTF‑8 reversal
  and only writing when it clearly reduces artifacts.

  Usage:
    npx tsx web/scripts/repair-tree-utf8.ts
*/
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const EXCLUDE = new Set(['node_modules', '.next', '.git']);
const EXT = new Set(['.ts', '.tsx', '.json', '.md', '.mdx', '.css']);

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXT.has(path.extname(full))) yield full;
  }
}

const bad = /(?:Ã.|Â|�)/g;
function countBad(s: string) {
  return (s.match(bad) || []).length;
}

let scanned = 0;
let fixed = 0;
for (const file of walk(ROOT)) {
  scanned++;
  const data = fs.readFileSync(file, 'utf8');
  const before = countBad(data);
  if (!before) continue;
  const repaired = Buffer.from(data, 'latin1').toString('utf8');
  const after = countBad(repaired);
  if (after < before) {
    fs.writeFileSync(file, repaired, 'utf8');
    fixed++;
    console.log(`Fixed ${path.relative(process.cwd(), file)} (${before} → ${after})`);
  }
}
console.log(`Scanned ${scanned} files; fixed ${fixed}.`);

