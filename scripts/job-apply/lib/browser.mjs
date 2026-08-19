import fs from 'node:fs';
import { chromium } from 'playwright';
import { SCREENSHOTS_DIR } from './config.mjs';

export async function launchBrowser({ headless = false, storagePath = null } = {}) {
  const browser = await chromium.launch({
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const contextOptions = {
    viewport: { width: 1366, height: 900 },
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
  };

  if (storagePath && fs.existsSync(storagePath)) {
    contextOptions.storageState = storagePath;
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  page.setDefaultTimeout(25000);

  return { browser, context, page };
}

export async function saveStorage(context, storagePath) {
  await context.storageState({ path: storagePath });
}

export async function capture(page, label) {
  const safe = label.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
  const file = `${Date.now()}-${safe}.png`;
  const fullPath = `${SCREENSHOTS_DIR}/${file}`;
  await page.screenshot({ path: fullPath, fullPage: true });
  return fullPath;
}

export async function waitForAny(page, selectors, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const selector of selectors) {
      const node = page.locator(selector).first();
      if (await node.count()) {
        const visible = await node.isVisible().catch(() => false);
        if (visible) return node;
      }
    }
    await page.waitForTimeout(400);
  }
  return null;
}
