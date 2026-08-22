# Giáo Phụ pass 2 — approval sheet

Session 12, 2026-08-22. Companion to `docs/fact-verification-audit.md` (the evidence) — this is the
**decision sheet**. Nothing has been applied. Tick a batch and I apply exactly that batch.

**177 `corrected` rows total: 164 in the Giáo Phụ entries (mine to apply) + 13 in the Giải Đáp Q&As
(Session 3's, see `docs/handoff-session3-patristic-quotes.md`).** The 124 `contested` and 22
`unverifiable` rows are held back from these batches — they need your judgement on *how* to hedge,
not just whether to fix, so they are proposed separately in batch 7.

**Supersedes the earlier "15 approved `corrected` rows."** That number came from the first report,
when only 6 entries were checked and entries 5–6 had their `sections[]` unopened. At least one of
those 15 (entry 6's works count) is now better handled by batch 2 than by a hand-patch.

---

## Batch 1 — S6: four broken Vietnamese strings · **4 rows, 2 files**

Four live questions read **"Thánh Thánh dạy gì về…"** with the saint's name missing, on the Leo the
Great and Gregory the Great pages. Mechanical, no research, no judgement call. The English is
undamaged, so this is invisible unless you read the Vietnamese.

*Risk: none. Recommend applying regardless of what you decide about everything else.*

- [ ] **Approve batch 1**

## Batch 2 — S5: the "Surviving works" relabel · **~30 rows, 30 files**

In **all 30 entries** the `facts[]` row "Surviving works: N" is exactly `works[].length` — the length
of the entry's own curated list, presented to readers as a fact about the corpus. Tertullian shows
"4" against 31 treatises; Augustine "3" against 100+ titles and 1,030 catalogued writings; John of
Damascus "2" against Hoeck's 150; Leo "1" against ~96 sermons and 143 letters. Polycarp's "2" is
inflated by a work he did not write.

**One decision, applied thirty times.** Two options:

- **(a) Relabel** — "Tác phẩm tiêu biểu / Selected works", so the number honestly describes the list.
  Cheap, safe, no further research. **Recommended.**
- **(b) Populate real counts** — a per-entry research task; several figures' totals are genuinely
  contested (Origen's homily count depends on what counts as surviving *in Greek*).

- [ ] **Approve batch 2(a) — relabel**  ·  [ ] **Approve batch 2(b) — research real counts**

## Batch 3 — fabricated or misattributed quotations · **32 rows, 20 entries**

The highest-risk class, and the reason the audit was commissioned. These are quotations presented in
quotation marks as a Father's own words which are not, or are cited to a work that does not contain
them. The worst:

| Entry | What it says | What the source says |
|---|---|---|
| 20 Ambrose | "Before the words of Christ, the vessel is **empty** of any content" | *De Sacramentis* IV,5: the chalice "**est vino et aqua plenus**" — **full** of wine and water. Asserts the opposite, spliced onto a genuine first half |
| 8 Hippolytus | a `more-quotes` passage on the end of the world | Appears nowhere in the complete *Commentary on Daniel* or in all of *ANF* vol. 5 — both grepped in full |
| 2 Ignatius | one quotation, cited to Ephesians 20:2 | **Two different letters spliced** inside one set of quotation marks; the "one Eucharist" clause is Philadelphians 4 |
| 1 Clement of Rome | "…they afterwards **added an appendix**" | In no standard translation — **and the site's apostolic-succession argument hangs on that clause** |
| 7 Tertullian | "the blood of **the martyrs** is the seed **of the Church**" | *semen est sanguis Christianorum* — "the blood of **Christians** is seed". The popular apocryphal expansion |
| 23 Augustine | *Confessions* X.27.38 credited to **Chadwick** | The wording is **Boulding's** verbatim; `further-reading` separately recommends Chadwick |
| 9 Origen | a `more-quotes` sentence from *Contra Celsum* | Untraceable in any reachable translation; carries no book/chapter and no edition |

*Risk: low — each proposes an attested translation with its source. This is the batch I would apply
first after batch 1.*

- [ ] **Approve batch 3**

## Batch 4 — self-contradictions · **within the 70 "other" rows, ~12 entries**

Cases where the entry's **own prose already refutes its own summary field**, so the page contradicts
itself in public. No new facts needed — just make the two halves agree, in the direction the entry's
own better half already states.

- **24 Cassian** — `facts[] Canonized: Yes` against the entry's own correct statement that he was
  never canonized.
- **8 Hippolytus** — `quote.source`, `life[1]` and `apologetics[0]` assert he wrote the *Apostolic
  Tradition*; its own `later-influence` reports the scholarship that it is "neither the work of
  Hippolytus nor of any other individual".
- **15 Hilary** — the married-clergy apologetic rests on a wife and daughter its own `martyrdom`
  section calls a probable medieval invention.
- **26 Leo** — `life[1]` says he "persuaded Attila not to sack the city"; `later-influence` debunks it.
- **27 Gregory** — the chant bullet says "hệ thống hóa"; the section below reports the Carolingian origin.
- **1 Clement, 5 Irenaeus** — `role` says "Martyr" where their own sections report otherwise.

- [ ] **Approve batch 4**

## Batch 5 — plain factual errors · **the remainder of the 70 "other" rows**

Wrong places, wrong people, wrong sequences. Representative:

- **26 Leo** — met Attila at the **Mincio near Mantua**, not "outside Rome". ~500 km off; Benedict XVI
  on vatican.va says "in Mantua". Likely contaminated by Raphael's fresco.
- **25 Cyril of Alexandria** — "twenty years after his death, Chalcedon (451)": he died 444, so seven.
  And "even Socrates Scholasticus records his death without hostility" — Socrates' history **ends in
  439**, five years before he died.
- **10 Cyprian** — the Carthage schism is inverted: Felicissimus and Fortunatus were the **laxist**
  party, not rigorists angry at Cyprian's moderation.
- **17 Gregory of Nazianzus** — Meletius presided at Constantinople I first; Gregory resigned *during*
  the council. And `role` "Bishop of Sasima (briefly)" — he never took possession of the see at all.
- **3 Polycarp** — the *Martyrdom* is listed as **his** work; and the `context` section says "Away with
  the Atheists!" was shouted *at* him "rather than by him", when Mart. Pol. 9 has him saying it.
- **28 Isidore** — headline quote cited to *Etym.* I.29; it is I.7.1.
- **11 Anthony** — `works[]` counts **Athanasius's** *Life of Antony* as one of Anthony's own works;
  its own `latin` field reads "by Athanasius".

- [ ] **Approve batch 5**

## Batch 6 — S4: Vietnamese names · **18 rows, 15 entries**

Six entries contradict the site's own Vietnamese Catechism, plus internal spelling splits within
single files. **Ordering constraint: entry 22 must be fixed before entry 25**, because Cyril of
Alexandria's correction needs to name *John of Antioch*, which Chrysostom currently occupies.

| # | Entry has | Site's own Catechism uses |
|---|---|---|
| 22 | `Gioan thành Antiôkia` | **`Gioan Kim Khẩu`** (×6) — and "John of Antioch" is a different man in entry 25 |
| 4 | `Justinô Tử Đạo` | `Giustinô` |
| 10 | `Ciprianô` | `Cyprianô` |
| 14 | `Ephrem` | `Êphrem` |
| 17 | `Nazianzô` | `Nazien` |
| 24 | `Cassianô` | `Casianô` |

One to decide separately: **8 Hippolytus's `Hippôlytô` matches Vietnamese Wikipedia and no Vietnamese
Catholic source** (attested: Hippôlitô, Hippolytô). Given the project rule forbidding VN Wikipedia,
you may want to know whether other names came from there too — that would be its own small check.

- [ ] **Approve batch 6**

## Batch 7 — the `contested` and `unverifiable` rows · **146 rows, needs your judgement**

Not included above because they need a decision about *how* to speak, not just what is true:

- **124 `contested`** — the sources genuinely disagree and the entry states one side flatly. Each row
  proposes hedged wording (adding "c.", giving a range, naming the dispute). The largest cluster is
  dates asserted with false precision.
- **22 `unverifiable`** — could not be confirmed from any reachable source. Each proposes either
  `[cần kiểm chứng]` or removing the claim. **Per `CLAUDE.md`, a flagged uncertainty beats a
  confident wrong answer**, so my recommendation is to flag rather than delete, and to delete only
  where the claim is doing no work.

*I suggest doing this batch last and in smaller passes, since it is where your voice matters most.*

- [ ] **Approve batch 7 — flag `unverifiable`, apply proposed hedges to `contested`**
- [ ] **Or: send batch 7 back to me grouped by entry for a closer look first**

---

## Do NOT undo these — 87 `confirmed` rows

Recorded deliberately: claims that look wrong but check out. Athanasius's **five exiles** is correct.
Justin's **three surviving works** is the standard count. Clement of Alexandria's **"Canonized: No"**
is right. Gregory of Nyssa correctly makes **no** Doctor-of-the-Church claim. John of Damascus's
severed hand is correctly labelled hagiography. Entry 5's `martyrdom` section is the most careful
writing in that entry. A later pass "tidying" any of these would make the site less accurate.

## Application mechanics

Per finding S3, most fixes land in **three files** — `content/giao-phu/<slug>.json`,
`church-fathers.json` and `church-fathers-vi.json` — because `lib/churchFathers.ts` still feeds the
homepage and search page from the legacy datasets. Exceptions: **batch 1 (S6) touches one file per
entry**, and `sections[]` fixes have no counterpart in the legacy files at all. I will report where
each fix landed, and run `npx tsc --noEmit` and `npm run lint` to exit 0 before committing.
