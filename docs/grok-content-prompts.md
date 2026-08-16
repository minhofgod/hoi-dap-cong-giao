# Grok content prompts — draft offline, Claude verifies

Use these to have **Grok Pro** draft content when Claude credits are tight. **Grok output is always a
DRAFT.** Grok has no repo access and *will* invent citations, occasionally miss Vietnamese Catholic
terms, and can be doctrinally/tonally imprecise. Workflow:

1. Paste the relevant prompt below into Grok, fill in the **[TOPIC]/[SAINT]**.
2. Grok returns `.md` files (with frontmatter) — save them under a scratch folder.
3. Hand them to **Claude** next session → Claude runs the **verification pass** (bottom of this doc)
   → fixes terms/citations/tone/schema → only then does it ship.

**Use Grok for research-heavy content** — saints' life stories, science/history Q&As with citations,
miracles. **Do NOT use Grok for the pastoral tree pieces** (grief, "were they saved," persecution) —
those are tone/doctrine-critical and stay hand-drafted.

**Non-negotiable rule Grok must follow:** never present an unverified fact or citation as certain. Mark
anything it isn't sure of with **`[cần kiểm chứng]`** (needs verification) so the human pass catches it.

---

## Shared standards (paste into every Grok prompt)

> **Voice & language:** Write in natural **Vietnamese Catholic** prose — NOT translated-from-English
> Vietnamese. Use the **traditional phonetic Catholic forms** for proper names, not scholarly Latin or
> Vietnamese-Wikipedia forms. Known-correct forms to use: councils — *Nicêa, Constantinôpôli, Êphêsô,
> Chalcêđônia, Latêranô, Lyon, Vienne, Constance, Florentinô, **Trentô** (Council of Trent — on first
> mention in a page write "Trentô (Triđentinô)", plain "Trentô" after), Vaticanô I/II*; "công đồng
> chung" = ecumenical council; saints/figures — *Inhaxiô, Augustinô/Âutinh, Giustinô, Athanasiô,
> Máctinô, Phaolô, Phêrô, Gioan Kim Khẩu*. **If you are unsure of a Vietnamese name/term, write your
> best guess + `[cần kiểm chứng]`** — do not invent a confident transliteration.
> **Quotes:** use curly double quotes `" "`, never guillemets `« »`.
> **Scripture references:** Vietnamese book abbreviations + comma, e.g. `Ga 11,35` · `Mt 5,3-6` · `Rm
> 5,8`. Catechism = `GLHTCG 847`. Reference only — do NOT paste full Bible verse text (licensing).
> **Doctrine:** align with the Catholic Catechism. When you're not certain a claim is Church teaching,
> write "Hội Thánh dạy…" and flag it `[cần kiểm chứng]`. Never state a contested opinion as doctrine.
> **Citations (science/history):** put external sources in a `sources` list (see schema). Every citation
> Grok is not 100% sure is real + accurately quoted → append `[cần kiểm chứng]`. Better to flag than to
> fabricate a plausible-looking reference.

---

## Prompt A — Giải Đáp Q&A cluster

> [PASTE SHARED STANDARDS ABOVE]
>
> Write **[N]** Vietnamese Catholic apologetics Q&A entries on **[TOPIC]** for the "Giải Đáp" section.
> Output **one markdown file per question**, each with this frontmatter, then the answer body below the
> `---`:
>
> ```yaml
> ---
> topic: "[the cluster name, e.g. Bằng chứng Chúa sống lại]"
> category: "[pick ONE: science-faith | evidence-history | god-meaning | theology-doctrine | the-church | mary-saints | scripture | morality-life | other-religions]"
> tags: ["[from: mary, papacy, eucharist, trinity, jesus, resurrection, saints, faith, works, grace, salvation, bible, confession, prayer, suffering, marriage, evangelization, science, evolution, miracles, church-history, authority, icons, purgatory, baptism, atheism, protestant-objections, free-will, sacraments, sin, afterlife, consolation, persecution]"]
> question_vi: "[the question in Vietnamese]"
> question_en: "[optional English]"
> featured: false          # true only for the cluster's anchor question
> sources:                 # ONLY for science/history claims; omit if none
>   - label: "[full citation]"
>     url: "[stable link, optional]"
> ---
> [Answer in Vietnamese — apologetics register: clear, charitable, cites Scripture (Ga/Mt/…) and GLHTCG
>  where relevant. If it addresses an objection, state the objection fairly then answer it.]
> ```
>
> Use only tags from the list. One `category` per file. Mark any uncertain citation/fact `[cần kiểm chứng]`.

