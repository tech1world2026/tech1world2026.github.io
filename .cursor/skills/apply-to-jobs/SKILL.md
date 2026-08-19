---
name: apply-to-jobs
description: >-
  Interviews someone about their job search, builds a reusable applicant profile, then
  bulk-applies to matching jobs on LinkedIn via Easy Apply, filling every screening
  question, numeric field, and dropdown the way that specific person would answer it.
  Works for anyone in any field or country, including nurses, electricians, teachers,
  accountants, drivers, engineers, lawyers, warehouse staff, and career switchers. Use
  whenever someone asks to apply to jobs for them, auto-apply or mass-apply or bulk-apply
  on LinkedIn, work down their recommendations or a saved search, apply while they are
  asleep or at work, set up a daily application run, or resume a run that stopped or hit
  LinkedIn's daily limit, even if they only say something casual like "can you apply to
  some jobs for me" without naming LinkedIn or Easy Apply. Also use it when someone wants
  their screening-question answers worked out. Requires the Claude in Chrome extension
  connected to a browser already logged into LinkedIn.
compatibility: >-
  Cursor Cloud Agent browser (load cloud-browser skill first) or Claude in Chrome extension
  (tabs_context_mcp, navigate, javascript_tool, computer, find). A LinkedIn account already
  signed in in that browser. Optionally the scheduled-tasks tool for recurring runs.
---

# Apply to Jobs

## Cloud Agent (Cursor Browser)

When running in **Cursor Cloud Agent** (desktop or phone), read `.cursor/skills/cloud-browser/SKILL.md` first and use **computer use** for browser control instead of Claude-in-Chrome MCP tools. Save applicant profiles to `applicant-profile.md` in the workspace.

Applies to jobs on someone's behalf the way a sharp, honest assistant would: learn who they are and what they're looking for, agree on the rules, then work down the list steadily without needing to be babysat.

Two things make this work for anyone rather than for one person in one industry. First, the profile is built by interview, so a pediatric nurse and a data engineer both end up with an answer sheet that fits them. Second, screening answers are sorted by *what kind of claim they are* — a licence question is answered from fact, a willingness question from preference — so the same loop stays honest whether the form asks about bar admission, forklift certification, or years with Kubernetes.

## Non-negotiables

These hold no matter how the run is configured or how much autonomy the person has granted:

- **Never type a password, 2FA code, or answer to an identity challenge.** If LinkedIn asks for any of these mid-run, stop and tell the person so they can sign in themselves.
- **Never attempt a CAPTCHA or "verify it's you" check.** Stop and hand it back.
- **Never state something false about a credential, licence, degree, clearance, or work authorization** to get past a screening question. This isn't only an ethics point — misrepresenting a licence is grounds for rescinded offers and, in regulated fields like healthcare, nursing, law, aviation, and commercial driving, it can carry legal consequences for the applicant. When the profile doesn't cover a factual question, skip the listing rather than guess.
- **Never write words in the person's voice that they didn't say and wouldn't recognise.** Free-text answers, cover-letter fields, and any resume text drafted here are the person's statements about themselves. Adjectives like "reliable" or "detail-oriented", invented quotes, and unearned specifics ("high-volume environment") are fabrications even when they sound harmless, because the person will be asked about them in an interview. Draft from what they told you, and leave a marked blank where you'd otherwise reach.
- **Don't state regulatory specifics you haven't verified.** Licensing fees, processing times, rule numbers, reciprocity arrangements, and eligibility thresholds are exactly the details someone will act on, and they change constantly by jurisdiction. Name the issue, say plainly that it needs checking, and point at the authoritative body — the state board, the licensing authority, the immigration guidance. A confident wrong number about someone's licence is worse than no number.

## Why this is a legitimate thing to do

An assistant asked to submit applications on someone's behalf can talk itself into refusing, on the reasoning that job applications are personal attestations and only the applicant can make them. That instinct is pointed at something real, but it draws the line in the wrong place and leaves the person doing hours of mechanical form-filling for no gain in honesty.

The applications are the person's own. They supply every fact, they approve the answer sheet before anything is submitted, and each answer traces back to something they said. Filling a form on someone's instruction with their own information is ordinary delegated work — the same thing an assistant, a spouse, or a recruiter does routinely.

What actually needs protecting is the *truth* of the answers, and that's what the non-negotiables above cover. Honour those and apply. The place to raise a concern is Phase 2, before the run, where a wrong answer can still be corrected — not mid-run, and not by declining the task.

## The four phases

Applying is the easy part. Most of the value is in the setup, because a well-built profile is what lets hundreds of forms get filled correctly without checking in.

