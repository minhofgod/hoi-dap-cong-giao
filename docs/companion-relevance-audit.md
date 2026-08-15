# Companion relevance-curation audit (Session 10)

**Status:** research/analysis only. This document emits **proposals**; it changes no runtime behaviour.
Applying approved items is handed to the owning lanes (see [Hand-off](#hand-off) at the end).

**Baseline audited:** commit `04fad3d` — the *corrected* tag-driven matcher (+2 per tag, +2 category,
featured +0.5, **≥1 tag overlap required to qualify**). Not the old +3 matcher. Verified against the
live pool on 2026-08-15.

**Pool at audit time:** 50 native Q&As + 21 council apologetics (1 per council) + 3 videos = **74 items**.

**Method.** I reproduced `matchResources` exactly against the real content frontmatter (a throwaway
Node harness that reads `content/giai-dap/*.md`, `content/cong-dong/*.json`, `content/video/*.md`,
builds the pool in the same order as `app/dong-hanh/page.tsx`, and runs the scoring verbatim). Every
"current output" table below is real matcher output, not a guess. Each candidate is then judged against
the situation's **intent** (its `lead` + `advice` prose), with the adversarial test: *would this reader
find this consoling / on-point, or would it read as a lecture?*

**Principle order (from the roadmap):** prefer **config/tag fixes** (scalable) over **pins** (manual).
Pins only where the algorithm structurally can't get there.

> **One structural gap surfaced up front:** the `Situation` interface has **no seed-pin field**. The
> roadmap's deliverable-1 language ("or explicit seed pins where curation is needed") assumes a
> mechanism that does not exist yet. Several high-value curations below (e.g. surfacing Nicaea II for
> the images path, the Good Thief for the suffering path) are **unreachable by category/tag tuning** and
> need a small Session-7 addition: an optional `seedPins?: string[]` on `Situation`, consulted by
> `matchResources` to force-rank specific keys (mirroring how `followUps` already honours `seed.pins`
> with `+100`). Proposed spec in [Appendix A](#appendix-a--proposed-seedpins-field). Where I mark a fix
> "**needs seedPins**," it is blocked on that field; everything else is pure data/config.

---

## Executive summary — the systemic findings

| # | Pattern | Where | Fix lane |
|---|---|---|---|
| F1 | **Two situations share identical config but have opposite intents** — `doubt-suffering` (intellectual "problem of evil", wants a *theodicy*) and `suffering` (personal pain, wants *consolation*) both carry `tags:['suffering']` and return the same 4 items, one of which is a free-will *lecture*. | `doubt-suffering`, `suffering` | 7 (config) + 3 (re-tag) |
| F2 | **The `authority` tag bleeds medieval papal-politics councils into `explore-jesus-church`** — an *explorer* who picked "Jesus and the Church he founded" is handed "Was deposing an emperor proof the Church is power-hungry?" (Lyon I) and "priestly celibacy — biblical or church law?" (Lateran II). Reads as a lecture; belongs only in `defend-church`. | `explore-jesus-church` | 7 (config) |
| F3 | **The single most authoritative source is buried by pool order.** In `defend-images`, every icon Q&A ties at score 2, so the 8 native items (which sort first) push **Nicaea II — the ecumenical council that *defined* icon veneration** off the visible list. Config can't lift it (a shared category boosts everything equally). | `defend-images` | 7 (needs `seedPins`) |
| F4 | **Cluster dominance / repetition.** A single densely-tagged cluster fills the whole result set: `explore-god` and `doubt-science` both return the *same five* cosmological-argument sub-questions (one article's parts) as the entire top 5. On-intent, but repetitive for a broad "just exploring" reader. | `explore-god`, `doubt-science` | content (later) |
| F5 | **Three situations correctly return nothing** because the content simply doesn't exist: `loved-one-spouse` (no marriage content), `loved-one-family` (no morality/family content), and — after F1's fix — most of `suffering` (almost no pastoral-consolation content). This is the empty-list-over-mismatch design working as intended; it is also the clearest signal of **what to write next**. | 3 situations | content (later) |
| F6 | **Tag conflation & an unused category.** `suffering` is applied to a free-will *argument* piece; the `science-faith` category is defined but used by **zero** Q&As (the cosmology cluster lives under `god-meaning`). | taxonomy/tagging | 2 (+ 3 re-tag) |

**Net:** the corrected matcher is **broadly healthy** — the known suffering bug (abstract `god-meaning`
outranking the crucifixion cluster) **is fixed**; `doubt-evidence`, `defend-saints`, `defend-faith-works`,
`defend-church`, `explore-basics` need **no changes**. Three situations need a small config edit, one
needs a pin, and the biggest lever is not the matcher at all — it's the content gaps (F5).

> **Pastoral-tone confirm-pass (2026-08-15).** After the "Pastoral tone" rule landed in
> `docs/content-guide.md`, I re-checked every piece routed to a grief-adjacent path (`suffering`,
> `doubt-suffering`, `loved-one-*`) by *tone*, not topic. Net change: **one grief pin withdrawn** (the Good
> Thief piece — its text ends in a works *demand*), two caveated, and a path-level tone lens added for
> Sessions 2/3/7. Full detail in the [Pastoral-tone confirm-pass addendum](#pastoral-tone-confirm-pass-2026-08-15-addendum).

---

## Deliverable 1 — Situation audit + curated routes

Legend: score in `[ ]`; `(kind)` is native / council / video. ✅ on-intent · ⚠️ weak/borderline ·
❌ off-intent.

### `explore-god` — *"Is God real, and who is he?"*
Intent: gentle first exploration; reason & faith not enemies; creation points to a Creator.
Config: `categories:['god-meaning']` · `tags:['atheism','science','trinity','miracles']`

| # | score | item | verdict |
|---|--|--|--|
| 1 | 6.5 | (n) ai-tao-ra-chua *(Who made God?)* | ✅ anchor |
| 2 | 6 | (n) vu-tru-co-the-hang-huu-khong | ✅ but same cluster |
| 3 | 6 | (n) lam-sao-biet-vu-tru-co-khoi-dau | ✅ same cluster |
| 4 | 4 | (n) nguyen-nhan-dau-tien-tai-sao-la-thien-chua | ✅ same cluster |
| 5 | 4 | (n) co-the-co-chuoi-nguyen-nhan-vo-han-khong | ✅ same cluster |
| 6 | 2 | (n) lam-sao-chung-minh-mot-phep-la-song-lai | ⚠️ resurrection-proof, tangential |
| 7–8 | 2 | (c) nicaea-i, constantinople-i | ⚠️ defensive council apologetics, low rank (harmless) |

**Verdict: config OK, content-limited.** Top 5 are the five parts of **one article** (the first-cause
argument) — coherent and on-intent for *"is God real,"* but repetitive, and the *"who is he?"* half of the
intent (Trinity, God's love/nature) has **no content** to answer it. The `trinity`/`miracles` tags only
reach low-ranked councils/evidence pieces (score 2, harmless — keep them).
**Proposed fix:** none to config. **Content gap (F4/F5):** needs a "who is God / the Trinity, simply" piece;
once it exists, tag it `trinity` + `god-meaning` and it will surface here without further tuning.

### `explore-jesus-church` — *"Jesus and the Church he founded"* ⭐ needs fix
Intent: meet Jesus (a Person, risen), and the Church's apostolic origin; the doctrinal Councils guarded the
faith about Christ. `nextStep → /cong-dong`.
Config: `categories:['the-church','evidence-history']` · `tags:['jesus','church-history','authority','trinity']`

| # | score | item | verdict |
|---|--|--|--|
| 1 | 6.5 | (n) bang-chung-chua-giesu-song-lai | ✅ perfect — evidence Jesus rose |
| 2 | 6 | (n) giao-hoi-co-chinh-sua-kinh-thanh-khong | ✅ Church & Scripture |
| 3 | 6 | (c) nicaea-i *(did Constantine invent Christ's divinity?)* | ✅ doctrinal council |
| 4 | 6 | (c) constantinople-iv *(discipline council still "ecumenical"?)* | ❌ medieval papal politics |
| 5 | 6 | (c) lateran-i *(ordinations/discipline = matter of faith?)* | ❌ medieval papal politics |
| 6 | 6 | (c) lateran-ii *(priestly celibacy — biblical or church law?)* | ❌ off-intent for an explorer |
| 7 | 6 | (c) lateran-iii *(an election rule = faith?)* | ❌ off-intent |
| 8 | 6 | (c) lyon-i *(deposing an emperor = power-hungry?)* | ❌ off-intent |

**Verdict: the `authority` tag is the culprit.** It is shared with `defend-church`, and it drags in the
whole medieval papal-authority/discipline council set — exactly the combative apologetics an *explorer*
did not ask for. The doctrinal councils that DO fit the intent (Nicaea, Constantinople I, Ephesus,
Chalcedon — Christ's identity) are outscored or crowded out.

**Proposed fix (config, scalable):** drop `authority`.
```diff
- tags: ['jesus', 'church-history', 'authority', 'trinity'],
+ tags: ['jesus', 'church-history', 'trinity'],
```
**Verified effect** (re-ran the matcher — actual new top-8):
`bang-chung-chua-giesu-song-lai 6.5` · **`nicaea-i 6`** *(did Constantine invent Christ's divinity?)* ·
`(video) bang-chung-chua-giesu-song-lai 6` · then the New-Testament-reliability natives
(`bang-chung-lich-su-cua-kinh-thanh 4.5`, `cac-nhan-vat-tan-uoc-co-phai-nguoi-that`,
`khong-co-ban-goc-sao-tin-tan-uoc-chinh-xac`, `giao-hoi-co-chinh-sua-kinh-thanh-khong`,
`co-the-la-ao-giac-tap-the-khong`, all `4`). **All six medieval papal-politics councils drop out of the
visible list** (they fall 6 → 4 and are outranked). The reader now meets Jesus (risen, historical) + Nicaea
+ the video + "is the record trustworthy?" — squarely *"who Jesus is and where the Church came from"* —
instead of 12th-century papal elections. *(The other doctrinal councils — Constantinople I, Ephesus,
Chalcedon — sit just below at 4/4/2, on-theme but not top-8; a small `the-church`→doctrinal nudge or a pin
could surface them if wanted, but it isn't necessary.)*

### `explore-basics` — *"Show me the most common questions"* ✅ no change
`showCommon:true` → returns the 7 featured anchors (ai-tao-ra-chua, bang-chung-chua-giesu-song-lai,
duc-tin-va-viec-lam, bang-chung-lich-su-cua-kinh-thanh, nguoi-cong-giao-co-tho-nguong-tuong,
tai-sao-chua-giesu-chiu-dong-dinh, tai-sao-cau-nguyen-voi-cac-thanh). A clean spread across all the major
clusters. **Verdict: keep.** Minor note: the list is sliced at `limit` in question-alphabetical (pool)
order, so the 7th featured anchor can drop off; harmless, but if a *curated* ordering is ever wanted this
is the only place a hand-order would matter.

### `doubt-science` — *"Science seems to contradict faith"* ✅ config OK
Config: `categories:['god-meaning']` · `tags:['science','atheism','evolution','miracles']`
Returns the same cosmology cluster as `explore-god` (first-cause / universe-had-a-beginning) — squarely
on-intent for the Big-Bang/Lemaître framing in its advice. `evolution` matches **nothing** (content gap —
no evolution Q&A exists); `miracles` reaches one low-ranked evidence Q&A. **Verdict: keep config.** Flag
the missing evolution piece (F5). This situation legitimately overlaps `explore-god` — the advice prose
differentiates them; that's acceptable.

### `doubt-evidence` — *"Is there any evidence this is true?"* ✅ no change — exemplary
Config: `categories:['evidence-history']` · `tags:['resurrection','church-history','bible','miracles','jesus']`
Returns the entire resurrection/evidence cluster **plus the matching video at #3** — perfectly on-intent,
zero off-topic pulls, mixed media. **This is the model of a well-tuned situation.** Keep as-is.

### `doubt-suffering` — *"If God is real, why so much suffering?"* ⭐ needs fix (F1)
Intent: the **intellectual** problem of evil — this reader wants a *reasoned answer* (theodicy / free-will
defence). `nextStep → /giai-dap`.
Config today: `categories:[]` · `tags:['suffering']` — **identical to the pastoral `suffering` path.**

| # | score | item | verdict |
|---|--|--|--|
| 1 | 2.5 | (n) tai-sao-chua-giesu-chiu-dong-dinh | ✅ |
| 2 | 2 | (n) chua-giesu-la-thien-chua-sao-khong-tu-cuu-minh | ✅ |
| 3 | 2 | (n) **sao-chua-khong-tao-con-nguoi-chi-lam-viec-tot** *(free-will defence)* | ✅ **this is the best answer for THIS path** — but it's buried at #3 |
| 4 | 2 | (v) tai-sao-chua-giesu-chiu-dong-dinh | ✅ |

**Verdict:** the direct theodicy answer (`sao-chua-khong-tao…` — the free-will defence, "a being that can
*only* do good isn't free, and without freedom there's no love") is exactly what this intellectual doubter
needs, yet it ranks last because it only shares the one `suffering` tag. See F1's paired fix below — this
path should keep the free-will content while the *pastoral* path sheds it.

**Proposed fix (config):**
```diff
  // doubt-suffering
- tags: ['suffering'],
+ tags: ['suffering', 'free-will'],
```
Combined with the re-tag in the pastoral section below, `sao-chua-khong-tao…` stays here (via `free-will`)
and leaves the pastoral path. *(Side-effect: `free-will` also reaches two councils — constantinople-iii
"two wills of Christ", vienne "Templars" — at score 2. Off-theme but bottom-ranked; acceptable. If judged
too noisy, prefer the new-tag route in [Tag audit → T3](#deliverable-3--tag-audit).)*

### `suffering` — *"I'm going through suffering or loss"* ⭐ needs fix (F1) — the residual bad case
Intent: someone **hurting right now**; the advice is pure consolation ("you do not walk alone; Jesus
entered your darkness"). `pastoral:true`, `nextStep → /giao-ly/1500`. Adversarial test applies hardest here.
Config: `categories:[]` · `tags:['suffering']`

| # | score | item | adversarial verdict |
|---|--|--|--|
| 1 | 2.5 | (n) tai-sao-chua-giesu-chiu-dong-dinh *(God suffered, out of love)* | ✅ consoling |
| 2 | 2 | (n) chua-giesu-la-thien-chua-sao-khong-tu-cuu-minh *("stayed on the cross not from weakness but from love")* | ✅ consoling |
| 3 | 2 | (n) **sao-chua-khong-tao-con-nguoi-chi-lam-viec-tot** | ❌ **reads as a lecture** — a robot/slave free-will *argument* handed to a grieving person |
| 4 | 2 | (v) tai-sao-chua-giesu-chiu-dong-dinh | ✅ |

**Verdict:** the old `god-meaning` suffering bug is gone, but a *smaller* version of the same failure
remains: item #3 is an intellectual free-will argument, not consolation. It qualifies only because it's
tagged `suffering` — a mis-tag (it's about the *origin of moral evil*, not the *experience* of suffering;
confirmed by reading it — robot/slave analogy, `part_of` the crucifixion apologetics cluster).

**Proposed fix (re-tag, lane 3) — the scalable fix that serves BOTH paths:**
```diff
  # content/giai-dap/sao-chua-khong-tao-con-nguoi-chi-lam-viec-tot.md
- tags: ["free-will", "suffering"]
+ tags: ["free-will"]
```
After this the pastoral `suffering` path returns **only** the consoling crucifixion items + video (verified),
and `doubt-suffering` (now tagged `free-will`) still surfaces it. One re-tag fixes both situations.

**Additional curation — needs `seedPins`, but tone-gated (see [Pastoral-tone confirm-pass](#pastoral-tone-confirm-pass-2026-08-15-addendum)).**
My first draft proposed pinning the Good Thief + atonement pieces here. **The tone confirm-pass revised that
down** — those pieces read as *apologetics/instruction*, not consolation. The **only** pin that survives the
present-first lens is the crucifixion anchor, and even it is explanatory in the body (its *closing* line is
the present one):
```
suffering.seedPins = ['n:tai-sao-chua-giesu-chiu-dong-dinh']   // apply with pastoral lens — see addendum
```
❌ **Dropped:** `nguoi-trom-lanh-tren-thap-gia` (its text pivots to a works *demand* — "those with a whole
life ahead must bear fruit") and `chua-giesu-chuoc-toi-nghia-la-gi` (courtroom-debt theology) — both land as
head-answers on fresh grief. The pastoral `advice` (already present-first) + the priest off-ramp carry this
path; the real fix is **new presence-first content** (F5), not pinning apologetics. See the addendum.

### `defend-saints` — *"Praying to Mary and the saints"* ✅ no change
Config: `categories:['mary-saints']` · `tags:['saints','prayer','mary']`. Returns the whole saints/prayer
cluster (6 items at 6) + two Mary items. Textbook on-intent. Keep.

### `defend-faith-works` — *"Faith, works, and salvation"* ✅ no change (one optional tweak)
Config: `categories:[]` · `tags:['faith','works','salvation','grace']`. Returns the faith/works cluster
**plus `trent-hoi-1` at #2** — the Council of Trent on justification, the single most authoritative source
for this topic. Excellent. **Optional:** adding `categories:['theology-doctrine']` would tidy the ranking
(every match is theology-doctrine) without pulling anything new in (category alone never qualifies). Not
required — leave unless a future retune wants it.

### `defend-images` — *"Images, statues, and veneration"* ⭐ needs pin (F3)
Config: `categories:[]` · `tags:['icons']`. **Every** icon item scores exactly 2 (single tag), so ordering
is pure pool order → the 8 native icon Q&As fill the list and **Nicaea II — the ecumenical council that
*defined* icon veneration** (`c:nicaea-ii-hoi-1`, also tagged `icons`) is pushed off the visible top.

**Verdict:** the native cluster is on-intent, but the authoritative council answer is invisible. Config
can't fix it — adding a shared category boosts *all* icon items equally (natives still sort first). This is
a genuine "algorithm can't get there" case.
**Proposed fix — needs `seedPins`:**
```
defend-images.seedPins = ['c:nicaea-ii-hoi-1']
```
*(No content change; the council is already correctly tagged.)*

### `defend-church` — *"The Church, the Pope, and authority"* ✅ no change — the right home
Config: `categories:['the-church']` · `tags:['authority','papacy','church-history']`. Returns six councils
at score 8 (all three tags + the `the-church` category) — precisely the papal-authority apologetics.
**This confirms F2:** the medieval-authority councils belong *here*, not in `explore-jesus-church`. Keep.
Content note: there is no *native* Q&A on the papacy — the councils fully carry it, but a native
papacy/authority explainer would round it out (F5).

### `loved-one-spouse` — *"My spouse doesn't share the faith"* — content gap (F5)
Config: `categories:['morality-life']` · `tags:['marriage']` → **0 matches.** No marriage/morality content
exists. Correctly rests on its warm `pastoral:true` advice + priest off-ramp. **No config fix possible or
needed** — this is a write-content signal (a mixed-marriage / evangelize-by-witness piece, tag `marriage` +
`evangelization`).

### `loved-one-family` — *"A child/relative drifted from the faith"* — content gap (F5)
Config: `categories:['morality-life']` · `tags:[]` → **0 matches** (empty tags can never qualify). Rests on
advice (St Monica/Augustine framing) + `nextStep → /giao-phu`. **Marginal reach:** `nguoi-chua-tung-nghe-biet-chua-co-duoc-cuu-khong`
(salvation of those who never knew Christ; tags `salvation`,`evangelization`) is thematically adjacent — if
`evangelization` were added to this situation it would surface that one Q&A (score 2). Weak; I'd hold off
until there's genuine "accompanying a doubter / prodigal" content rather than force a soteriology piece onto
a grieving parent. **Primary fix is content (F5).**

---

## Deliverable 3 — Tag audit

| id | issue | proposal | lane |
|---|---|---|---|
| **T1** | `sao-chua-khong-tao-con-nguoi-chi-lam-viec-tot` is tagged **`suffering`** but is a free-will *theodicy* (origin of moral evil), not the *experience* of suffering. Pollutes the pastoral `suffering` path (F1). | **Re-tag:** `["free-will","suffering"]` → `["free-will"]`. | 3 |
| **T2** | The `science-faith` **category exists but is used by zero Q&As.** The cosmological-argument cluster (ai-tao-ra-chua + 4 parts, `lam-sao-chung-minh-mot-phep-la`) all sit under `god-meaning`, so the `doubt-science` situation leans on `god-meaning` instead of the category built for it. | Consider re-categorising the cosmology + miracle-evidence Q&As to `science-faith` (or at least the cluster that argues from physics/Big-Bang). **Owner decision** — changes `/giai-dap` filter placement too. If done, `doubt-science` should switch `categories:['god-meaning']` → `['god-meaning','science-faith']`. | 3 (+ 7 for the situation) |
| **T3** | **Coarse-grained "problem of evil" vs "consolation."** The archetypal gap the roadmap names ("abstract-apologetics vs pastoral-consolation"). Today the free-will/suffering split is handled by T1's re-tag + `free-will`, but there is **no positive tag for consolation/pastoral content**, so the `suffering` path can't *find* consoling pieces that aren't literally tagged `suffering` (e.g. the Good Thief). | **Optional new tag** `consolation` (vi: *An ủi & hy vọng*, en: *Consolation & hope*) — apply to genuinely pastoral pieces (crucifixion "out of love", Good Thief, prodigal). Then `suffering.tags += 'consolation'` reaches them **without `seedPins`**. Only worth it once ≥3–4 items would carry it; until then use `seedPins`. New id must be added to `lib/giaiDapTaxonomy.ts` and pass `scripts/check-tags.mjs`. | 2 (id) + 3 (apply) |
| **T4** | **`evolution` and `marriage` are "dangling" tags** — referenced by situations (`doubt-science`, `loved-one-spouse`) but carried by **no** Q&A. Not a bug (they're valid vocabulary awaiting content), but worth logging as the concrete content backlog. | No taxonomy change. Track as content to write (F5). | content |
| **T5** | **Consistency check — all clear.** Every tag a situation references resolves to a real taxonomy id, and every Q&A/council/video tag in the pool is a defined id. No typos or orphan ids found. `protestant-objections` is heavily and correctly used across the apologetics clusters. | none | — |

*No mis-tags found beyond T1.* The tagging is otherwise accurate and consistent — the clusters are
internally coherent (resurrection, icons, faith/works, saints, cosmology each share a tight tag set).

---

## Deliverable 2 — Follow-up chains (v2 fuel)

**Important context:** the follow-up mechanism (`followUps` in `lib/dongHanh.ts`) already forces a Q&A's
`related` frontmatter to the top of its follow-ups (`app/dong-hanh/page.tsx` maps
`pins = [...related, ...related_video]`). **Most clusters are already densely `related`-linked** — so
tag-overlap + existing pins already produce good chains. Per the roadmap, pins are *high-value
corrections, not a wholesale hand-map*. This section therefore proposes only (A) the **empty-`related`
gaps** on non-anchor Q&As, and (B) a few **cross-cluster bridges** that model a real next-move (curiosity /
objection / deepening) which tag-overlap alone misses. Everything else is left to the scalable default.

### A. Fill empty `related` on non-anchor Q&As (lane 3)
These currently have `related: []` and no video pin, so their follow-ups run on bare tag-overlap. Proposed
`related` (ordered — first is the strongest next question):

| Q&A (source) | proposed `related` |
|---|---|
| `duoc-cuu-nho-duc-tin-khong-boi-viec-lam` | `duc-tin-va-viec-lam`, `chi-can-tin-vao-chua-giesu-la-du`, `viec-lam-co-phai-tu-kiem-on-cuu-do`, `thanh-phaolo-cong-chinh-hoa-nho-duc-tin` |
| `chi-can-tin-vao-chua-giesu-la-du` | `duc-tin-va-viec-lam`, `nguoi-trom-lanh-tren-thap-gia`, `mot-lan-duoc-cuu-la-cuu-vinh-vien` |
| `viec-lam-co-phai-tu-kiem-on-cuu-do` | `duc-tin-va-viec-lam`, `duoc-cuu-nho-duc-tin-khong-boi-viec-lam`, `nguoi-trom-lanh-tren-thap-gia` |
| `nguoi-trom-lanh-tren-thap-gia` | `duc-tin-va-viec-lam`, `viec-lam-co-phai-tu-kiem-on-cuu-do`, `chi-can-tin-vao-chua-giesu-la-du` |
| `mot-lan-duoc-cuu-la-cuu-vinh-vien` | `duc-tin-va-viec-lam`, `on-cuu-do-la-qua-tang-co-the-tu-do-pham-toi-khong`, `viec-lam-co-phai-tu-kiem-on-cuu-do` |
| `apraham-cong-chinh-hoa-nho-duc-tin` | `thanh-phaolo-cong-chinh-hoa-nho-duc-tin`, `duc-tin-va-viec-lam`, `duoc-cuu-nho-duc-tin-khong-boi-viec-lam` |
| `thanh-phaolo-cong-chinh-hoa-nho-duc-tin` | `apraham-cong-chinh-hoa-nho-duc-tin`, `duc-tin-va-viec-lam`, `duoc-cuu-nho-duc-tin-khong-boi-viec-lam` |

*(The featured anchors with empty `related` — `ai-tao-ra-chua`, `bang-chung-chua-giesu-song-lai`,
`bang-chung-lich-su-cua-kinh-thanh`, `duc-tin-va-viec-lam`, `nguoi-cong-giao-co-tho-nguong-tuong`,
`tai-sao-cau-nguyen-voi-cac-thanh` — are the *entry* points of their clusters; their `parts` structure the
article and tag-overlap fills their follow-ups richly. Leaving them unpinned is fine.)*

### B. Cross-cluster bridges (lane 3) — the jumps tag-overlap can't make
These model a reader crossing from one cluster to the *next* natural question in a different cluster. Add as
extra `related` entries (append, don't replace existing):

| From | → bridge to | why (reader's next move) |
|---|---|---|
| `tai-sao-chua-giesu-chiu-dong-dinh` (cross anchor) | `chua-giesu-chuoc-toi-nghia-la-gi`, then `duc-tin-va-viec-lam` | "Why the cross?" → "so how does that save *me*?" → "then do my works matter?" (atonement → soteriology) |
| `ai-tao-ra-chua` (cosmology anchor) | `bang-chung-chua-giesu-song-lai` | "OK, *a* God exists" → "is there evidence for a *specific* (Christian) God?" (first-cause → historical evidence) |
| `bang-chung-chua-giesu-song-lai` (resurrection anchor) | `giao-hoi-co-chinh-sua-kinh-thanh-khong` | "He rose" → "but can I trust the book that says so?" (already partly covered by tag-overlap; pin cements the ordering) |
| `nguoi-chua-tung-nghe-biet-chua-co-duoc-cuu-khong` | `tai-sao-chua-giesu-chiu-dong-dinh` *(already pinned)* + `duc-tin-va-viec-lam` | "What about those who never heard?" → the mechanism of salvation |
| `me-thien-chua-nu-vuong-co-phai-nang-me-len-ngang-chua` | `tai-sao-cau-nguyen-voi-cac-thanh` | Mary-specific objection → the general saints/intercession answer (Marian → veneration cluster) |

### C. Council & video follow-ups — no action needed
Council apologetics have **no `related` field** in the data model, so their follow-ups run purely on
tag-overlap — which actually works *well* here, cross-linking each council to the matching native cluster
(e.g. from `trent-hoi-1` → the faith/works natives; from `nicaea-ii-hoi-1` → the icons natives). Adding a
`related`-equivalent to councils is a **low-priority** future enhancement (needs a `CouncilQA.related` field
+ JSON authoring); not recommended now. Videos already carry `related_qa` (currently empty) — the three
videos are cluster anchors and tag-overlap surfaces their siblings; optional pins later.

---

## Deliverable 4 — Findings report

1. **The corrected matcher works.** The headline bug (suffering → abstract `god-meaning` "Ai Tạo Ra Chúa"
   over the crucifixion cluster) is **gone**. The ≥1-tag-overlap gate + tag-weighting does its job: 5 of
   the 15 situations are already optimal and need no touch (`doubt-evidence`, `defend-saints`,
   `defend-faith-works`, `defend-church`, `explore-basics`).

2. **The two remaining relevance defects are both "shared config, divergent intent" problems** (F1, F2).
   A tag that is *correct* for one situation (`authority` for `defend-church`; `suffering` for
   `doubt-suffering`) leaks into a *sibling* situation with a gentler/different intent. The fix pattern is
   the same each time: **narrow the softer situation's tag set** so it stops inheriting the harder
   situation's combative content. Both are one-line config edits with verified effects.

3. **Pool order is a silent relevance factor.** When many items tie on score (single-tag situations like
   `defend-images`, or the flat cosmology cluster), the *alphabetical native-first pool order* decides what's
   visible — which is why the authoritative Nicaea II council is invisible under 8 native Q&As (F3). Any
   situation whose matches mostly tie at the same score is a candidate for a `seedPins` curation.

4. **The matcher is not the bottleneck — content is.** The single biggest lever on companion quality is the
   **content gaps** (F5): no morality/marriage content (2 whole situations empty), no evolution piece, and —
   most importantly — **almost no pastoral-consolation content**, so the emotionally heaviest path
   (`suffering`) has the least to give and leans hardest on hand-written advice. Recommended write-order for
   maximum companion lift: (a) a "who is God / the Trinity, gently" piece → fills `explore-god`'s *"who is
   he?"* half; (b) 2–3 genuinely consoling/pastoral pieces (grief, hope in loss) → fills `suffering`;
   (c) a mixed-marriage witness piece → fills `loved-one-spouse`; (d) an evolution & faith piece →
   fills `doubt-science`'s dangling tag.

5. **Cluster dominance is acceptable but worth watching (F4).** Where one article's `parts` are all tagged
   identically (cosmology's 5 parts), they occupy the entire top-5 of broad situations. It's on-intent, but
   as content grows, consider whether sub-questions should be slightly *down*-weighted vs their anchor in
   broad-explore contexts (a v2 tuning idea, not a bug).

6. **Recommend adding the `seedPins` mechanism (Appendix A).** Two concrete curations (Nicaea II → images;
   Good Thief/atonement → suffering) are blocked without it, and it's the roadmap's own assumed tool. It's a
   ~10-line addition to `matchResources` + one optional field, fully backward-compatible.

---

## Pastoral-tone confirm-pass (2026-08-15 addendum)

Triggered by the new cross-cutting rule in `docs/content-guide.md` → **"Pastoral tone — suffering, grief,
and the saints"**: any content a hurting/grieving person reaches must be framed as **companionship + an
invitation to lean on God** (presence → reliance → closeness), *never* as instruction, comparison, or
demand. I re-read the actual text of every piece I routed to a grief-adjacent path and judged it by tone,
not topic. Result: **one proposal withdrawn, two caveated.**

**The structural problem this exposes:** the pastoral `suffering` path has **no presence-first content to
pull.** Every on-topic Q&A it can reach was authored to answer a *doubt/apologetics question* ("why the
cross," "faith vs works"), so each leads with explanation or argument. Topic-match ≠ tone-match. The
matcher can't fix this — only new content can (this is the sharpest edge of content-gap F5).

| Piece | Routed to | Actual tone (verified by reading) | Verdict |
|---|---|---|---|
| `tai-sao-chua-giesu-chiu-dong-dinh` | `suffering`, `doubt-suffering` | Explanatory atonement theology (sin/freedom/love), **but** closes present: *"the cross is not God distant or cruel — the summit of love; God himself entered."* | ⚠️ **Keep as the one pin**, apply with pastoral lens. Its closing line is the most companionship-like text available. Ideally give it a present-first intro when surfaced in `suffering`. |
| `nguoi-trom-lanh-tren-thap-gia` (Good Thief) | ~~`suffering` pin~~ | A **faith-vs-works apologetic**: argues the thief's faith "wasn't empty," then pivots to *"for those with a whole life ahead, living faith must bear fruit in works of love and obedience."* | ❌ **Dropped.** That pivot is a **works demand** — exactly the "reliance-as-assignment" the rule forbids for fresh grief. The *story* consoles; *this treatment* doesn't. Keep it in the faith/works cluster only. |
| `chua-giesu-chuoc-toi-nghia-la-gi` | ~~`suffering` pin~~ | Courtroom/debt metaphor for substitutionary atonement — a doctrinal explanation (warm ending, but head-first). | ❌ **Dropped** from the grief pin. Fine where it is (atonement/soteriology). |
| `chua-giesu-la-thien-chua-sao-khong-tu-cuu-minh` | `suffering`, `doubt-suffering` (tag-match) | Answers a doubt ("why didn't he save himself"), but frames it as love: *"he stayed not from weakness but from love."* | ⚠️ Acceptable — the love-framing lands. Not a lecture, but still answering a *question*. |
| `sao-chua-khong-tao-con-nguoi-chi-lam-viec-tot` (free-will) | `doubt-suffering` (after T1 re-tag) | Free-will theodicy (robot/slave analogy) — pure *argument*. | ⚠️ **Correct for the intellectual `doubt-suffering` intent**, and T1 already removes it from the *pastoral* `suffering` path. Must never be pushed at someone in fresh grief; see below. |

**Path-level guidance for Sessions 2/3/7:**

- **`suffering` (pastoral):** its hand-written `advice` is already correct (present-first: *"you do not walk
  alone… Jesus entered your darkness… don't carry this alone — reach out to a priest"*). Keep the **advice
  primary**; the matched Q&As are secondary and must not displace it. Only the single crucifixion pin
  survives, and it should carry a gentle framing. **Highest-value action is not a pin — it's writing a
  presence-first consolation piece** (grief/loss, a saint who *relied* on God through suffering per the
  content-guide) and tagging it so this path finally has something that consoles rather than explains.
- **`doubt-suffering` (intellectual):** the theodicy content is right for the *stated* intent (a reasoned
  answer to "why is there suffering"). **But** this path is reachable by someone whose doubt is born of
  fresh loss — so its present-first `advice` and the **human off-ramp must stay visible across the entire
  v2 walk**, not just the first screen (the v2 spec already mandates the priest/RCIA off-ramp on heavy
  branches — this confirms it as non-negotiable here). The theodicy is offered as an answer to a question,
  never pushed.
- **`loved-one-family` / `loved-one-spouse`:** both rest on present-first `advice` (St Monica / gentle
  witness) — correct. **Reaffirmed hold** on pinning `nguoi-chua-tung-nghe-biet-chua-co-duoc-cuu-khong` to
  `loved-one-family`: to an anxious/grieving parent a "can those who never heard be saved?" answer can read
  as a fear-spiral rather than hope. Any content routed here must be **hope/companionship-framed**.
- **General:** for these paths, **tone overrides tag-score.** A perfectly tag-matched apologetic that reads
  as instruction is a *worse* result than a shorter list resting on the pastoral advice. When Session 7
  wires `seedPins` and Session 3 wires `related` on these paths, weight consolation/presence over topical
  completeness.

*Everywhere outside the grief-adjacent paths, the audit above stands unchanged.*

---

## Hand-off

This session applies nothing. Approved items route to their owning lanes:

| Item | What | Lane / session |
|---|---|---|
| **Fix F2** | `explore-jesus-church`: drop `authority` from `tags`. | **7** (`lib/dongHanh.ts`) |
| **Fix F1a** | `doubt-suffering`: `tags` → `['suffering','free-will']`. | **7** (`lib/dongHanh.ts`) |
| **Fix F1b / T1** | Re-tag `sao-chua-khong-tao-con-nguoi-chi-lam-viec-tot`: `["free-will","suffering"]` → `["free-will"]`. | **3** (`content/giai-dap`) |
| **Fix F3** | `defend-images.seedPins = ['c:nicaea-ii-hoi-1']`. | **7** (needs the field — Appendix A) |
| **Curation (tone-gated)** | `suffering.seedPins = ['n:tai-sao-chua-giesu-chiu-dong-dinh']` **only** — Good-Thief/atonement pins **dropped** on tone grounds (addendum). Apply with the pastoral lens. | **7** (needs the field) |
| **Pastoral-tone lens** | Grief/loss paths (`suffering`, `doubt-suffering`, `loved-one-*`) must be applied present-first (companionship → invitation to lean on God), never as instruction/argument. See the addendum + `docs/content-guide.md` "Pastoral tone." | **2 / 3 / 7** — cross-cutting |
| **`seedPins` field** | Add optional `seedPins?: string[]` to `Situation` + honour it in `matchResources`. | **7** (`lib/dongHanh.ts`) — Appendix A |
| **Follow-up chains** | Deliverable 2 §A (empty-`related` fills) + §B (cross-cluster bridges). | **3** (`content/giai-dap` frontmatter `related`) |
| **New tag (optional)** | `consolation` id in `CATEGORIES`/`TAGS` (T3) — only if content will use it. | **2** (`lib/giaiDapTaxonomy.ts`) → then **3** applies it |
| **Category rethink (owner call)** | `science-faith` category unused (T2); optional re-categorise of the cosmology cluster. | owner → **3** (+ **7** situation) |
| **Content backlog** | Write: "who is God/Trinity"; pastoral/consolation pieces; mixed-marriage witness; evolution & faith. (F5) | **3** (content) |

**Nothing here is blocking Session 7's v2 build** — v2 ships on tag-overlap + the `short:` title fallback;
these proposals layer in as signed off. The `seedPins` field is the only *code* proposal, and it's additive.

---

## Appendix A — proposed `seedPins` field

The only new mechanism this audit asks for. Backward-compatible (absent = today's behaviour).

```ts
// lib/dongHanh.ts — add to interface Situation:
/** Resource keys to force to the top of THIS situation's matches, ahead of tag scoring — for
 *  curation the taxonomy can't reach (e.g. the authoritative council for a topic, or a consoling
 *  piece that shares no tag with the situation). Optional; empty/absent = pure tag scoring. */
seedPins?: string[];
```

```ts
// in matchResources, before the tag loop — pinned keys lead, in listed order, then tag-scored rest:
export function matchResources(sit: Situation, pool: Resource[], limit = 6): Resource[] {
  if (sit.showCommon) return pool.filter((r) => r.featured).slice(0, limit);
  const pins = sit.seedPins ?? [];
  const pinned = pins
    .map((k) => pool.find((r) => r.key === k))
    .filter((r): r is Resource => Boolean(r));
  const pinnedKeys = new Set(pinned.map((r) => r.key));
  const scored = pool
    .filter((r) => !pinnedKeys.has(r.key))
    .map((r) => { /* …existing tag/category scoring… */ })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.r);
  return [...pinned, ...scored].slice(0, limit);
}
```

`followUps` already honours per-item `seed.pins` (`+100`), so this brings the *anchor* (situation-level)
step to parity with the *walking* step. No other call sites change.

---

*Generated by Session 10 (relevance-curation research). Matcher reproduction harness + full per-situation
output retained in the session scratchpad; regenerate against any content change before applying pins.*
