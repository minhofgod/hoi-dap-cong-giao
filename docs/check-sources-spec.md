# check-sources.mjs — content citation guard (DEFERRED)

> **Status: PARKED (decided 2026-08-15).** Not worth building yet — only ~6 Q&As carry `sources`, small
> enough to eyeball; Tier-1 failures are cosmetic (and `toSources()` already drops junk), and Tier-2's
> heuristic nudge only pays off at scale. The real risk (fake/inaccurate citations) is a human
> fact-check the script can't do anyway.
>
> **Build it when** the science/history clusters outgrow eyeballing — roughly **15–20+ sourced Q&As** —
> so the Tier-2 "you forgot sources" nudge earns its keep. Until then, the content-guide's manual step
> **4b** (fact-check + add `sources`) + owner review covers it.
>
> **Dependency (already met):** `lib/giaiDap.ts` has `GiaiDapSource` + `toSources()` + `sources` on the
> type (Session 2 shipped the field); content-guide has the step-4b `sources` requirement.

## The spec (ready to build when un-parked)

**Add `scripts/check-sources.mjs`** (sibling to `scripts/check-tags.mjs`). Read-only, no network, fast.
Lane: `scripts/` + `package.json` wiring. Don't touch content bodies.

**Why.** Content-guide step 4b requires science/history Q&As to carry a verified `sources:` block
(`{label, url?}`, rendered as "Nguồn tham khảo"). This check enforces the parts a machine CAN enforce.
It does NOT verify a citation is real/accurate — that stays human; the script checks presence, shape,
and surfaces likely-missing ones.

**Tier 1 — HARD (exit 1): validate every `sources` present, in all `content/giai-dap/*.md`**
- `sources` (if present) must be an array; reject `sources: []` (omit it instead).
- Each entry: a non-empty string (label-only) OR an object with a non-empty string `label`.
- If an object has `url`, it must be a well-formed absolute http(s) URL (`new URL()` parses; protocol
  http/https). Reject typo'd links, protocol-relative, mailto, etc.
- Reuse the loader's shape from `lib/giaiDap.ts` (`GiaiDapSource {label, url?}`) so check and renderer agree.

**Tier 2 — SOFT (advisory; exit 0 by default, exit 1 only under `--strict`): likely-missing sources**
- Scope: Q&As with category `science-faith` or `evidence-history`, OR tagged `science`.
- Signal (conservative, tunable — keep the regex set small + documented at the top; better to miss than
  false-fire): names of external works (`/\b(JAMA|PNAS|Nature|Codex|Annals|Antiquities|Testimonium|arXiv)\b/`);
  a study with a year (`/nghiên cứu[^.\n]{0,40}\b(19|20)\d{2}\b/i`).
- If a scoped Q&A has NO `sources` but its body matches the signal, print a WARNING listing the file.
  Never hard-blocks by default.
- OPT-OUT: frontmatter `sources_exempt: true` silences the Tier-2 warning for a piece a human reviewed
  and judged claim-free (overview anchors, purely theological members). Tier 1 still applies.

**Output.** Mirror `check-tags.mjs`: on success "check-sources: ✓ …"; on Tier-1 failure list file +
reason, exit 1; Tier-2 warnings print but don't fail unless `--strict`.

**Wiring.** Add a `check-sources` npm script; fold into whatever runs `check-tags` (e.g. a `check`
script: `node scripts/check-tags.mjs && node scripts/check-sources.mjs`). Optional pre-commit hook.
CI/pre-commit can call `--strict` once existing content is exempt-annotated.
⚠️ **Ordering:** the `check` npm script is being created by the `check:tags` wiring task
(`task_83d875f3`) — land this AFTER that, or coordinate, so both don't edit `package.json`'s check
script at once.

**Non-goals (state in a header comment):** does NOT verify a citation is real/accurate (human, 4b);
does NOT force sources onto every science-tagged Q&A (Tier 2 is advisory + opt-out, not a hard gate).

**Verify.** `npx tsc --noEmit` (if TS) + `npm run lint` clean; run `node scripts/check-sources.mjs`
against current content: Tier 1 passes (the sourced files are well-formed), Tier 2 warns only for
genuinely un-sourced science pieces.

## Hand-off (when un-parked)
| Session | Task |
|---|---|
| **2** (scripts/framework) | Build `scripts/check-sources.mjs` per above + package.json wiring (after `task_83d875f3`). |
| **Content session** | Review Tier-2 warnings; add verified `sources` or set `sources_exempt: true` on reviewed claim-free pieces, so a future `--strict`/CI run is green. |
