/*
  One-shot repair for mojibake in a specific file by re-decoding the content
  as UTF‑8 from Latin‑1 bytes when it clearly improves the text.

  Usage:
    npx tsx web/scripts/repair-utf8.ts web/components/BusinessCarousel.tsx
*/
import fs from 'fs';
import path from 'path';

function countMarkers(s: string): number {
  const m = s.match(/(?:Ã.|Â|�)/g);
  return m ? m.length : 0;
}

function repairContent(s: string): string {
  try {
    return Buffer.from(s, 'latin1').toString('utf8').normalize('NFC');
  } catch {
    return s;
  }
}

const target = process.argv[2];
if (!target) {
  console.error('Provide a path to the file to repair.');
  process.exit(2);
}

const full = path.resolve(process.cwd(), target);
const raw = fs.readFileSync(full, 'utf8');
const before = countMarkers(raw);
const repaired = repairContent(raw);
const after = countMarkers(repaired);

if (after < before) {
  fs.writeFileSync(full, repaired, 'utf8');
  console.log(`Repaired ${path.relative(process.cwd(), full)} (markers ${before} → ${after}).`);
} else {
  console.log('No improvement detected; left file unchanged.');
}

