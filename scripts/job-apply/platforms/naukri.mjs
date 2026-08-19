import fs from 'node:fs';
import { capture, launchBrowser, saveStorage, waitForAny } from '../lib/browser.mjs';
import { createReport, finishReport, printSummary } from '../lib/report.mjs';

const NAUKRI_LOGIN = 'https://www.naukri.com/nlogin/login';
const NAUKRI_SEARCH = (query, location) =>
  `https://www.naukri.com/${encodeURIComponent(query.replace(/\s+/g, '-'))}-jobs${location ? `-in-${encodeURIComponent(location.replace(/\s+/g, '-'))}` : ''}`;

async function ensureLoggedIn(page, config, report) {
  await page.goto(NAUKRI_LOGIN, { waitUntil: 'domcontentloaded' });

  const loggedInMarker = await waitForAny(page, [
    'a#login_Layer',
    '.nI-gNb-drawer__bars',
    'div[id="root"] img[alt*="profile"]',
  ], 5000);

  if (loggedInMarker && !(await page.locator('input[type="text"][placeholder*="Email"], input#usernameField').isVisible().catch(() => false))) {
    report.notes.push('Naukri session already active.');
    return;
  }

  const emailInput = page.locator('input[type="text"], input#usernameField').first();
  const passwordInput = page.locator('input[type="password"], input#passwordField').first();
  await emailInput.fill(config.naukri.email);
  await passwordInput.fill(config.naukri.password);
  await page.locator('button[type="submit"], button.loginButton').first().click();

  const otp = await waitForAny(page, [
    'input[placeholder*="OTP"]',
    'input[name="otp"]',
    'text=OTP',
  ], 6000);

  if (otp) {
    const shot = await capture(page, 'naukri-otp-required');
    report.notes.push(`Naukri OTP required. Complete once in browser, then rerun. Screenshot: ${shot}`);
    throw new Error('Naukri OTP required. Complete verification once, then rerun job-apply.');
  }

  const loggedIn = await waitForAny(page, [
    '.nI-gNb-drawer__bars',
    'a[title="Jobseeker Profile"]',
    'div#root',
  ], 20000);

  if (!loggedIn) {
    const shot = await capture(page, 'naukri-login-failed');
    throw new Error(`Naukri login failed. Screenshot: ${shot}`);
  }
}

async function tryApply(page, config, report, dryRun) {
  const title = await page.locator('h1, .jd-header-title').first().textContent().catch(() => 'Unknown role');
  const company = await page.locator('.jd-header-comp-name, .comp-name').first().textContent().catch(() => 'Unknown company');

  const applyBtn = page.locator('button, a').filter({ hasText: /Apply on company site|Apply now|Quick apply|Apply/i }).first();
  if (!(await applyBtn.isVisible().catch(() => false))) {
    report.skipped.push({ title: title?.trim(), company: company?.trim(), reason: 'No apply button', url: page.url() });
    return;
  }

  if (dryRun) {
    report.skipped.push({ title: title?.trim(), company: company?.trim(), reason: 'Dry run', url: page.url() });
    return;
  }

  await applyBtn.click();
  await page.waitForTimeout(1500);

  const fileInput = page.locator('input[type="file"]').first();
  if (config.profile.resumePath && fs.existsSync(config.profile.resumePath) && await fileInput.count()) {
    await fileInput.setInputFiles(config.profile.resumePath).catch(() => {});
  }

  const confirm = page.locator('button').filter({ hasText: /Submit|Apply|Save/i }).last();
  if (await confirm.isVisible().catch(() => false)) {
    await confirm.click().catch(() => {});
    await page.waitForTimeout(1200);
  }

  report.applied.push({ title: title?.trim(), company: company?.trim(), url: page.url() });
}

export async function applyNaukri(config) {
  const report = createReport({
    platform: 'naukri',
    query: config.query,
    city: config.city,
    dryRun: config.dryRun,
  });

  const { browser, context, page } = await launchBrowser({
    headless: config.headless,
    storagePath: config.naukri.storage,
  });

  try {
    await ensureLoggedIn(page, config, report);
    await saveStorage(context, config.naukri.storage);

    const searchUrl = NAUKRI_SEARCH(config.query, config.city);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    const cards = page.locator('article.jobTuple, div.cust-job-tuple, a.title');
    await cards.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});

    const total = Math.min(await cards.count(), config.limit);
    if (!total) {
      report.notes.push('No Naukri job listings found for this query.');
      return finishReport(report);
    }

    for (let i = 0; i < total; i += 1) {
      const card = cards.nth(i);
      await card.scrollIntoViewIfNeeded().catch(() => {});
      await card.click({ timeout: 10000 }).catch(() => {
        report.failed.push({ reason: 'Could not open listing', index: i });
      });
      await page.waitForTimeout(1200);
      await tryApply(page, config, report, config.dryRun);
      await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
    }

    await saveStorage(context, config.naukri.storage);
  } finally {
    await browser.close();
  }

  const reportPath = finishReport(report);
  printSummary(report, reportPath);
  return reportPath;
}
