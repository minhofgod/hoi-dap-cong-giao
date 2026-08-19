# Tổng luận Thần học — "The Summa, Explained" (section spec)

Commissioned 2026-08-19. A 37-chapter guided walk through St Thomas Aquinas's *Summa Theologiae*,
sourced from `D:\Dropbox\Obsidian Vault\Summa of the Summa\`.

**Route:** `/tong-luan` (free — no collision).
**Name — LOCKED:** VI **Tổng luận Thần học** · EN **The Summa, Explained**.

> **Why not "Summa of the Summa".** That is the title of **Peter Kreeft's** book (Ignatius Press,
> 1990). Titles are not copyrightable, so using it would be legal — but on a site whose value is being
> trustworthy and well-sourced, borrowing a well-known author's distinctive title for *different*
> content invites "is this a knock-off?" The material itself is **original exposition of Aquinas**, not
> derived from Kreeft, and the name should say so. Keep the vault folder name if you like; the public
> label is the one that matters.

---

## ⚠️ The defining constraint: this content is AI-GENERATED and therefore UNVERIFIED

The owner confirmed (2026-08-19) the text came from Grok/ChatGPT. Under `CLAUDE.md` → "Verify facts
before they ship", **all 37 chapters are drafts until web-checked.** This is the largest single block of
unverified content the project has taken on, and it is *theology on an apologetics site* — the exact
place where a confident, fluent, wrong sentence does the most damage.

**Therefore the build order is inverted from every other section: VERIFY FIRST, BUILD SECOND.**
Do not construct the section around content that may not survive review.

### Why this material is unusually checkable — use it

**Every chapter cites its Summa location** (e.g. *"Tổng luận thần học, Phần I, Câu hỏi 2"* for the Five
Ways — which is correct: ST I, q.2, a.3). That makes verification **mechanical rather than
impressionistic**: a citation either resolves to that question in the actual Summa, or it doesn't.

**Primary sources (in order):**
1. The Summa itself — Latin at `corpusthomisticum.org`; the Dominican Fathers English translation
   (public domain) at `newadvent.org/summa`.
2. The Catechism (for doctrinal cross-check) and magisterial documents.
3. Serious Thomist scholarship. **Wikipedia and any LLM = pointers only, never the final word.**

### What to check, per chapter

1. **The Summa citation resolves** — does Phần/Câu hỏi actually contain what the chapter says it does?
2. **Aquinas actually held this.** The characteristic LLM failure here is not invention but
   **flattening** — collapsing a distinction Aquinas draws, or stating a later Scholastic position as
   his. Check the argument against the actual article.
3. **The Five Ways get extra scrutiny.** They are the most-summarised and most-garbled passage in all
   of Aquinas. Verify each of the five against ST I q.2 a.3 individually — especially the Third Way,
   whose usual popular summary ("if everything were merely possible, at some time there would have
   been nothing") is a genuinely contested rendering. Flag contested readings rather than asserting one.
4. **Hard facts** — dates (1225–1274), titles (*Doctor Angelicus*, *Doctor Communis*), Dominican
   order, canonisation, the *exitus/reditus* structure claim.
5. **Latin terms** spelled and used correctly (*Quinque viae*, *Prima Pars*, *Prima Secundae*,
   *Secunda Secundae*, *Tertia Pars*, *Quaestio*, *objectiones*, *Sed contra*, *Respondeo*).
6. ~~**Vietnamese terminology.**~~ **OUT OF SCOPE — the owner read all 37 chapters himself
   (2026-08-19) and vouches for the Vietnamese terminology and register.** He is a native Vietnamese
   Catholic reader; this is precisely the axis he *can* judge, and re-checking it would spend effort
   where the tool adds nothing. **Do not re-audit word choice.**

   **But keep the distinction:** *is this the right Vietnamese word* (owner's call, done) is a different
   question from *is this the right Thomistic concept* (still yours). If a chapter uses **Ngôi hiệp**
   correctly as Vietnamese but applies it to the wrong thing, that is a **doctrinal** error under
   item 2, not a terminology one — still report it.
7. **Scripture quotations must match CGKPV** (the intro already quotes `1 Cr 3,1-2`). **Keep this even
   though terminology is out of scope** — it is not a word-choice question but a verbatim-text one, and
   an AI-generated text quoting Vietnamese Scripture from memory is a live risk. Note also that
   **CGKPV versification differs from English/Protestant numbering** near some OT chapter breaks and in
   the Psalms — see `docs/session-4-script-wikilink.md` → "CGKPV versification". Open the CGKPV chapter
   file and read the verse; never trust a remembered reference.

### Verdicts + the anti-rubber-stamp guard

Same vocabulary as `docs/fact-verification-audit-spec.md`: `confirmed` · `corrected` · `contested` ·
`unverifiable`. **A report that clears all 37 chapters with no flags should be treated as suspect and
re-run** — 37 chapters of LLM theology with zero issues is not a plausible result. Every non-`confirmed`
row carries its source URLs.

**Pilot first:** verify the intro + the 10 chapters of Phần I, report, and let the owner judge the
quality of the underlying text **before** committing to the remaining 26. If the pilot finds the
material substantially unreliable, the honest options are to rewrite it by hand or drop the section —
both better than publishing 37 polished-but-unchecked chapters.

---

## Content shape (already in good order)

37 files, already numbered and grouped into the Summa's four parts. **The vault stays the authoring
source; the repo gets the published copy** — the Video Scripts pattern. One canonical published
location, so the two copies can't drift.

```
content/tong-luan/
  00-mo-dau.md            intro — who Aquinas is, how to read the Summa
  phan-i/                 10 chapters — God + creation
  phan-i-ii/               5 chapters — general morality
  phan-ii-ii/              8 chapters — the particular virtues
  phan-iii/               12 chapters — Christ + the sacraments
  99-ket-luan.md          conclusion
