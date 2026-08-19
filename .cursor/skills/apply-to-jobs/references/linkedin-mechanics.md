# LinkedIn Easy Apply mechanics

Contents:

- [Read the form, don't photograph it](#read-the-form-dont-photograph-it)
- [Finding the modal](#finding-the-modal)
- [The describe helper](#the-describe-helper)
- [Filling fields](#filling-fields)
- [Radios and the verification rule](#radios-and-the-verification-rule)
- [Picking the resume](#picking-the-resume)
- [Stepping through pages](#stepping-through-pages)
- [Confirming submission](#confirming-submission)
- [Working the job list](#working-the-job-list)
- [Failure signatures](#failure-signatures)

## Read the form, don't photograph it

Easy Apply is a plain HTML form inside a modal. Screenshotting each step and reading fields off an image is slow, costs a lot of context, and misreads values that are visually truncated. Reading the DOM with `javascript_tool` returns every label, current value, and available button in one call.

Screenshots still earn their place in two spots — verifying a radio actually flipped, and picking a resume — because both involve rendered state that the DOM can misreport. Everywhere else, read the form.

## Finding the modal

The modal's markup has changed over time, so anchoring on a single selector is fragile. `document.querySelector('dialog')` works on some builds and returns `null` on others where the modal is a `div` with `role="dialog"` or an `.artdeco-modal`. Try all three:

```js
window.getModal = function() {
  return document.querySelector('.jobs-easy-apply-modal, [role="dialog"], .artdeco-modal');
};
```

If this returns `null` right after clicking Easy Apply, the modal probably hasn't rendered yet rather than being absent — wait a beat and try again before concluding something is wrong. A screenshot settles it quickly.

## The describe helper

Define once per page load; it survives until navigation. Call it immediately after opening the modal and again after every Next click, so each step's fields, labels, values, and buttons arrive in a single response.

```js
window.describeEasyApply = function() {
  const modal = window.getModal();
  if (!modal) return {error: 'no dialog found'};
  const out = {heading: modal.querySelector('h2')?.innerText, progress: null, fields: [], buttons: []};
  const progressText = modal.innerText.match(/\d+\/\d+ pages?/);
  if (progressText) out.progress = progressText[0];
  modal.querySelectorAll('input, textarea, select').forEach(el => {
    if (el.type === 'hidden') return;
    let label = '';
    if (el.id) { const lbl = modal.querySelector(`label[for="${el.id}"]`); if (lbl) label = lbl.innerText.trim(); }
    const numOptions = el.tagName === 'SELECT' ? el.options.length : 0;
    out.fields.push({tag: el.tagName, type: el.type||'', id: el.id, label, value: el.value, checked: el.checked,
      numOptions: el.tagName==='SELECT'?numOptions:undefined,
      options: (el.tagName==='SELECT'&&numOptions<=15)?[...el.options].map(o=>o.text):undefined});
  });
  modal.querySelectorAll('button').forEach(b => { const t=b.innerText.trim(); if(t) out.buttons.push(t); });
  return out;
};
```

The `buttons` array tells you where you are without needing a progress indicator. `["Next"]` means an early step, `["Back","Review"]` means the last question page, `["Edit","Edit","View","Back","Submit application"]` means the review page. Some listings are a single page and show `["Submit application"]` immediately — no Next at all.

## Filling fields

**Text inputs.** Assigning `.value` directly is invisible to the page's JavaScript framework, so the form keeps its old state and either submits the wrong value or refuses to advance. Go through the native setter and fire the events the framework listens for:

```js
const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
setter.call(el, '5');
el.dispatchEvent(new Event('input', {bubbles:true}));
el.dispatchEvent(new Event('change', {bubbles:true}));
```

**Native `<select>` dropdowns.** Clicking them rarely opens LinkedIn's styled list reliably. Set the value the same way, matching on option text:

```js
function setSelect(sel, text) {
  const opt = [...sel.options].find(o => o.text === text);
  if (!opt) return false;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
  setter.call(sel, opt.value);
  sel.dispatchEvent(new Event('input', {bubbles:true}));
  sel.dispatchEvent(new Event('change', {bubbles:true}));
  return true;
}
```

Batching helps on question-heavy pages — one call that fills every numeric field, sets every dropdown, and selects every radio, then re-runs `describeEasyApply()` to show the result, is far faster than one call per field and makes verification a single read.

## Radios and the verification rule

Yes/No questions are custom-styled radios backed by component state. A JavaScript `.click()` on them *sometimes* works and sometimes flips the DOM's `checked` attribute without the underlying state following — the form then quietly keeps the old answer, and the review page shows "No" after you thought you set "Yes."

Because it's unreliable rather than reliably broken, the rule isn't "never use JS clicks" — it's **always verify**. Click, then re-run `describeEasyApply()` and check `checked` on the option you intended. If it didn't take, screenshot and click the radio's real on-screen coordinate with the `computer` tool.

The review page is the second safety net: it prints every answer as text, so reading it catches anything that silently reverted.

## Picking the resume

The resume step lists uploaded files with an upload date under each. When several files share a name, the date is the only thing distinguishing them, and the pre-selected one isn't always the newest.

Read the fields first — labels come through as `"Select resume <filename>"` and `"Deselect resume <filename>"`, where *Deselect* marks the currently chosen file. If the right one is already selected, change nothing.

If it needs changing, take a screenshot rather than computing coordinates. `getBoundingClientRect()` has been observed returning values offset from where the element actually renders inside this modal, so click what you can see. Then confirm on the review page, which prints the filename and its "Last used on" date.

## Stepping through pages

Click the button whose text matches what `describeEasyApply()` returned, wait briefly, then re-describe:

```js
const modal = window.getModal();
[...modal.querySelectorAll('button')].find(b => b.innerText.trim() === 'Next').click();
await new Promise(r => setTimeout(r, 1200));
window.describeEasyApply();
```

On the review page, read `window.getModal().innerText` in full before submitting. It's long — slice it if it truncates — and it's the one place where every answer is visible as text at once. Check the resume filename and date, the pay figure and its unit, and that the Yes/No answers read as intended. Anything wrong gets fixed via the section's Edit button rather than submitted and regretted.

## Confirming submission

Three independent signals, in order of reliability:

1. The URL changes to a `.../post-apply/...` path
2. `document.body.innerText.match(/Application (sent|submitted)[^\n]*/g)` returns a match
3. The job card in the list flips from "Easy Apply" to "Applied"

The confirmation dialog has a **Done** button; click it to close before moving on. Occasionally the text match returns `null` while the URL has already changed — trust the URL and take a screenshot rather than re-submitting, since a duplicate submission is worse than a missing confirmation.

## Working the job list

The list panel is `.jobs-search-results-list, .scaffold-layout__list`. Reading its `innerText` gives every visible card's title, company, location, and badges in one call — enough to filter without clicking into each listing, though the company's actual business usually needs the description.

Cards frequently appear duplicated in the DOM; deduplicate on title plus company rather than trusting the node count.

Only a handful of cards render at a time. Paginate with the numbered page buttons at the bottom (`find` locates them reliably as "Page 2", "Page 3") rather than trying to scroll the whole list into existence.

Clicking a card changes `currentJobId` in the URL and swaps the right-hand panel. Read the panel with `get_page_text` after the click — occasionally it lags and returns the *previous* listing's description, which is a quiet way to filter on the wrong company. Confirm the panel matches the card you clicked, especially when the two are in different industries.

## Failure signatures

| What you see | What it means | What to do |
|---|---|---|
| Dialog text mentioning the Easy Apply limit | LinkedIn's daily cap | Stop for the day, offer a scheduled resume |
| `getModal()` returns null after clicking Easy Apply | Not yet rendered, or a changed selector | Wait and retry once, then screenshot |
| Next does nothing, no error | A required field is unfilled or a radio didn't take | Re-describe, look for empty values and unchecked radios |
| Review page shows an answer you didn't set | A radio silently reverted | Edit that section, click on-screen, verify |
| A login page or password prompt | Session expired | Stop, tell the person, never enter credentials |
| CAPTCHA or "verify it's you" | Bot check | Stop, don't attempt it |
| The same step fails twice running | Page structure changed | Stop and report rather than burning attempts |
