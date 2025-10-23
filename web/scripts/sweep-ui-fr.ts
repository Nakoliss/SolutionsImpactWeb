/*
  Curated sweep to fix visible mojibake in BusinessCarousel.tsx for
  Antique and Beauty designs. This does literal replacements aimed at
  the exact broken sequences currently in the file.

  Usage: npx tsx web/scripts/sweep-ui-fr.ts
*/
import fs from 'fs';
import path from 'path';

const file = path.join(__dirname, '..', 'components', 'BusinessCarousel.tsx');
let src = fs.readFileSync(file, 'utf8');

type Pair = [RegExp, string];
const R: Pair[] = [
  // Beauty name in the menu
  [/name:\s*'Salon de BeautA'Ac',/g, "name: 'Salon de Beauté',"],

  // Antique sidebar titles
  [/AntiquitA'Acs & Collections/g, 'Antiquités & Collections'],
  [/TrA'Acsors du passA'Ac/g, 'Trésors du passé'],

  // Antique hero pill
  [/A[\s\S]*?Expertise & AuthenticitA'Ac Depuis 1950/g, '• Expertise & Authenticité Depuis 1950'],

  // Beauty hero pill
  [/A[\s\S]*?BeautA'Ac & Intelligence Artificielle/g, '✨ Beauté & Intelligence Artificielle'],

  // Beauty sub-card text
  [/Soins personnalisA'Acs grA'A�ce A'A� l&apos;IA/g, "Soins personnalisés grâce à l'IA"],

  // Beauty contact header
  [/Transformez Votre BeautA'Ac/g, 'Transformez Votre Beauté'],

  // Simple beauty labels
  [/BeautA'Ac IA/g, 'Beauté IA'],

  // Misc footers/copyright + bullets in beauty/antique areas
  [/���\u001aAc\s*2025\s*\$\{m\.footer\.company\}/g, '© 2025 ${m.footer.company}'],
  [/A����\u001a���A�/g, ' • '],
  [/A'���lA'Acgance/g, 'Élégance'],
  [/Innovation/g, 'Innovation'],
];

for (const [from, to] of R) src = src.replace(from, to);

fs.writeFileSync(file, src, 'utf8');
console.log('Swept BusinessCarousel.tsx for curated FR fixes.');

