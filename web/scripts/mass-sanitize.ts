/*
  Mass-sanitize BusinessCarousel.tsx by applying broad, safe replacements
  for common broken sequences. Use with care; this only touches that file.

  Run: npx tsx web/scripts/mass-sanitize.ts
*/
import fs from 'fs';
import path from 'path';

const file = path.join(__dirname, '..', 'components', 'BusinessCarousel.tsx');
let s = fs.readFileSync(file, 'utf8');

// 1) Fix frequent mojibake for é
s = s.split('Ò©').join('é');

// 2) Remove garbled emoji byte-leaks starting with 'ðŸ'
s = s.replace(/ðŸ[^\s<]*/g, '');

// 3) Convert some known markers to bullets or symbols
s = s.replace(/â�\u001a�¢/g, '•');
s = s.replace(/â�\u001a�⬝/g, '•');
s = s.replace(/â�\u001c�S/g, '•');
s = s.replace(/â�\u001c�\u001d/g, '•');
s = s.replace(/â�\u001c¨/g, '✧');
s = s.replace(/â�\u001c⬰ï¸/g, '✉️');
s = s.replace(/â�\u001c�aï¸/g, '⚑');

fs.writeFileSync(file, s, 'utf8');
console.log('Mass-sanitized BusinessCarousel.tsx');
