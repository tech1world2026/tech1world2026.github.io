---
name: job-apply
description: Apply to jobs on LinkedIn, Naukri, and JSearch from Cursor Cloud Agent (desktop or phone). Use when the user asks to apply for jobs, run job automation, apply on LinkedIn/Naukri, or trigger the job apply skill.
environments: [cloud]
compatibility: Requires Playwright Chromium from .cursor/environment.json, Cloud Agent secrets for platform credentials, and DISPLAY=:99 (started by environment start script).
---

# Job Apply (Cloud + Phone)

Automated job applications for Tech1World students and operators. Runs in **Cursor Cloud Agent** so you can trigger it from **desktop or mobile Cursor**.

## Before First Run

1. **Commit this repo** with `.cursor/environment.json` and `.cursor/skills/job-apply/`.
2. In **Cursor → Cloud Agent → Environment → Secrets**, add:

| Secret | Required for |
| --- | --- |
| `JOB_APPLY_LINKEDIN_EMAIL` | LinkedIn |
| `JOB_APPLY_LINKEDIN_PASSWORD` | LinkedIn |
| `JOB_APPLY_NAUKRI_EMAIL` | Naukri |
| `JOB_APPLY_NAUKRI_PASSWORD` | Naukri |
| `JOB_APPLY_JSEARCH_KEY` | JSearch / job board API |
| `JOB_APPLY_NAME` | Optional — application forms |
| `JOB_APPLY_PHONE` | Optional — application forms |
| `JOB_APPLY_RESUME_PATH` | Optional — defaults to `scripts/job-apply/assets/resume.pdf` |

3. Upload a resume PDF to `scripts/job-apply/assets/resume.pdf` **or** set `JOB_APPLY_RESUME_PATH` to a secret-backed path.
4. Trigger an **environment build** once so Playwright + Chromium are installed (Cursor → Environment → Builds).

See [secrets-setup.md](references/secrets-setup.md) and [phone-usage.md](references/phone-usage.md).

## When to Use

- User says: "apply jobs", "apply on LinkedIn", "apply on Naukri", "run job apply", "/job-apply"
- User wants QA/testing roles applied from phone Cursor
- User asks to search and apply using the live job board API

## Workflow (Agent Steps)

1. Confirm secrets exist (never print secret values).
2. Ensure dependencies are installed:
   ```bash
   cd scripts/job-apply && npm install && npx playwright install chromium --with-deps
   ```
3. Run a **dry run** first unless the user explicitly says to apply now:
   ```bash
   cd scripts/job-apply
   node run.mjs --platform all --query "QA Engineer Selenium" --city Bangalore --limit 5 --dry-run
   ```
4. If dry run looks good, run live apply:
   ```bash
   node run.mjs --platform linkedin --query "QA Engineer" --city Bangalore --limit 3
   ```
5. Read JSON reports from `scripts/job-apply/reports/` and summarize:
   - applied count
   - skipped (no Easy Apply, dry run, etc.)
   - failed (login, OTP, incomplete forms)
6. If LinkedIn/Naukri asks for **2FA or OTP**, tell the user to complete verification once in the Cloud Agent browser session, then rerun. Session cookies are saved under `scripts/job-apply/.storage/`.

## CLI Reference

```bash
cd scripts/job-apply
node run.mjs --platform linkedin|naukri|jsearch|all \
  --query "QA Engineer Software Testing" \
  --city Bangalore \
  --limit 5 \
  [--dry-run] \
  [--headless]
```

## Platform Notes

| Platform | Behavior |
| --- | --- |
| **linkedin** | Easy Apply jobs only (`f_AL=true`). Skips jobs without Easy Apply. |
| **naukri** | Opens listings and clicks Apply / Quick apply when visible. |
| **jsearch** | Uses RapidAPI JSearch (same source as site job board). Opens apply links in browser. |

## Phone Cursor Usage

From the Cursor mobile app:

1. Open this repository.
2. Start a **Cloud Agent**.
3. Message: `/job-apply apply to QA jobs in Bangalore on LinkedIn and Naukri, limit 3`
4. Agent runs the scripts above and returns the report summary.

## Safety

- Never commit credentials or API keys.
- Prefer `--dry-run` when testing new queries.
- LinkedIn/Naukri may rate-limit or require manual verification — report screenshots from `scripts/job-apply/screenshots/` when blocked.
- Do not guarantee placement outcomes; this automates application attempts only.
