#!/usr/bin/env node
import { assertCredentials, loadConfig } from './lib/config.mjs';
import { applyJSearch } from './platforms/jsearch.mjs';
import { applyLinkedIn } from './platforms/linkedin.mjs';
import { applyNaukri } from './platforms/naukri.mjs';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--platform') out.platform = argv[++i];
    else if (arg === '--query') out.query = argv[++i];
    else if (arg === '--city') out.city = argv[++i];
    else if (arg === '--location') out.location = argv[++i];
    else if (arg === '--limit') out.limit = argv[++i];
    else if (arg === '--dry-run') out.dryRun = true;
    else if (arg === '--headless') out.headless = true;
    else if (arg === '--help' || arg === '-h') out.help = true;
  }
  return out;
}

function printHelp() {
  console.log(`Usage: node run.mjs [options]

Options:
  --platform linkedin|naukri|jsearch|all   Platform to run (default: all)
  --query "QA Engineer"                    Job search keywords
  --city Bangalore                           Optional city filter
  --location India                           Location suffix (default: India)
  --limit 5                                Max jobs per platform (default: 5)
  --dry-run                                List targets without submitting
  --headless                               Run browser headless

Secrets (Cursor Cloud Agent → Environment → Secrets):
  JOB_APPLY_LINKEDIN_EMAIL / JOB_APPLY_LINKEDIN_PASSWORD
  JOB_APPLY_NAUKRI_EMAIL / JOB_APPLY_NAUKRI_PASSWORD
  JOB_APPLY_JSEARCH_KEY
  JOB_APPLY_NAME / JOB_APPLY_PHONE / JOB_APPLY_RESUME_PATH (optional)
`);
}

async function main() {
  const argv = parseArgs(process.argv.slice(2));
  if (argv.help) {
    printHelp();
    return;
  }

  const config = loadConfig(argv);
  const platform = config.platform;
  const reports = [];

  if (platform === 'linkedin' || platform === 'all') {
    assertCredentials(config, 'linkedin');
    reports.push(await applyLinkedIn(config));
  }

  if (platform === 'naukri' || platform === 'all') {
    assertCredentials(config, 'naukri');
    reports.push(await applyNaukri(config));
  }

  if (platform === 'jsearch' || platform === 'all') {
    reports.push(await applyJSearch(config));
  }

  if (!reports.length) {
    throw new Error(`Unknown platform "${platform}". Use linkedin, naukri, jsearch, or all.`);
  }

  console.log('\nReports written:');
  for (const report of reports) console.log(`- ${report}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
