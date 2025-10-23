/*
  Strip leading replacement characters (�, U+FFFD) and BOM (U+FEFF)
  from a given file. Useful after repairing mojibake where the first
  bytes were corrupted.

  Usage:
    npx tsx web/scripts/strip-leading-repl.ts web/components/BusinessCarousel.tsx
*/
import fs from 'fs';
import path from 'path';

const target = process.argv[2];
if (!target) {
  console.error('Usage: strip-leading-repl <file>');
  process.exit(2);
}

const full = path.resolve(process.cwd(), target);
let s = fs.readFileSync(full, 'utf8');

// Remove any leading BOM or replacement chars
s = s.replace(/^[\uFEFF\uFFFD]+/, '');

// Also normalize the first line to a clean 'use client' directive if present
s = s.replace(/^['"]?use client['"];?/, "'use client';");

fs.writeFileSync(full, s, 'utf8');
console.log('Stripped leading markers in', path.relative(process.cwd(), full));