---

## Prompt B — Saint life story (Các Thánh)

**Revised 2026-08-15** after the first Grok run (Thérèse): it produced an excellent story but a
**confidently-wrong, unflagged** date error (placed her 1883 Marian healing at age 11 after First
Communion + wrong feast). Fixes below: hammer on **dates/sequence flagging**, and require a **FACTS
block** so dates are laid out separately and cross-check fast. Also: many saints **already exist** as
JSON entries (Session 9) — the story *enriches* the existing entry, so Grok should NOT invent a slug/schema.

> Write a narrative life STORY of a Catholic saint, in VIETNAMESE, for the "Các Thánh" section of a
> bilingual Vietnamese Catholic site. Write the story of: **[SAINT]**
>
> **VOICE:** natural Vietnamese Catholic prose (not translated-English). Traditional phonetic Catholic
> name forms (Nicêa, Trentô, Inhaxiô, Augustinô, Phaolô, Cát Minh = Carmel; popes as Đức Piô XI, Đức
> Gioan Phaolô II…). Unsure of a name/term → best guess + `[cần kiểm chứng]`. Curly quotes `" "`.
> Scripture refs `Ga 11,35`, Catechism `GLHTCG 847` — reference only, never paste verse text.
>
> **FACTS = THE #1 ERROR RISK:** dates, ages, and the ORDER of events are where you'll most likely be
> wrong. Double-check them; flag ANY date/age/sequence/feast-day you're not 100% sure of with
> `[cần kiểm chứng]` — even confident-seeming ones. Don't guess which feast or exact age.
> Doctrine per the Catechism; unsure → "Hội Thánh dạy…" + flag.
>
> **TONE:** devotional — the STORY is the point: narrative, chronological, vivid, longer is good, NOT a
> bullet summary. Suffering/martyrdom = witness + reliance on God, never grim spectacle or "so should you."
>
> **OUTPUT (do NOT invent a slug or db fields — the maintainer integrates):**
> 1. NAME `{ vi, en }`
> 2. THE STORY (VN): 2–3 sentence header + full narrative; weave in Scripture/GLHTCG; end on legacy +
>    why they still speak (a real Vietnamese connection if there is one).
> 3. FACTS BLOCK (label each; flag uncertain): Born (date+place) · Died (date+place+age) · Key milestones
>    each with date · Beatified/Canonized dates + which pope · Doctor/patronages if any · quotes used.
> 4. IMAGE: one PD Wikimedia Commons portrait — exact filename + source URL, `[cần kiểm chứng]` for license.
>
> Your output is a DRAFT a human verifies. Flag generously — a flagged uncertainty helps; a confident
> error harms.

---

## Verification pass — Claude does this on the returned files (do NOT skip)
1. **VN terminology** — every proper name/term vs the site + HĐGM VN (resolve every `[cần kiểm chứng]`);
   apply the Trentô rule.
2. **Citations** — every source in a science/history piece + every miracle/date in a saint story: real,
   accurately quoted, stable link only. Delete or fix anything that doesn't check out.
3. **Doctrine** — align with the Catechism; soften/flag anything imprecise.
4. **Tone** — pastoral rule where suffering/martyrdom appears (companionship, not "so should you").
5. **Schema** — valid frontmatter; `category` is one of the 9; tags are from the vocab; run
   `node scripts/check-tags.mjs` clean.
6. **Quotes** curly, scripture refs formatted, no pasted CGKPV verse text.
7. **Images** — PD license confirmed on Wikimedia; copy into `Catholic Images/` + a CREDITS.csv row.