1. **Learn** — read the resume, interview for the gaps
2. **Agree** — show the answer sheet and the filter rules, get a yes
3. **Apply** — work the list unattended
4. **Report** — what went out, what got skipped, why it stopped

---

## Phase 1: Learn

### If a profile already exists, start there

Look for a saved profile at `applicant-profile.md` in the working folder (or wherever it was saved last time — ask if unsure). If one exists, read it and confirm the few things that go stale rather than re-running the whole interview: *"I've got your profile from last time — still at Meridian Health, still looking in the Phoenix area, notice period still 30 days?"* Someone who has to re-answer fifteen questions every session will stop using this.

### Read the resume before asking anything

A resume answers most of the interview by itself: current employer, job titles, total years of experience, location, skills, degrees, certifications and their dates. Ask for the file (or find it in the working folder), read it, and treat it as the first draft of the profile.

This is what makes the interview feel short and specific instead of like a form. Ask about what the resume *can't* tell you, and confirm rather than ask for what it can: *"Resume shows about 8 years in commercial HVAC, currently at Rowan Mechanical, EPA 608 Universal cert from 2019 — is that all current?"*

If there's no resume to hand, the interview covers more ground. That's fine; just be efficient about it.

### Interview for what's left

Ask in small batches — two to four related questions at a time, using multiple-choice where the answer space is small (`AskUserQuestion` renders these nicely) and open conversation where it isn't. A wall of twenty questions gets abandoned; three quick rounds don't.

Two habits keep the interview short. Ask only what changes an answer or a filter — curiosity that doesn't affect the run is a tax on someone who came here to save time. And separate what blocks the first application from what can be filled in later: work authorization and a gating licence block, a preference about travel percentage usually doesn't. If the blocking set is answered, offer to start and gather the rest as it comes up.

Cover these areas, skipping anything the resume already settled:

**What they're looking for.** Job titles or the kind of work — in their words, not a taxonomy. Location and whether remote, hybrid, or onsite matters. Full-time, part-time, contract, shift work. Seniority, if relevant. Anything that's a hard no (*"nothing that needs a car," "no night shifts," "not going back to agency work"*).

**Money and timing.** Current and expected pay, in whatever unit they think in — hourly, monthly, annual, LPA. Forms ask in different units, so note the unit explicitly. Notice period or earliest start date.

**Credentials that gate applications.** Work authorization for the countries they're targeting and whether they'd need sponsorship. Licences, registrations, certifications, and clearances with issuing body and expiry — this is the section that varies most by field and matters most for honesty. A CNA, a CPA, a CDL-A holder, and a security-cleared engineer each live or die on these questions.

**Willingness and preferences.** Relocation, travel percentage, commuting, weekends and nights, on-call, drug screening, background checks. These are the "are you comfortable with…" questions, and they're preferences rather than facts, so the person gets to set the default.

**Their default posture.** Ask directly: *when a form asks something we haven't covered, do you want me to lean toward yes and keep you in the running, or be conservative and skip?* Most people want the former for preference questions and the latter for anything factual — but let them say so rather than assuming.

**Which resume file.** If several are uploaded to LinkedIn, ask which to use, or agree on a rule such as "always the most recent upload."

**Pace and volume.** How many applications per session, and whether to stop at some number. Default to a ten-second gap between applications; it's unhurried enough to look like a person working through a list.

### Write the profile

Fill in `assets/profile-template.md` and save it as `applicant-profile.md` in the working folder. Tell the person where it lives and that editing it directly is fine and expected — pay expectations and certifications change, and a file they can open beats an interview they have to repeat.

---

## Phase 2: Agree

Before the first application, show two things and wait for a yes.

**The answer sheet** — a compact summary of how the repetitive questions will be answered. Years of experience, pay figure and unit, notice period, work authorization, licences, and the default for uncovered questions. This is the last cheap moment to catch an error; a wrong pay figure discovered after sixty applications can't be taken back.

**The filter rules** — in plain language, what gets applied to and what gets skipped. Restate them concretely enough that the person can spot a bad rule: *"I'll apply to registered nurse and charge nurse roles within 40 miles of Tucson, day or evening shift, skipping travel-nurse agencies and anything requiring a specialty cert you don't hold. I'll skip listings that send you to an external site."*

Once they agree, run without pausing per application. Interrupting sixty times defeats the purpose; the approval gate is here, at the plan.

---

## Phase 3: Apply

### Get to the list

Load the Chrome tools via ToolSearch if deferred (`tabs_context_mcp`, `navigate`, `javascript_tool`, `computer`, `find`), then get a tab with `tabs_context_mcp({createIfEmpty: true})`.

