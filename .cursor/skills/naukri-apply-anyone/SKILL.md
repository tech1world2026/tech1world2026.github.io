---
name: naukri-apply-anyone
description: >-
  Apply to jobs on Naukri.com for any role or sector via browser automation. Interviews
  the user for a profile, searches keyword listings, answers screening questions honestly,
  and reports results. Use when someone asks to apply on Naukri, auto-apply Naukri jobs,
  mass apply on Naukri, or resume a Naukri application run from phone or desktop Cursor.
environments: [cloud]
compatibility: >-
  Cursor Cloud Agent browser (load cloud-browser skill first). Naukri account signed in
  in the cloud VM browser, or user completes login once when prompted.
---

# Naukri Apply (Any Role, Any Sector)

Applies to jobs on Naukri.com for whoever is asking, in whatever field they work in, through a fast browser-automation loop. It starts by interviewing the person to build an application profile, then uses that profile to search, filter, and answer Naukri's screening questions in their own voice and with their own real facts.

Two things make this different from a generic "click apply" loop:

1. **Nothing about the applicant is hardcoded.** The profile comes from the intake interview in Step 1 (or a saved profile from a previous run). A nurse, a Java developer, a CA, a warehouse supervisor, and a BD manager should all get sensible behaviour out of this.
2. **It represents the person honestly.** This submits real applications under someone's real identity. Never invent an employer, a certification, a tool, a degree, a visa status, or a number to get past a screening question. An application that gets filtered out for an honest "no" costs far less than one that collapses in the interview.

## Cloud Agent setup

**In Cursor Cloud Agent (desktop or phone):** read and follow `.cursor/skills/cloud-browser/SKILL.md` first. Use **computer use** for browser control instead of Claude-in-Chrome MCP tools.

Requires a browser on the cloud VM already logged into the person's Naukri account, or the user completes login once when the agent opens Naukri (never enter OTP/password unattended).

Original Chrome-tool names map as: `tabs_context_mcp` → open browser; `navigate` → go to URL; `javascript_tool` → run JS in DevTools when available; `computer` → click/type via computer use; `find` → read page snapshot; `browser_batch` → chain steps.

Save profiles to `naukri-profile.md` in the repo workspace (preferred for Cloud Agent) or a `## Saved profile` section at the bottom of this file.

---

## Step 1 — Build the application profile

**First, check for a saved profile.** If a `## Saved profile` section exists at the bottom of this skill, or the person points to a profile file (e.g. `naukri-profile.md` in their working folder), read it and skip straight to Step 2. Confirm only what's likely to have gone stale — notice period, current CTC, target roles — rather than re-running the whole interview.

If there's no saved profile, run the interview below. Use multiple-choice options wherever the answer is a bounded choice; batch related questions into one call instead of drip-feeding them. Anything that needs prose (work history, tools) is better asked as plain conversation.

### Block A — Core (ask everyone)

| # | Ask | Why it's needed |
|---|---|---|
| 1 | **Target roles / job titles** — 3-6 variants, including functional synonyms (e.g. "Staff Nurse" + "ICU Nurse"; "SDR" + "Business Development Executive"; "Accounts Executive" + "Accountant") | Search keywords for Part A and the relevance filter for Part B |
| 2 | **Total years of experience**, and years in the specific target function if different | The single most common screening field |
| 3 | **Current city, plus cities they'd relocate to or work from** | Location screening and search scoping |
| 4 | **Work mode and shift flexibility** — WFO / hybrid / remote; night shift, rotational, US/UK hours, weekend work | Recurring eligibility questions |
| 5 | **Notice period**, and whether they're currently serving it or immediately available | Recurring field |
| 6 | **Current CTC and expected CTC** — and whether they're willing to have real numbers submitted, or want a "negotiable / prefer to discuss" answer where the field allows free text | Some forms make this mandatory; better to settle the policy up front |
| 7 | **Highest qualification** — degree, specialisation, year, plus any licences, registrations, or certifications that gate their field (e.g. council registration, CA/CS, PMP, AWS cert, teaching eligibility, trade licence) | Many sectors screen hard on this |
| 8 | **Sector / industry they work in**, and which industries to exclude | Drives Block B below and the company filter |

### Block B — Sector follow-ups (ask only what fits)

Pick the branch matching their answer to #8. These are starting points, not a fixed script — if their field isn't listed, ask the equivalent two or three questions that a recruiter in that field would screen on.

