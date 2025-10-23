/*
 Spin up dev server and scan FR/EN home across designs for mojibake in rendered text.
 Usage: npx tsx web/scripts/scan-ui-mojibake.ts
*/
import { spawn } from 'child_process';
import http from 'http';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

function waitForServer(url: string, timeoutMs = 60000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      http.get(url, (res) => {
        res.resume();
        resolve();
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Server start timeout'));
        else setTimeout(tryOnce, 1000);
      });
    };
    tryOnce();
  });
}

function hasMojibake(text: string): boolean {
  // Look for typical corruption markers
  return /A�|A,|Ã|Â|�|�|�/.test(text);
}

async function main() {
  let server: ReturnType<typeof spawn> | null = null;
  try {
    if (!process.env.BASE_URL) {
      const cmd = process.platform.startsWith('win') ? 'npm.cmd' : 'npm';
      server = spawn(cmd, ['run', 'dev'], { cwd: 'web', stdio: 'inherit', shell: true });
      await waitForServer(`${BASE}/`);
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    const locales = ['fr', 'en'] as const;
    const issues: string[] = [];

    for (const locale of locales) {
      await page.goto(`${BASE}/${locale}`);
      // Check initial render
      let body = await page.evaluate(() => document.body.innerText);
      if (hasMojibake(body)) issues.push(`${locale}: initial render contains mojibake`);

      // Open menu and click next to cycle designs
      // There is a menu button at top-right; click it to open menu
      await page.click('button[aria-label="Ouvrir le menu des designs"]', { timeout: 10000 }).catch(() => {});
      // Close it in case; then use Next button inside the menu for cycling
      for (let i = 0; i < 9; i++) {
        // Try clicking next; FR uses "Suivant", EN uses "Next"
        const nextLabel = locale === 'fr' ? 'Suivant' : 'Next';
        await page.locator('button', { hasText: nextLabel }).first().click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(400);
        body = await page.evaluate(() => document.body.innerText);
        if (hasMojibake(body)) issues.push(`${locale}: mojibake on design index ${i + 2}`);
      }
    }

    await browser.close();

    if (issues.length) {
      console.error('Mojibake issues detected:\n' + issues.join('\n'));
      process.exitCode = 1;
    } else {
      console.log('No mojibake detected across FR/EN and designs.');
    }
  } finally {
    if (server && !server.killed) {
      server.kill();
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