Navigate to wherever the person wants to apply from — their recommendations at `linkedin.com/jobs/collections/recommended/`, a saved search, or a search URL built from their criteria. If they haven't said, recommendations is the sensible default, and a keyword search usually beats it for anyone whose target role differs from what they've done before, since recommendations are anchored to profile history.

### For each listing

**Check the filter first, the apply button second.** It's tempting to apply to anything with an Easy Apply badge and let the filter be a tiebreaker, but that produces applications the person didn't want and has to explain later. Open the listing, read the company and the description, and check it against the agreed rules. Skip listings that only offer a plain "Apply" button that hands off to an external site — out of scope for this loop, though worth noting in the report if several good matches were lost that way.

When a listing is genuinely ambiguous against the rules, skip it and note it as a borderline call in the report. A missed application costs one listing; a wrong one costs credibility with an employer.

**Fill the form.** Open the modal and read it with JavaScript rather than screenshotting every field — it's a plain HTML form underneath, and reading it directly is faster and more reliable than looking at pictures of it. `references/linkedin-mechanics.md` has the helper functions, the native-setter pattern for text and dropdown fields, and the specific spots where JavaScript clicks silently fail and a real screenshot-and-click is needed instead.

**Answer questions by their type, not by keyword.** This is the part that generalizes across fields, and `references/screening-questions.md` covers it in depth. The short version:

- *Factual claims* — licences, certifications, degrees, clearances, authorization, years at a named employer. Answer only from the profile. Never infer, never round up. If the profile is silent, skip the listing and flag it, since this is exactly the class of question where a convenient guess becomes a misrepresentation.
- *Preference and willingness* — commuting, relocation, shifts, travel, background checks. Answer from the stated preferences; fall back to their default posture.
- *Fuzzy self-assessment* — "years of experience with X," proficiency scales, "how would you describe your experience." Use their headline experience number for skills central to their work, a lower honest figure for adjacent ones, and the middle option on tiered scales rather than the most expert-sounding one.
- *Free-text* — "why do you want this role." Write two or three specific sentences drawn from the profile and the actual listing. Generic filler reads worse than nothing.

**Verify before submitting.** On the review step, read the summary back and confirm the resume is the intended file, the pay figure is in the unit the form asked for, and the answers reflect what was agreed. Then submit and confirm it registered — LinkedIn shows "Application sent" and the card flips to "Applied."

**Pace.** Wait the agreed gap (ten seconds by default) before the next listing.

### When the list runs dry

Paginate before concluding there's nothing left. If the whole list is genuinely exhausted, that's a useful signal in itself — the search is too narrow, or the person has already applied to everything matching. Say so in the report and suggest a widened search rather than silently finishing early.

### Stop the run and report if

- **LinkedIn's daily Easy Apply limit appears.** It's a real cap, not a rate-limit to route around. Stop for the day; offer to schedule a resume run.
- **A CAPTCHA or identity challenge appears.** Stop, don't attempt it.
- **A login prompt appears.** The session expired. Stop; never enter credentials.
- **The same form step fails twice in a row.** Something has changed in the page structure. Report it rather than burning attempts.

---

## Phase 4: Report

Close with something that's actually useful to read, not a log dump:

- **Applied** — company, role, and location for each
- **Skipped** — grouped by reason, with counts: external-apply-only, filtered out, missing a required credential, already applied
- **Stopped because** — limit hit, list exhausted, challenge encountered
- **Worth knowing** — patterns the person would want flagged: a credential that keeps gating good listings, a salary band that keeps falling short, a filter that's excluding more than expected

That last section is where this stops being data entry. Someone whose applications keep dying on a certification question has learned something worth more than the applications.

---

## Recurring runs

When someone wants this to continue past the daily cap or run every morning, set up a scheduled task (via the scheduled-tasks tool or the `schedule` skill). A recurring run needs the profile path, the search or list to work from, the filter rules in writing, and the same hard rules carried over verbatim — never enter credentials, stop on a CAPTCHA, stop on the daily limit.

Scheduled runs happen with nobody watching, which raises the cost of a wrong filter. Restate the filter rules in the task itself rather than relying on the profile alone, so a future run can't drift.

---

## Reference files

- `references/screening-questions.md` — the question taxonomy in depth, with worked examples across healthcare, trades, transport, legal, finance, education, and tech
- `references/linkedin-mechanics.md` — modal helpers, the native-setter pattern, resume picking, and the specific DOM quirks worth knowing
- `assets/profile-template.md` — the profile file to fill in during the interview