- **Software / IT / data / AI** — primary stack and languages, years per key technology, cloud platforms actually used, GitHub or portfolio link, product vs services background, on-call/production ownership.
- **Sales / BD / inside sales / pre-sales** — markets sold into (domestic vs specific geographies), average deal size and biggest deal, CRM tools used, inbound vs outbound, quota and attainment, daily call/email volume.
- **Marketing / content / growth** — channels owned, budget managed, tools (GA, HubSpot, Meta/Google Ads, SEO stack), B2B vs B2C, in-house vs agency.
- **Finance / accounting / audit** — statutory vs management accounting, ERP/tools (Tally, SAP, Zoho Books, Oracle), GST/TDS/audit exposure, qualification status (CA final, semi-qualified, etc.), team or entity size handled.
- **HR / recruitment / admin** — generalist vs specialist, HRMS tools, hiring volume and roles hired for, payroll/compliance exposure.
- **Healthcare / pharma / life sciences** — registration/licence number status, department or therapeutic area, patient load or shift pattern, hospital tier or setting, regulatory exposure (GMP, clinical trials).
- **Operations / supply chain / manufacturing** — plant/warehouse scale, processes owned, certifications (Six Sigma, safety), SAP/WMS tools, shift responsibility.
- **Customer support / BPO** — voice vs non-voice vs chat, domestic vs international process, AHT/CSAT metrics, tools (Zendesk, Freshdesk, Genesys), rotational/night shift comfort.
- **Design / creative** — portfolio link, tools, product vs brand vs print, handoff and collaboration workflow.
- **Education / training** — subjects and grade levels, board or curriculum, eligibility tests cleared, class size, online vs offline.
- **Legal / compliance** — enrolment/bar status, practice area, litigation vs in-house, drafting exposure.
- **Skilled trades / field roles** — trade certification, equipment handled, site vs workshop, travel willingness, licence type.

### Block C — Run policy (ask everyone, keep short)

- **Company filter** — industries or company types to include, and any to hard-exclude (some people won't apply to staffing agencies, some won't apply to a former employer, some only want product companies). Treat exclusions as absolute: check the hiring company's actual business, not just the job title, and skip when genuinely ambiguous.
- **Seniority floor and ceiling** — the experience range worth applying into, so a 5-year candidate isn't pushed at 10+ year roles.
- **Salary floor**, if they have a hard one — used to skip listings below it where the range is visible.
- **Stop conditions** — max applications per run and/or a time cap.
- **Competing-offer disclosure** — most people prefer "prefer to discuss during the interview"; confirm.
- **Team management** — have they managed people, and how many. Answer this from fact, never from what sounds better.

### Block D — Work history narrative

Ask for 1-2 short honest paragraphs covering their most relevant roles: real employer names, titles, dates, what they actually did, and real numbers if they have them. Open-ended screening questions ("describe your experience with X", "why this role") get answered from this and nothing else.

This block can be collected slightly late — it's fine to start Part A once Blocks A and C are answered. But the first time a screening chat asks an open-ended narrative question without it, stop and ask rather than composing something plausible.

### Save the profile

Once collected, offer to persist it so future runs skip the interview:

- Write `naukri-profile.md` in the workspace (recommended for Cloud Agent — easy to edit).
- Or append a `## Saved profile` section to this skill file.

Add any new standing answer discovered mid-run to the same place at the end of the run.

**Unattended runs:** if this is running as a scheduled task with nobody present, do not ask questions. Work from the saved profile, and when a screening question can't be answered honestly from it, skip that listing and record the gap in the final report so the person can fill it in before the next run.

---

## Step 2 — Part A: Keyword search (start here)

Keyword search is where most of a run's volume should come from — it's effectively unlimited, unlike the small, slow-refilling recommended queue. Start here, not with recommended jobs.

1. Search URLs follow `https://www.naukri.com/{keyword-with-hyphens}-jobs`, e.g. `naukri.com/staff-nurse-jobs`, and can be scoped by city: `naukri.com/{keyword}-jobs-in-{city}`. Cycle through all the person's target-role variants from Block A rather than camping on one term; when a term runs dry, move to the next.
2. Enumerate result cards with JS in one shot instead of clicking through blind:
   ```js
   Array.from(document.querySelectorAll('article.jobTuple, div.srp-jobtuple-wrapper')).map((c,i) => ({
     i,
     title: c.querySelector('a.title, [class*="title"]')?.innerText.trim(),
     company: c.querySelector('[class*="comp-name"], a.subTitle')?.innerText.trim(),
     exp: c.querySelector('[class*="expwdth"], [class*="experience"]')?.innerText,
     sal: c.querySelector('[class*="sal-wrap"], [class*="salary"]')?.innerText,
     loc: c.querySelector('[class*="loc"], [class*="location"]')?.innerText,
     href: c.querySelector('a.title, [class*="title"]')?.getAttribute('href')
   }))
   ```
3. **Filter before opening anything.** Skip a listing if it fails the person's company filter, sits outside their seniority band (a 6-11 year floor for someone with 5), is in a domain they have no adjacent experience in, is below their salary floor where visible, or was already attempted this run. Volume is not the goal — a filtered-out listing costs nothing, a bad application costs the person's credibility.
4. Navigate straight to the job detail page. Same tab is fine and faster; if clicking a title opened a new tab, work there and close it when done.
5. The detail page has a single "Apply" button. Click it. Two outcomes:
   - **Instant** — redirects to an "Applied to '<title>'" confirmation. One screenshot to confirm, then move on.
   - **Screening drawer** — the chat panel described in Step 4. Answer it, then it redirects to its own confirmation (`myapply/saveApply?...&multiApplyResp={"<jobId>":200}`; 200 means applied).
