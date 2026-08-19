import { launchBrowser } from '../lib/browser.mjs';
import { createReport, finishReport, printSummary } from '../lib/report.mjs';

async function fetchJobs(config) {
  if (!config.jsearch.apiKey) {
    throw new Error('Missing JOB_APPLY_JSEARCH_KEY in Cloud Agent secrets.');
  }

  const query = config.city
    ? `${config.query} in ${config.city} ${config.location}`
    : `${config.query} ${config.location}`;

  const url = new URL('https://jsearch.p.rapidapi.com/search');
  url.searchParams.set('query', query);
  url.searchParams.set('page', '1');
  url.searchParams.set('num_pages', '1');
  url.searchParams.set('date_posted', 'week');

  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': config.jsearch.apiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  });

  if (!res.ok) {
    throw new Error(`JSearch request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return (data.data || []).slice(0, config.limit);
}

export async function applyJSearch(config) {
  const report = createReport({
    platform: 'jsearch',
    query: config.query,
    city: config.city,
    dryRun: config.dryRun,
  });

  const jobs = await fetchJobs(config);
  if (!jobs.length) {
    report.notes.push('No JSearch jobs found.');
    const reportPath = finishReport(report);
    printSummary(report, reportPath);
    return reportPath;
  }

  if (config.dryRun) {
    for (const job of jobs) {
      report.skipped.push({
        title: job.job_title,
        company: job.employer_name,
        url: job.job_apply_link,
        reason: 'Dry run',
      });
    }
    const reportPath = finishReport(report);
    printSummary(report, reportPath);
    return reportPath;
  }

  const { browser, page } = await launchBrowser({ headless: config.headless });

  try {
    for (const job of jobs) {
      if (!job.job_apply_link) {
        report.skipped.push({ title: job.job_title, company: job.employer_name, reason: 'No apply link' });
        continue;
      }

      try {
        await page.goto(job.job_apply_link, { waitUntil: 'domcontentloaded', timeout: 30000 });
        report.applied.push({
          title: job.job_title,
          company: job.employer_name,
          url: job.job_apply_link,
          opened: true,
        });
      } catch (err) {
        report.failed.push({
          title: job.job_title,
          company: job.employer_name,
          url: job.job_apply_link,
          reason: err.message,
        });
      }
    }
  } finally {
    await browser.close();
  }

  const reportPath = finishReport(report);
  printSummary(report, reportPath);
  return reportPath;
}
