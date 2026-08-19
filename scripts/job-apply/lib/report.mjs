import fs from 'node:fs';
import path from 'node:path';
import { REPORTS_DIR } from './config.mjs';

export function createReport({ platform, query, city, dryRun }) {
  return {
    platform,
    query,
    city,
    dryRun,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    applied: [],
    skipped: [],
    failed: [],
    notes: [],
  };
}

export function finishReport(report) {
  report.finishedAt = new Date().toISOString();
  const file = path.join(
    REPORTS_DIR,
    `${report.platform}-${Date.now()}.json`,
  );
  fs.writeFileSync(file, JSON.stringify(report, null, 2));
  return file;
}

export function printSummary(report, reportPath) {
  const lines = [
    `Platform: ${report.platform}`,
    `Query: ${report.query}${report.city ? ` (${report.city})` : ''}`,
    `Applied: ${report.applied.length}`,
    `Skipped: ${report.skipped.length}`,
    `Failed: ${report.failed.length}`,
    `Report: ${reportPath}`,
  ];
  if (report.notes.length) lines.push(`Notes: ${report.notes.join(' | ')}`);
  console.log(lines.join('\n'));
}
