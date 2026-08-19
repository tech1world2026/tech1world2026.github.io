---
name: cloud-browser
description: Control the browser in Cursor Cloud Agent (desktop or phone) for job applications on Naukri, LinkedIn, and other sites. Use before any browser-based job-apply skill when running in Cloud Agent, or when the user asks to open Cursor browser, apply from phone, or use cloud browser automation.
environments: [cloud]
compatibility: Cursor Cloud Agent with computer-use browser on the remote VM. DISPLAY :99 from environment start script.
---

# Cloud Browser (Cursor Agent)

Use this when job-apply skills mention **Claude in Chrome** or Chrome MCP tools (`tabs_context_mcp`, `navigate`, `javascript_tool`, `computer`, `find`, `browser_batch`). In **Cursor Cloud Agent**, those map to the cloud VM browser via **computer use**.

## Tool mapping

| Skill expects (Chrome extension) | Cloud Agent equivalent |
| --- | --- |
| `tabs_context_mcp` | Launch/resume browser via **computer use** subagent |
| `navigate` | Browser URL bar or `computerUse` navigation |
| `javascript_tool` | DevTools console JS when available; otherwise DOM clicks via computer use |
| `computer` | Coordinate clicks and typing in the browser window |
| `find` | Read page snapshot / accessibility tree from computer use |
| `browser_batch` | Chain computer-use steps; screenshot only when options need visual confirmation |

## Workflow

1. Confirm `DISPLAY=:99` (started by `.cursor/environment.json` `start` script).
2. Invoke **computer use** to open Chromium/Chrome on the cloud VM.
3. Navigate to the target site (Naukri, LinkedIn, etc.).
4. **First run:** user must log in once in the cloud browser (you may guide them; never store or echo passwords in chat). Session persists in the VM browser profile for follow-up runs in the same environment.
5. Follow the platform skill (`naukri-apply-anyone`, `apply-to-jobs`, etc.) using browser interaction — not Playwright scripts.

## Phone Cursor

- User starts a **Cloud Agent** from the mobile app on this repo.
- Browser runs on the **remote VM**, not on the phone.
- User sends: `/naukri-apply-anyone apply to QA jobs in Bangalore` or `@cloud-browser open Naukri and apply`.
- Agent uses computer use + the platform skill and returns an end-of-run report.

## Safety (same as platform skills)

- Never enter passwords, OTP, or 2FA unless the user is actively present and typing via browser handoff.
- Stop on CAPTCHA or security challenges; hand back to the user.
- Stop on rate-limit warnings from the job site.
- Answer screening questions honestly from the applicant profile only.

## Related skills

- `naukri-apply-anyone` — Naukri keyword search + screening drawer
- `apply-to-jobs` — LinkedIn Easy Apply
