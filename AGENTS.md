# Cloud Agent instructions

## Job apply automation

This repo includes a Cloud Agent skill at `.cursor/skills/job-apply/` for applying to jobs on **LinkedIn**, **Naukri**, and **JSearch**.

When the user asks to apply for jobs (including from phone Cursor):

1. Read and follow `.cursor/skills/job-apply/SKILL.md`.
2. Use secrets from the Cloud Agent environment — never hardcode credentials.
3. Default to `--dry-run` unless the user explicitly wants live applications.
4. Run scripts from `scripts/job-apply/`:
   ```bash
   cd scripts/job-apply && node run.mjs --platform all --query "QA Engineer" --limit 5 --dry-run
   ```
5. Summarize results from `scripts/job-apply/reports/*.json`.

Environment setup is defined in `.cursor/environment.json` (Playwright + Chromium + Xvfb).

## Site context

- Static Tech1World institute site (`index.html`).
- Live job board section: `#jobs` (JSearch API).
- AI resume analyzer with skills gap detection is embedded in `index.html`.
