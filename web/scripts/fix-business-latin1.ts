/*
 Heuristically repair BusinessCarousel.tsx by re-decoding as UTF-8 from Latin1 bytes when it improves text.
 Usage: npx tsx web/scripts/fix-business-latin1.ts
*/
import fs from 'fs';
import path from 'path';

const target = path.join(__dirname, '..', 'components', 'BusinessCarousel.tsx');

function countMarkers(s: string): number {
  const m = s.match(/(?:A�.|A,|A�|���|�|�)/g);
  return m ? m.length : 0;
}

try {
  const raw = fs.readFileSync(target);
  const asUtf8 = raw.toString('utf8');
  const repaired = Buffer.from(asUtf8, 'latin1').toString('utf8');
  const before = countMarkers(asUtf8);
  const after = countMarkers(repaired);
  if (after < before) {
    fs.writeFileSync(target, repaired, 'utf8');
    console.log(`Rewrote ${path.relative(process.cwd(), target)} (markers ${before} -> ${after}).`);
  } else {
    console.log('No improvement detected; left file unchanged.');
  }
} catch (e) {
  console.error('Failed to process:', e);
  process.exit(1);
}

