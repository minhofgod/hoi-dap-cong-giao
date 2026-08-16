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

> [PASTE SHARED STANDARDS ABOVE]
>
> Write a **narrative life STORY** of **[SAINT]** for the "Các Thánh" section — this is the *devotional*
> lens, so the **story is the point**: longer, narrative, moving. NOT a bullet summary. Output one
> markdown file:
>
> ```yaml
> ---
> slug: "[ascii-kebab, e.g. carlo-acutis]"
> name: { vi: "[VN name — verify, flag if unsure]", en: "[English name]" }
> dates: "[e.g. 1991–2006]"
> patronage: { vi: "[bổn mạng của…]", en: "[patron of…]" }
> group: "[martyrs-vn | modern | converts | bridge | patrons]"
> ---
> [SHORT HEADER: 2–3 sentences — who they are, when, what they're known/patron for.]
>
> [FULL LIFE STORY in Vietnamese — narrative, chronological, vivid. Where suffering/martyrdom appears,
>  frame it as witness and reliance on God, never grim spectacle. Weave in Scripture/GLHTCG refs where
>  natural. End on their legacy / why they still speak to us.]
> ---
> IMAGE: suggest ONE public-domain portrait (Wikimedia Commons) + its filename + source URL, for the
> Catholic Images library. Mark [cần kiểm chứng] — Claude confirms the license.
> ```
>
> Verify facts (dates, places, the cause/miracle for canonization). Flag anything uncertain `[cần kiểm chứng]`.

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
