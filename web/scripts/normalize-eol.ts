/* Normalize EOL of a file to LF to make patches stable. */
import fs from 'fs';
import path from 'path';

const file = process.argv[2];
if (!file) {
  console.error('Usage: tsx scripts/normalize-eol.ts <path>');
  process.exit(1);
}
const p = path.resolve(process.cwd(), file);
const raw = fs.readFileSync(p, 'utf8');
const lf = raw.replace(/\r\n/g, '\n');
if (lf !== raw) {
  fs.writeFileSync(p, lf, 'utf8');
  console.log('Normalized EOL to LF for', file);
} else {
  console.log('EOL already LF for', file);
}

