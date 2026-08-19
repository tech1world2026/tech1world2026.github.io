import fs from 'node:fs';
import { capture, launchBrowser, saveStorage, waitForAny } from '../lib/browser.mjs';
import { createReport, finishReport, printSummary } from '../lib/report.mjs';

const LINKEDIN_LOGIN = 'https://www.linkedin.com/login';
const LINKEDIN_JOBS = (query, location) =>
  `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&f_AL=true`;

async function ensureLoggedIn(page, config, report) {
  await page.goto(LINKEDIN_LOGIN, { waitUntil: 'domcontentloaded' });

  const feedMarker = await waitForAny(page, [
    'input[placeholder*="Search"]',
    'nav.global-nav',
    'img.global-nav__me-photo',
  ], 6000);

  if (feedMarker) {
    report.notes.push('LinkedIn session already active.');
    return;
  }

  await page.fill('#username', config.linkedin.email);
  await page.fill('#password', config.linkedin.password);
  await page.click('button[type="submit"]');

  const challenge = await waitForAny(page, [
    '#input__phone_verification_pin',
    'input[name="pin"]',
    'form#two-step-challenge',
    'h1:has-text("Check your LinkedIn app")',
  ], 8000);

  if (challenge) {
    const shot = await capture(page, 'linkedin-verification-required');
    report.notes.push(`LinkedIn verification required. Complete it once in Cloud Agent browser, then rerun. Screenshot: ${shot}`);
    throw new Error('LinkedIn verification required. Complete 2FA/checkpoint once, then rerun job-apply.');
  }

  const loggedIn = await waitForAny(page, [
    'input[placeholder*="Search"]',
    'nav.global-nav',
  ], 20000);

  if (!loggedIn) {
    const shot = await capture(page, 'linkedin-login-failed');
    throw new Error(`LinkedIn login failed. Screenshot: ${shot}`);
  }
}

async function dismissOverlays(page) {
  for (const label of ['Dismiss', 'Not now', 'Skip']) {
    const btn = page.getByRole('button', { name: new RegExp(label, 'i') }).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(500);
    }
  }
}

async function tryEasyApply(page, config, report, dryRun) {
  const easyApply = page.locator('button').filter({ hasText: /^Easy Apply$/ }).first();
  if (!(await easyApply.isVisible().catch(() => false))) {
    report.skipped.push({ reason: 'No Easy Apply button', url: page.url() });
    return;
  }

  const title = await page.locator('h1').first().textContent().catch(() => 'Unknown role');
  const company = await page.locator('.job-details-jobs-unified-top-card__company-name, a.jobs-unified-top-card__company-name').first().textContent().catch(() => 'Unknown company');

  if (dryRun) {
    report.skipped.push({ title: title?.trim(), company: company?.trim(), reason: 'Dry run', url: page.url() });
    return;
  }

  await easyApply.click();
  const modal = page.locator('.jobs-easy-apply-modal, div[role="dialog"]').first();
  await modal.waitFor({ state: 'visible', timeout: 12000 }).catch(() => {});

  let steps = 0;
  while (steps < 8) {
    steps += 1;
    await page.waitForTimeout(800);

    const submit = page.locator('button').filter({ hasText: /Submit application|Review|Next|Continue/ }).last();
    const text = (await submit.textContent().catch(() => '')) || '';

    if (/Submit application/i.test(text)) {
      if (config.profile.resumePath && fs.existsSync(config.profile.resumePath)) {
        const fileInput = page.locator('input[type="file"]').first();
        if (await fileInput.count()) {
          await fileInput.setInputFiles(config.profile.resumePath).catch(() => {});
        }
      }
      await submit.click();
      await page.waitForTimeout(1500);
      report.applied.push({ title: title?.trim(), company: company?.trim(), url: page.url() });
      await page.keyboard.press('Escape').catch(() => {});
      return;
    }

    if (/Review|Next|Continue/i.test(text)) {
      await submit.click();
      continue;
    }

    break;
  }

  report.failed.push({ title: title?.trim(), company: company?.trim(), reason: 'Easy Apply flow incomplete', url: page.url() });
  await capture(page, 'linkedin-easy-apply-incomplete');
  await page.keyboard.press('Escape').catch(() => {});
}

export async function applyLinkedIn(config) {
  const report = createReport({
    platform: 'linkedin',
    query: config.query,
    city: config.city,
    dryRun: config.dryRun,
  });

  const location = config.city ? `${config.city}, ${config.location}` : config.location;
  const { browser, context, page } = await launchBrowser({
    headless: config.headless,
    storagePath: config.linkedin.storage,
  });

  try {
    await ensureLoggedIn(page, config, report);
    await saveStorage(context, config.linkedin.storage);
    await page.goto(LINKEDIN_JOBS(config.query, location), { waitUntil: 'domcontentloaded' });
    await dismissOverlays(page);

    const cards = page.locator('div.job-card-container, li.jobs-search-results__list-item');
    await cards.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});

    const total = Math.min(await cards.count(), config.limit);
    if (!total) {
      report.notes.push('No LinkedIn job cards found for this query.');
      return finishReport(report);
    }

    for (let i = 0; i < total; i += 1) {
      const card = cards.nth(i);
      await card.scrollIntoViewIfNeeded().catch(() => {});
      await card.click({ timeout: 10000 }).catch(async () => {
        report.failed.push({ reason: 'Could not open job card', index: i });
      });
      await page.waitForTimeout(1200);
      await tryEasyApply(page, config, report, config.dryRun);
    }

    await saveStorage(context, config.linkedin.storage);
  } finally {
    await browser.close();
  }

  const reportPath = finishReport(report);
  printSummary(report, reportPath);
  return reportPath;
}
