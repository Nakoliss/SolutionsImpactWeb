/*
 Sweep BusinessCarousel.tsx for known mojibake literals and fix them.
 Usage: npx tsx web/scripts/sweep-mojibake-business.ts
*/
import fs from 'fs';
import path from 'path';

const target = path.join(__dirname, '..', 'components', 'BusinessCarousel.tsx');

const replacements: Array<[RegExp, string]> = [
  [/\<span aria-hidden\>[^<]*\<\/span\>/g, '<span aria-hidden>•</span>'],
  [/Clinique M[^'\n]*cdicale/g, 'Clinique Médicale'],
  [/dA.?.?veloppement/g, 'développement'],
  [/A.?Ac 2025/g, '© 2025'],
  [/A.{0,2},.{0,2}A./g, ' — '],
  [/PrA..A.cdent/g, 'Précédent'],
  [/MontrA.*cal/g, 'Montréal'],
  [/QuA.*bec/g, 'Québec'],
  [/confidentialitA.*c/g, 'confidentialité'],
];

try {
  let data = fs.readFileSync(target, 'utf8');
  const before = data;
  for (const [re, to] of replacements) {
    data = data.replace(re, to);
  }
  if (data !== before) {
    fs.writeFileSync(target, data, 'utf8');
    console.log('Updated BusinessCarousel.tsx with mojibake fixes.');
  } else {
    console.log('No changes made to BusinessCarousel.tsx.');
  }
} catch (e) {
  console.error('Failed to process BusinessCarousel.tsx:', e);
  process.exit(1);
}
