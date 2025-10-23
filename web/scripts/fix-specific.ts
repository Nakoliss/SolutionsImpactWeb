/*
  Targeted cleanup for a few stubborn mojibake strings in BusinessCarousel.tsx.
  Run: npx tsx web/scripts/fix-specific.ts
*/
import fs from 'fs';
import path from 'path';

const file = path.join(__dirname, '..', 'components', 'BusinessCarousel.tsx');
let s = fs.readFileSync(file, 'utf8');

const pairs: Array<[string, string]> = [
  ["AntiquitA'Acs & Collections", 'Antiquités & Collections'],
  ["TrA'Acsors du passA'Ac", 'Trésors du passé'],
  ['Expertise & AuthenticitÒ© Depuis 1950', '• Expertise & Authenticité Depuis 1950'],
  ["BeautA'Ac & Intelligence Artificielle", 'Beauté & Intelligence Artificielle'],
  ['BeautÒ© & Intelligence Artificielle', 'Beauté & Intelligence Artificielle'],
  ["BeautA'Ac IA", 'Beauté IA'],
  ['BeautÒ© IA', 'Beauté IA'],
  ["Transformez Votre BeautA'Ac", 'Transformez Votre Beauté'],
  ['Transformez Votre BeautÒ©', 'Transformez Votre Beauté'],
  ["Soins personnalisA'Acs grA'A�ce A'A� l&apos;IA", "Soins personnalisés grâce à l'IA"],
  ['Soins personnalisÃ©s grâce Ã  l\'IA', "Soins personnalisés grâce à l'IA"],
];

for (const [from, to] of pairs) {
  if (s.includes(from)) s = s.split(from).join(to);
}

// Normalize a few copyright markers
s = s.replace(/\{m\.footer\.copyright \?\? `[^`]*2025 \$\{m\.footer\.company\}`\}/g, '{m.footer.copyright ?? `© 2025 ${m.footer.company}`}');
// Replace a common bullet mojibake with a middle dot
s = s.replace(/A.{0,3}\u001a.{0,3}A./g, ' • ');

fs.writeFileSync(file, s, 'utf8');
console.log('Applied targeted fixes to BusinessCarousel.tsx');

