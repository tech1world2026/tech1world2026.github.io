# Cloud Agent Secrets Setup

Add these in **Cursor → Settings → Cloud Agent → Environment → Secrets** for repo `tech1world2026.github.io`.

## Required

```
JOB_APPLY_LINKEDIN_EMAIL=you@example.com
JOB_APPLY_LINKEDIN_PASSWORD=your-linkedin-password
JOB_APPLY_NAUKRI_EMAIL=you@example.com
JOB_APPLY_NAUKRI_PASSWORD=your-naukri-password
JOB_APPLY_JSEARCH_KEY=your-rapidapi-jsearch-key
```

Get a JSearch key from [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch).

## Optional

```
JOB_APPLY_NAME=Jasveer Singh
JOB_APPLY_PHONE=+91XXXXXXXXXX
JOB_APPLY_QUERY=QA Engineer Software Testing
JOB_APPLY_CITY=Bangalore
JOB_APPLY_LIMIT=5
JOB_APPLY_RESUME_PATH=/workspace/scripts/job-apply/assets/resume.pdf
JOB_APPLY_DRY_RUN=1
JOB_APPLY_HEADLESS=1
```

## Resume file

Either:

- Commit a PDF to `scripts/job-apply/assets/resume.pdf`, or
- Upload resume to the cloud workspace and set `JOB_APPLY_RESUME_PATH`.

## First-time 2FA / OTP

LinkedIn and Naukri often require one-time verification on a new device:

1. Run with `--dry-run` to confirm login works.
2. If verification is required, open the Cloud Agent browser (computer use) and complete OTP/2FA once.
3. Rerun apply — session is stored in `scripts/job-apply/.storage/`.

## Environment build

After adding secrets, trigger **Environment → Build** so `install` runs:

```
cd scripts/job-apply && npm install && npx playwright install chromium --with-deps
```

New Cloud Agents boot with Chromium ready.
