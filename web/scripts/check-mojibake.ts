/*
 Scan repo for common mojibake bytes that indicate broken French accents.
 Usage: npx tsx web/scripts/check-mojibake.ts
*/
import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '..');
const exts = new Set(['.json', '.mdx', '.md']);
const bad = /[ÃÂ�├┬]/; // common mojibake markers in corrupted FR text

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.next') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip source code and scripts to avoid flagging regex literals/constants
      if (['lib', 'scripts', 'components', 'app', 'pages'].includes(entry.name)) continue;
      yield* walk(full);
    } else if (exts.has(path.extname(full))) {
      // Only scan JSON/MD/MDX assets inside messages/ or content/
      const rel = path.relative(root, full);
      if (!/(^|\\|\/)messages(\\|\/)/.test(rel) && !/(^|\\|\/)content(\\|\/)/.test(rel)) continue;
      if (path.basename(full).toLowerCase() === 'readme.md') continue;
      yield full;
    }
  }
}

let issues = 0;
for (const file of walk(root)) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    if (bad.test(data)) {
      issues++;
      console.log('Mojibake detected in:', path.relative(process.cwd(), file));
    }
  } catch {}
}

if (issues) {
  console.log(`Found ${issues} files with possible mojibake.`);
  process.exitCode = 1;
} else {
  console.log('No mojibake detected.');
}

