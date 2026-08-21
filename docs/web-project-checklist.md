# Web project checklist — lessons worth carrying to the next site

Distilled from building Hỏi Đáp Công Giáo. **Portable** — copy this into any new web project. Each item
is here because it actually cost us something, not because it's conventional wisdom.

---

## 1. Decide your browser baseline on DAY ONE ⭐ (the expensive lesson)

**What happened.** The site shipped with **no `browserslist`**, so it used the framework's default
target. That default emitted a **class static block** (`static { … }`, ES2022) inside Next.js's own App
Router code. Class static blocks require **Safari 16.4+**. On an iPad Pro running iPadOS 16.2, that
chunk threw a **SyntaxError at parse time** → the chunk never loaded → **React never hydrated** → every
button on every page was dead, site-wide, silently.

**Why it was expensive:** the site *looked* perfect. Server-rendered HTML and `<a>` links worked fine.
Only JS-driven controls failed — so it presented as "a few buttons are broken" rather than "no
JavaScript is running." We chased CSS, sticky positioning, overlays, and layout for a long time.

**The fix:** one line — `"browserslist": ["defaults", "safari >= 15"]` in `package.json`.

**Carry forward:**
- [ ] Set an explicit `browserslist` **at project setup**, before writing features. Treat "which
      browsers do we support?" as a product decision, not a framework default.
- [ ] Base it on your actual audience. Ours: Vietnamese Catholics, many on older or hand-me-down
      iPhones/iPads, some on patchy connections — a modern-only default was plainly wrong for them.
- [ ] After deploying, **verify the built output**, don't trust the config. Fetch the deployed JS
      chunks and grep for syntax above your baseline. Frameworks ship *precompiled* chunks that a
      browserslist may not reach — that has to be checked, not assumed.

**Syntax/API cutoffs that bite Safari specifically** (verify current values on caniuse — these move):
class static blocks & RegExp lookbehind (~16.4) · `.at()`, `structuredClone`, `:has()` (~15.4) ·
`toSorted`/`toReversed`/`with` (~16.4) · `Object.groupBy`, `Promise.withResolvers` (~17.4).

---

## 2. The debugging heuristic that would have saved hours

**If links work but buttons don't → JavaScript isn't running. Stop looking at CSS.**

Server-rendered HTML and `<a>` navigation work with JS completely disabled. Anything needing an
`onClick` does not. So the very first diagnostic on "the UI doesn't respond" is:

- [ ] Tap a plain link → works?
- [ ] Tap a button on an *unrelated* page (a filter chip, a toggle) → works?

If links work and **every** button fails, it's one root cause (bundle didn't parse / hydration threw),
not several component bugs. **Get this data point before forming theories.** We built several elaborate
CSS hypotheses that were all in the wrong category because we hadn't established this first.

Corollary: **on iOS/iPadOS every browser is WebKit.** Chrome and Firefox there are Safari in a
different shell — so "try another browser" proves nothing, and updating the *app* never updates the
*engine*. Only the OS version matters.

---

## 3. A feature isn't done until someone can reach it

We repeatedly shipped finished, deployed sections with **no link anywhere** — no homepage card, no nav
item, no footer link. One section sat complete and unreachable for days. A finished thing nobody can
find is the most expensive kind of unfinished work.

- [ ] "Done" includes its **entry point**. Ship the link in the same breath as the feature, or track it
      as explicitly unfinished.
- [ ] Decide early **who owns global nav/homepage** so feature work doesn't silently skip it.
- [ ] Watch nav capacity *before* it's exceeded — plan the grouping/dropdown shape when you're at 5
      sections, not when the 8th won't fit.

---

## 4. Test on real devices before launch, not after

Emulators lie by omission. Ours couldn't reproduce **wide viewport + touch** (tablet landscape) at all —
touch emulation only engaged below a phone-width breakpoint — which is exactly where the bug lived.

- [ ] Test on a **real phone and a real tablet** before pointing a domain at the site.
- [ ] Include at least one device that is **not** current — an older phone or tablet you already own.
- [ ] Check the things emulators skip: tap targets, sticky/fixed behavior, tablet landscape.

---

## 5. Small platform gotchas worth pre-empting

- [ ] **Favicon:** ship a `favicon.ico`/PNG *alongside* any SVG. Search engines are inconsistent about
      SVG-only favicons, and they refresh their cached icon on their own schedule — days to weeks.
- [ ] **Storage always in `try/catch`.** `localStorage`/`sessionStorage` **throw** when cookies are
      blocked or in some private modes. An unguarded call during render kills the component tree.
- [ ] **Honest empty states** beat broken ones. A missing image should degrade to a designed
      placeholder, never a broken-image icon. Same for "coming soon" links — render them
      non-clickable rather than as dead links.
- [ ] **Design tokens for scale-dependent detail.** Our logo's cross cut-out has to *widen* as the mark
      shrinks, and disappear entirely below ~20px. Write those rules down with the asset; they're
      invisible until someone uses the wrong variant as a favicon.

---

## 6. Process lessons (the ones that scaled best)

- [ ] **Write decisions down in the repo, not in chat.** Every convention, spec, and hand-off lives in
      `docs/`. That's what let a long-running assistant session be replaced by a fresh one with no loss.
- [ ] **Hand off with pointers, not pasted walls of text** — "read `docs/X.md`, do your row." Detail
      stays in one place, so later edits reach everyone.
- [ ] **Verify hard facts against primary sources; flag uncertainty rather than guessing.** A flagged
      "I'm not sure" is worth more than a confident wrong answer — especially anywhere the site's
      credibility is the product.
- [ ] **Correct the record when a theory dies.** We nearly filed this bug as "old device, won't fix,"
      which was false and would have misled the next person. A wrong note is worse than no note.
- [ ] **Automate the one silent failure mode.** Content that's invisible because it's untagged, a
      citation that's missing — a tiny check script beats remembering. Skip the guards for failures
      that are loud and obvious.