6. Skip anything whose button says "Apply on company site" or similar — external, not trackable through this flow.
7. The "Jobs you might be interested in" sidebar on detail pages is a good secondary source, but run the same relevance filter over it.

---

## Step 3 — Part B: Recommended Jobs (fallback only)

Only use this once keyword search is exhausted across all the person's role variants. The bulk-select checkboxes here are unreliable to automate: many listings have no checkbox at all (external-apply-only) and JS-dispatched clicks on the ones that exist frequently fail to register — expect roughly half to silently not take.

1. Navigate to `https://www.naukri.com/mnjuser/recommendedjobs`.
2. Enumerate:
   ```js
   Array.from(document.querySelectorAll('article.jobTuple')).map(c => ({
     title: c.querySelector('a.title, [class*="title"]')?.innerText.trim(),
     company: c.querySelector('[class*="comp-name"], a.subTitle')?.innerText.trim(),
     hasCheckbox: !!c.querySelector('.tuple-check-box i')
   }))
   ```
   No checkbox = external-apply-only; never select those.
3. Pick up to 5 eligible listings that pass the same filters as Part A.
4. Select them by dispatching real mouse events — a plain `.click()` doesn't register on this custom control:
   ```js
   function clickReal(el) {
     el.scrollIntoView({block:'center'});
     const r = el.getBoundingClientRect();
     const x = r.left + r.width / 2, y = r.top + r.height / 2;
     ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(type =>
       el.dispatchEvent(new MouseEvent(type, {bubbles:true, cancelable:true, clientX:x, clientY:y}))
     );
   }
   ```
   Re-query each checkbox's state afterward and proceed with however many actually took, rather than looping to force all 5. Then click the "Apply N Jobs" button with a real coordinate click, where N is the number actually selected.
5. The screening drawer opens and asks questions across the whole batch — see Step 4.
6. On finish, the tab redirects to `saveApply` with a per-job result map (200 = applied, 406 = failed, usually a duplicate). Screenshot once, note the count, navigate back, repeat.
7. Never retry a 406 — move to fresh titles.

---

## Step 4 — Answering the screening chat

### Mechanics

- **Read the question via JS, not screenshots.** Query the drawer's message container and take the last non-user bubble's `innerText`. Reserve screenshots for questions with radio/checkbox options (where real coordinates are needed) and for confirmation pages. Target roughly one screenshot per options-question, not several per question.
- **Free-text answers** go into a `[contenteditable="true"]` div, not an `<input>` — setting `.value` does nothing:
  ```js
  const ed = document.querySelector('[contenteditable="true"], [contenteditable=""]');
  ed.focus();
  document.execCommand('insertText', false, "your answer text");
  ```
  Re-query the element fresh before every answer; never reuse a reference from the previous question.
- **Radios and checkboxes** are real `<input>`s but custom-styled — JS clicks and `label.click()` often don't register. Use a real coordinate click via computer use, then optionally verify with `element.checked` before advancing.
- Click **Save** after each answer. On "Something went wrong. Please Try again later," click "Try again" and re-answer the repeated question.
- Batch clicks, waits, and screenshots together whenever the next action doesn't depend on reading the previous result.
- **Keep an answer library.** The same questions recur constantly within a run — experience, notice period, CTC, location, shift, tools, qualification. Store the exact approved answer text the first time and paste it thereafter instead of recomposing. Carry it into the saved profile at the end of the run.

### Answering honestly

- **Eligibility and availability** (relocation, shift, "willing to work at <location>", weekend work) — answer from the person's stated flexibility, not from what maximises the chance of passing.
- **Years in their core field** — their real total, or the tightest true bracket. Naukri often offers tiered radios (`No experience / <2 / 2-4 / 4-6 / 6-8 / >8`); pick the bracket containing their real number, and if they sit exactly on a shared boundary, take the lower one.
- **Years in a specific named tool, platform, certification, or narrow domain they didn't mention** — do not reuse their overall experience number. Answer with a smaller real figure if they have partial exposure, or plainly "no direct experience with X; my background is in Y."
- **Never invent** an employer name, a certification or licence number, a degree, a geography sold into, a client, a tool, a metric, or a visa/work-authorisation status.
- **Scope questions** ("have you managed a team", "what was your budget") — answer from their real history.
- **Salary and competing offers** — use their stated policy; never volunteer a number they didn't give you.
- **A genuinely new question that can't be answered from the profile** — ask once and carry the answer forward for the rest of the run (or, if unattended, skip the listing and log it).

---

## Step 5 — Pacing, stopping, reporting

Leave roughly 1.5-2 seconds between drawer interactions. Stop the run immediately and report if any of these appear:

- A **rate-limit or throttling warning** from Naukri — don't retry through it.
- A **CAPTCHA or security challenge** — never attempt it.
- A **login prompt** — the session expired. Never enter a password, OTP, or 2FA code unattended.
- The person's **stop condition** is hit (application count or time cap).

**End-of-run report:** total applied (company + title), failed + why, Part A vs Part B split, skipped by reason, remaining listings, profile gaps discovered.

Optionally log applications to `naukri-applications.csv` in the workspace (date, company, title, source, status).
