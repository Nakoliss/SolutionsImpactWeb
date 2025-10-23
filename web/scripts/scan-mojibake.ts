/*
  Scan translation and content assets for mojibake so we can fail CI early.
  Usage: npx tsx web/scripts/scan-mojibake.ts
*/
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const TARGET_DIRS = ['messages', 'content'];
const EXT = new Set(['.json', '.md', '.mdx']);
const BAD = /(?:�.|�|�)/; // common markers: "é", stray "�", replacement char

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXT.has(path.extname(full))) yield full;
  }
}

let count = 0;
for (const base of TARGET_DIRS) {
  const start = path.join(ROOT, base);
  if (!fs.existsSync(start)) continue;
  for (const file of walk(start)) {
    const data = fs.readFileSync(file, 'utf8');
    if (BAD.test(data)) {
      count++;
      console.log('Mojibake found:', path.relative(process.cwd(), file));
    }
  }
}

if (count) {
  console.log(`Found ${count} files with mojibake.`);
  process.exitCode = 1;
} else {
  console.log('No mojibake detected.');
}