```

Each chapter is ~380–750 words. Frontmatter to add (the vault files are bare markdown with an H1):

```yaml
---
title_vi: "Sự hiện hữu của Thiên Chúa – Năm con đường"
title_en: "The existence of God — the Five Ways"
part: "phan-i"            # phan-i · phan-i-ii · phan-ii-ii · phan-iii
order: 1                   # within the part
summa_ref: "I, q.2"        # the Summa location this chapter expounds
refs_ccc: [31, 34]         # Catechism paragraphs, where they apply
refs_scripture: ["1 Cr 3,1-2"]
sources: [{ label, url }]  # added BY the verification pass
---
```

`sources` is populated by the verifier, not the author — that's what makes the citations real.

## Page structure — reuse the reader NAVIGATION, not the Catechism data model

This is a **linear reader with hierarchy** (parts → chapters, read in order), so the closest model is
`/giao-ly`: part grouping, prev/next, a sidebar table of contents.

**But do NOT reuse the Catechism's data layer** — that is built around paragraph numbers and a ~3.2MB
`content.json`. This is 37 short markdown files. Use the `content/giai-dap` loader shape (one `.md` +
frontmatter per item) with a part grouping on top. Small new model, familiar navigation.

- `/tong-luan` — index: the four parts, each listing its chapters, plus the intro/conclusion.
- `/tong-luan/[slug]` — one chapter, with prev/next across the whole sequence and a sidebar TOC.
- **Bodies MUST render through `ScriptureBody` + `enrichBody`** (`CLAUDE.md`) — the text already quotes
  Scripture and will cite the Catechism; those refs must open the popover, never a bare
  `dangerouslySetInnerHTML`.
- Bilingual VI/EN via `<T>` like the rest of the site. **Note:** the chapter bodies are Vietnamese-only,
  same as Giải Đáp — see `docs/roadmap.md` → "English Q&A bodies" for that standing gap.
- Session 8 owns the homepage card, nav item, footer link, **and the sitemap routes** — one combined
  hand-off, gated on the section's flag.
- **Gate the whole section behind `NEXT_PUBLIC_TONG_LUAN`** (Canvas shape, default off) so it can be
  built and previewed locally while verification is still running. `main` is production; there is no
  staging.

## Hand-off

| # | Session | Task |
|---|---|---|
| 1 | **14** (new) | **Pass 1 — VERIFY.** Pilot: intro + Phần I (11 files). Report to `docs/tong-luan-verification.md`. Change no content. |
| 2 | owner | Judge the pilot. Continue, rewrite, or drop. |
| 3 | **14** | Verify the remaining 26; apply approved corrections; add `sources`. |
| 4 | **14** | Build `/tong-luan` + the loader, flag-gated. Owns `app/tong-luan`, `lib/tongLuan*`, `content/tong-luan`. |
| 5 | **8** | Homepage card · nav · footer · sitemap routes — all flag-gated. |
| 6 | owner | Proofread (the tracker gets 37 new rows), then set the flag on Vercel. |

**Sequencing: 1 → 2 → 3 → 4 → 5 → 6.** Verification gates the build, not the other way round.
