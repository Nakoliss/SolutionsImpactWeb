import fs from 'fs';
import path from 'path';

type Dict = Record<string, any>;

function upsertMessages(file: string, updater: (j: Dict) => void) {
  let data = fs.readFileSync(file, 'utf8');
  if (data.charCodeAt(0) === 0xfeff) data = data.slice(1); // strip BOM if present
  const json = JSON.parse(data) as Dict;
  updater(json);
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
}

const root = path.join(__dirname, '..', 'messages');
const en = path.join(root, 'en.json');
const fr = path.join(root, 'fr.json');

upsertMessages(en, (j) => {
  j.business ||= {};
  j.business.antique = j.business.antique || {
    title: 'Antiques & Collections',
    tagline: 'Treasures of the past',
    badge: '• Expertise & Authenticity Since 1950'
  };
  j.business.beauty = j.business.beauty || {
    menuName: 'Beauty Salon',
    badge: '• Beauty & Artificial Intelligence',
    beautyIA: 'Beauty AI',
    ctaTitle: 'Transform Your Beauty',
    subcard: 'Personalized care thanks to AI'
  };
});

upsertMessages(fr, (j) => {
  j.business ||= {};
  j.business.antique = j.business.antique || {
    title: 'Antiquités & Collections',
    tagline: 'Trésors du passé',
    badge: '• Expertise & Authenticité Depuis 1950'
  };
  j.business.beauty = j.business.beauty || {
    menuName: 'Salon de Beauté',
    badge: '• Beauté & Intelligence Artificielle',
    beautyIA: 'Beauté IA',
    ctaTitle: 'Transformez Votre Beauté',
    subcard: "Soins personnalisés grâce à l'IA"
  };
});

console.log('Added business.* i18n keys to en/fr messages.');
