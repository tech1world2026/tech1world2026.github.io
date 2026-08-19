# Apply Jobs from Phone Cursor

## Quick start

1. Install **Cursor** on your phone (iOS/Android).
2. Sign in with the same account used for Cloud Agents.
3. Open repo: `tech1world2026/tech1world2026.github.io`
4. Tap **Cloud Agent** (or start an agent run).
5. Send a message like:

```
/job-apply apply to QA Engineer jobs in Bangalore on LinkedIn, limit 3
```

or

```
Apply for Selenium QA jobs on Naukri and LinkedIn. Dry run first.
```

## What happens

- Cloud Agent loads the **job-apply** skill from `.cursor/skills/job-apply/SKILL.md`.
- It runs Playwright automation in the remote VM (not on your phone).
- You get a text summary: applied / skipped / failed jobs.
- JSON reports are saved under `scripts/job-apply/reports/`.

## Example prompts

| Goal | Message |
| --- | --- |
| Test without applying | `Dry run job apply for QA roles in Pune, limit 5` |
| LinkedIn only | `Apply Easy Apply QA jobs on LinkedIn in Hyderabad, limit 3` |
| Naukri only | `Apply QA jobs on Naukri in Bangalore` |
| All platforms | `Apply QA testing jobs on LinkedIn, Naukri, and job board, limit 5 each` |
| After OTP block | `LinkedIn asked for OTP — I completed it, rerun apply for 3 QA jobs` |

## Prerequisites on phone

- Cloud Agent secrets configured (see `secrets-setup.md`)
- One environment **build** completed after merging this branch
- Resume PDF available in the repo or via `JOB_APPLY_RESUME_PATH`

## Limitations

- Your phone does not run the browser; the **cloud VM** does.
- First login may need OTP — complete it once via Cloud Agent browser tools.
- Not every job supports one-click apply; skipped jobs are listed in the report.
