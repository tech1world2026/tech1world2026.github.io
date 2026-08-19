# Cloud Agent instructions

## Browser-based job apply skills

This repo uses **Cursor Cloud Agent browser skills** (not Playwright scripts) for job applications:

| Skill | Platform | Trigger |
| --- | --- | --- |
| `cloud-browser` | Browser setup for cloud VM | `/cloud-browser` |
| `naukri-apply-anyone` | Naukri.com | `/naukri-apply-anyone` |
| `apply-to-jobs` | LinkedIn Easy Apply | `/apply-to-jobs` |

Skills live in `.cursor/skills/` and load automatically when a Cloud Agent starts.

### Phone Cursor workflow

1. Open this repo → start **Cloud Agent**
2. Message: `/naukri-apply-anyone apply to QA jobs in Bangalore, limit 5`
3. Agent loads `cloud-browser` + `naukri-apply-anyone`, opens browser on the cloud VM, applies, and reports results

### First-time setup

1. Merge the branch with these skills
2. Optional: **Environment → Build** once (starts Xvfb for browser display via `.cursor/environment.json`)
3. On first Naukri/LinkedIn run, log in once in the cloud browser when prompted
4. Save profile to `naukri-profile.md` or `applicant-profile.md` for faster future runs

### Site context

Static Tech1World site in `index.html`. Live job board at `#jobs` (JSearch API) for browsing only — automated apply uses the skills above.
