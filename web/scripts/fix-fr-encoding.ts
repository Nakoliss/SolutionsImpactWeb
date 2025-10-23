/*
 Batch-fix common French mojibake in JSON content files.
 Usage: npx tsx web/scripts/fix-fr-encoding.ts
*/
import fs from 'fs';
import path from 'path';

const files = [
  path.join(__dirname, '..', 'messages', 'fr.json'),
  path.join(__dirname, '..', 'content', 'services.fr.json'),
];

function fixMojibake(input: unknown): any {
  if (typeof input === 'string') {
    let s = input;
    const map: Record<string, string> = {
      'Ã©': 'é', 'Ã¨': 'è', 'Ãª': 'ê', 'Ã«': 'ë', 'Ã§': 'ç',
      'Ã€': 'À', 'Ã‚': 'Â', 'Ã¢': 'â', 'Ã¤': 'ä', 'Ã ': 'à', 'Ã¡': 'á',
      'Ã¹': 'ù', 'Ãº': 'ú', 'Ã»': 'û', 'Ã¼': 'ü', 'Ãœ': 'Ü',
      'Ã‰': 'É', 'Ãˆ': 'È', 'ÃŠ': 'Ê', 'Ã‹': 'Ë', 'Ã”': 'Ô', 'Ã´': 'ô',
      'ÃŒ': 'Ì', 'ÃŽ': 'Î', 'Ã¯': 'ï', 'Ã±': 'ñ',
      'Â·': '·', 'Â«': '«', 'Â»': '»', 'Â°': '°', 'Â': '',
      // Common corrupted separators
      'A�': '',
    };
    for (const [bad, good] of Object.entries(map)) s = s.split(bad).join(good);
    return s;
  }
  if (Array.isArray(input)) return input.map(fixMojibake);
  if (input && typeof input === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(input as Record<string, any>)) out[k] = fixMojibake(v);
    return out;
  }
  return input;
}

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const json = JSON.parse(raw);
    const fixed = fixMojibake(json);
    const out = JSON.stringify(fixed, null, 2) + '\n';
    fs.writeFileSync(file, out, 'utf8');
    console.log(`Fixed mojibake in: ${path.relative(process.cwd(), file)}`);
  } catch (err) {
    console.error(`Failed to process ${file}:`, err);
  }
}

