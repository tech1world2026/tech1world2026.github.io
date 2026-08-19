import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');
export const STORAGE_DIR = path.join(ROOT, '.storage');
export const REPORTS_DIR = path.join(ROOT, 'reports');
export const SCREENSHOTS_DIR = path.join(ROOT, 'screenshots');

for (const dir of [STORAGE_DIR, REPORTS_DIR, SCREENSHOTS_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

function env(name, fallback = '') {
  const value = process.env[name];
  return value == null || value === '' ? fallback : value.trim();
}

export function loadConfig(argv = {}) {
  return {
    platform: argv.platform || 'all',
    query: argv.query || env('JOB_APPLY_QUERY', 'QA Engineer Software Testing'),
    city: argv.city || env('JOB_APPLY_CITY', ''),
    location: argv.location || env('JOB_APPLY_LOCATION', 'India'),
    limit: Number(argv.limit || env('JOB_APPLY_LIMIT', '5')),
    dryRun: Boolean(argv.dryRun || env('JOB_APPLY_DRY_RUN') === '1'),
    headless: env('JOB_APPLY_HEADLESS', '0') === '1',
    linkedin: {
      email: env('JOB_APPLY_LINKEDIN_EMAIL'),
      password: env('JOB_APPLY_LINKEDIN_PASSWORD'),
      storage: path.join(STORAGE_DIR, 'linkedin.json'),
    },
    naukri: {
      email: env('JOB_APPLY_NAUKRI_EMAIL'),
      password: env('JOB_APPLY_NAUKRI_PASSWORD'),
      storage: path.join(STORAGE_DIR, 'naukri.json'),
    },
    profile: {
      name: env('JOB_APPLY_NAME'),
      phone: env('JOB_APPLY_PHONE'),
      resumePath: env('JOB_APPLY_RESUME_PATH', path.join(ROOT, 'assets', 'resume.pdf')),
    },
    jsearch: {
      apiKey: env('JOB_APPLY_JSEARCH_KEY'),
    },
  };
}

export function assertCredentials(config, platform) {
  if (platform === 'linkedin' || platform === 'all') {
    if (!config.linkedin.email || !config.linkedin.password) {
      throw new Error('Missing JOB_APPLY_LINKEDIN_EMAIL or JOB_APPLY_LINKEDIN_PASSWORD in Cloud Agent secrets.');
    }
  }
  if (platform === 'naukri' || platform === 'all') {
    if (!config.naukri.email || !config.naukri.password) {
      throw new Error('Missing JOB_APPLY_NAUKRI_EMAIL or JOB_APPLY_NAUKRI_PASSWORD in Cloud Agent secrets.');
    }
  }
}
