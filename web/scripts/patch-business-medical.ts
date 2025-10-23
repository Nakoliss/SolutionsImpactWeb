/*
  Targeted cleanup for the medical section inside BusinessCarousel.tsx.
  It normalizes a few known-bad strings to their correct French forms.

  Usage:
    npx tsx web/scripts/patch-business-medical.ts
*/
import fs from 'fs';
import path from 'path';

const file = path.join(__dirname, '..', 'components', 'BusinessCarousel.tsx');
let src = fs.readFileSync(file, 'utf8');

// 1) Fix the businessTypes label
src = src.replace(/name:\s*'Clinique[^']*',/m, "name: 'Clinique Médicale',");

// 2) Fix header + subtitle near the navbar
src = src.replace(/(<h1 className=\"text-xl font-bold text-gray-900\">)[^<]*(<\/h1>)/m, `$1Clinique Médicale$2`);
src = src.replace(/(<p className=\"text-sm text-blue-600\">)[^<]*(<\/p>)/m, `$1Services de santé professionnels$2`);

// 3) Fix the promo pill text line in the hero
src = src.replace(/(font-medium mb-6\">)[^<]*?(<\/div>)/m, `$1• Excellence médicale avec l'IA$2`);

// 4) Fix the small card on the right side (first occurrence in medical section)
src = src.replace(/(<h3 className=\"text-2xl font-bold text-gray-900 mb-4\">)[^<]*(<\/h3>)/m, `$1Soins Avancés$2`);
src = src.replace(/(<div className=\"bg-blue-100 rounded-2xl p-8 text-center\">[\s\S]*?<p className=\"text-gray-600\">)[^<]*(<\/p>)/m, `$1Technologie médicale de pointe pour votre santé$2`);

// 5) Sweep for a few stubborn mojibake variants seen in the file
const replacements: Array<[RegExp, string]> = [
  [/Clinique MA'?cdicale/g, 'Clinique Médicale'],
  [/Clinique MÒ©dicale/g, 'Clinique Médicale'],
  [/Services de santAc professionnels/g, 'Services de santé professionnels'],
  [/santA'Ac/g, 'santé'],
  [/santAc/g, 'santé'],
  [/mA'?cdicale/g, 'médicale'],
  [/mÒ©dicale/g, 'médicale'],
  [/Soins AvancA'?A?cs/g, 'Soins Avancés'],
  [/AvancÒ©s/g, 'Avancés'],
  [/Technologie mA'?cdicale de pointe pour votre santA'?c/g, 'Technologie médicale de pointe pour votre santé'],
  [/Technologie mÒ©dicale de pointe pour votre santÒ©/g, 'Technologie médicale de pointe pour votre santé'],
  [/Excellence mA'?cdicale avec l&apos;IA/g, "• Excellence médicale avec l'IA"],
  [/Excellence mÒ©dicale avec l&apos;IA/g, "• Excellence médicale avec l'IA"],
];
for (const [re, to] of replacements) src = src.replace(re, to);

// 6) Line-level fallback replacements (robust to hidden control bytes)
const lines = src.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  if (L.includes('text-xl font-bold text-gray-900') && L.includes('Clinique')) {
    lines[i] = '                    <h1 className="text-xl font-bold text-gray-900">Clinique Médicale</h1>';
  }
  if (L.includes('text-sm text-blue-600') && (L.includes('Services de') || L.toLowerCase().includes('service'))) {
    lines[i] = '                    <p className="text-sm text-blue-600">Services de santé professionnels</p>';
  }
  if (L.includes('font-medium mb-6') && L.includes('Excellence')) {
    lines[i] = '                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">• Excellence médicale avec l\'IA</div>';
  }
  if (L.includes('text-2xl font-bold text-gray-900 mb-4') && L.includes('Soins')) {
    lines[i] = '                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Soins Avancés</h3>';
  }
  if (L.includes('text-gray-600') && L.includes('Technologie') && (L.includes('pointe') || L.includes('sant'))) {
    lines[i] = '                  <p className="text-gray-600">Technologie médicale de pointe pour votre santé</p>';
  }
}
src = lines.join('\n');

fs.writeFileSync(file, src, 'utf8');
console.log('Patched medical copy in BusinessCarousel.tsx');
