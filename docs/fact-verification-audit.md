# Fact-verification audit — Giáo Phụ (pass 1, report only)

Session 12 · started 2026-08-18 · per `docs/fact-verification-audit-spec.md`
**No content has been changed.** This is the report half of the two-pass workflow; nothing here has
been applied to `content/giao-phu`.

## STATUS: INCOMPLETE — 6 of 30 entries verified

Read this before reading anything below it.

The audit was fanned out to 15 verifier agents as the spec directs (one pair of entries each). Two
returned complete work (entries 1–4). **Thirteen were killed mid-run by a monthly API spend limit**
and produced no output. Their work is lost, not merely unfinished. Entries 5 and 6 were then
verified directly by the coordinating session at the same standard.

| Entries | State |
|---|---|
| 1, 2 (Clement of Rome, Ignatius of Antioch) | **verified** — subagent, full field sweep |
| 3, 4 (Polycarp, Justin Martyr) | **verified** — subagent, full field sweep |
| 5, 6 (Irenaeus, Clement of Alexandria) | **verified** — coordinating session; `sections[]` bodies not opened (noted per entry) |
| 7–30 (24 entries) | **NOT VERIFIED — nothing checked, no conclusions drawn** |

Entries 7–30 carry **no verdict of any kind**. Their absence from this report is not a clean bill of
health; they were never examined. Given the hit rate on the six that were checked, assuming them
sound would be the exact mistake the spec's "guards" section warns against.

## What the six verified entries produced

37 flagged rows across 6 entries — **an average of 6 findings per entry, and not one entry came back
clean.** By verdict:

| Verdict | Count |
|---|---|
| `corrected` (a definite error; exact replacement proposed) | 15 |
| `contested` (sources genuinely disagree; hedged wording proposed) | 15 |
| `unverifiable` (could not confirm; propose flagging or removing) | 2 |
| `confirmed` but notable (correct — do **not** "fix" these later) | 3 |
| cross-file contradictions (per-slug file vs legacy dataset) | 4 |

The spec said a report with zero flags across 51 entries should be treated as suspect. The inverse
result is what actually happened: the content is dense enough, and was authored early enough, that
essentially every entry has something.

## Systemic patterns

These are the findings that generalise beyond a single entry. They are the reason the remaining 24
entries should not be assumed clean.

**P1 — Quotations are the weakest field on the site, exactly as the spec predicted.** Of the six
entries checked, **five had a problem in a quotation**, and the failures are not random: they are
"almost right" in a way that survives casual reading.
- *Entry 2 (Ignatius)* — **two different letters spliced inside one set of quotation marks** and
  cited to only one of them. The "one Eucharist" clause is Philadelphians 4, not Ephesians 20:2.
  (Independently re-verified against the primary text by the coordinating session.)
- *Entry 1 (Clement of Rome)* — the headline quote's key phrase, "added an appendix", is in **no**
  standard translation, and the site's apostolic-succession argument hangs on that clause.
- *Entry 3 (Polycarp)* — the relic quotation at Mart. Pol. 18 is a **hybrid** of the ANF and
  Lightfoot renderings, matching neither.
- *Entries 5, 6* — quotes traced correctly to real passages but **silently smoothed** from the
  translation they appear to be quoting.
The pattern: the citation is usually right and the sense is usually right, but the *wording* has
drifted from any actual published translation. A reader checking the reference would find the
passage; a reader checking the words would not.

**P2 — Pious tradition and attested history are stated in the same voice.** Entry 5's `role` calls
Irenaeus a Martyr (liturgically correct, historically "generally rejected by the scholarly
community"); entry 1's `role` calls Clement of Rome a Martyr while the entry's own martyrdom section
correctly reports the earliest sources record a natural death. The entries contradict themselves
between the summary fields and the prose.

**P3 — Authorship and counts are asserted where scholarship hedges.** Entry 3 attributes the
*Martyrdom of Polycarp* to Polycarp and counts it in "2 works" — he did not write it. Entry 6
undercounts Clement's surviving works by omitting *Quis dives salvetur?*. Entry 6 also states
Origen was Clement's student, which Eusebius claims and modern scholars doubt.

**P4 — Precise-looking dates rest on doubted evidence.** Entry 5's death year "c. 202" is supplied
by the very martyrdom tradition the sources reject; entries 1 and 2 both assert `born = 35` with no
support. The "c." is present but is doing less work than it appears to.

**P5 — The per-slug files are frequently the *outlier*, and the legacy dataset is right.** In four
cases the older combined dataset already had the correct value and the per-slug rewrite introduced
the error (Justin's era, Polycarp's works, and two others). This is a strong hint about where the
errors came from — and it means pass 2 should check the legacy file before inventing a new value.

**P6 — Contested scholarship is presented as settled where it serves an apologetic point.** Entry
5's *Adv. Haer.* III.3.2 ("preeminent authority") is one of the most disputed sentences in
patristics — the Greek is lost, the Latin has no agreed rendering, and Nautin argues "this Church"
may not even mean Rome — yet the entry offers it flatly as proof of Roman primacy. This is the
finding most worth the owner's judgement, because it is the one where getting it wrong costs the
site credibility with exactly the readers it is trying to persuade.

---

## Structural findings (all 30 entries)


Done by the coordinating session with scripts over all 30 files, not by a verifier agent.

### S1. `ccc_refs` is empty on all 30 entries

Spec item 6 ("does the cited Catechism paragraph actually say what the entry implies?") has nothing
to check: every one of the 30 entries has `"ccc_refs": []`. Not an error — the field exists and is
unused. Worth knowing that the Giáo Phụ section currently makes **no** Catechism citations at all,
which is a content gap rather than a factual one.

### S2. Internal date consistency is clean

Script check across all 30: `dates.display`, the `dates.born` / `dates.died` integers, and the
`facts[]` "Born" / "Died" rows agree with each other in every entry. Zero mismatches. Whatever the
dates turn out to be *externally*, they are at least stated consistently *internally*.

### S3. The two datasets are not independent witnesses — and corrections must land in three files

`content/giao-phu/` holds the 30 per-slug files **plus** two legacy combined datasets,
`church-fathers.json` (en) and `church-fathers-vi.json` (vi).

- `lib/churchFathersV2.ts` reads the **per-slug** files → the `/giao-phu` index and detail pages.
- `lib/churchFathers.ts` reads the **combined** files → still live on the **homepage**
  (`app/page.tsx`) and the **search page** (`app/tim-kiem/page.tsx`).

Diffed all 30 figures across both: **every quote (en and vi), every citation, every birth/death
year, every feast day, and every doctor/canonized flag is byte-identical** between the per-slug file
and the combined dataset. The per-slug files were derived from the combined dataset.

Two consequences:
1. Agreement between the two files is **not** corroboration. It is one source repeated.
2. **Every approved correction in pass 2 must be applied in up to three places** — the per-slug
   file, `church-fathers.json`, and `church-fathers-vi.json` — or the homepage and search page will
   keep showing the uncorrected value.

The only differences found were name *forms* (the combined file carries the fuller
`Formal Name (Common Name)` style, e.g. `Quintus Septimius Florens Tertullianus (Tertullian)`,
`Leo I (Leo the Great)`). Cosmetic, not factual — 18 of 30 differ this way.

### S4. Vietnamese names: five entries disagree with the site's own Vietnamese Catechism

Method per `docs/content-guide.md`: grep each figure's `name.vi` against the site's own Catechism
text (`content/content.json`), then check context to be sure the hit is the same person. No
Vietnamese Wikipedia used. These are **internal inconsistencies with the site's own published
usage**, which is the strongest available authority here.

| # | Entry `name.vi` | The site's own Catechism uses | Note |
|---|---|---|---|
| 4 | `Justinô Tử Đạo` | **`Giustinô`** — "thánh Giustinô tử đạo" (×2, incl. the CCC §1345 passage on the earliest Mass description) | Same person, different romanization |
| 10 | `Ciprianô thành Carthage` | **`Cyprianô`** — "theo kiểu nói của thánh Cyprianô" | Same person, `C-` vs `Cy-` |
| 22 | `Gioan thành Antiôkia` | **`Gioan Kim Khẩu`** (×6, incl. the CCC's own list of catechetical Fathers) | **Most serious.** See T1 below |
| 24 | `Gioan Cassianô` | **`Casianô`** — "thánh Gioan Casianô và thánh Grêgôriô Cả" | Single `s` |
| 14 | `Ephrem người Syria` | **`Êphrem`** — "các thánh thi kính Mẹ Thiên Chúa của thánh Êphrem" | Missing circumflex |

**T1 — entry 22 is the one to look at first.** The site's primary Vietnamese name for John
Chrysostom is currently `Gioan thành Antiôkia` ("John of Antioch"), while `name.en` says
"John Chrysostom". Two problems: (a) the site's own Catechism calls him `Gioan Kim Khẩu` six times,
including in the CCC's list of Fathers who shaped catechesis, so the Giáo Phụ page contradicts the
Giáo Lý pages; (b) "John of Antioch" is separately the name of the *Patriarch of Antioch* who led
the Antiochene party against Cyril at Ephesus (431) — a different man who also appears in this same
section's content (entry 25, Cyril of Alexandria). The combined dataset already carries
`Gioan thành Antiôkia (Gioan Kim Khẩu)`; the per-slug file dropped the half that identifies him.

Non-findings, checked and clear: `Irênê thành Lyon` (site: "Thánh Irênê Lyon" — `thành` is a normal
connector), `Athanasiô`, `Ambrôsiô`, `Augustinô`, `Grêgôriô`, `Cyrillô`, `Clêmentê`, `Inhaxiô` all
match the site's usage. `Đamas` / `Đamát` hits in the Catechism turned out to be Pope Damasus and
the road to Damascus, not John of Damascus — so entry 30's `Gioan thành Đamas` is simply not
attested either way in the site's own text and was passed to the verifier for external checking.

Nine figures (3, 7, 8, 9, 12, 15, 18, 21, 28, 29) appear nowhere in the site's Catechism text under
any probed spelling, so the site's own usage cannot adjudicate them; those went to the verifiers for
external Vietnamese-Catholic sourcing.

---

## Per-entry findings

### 1. clement-of-rome — Clement of Rome

**Checked:** Header `quote` and both quotations in `more-quotes` collated word-by-word against the Roberts–Donaldson (ANF) text at CCEL and the Lightfoot text at earlychristianwritings; `dates`, `facts` (feast, pope, canonized, 1 work), the martyrdom legend, the Flavius Clemens theory, the San Clemente archaeology and the Codex Alexandrinus claim against the 1913 *Catholic Encyclopedia*, Cassius Dio 67.14 secondary literature, the basilica's own site and manuscript scholarship; Vietnamese forms grepped in `content/content.json`; cross-checked `content/giao-phu/church-fathers.json` id 1. Confirmed and **not** flagged below: feast 23 November (optional memorial, General Roman Calendar); 1 Clement in the 5th-c. Codex Alexandrinus; the martyrdom legend being no older than the 4th century *and* the 1913 CE saying exactly that ("This story is not older than the fourth century"); Flavius Clemens executed under Domitian on a charge of "atheism"; Irenaeus saying Clement had seen and conversed with the apostles; the first phoenix quotation being verbatim Roberts–Donaldson; `works` = 1 authentic work; `ccc_refs` empty.

| Field | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| `quote.en` (and identical `key_quote.text` in `church-fathers.json`) | "…there would be strife over the bishop's office. For this reason… they afterwards **added an appendix**, to the effect that if these should fall asleep, other approved men should succeed to their ministry." | The substance is genuinely 1 Clem 44:1–2, but this wording is in **no** standard translation. Roberts–Donaldson (ANF): "Our apostles also knew… that there would be strife on account of the office of the episcopate. For this reason, therefore, inasmuch as they had obtained a perfect fore-knowledge of this, they appointed those [ministers] already mentioned, and afterwards gave instructions…" — the word "appendix" does not occur on the ANF page or its footnotes. Lightfoot: "…strife over the name of the bishop's office… they provided a continuance." Lightfoot's larger edition renders the crux word ἐπινομήν as "added the codicil"; the Greek here is a recognised textual crux, with note that "the Greek is perhaps corrupt". Since the entry hangs an apostolic-succession argument on this clause, a hybrid rendering with no named edition is a real exposure. | `contested` → adopt one named translation verbatim and cite the verse, e.g. `en`: "Our apostles also knew, through our Lord Jesus Christ, that there would be strife on account of the office of the episcopate. For this reason… they appointed those [ministers] already mentioned, and afterwards gave instructions, that when these should fall asleep, other approved men should succeed them in their ministry." · `source.en`: "1 Clement 44:1–2 (Roberts–Donaldson)" · `source.vi`: "Thư Clêmentê I, 44,1-2 (bản dịch Roberts–Donaldson)" | [CCEL ANF 1 Clem 44](https://ccel.org/ccel/clement_rome/first_epistle_to_the_corinthians/anf01.ii.ii.xliv.html), [Lightfoot text](https://www.earlychristianwritings.com/text/1clement-lightfoot.html), [Lightfoot, Apostolic Fathers Pt I Vol 2](https://www.earlychristianwritings.com/lightfoot/pt1vol2/translation1.html) |
| `sections[more-quotes]` — 2nd phoenix quotation, in quotation marks and attributed "Roberts–Donaldson translation" | "takes up its predecessor's remains and carries them to Egypt to the city called Heliopolis, and in the daylight in the sight of all it flies to the altar of the Sun, places them there, and then starts back to its former home" | Not verbatim Roberts–Donaldson. ANF reads: "bearing these it passes from the land of Arabia into Egypt, to the city called Heliopolis. And, in open day, flying in the sight of all men, it places them on the altar of the sun, and having done this, hastens back to its former abode." (The *first* phoenix quotation in the same paragraph **is** verbatim R–D and is fine.) | `corrected` → replace the quoted string with the ANF wording above, or drop the quotation marks and present it as a paraphrase | [CCEL ANF 1 Clem 25](https://ccel.org/ccel/clement_rome/first_epistle_to_the_corinthians/anf01.ii.ii.xxv.html) |
| `sections[more-quotes]` — citation "(1 Clement 25…)" | The whole passage, including "if the Creator preserves such order even in a bird, how much more will he raise up those who have served him faithfully", cited to ch. 25 | Ch. 25 is the phoenix description only. The "how much more" resurrection inference is **ch. 26:1**. | `corrected` → cite `1 Clement 25–26` / `Thư Clêmentê I, đoạn 25-26` | [CCEL ANF 1 Clem 25](https://ccel.org/ccel/clement_rome/first_epistle_to_the_corinthians/anf01.ii.ii.xxv.html), [Lightfoot text](https://www.earlychristianwritings.com/text/1clement-lightfoot.html) |
| `life[1]` / `facts`-adjacent claim (also `known_for` in `church-fathers.json`) | "the earliest Christian document outside the New Testament **with a securely known author**" | 1 Clement is **anonymous**. Its address is simply "The Church of God which sojourns at Rome, to the Church of God sojourning at Corinth"; it never names Clement. The attribution rests on Dionysius of Corinth (c. 170), preserved in Eusebius, *HE* 4.23. Standard reference descriptions call it "an anonymous letter of the church of Rome". "Securely known author" overstates. | `contested` → hedge, e.g. `en`: "…the earliest Christian document outside the New Testament that can be securely dated and confidently attributed — the letter is formally anonymous, sent in the name of the church of Rome, and has been credited to Clement since at least Dionysius of Corinth (c. 170)" · `vi`: "…tài liệu Kitô giáo cổ nhất ngoài Tân Ước có thể xác định niên đại chắc chắn — bức thư về hình thức là vô danh, gửi nhân danh Giáo hội Rôma, và được quy cho Clêmentê ít là từ thời Điônysiô thành Côrintô (khoảng năm 170)" | [1913 CE, Pope St. Clement I](https://www.newadvent.org/cathen/04012c.htm), [Richardson, *Early Christian Fathers* (CCEL)](https://ccel.org/ccel/richardson/fathers.vi.i.i.html) |
| `role.en` / `role.vi` = "Bishop of Rome · **Martyr**" / "Giám mục Rôma · **Tử đạo**" | Flat, unhedged "Martyr" | **Contradicts the entry's own `martyrdom` section.** The earliest witnesses (Irenaeus, Eusebius, Jerome) record a natural death; Clement is not called a martyr before the 5th century; the anchor/Crimea story comes from the *Passio Sancti Clementis*, 4th–5th c. He is liturgically titled martyr, so the label isn't "wrong" — but it should not be flatter than the body text. | `contested` → `en`: "Bishop of Rome · Martyr (by tradition)" · `vi`: "Giám mục Rôma · Tử đạo (theo truyền thống)" | [1913 CE](https://www.newadvent.org/cathen/04012c.htm), [New World Encyclopedia, Pope Clement I](https://www.newworldencyclopedia.org/entry/Pope_Clement_I) |
| `dates.born` = `35`; `facts` "Born / Sinh" = "c. 35 AD" | A specific birth year | No source gives one. "No reliable source gives even the approximate date or place of his birth." The 1913 CE gives only the episcopate ("apparently 90-99") and death ("about 160 the death of St. Clement was believed to have been in 99"). `c. 35` is web folklore, not scholarship. | `unverifiable` → drop the born year: `dates.display` → `? — c. 99`, `dates.born` → `null`, `facts` Born → `en`: "Unknown" / `vi`: "Không rõ". If the field cannot be null, mark `[cần kiểm chứng]`. | [Britannica, St. Clement I](https://www.britannica.com/biography/Saint-Clement-I), [1913 CE](https://www.newadvent.org/cathen/04012c.htm) |
| `sections[context]` | "Clement wrote **as Bishop of Rome**…" (same phrase in `life[1]`) | Widely doubted: there is no evidence of a monarchical episcopate at Rome this early. Lampe and others argue Rome was led by a college of presbyter-bishops, with Clement a prominent presbyter-bishop and the church's external correspondent; a single-bishop model is discernible at Rome only by the mid-2nd century. The letter itself is written in the church's name, not his. Given that the entry's apologetics section already concedes contested ground, the body should too. | `contested` → hedge, e.g. `en`: "Clement wrote in the name of the church of Rome — later tradition, and the letter's early readers, identify him as its bishop, though scholars debate whether Rome yet had a single bishop" · `vi`: "Clêmentê viết nhân danh Giáo hội Rôma — truyền thống về sau xác định ngài là giám mục của giáo hội ấy, dù các học giả còn tranh luận liệu Rôma khi đó đã có một giám mục duy nhất hay chưa" | [History of papal primacy (with Lampe citations)](https://en.wikipedia.org/wiki/Successor_of_the_Prince_of_the_Apostles), [Did Rome Have a Bishop Before the Late Second Century?](https://lucadanselmi.substack.com/p/did-rome-have-a-bishop-before-the) |
| `sections[context]` | "Clement wrote around 96 AD, **in the years just after Domitian's reign**" | Two problems. (a) Internally inconsistent: Domitian was killed 18 Sept 96, so "around 96" is *during* his reign, not "the years just after". (b) The dating premise is contested — scholars propose ranges from c. 64–70 to 100–140 (Welborn: 80–140), and the "Domitianic persecution" that anchors the traditional 96 is now largely rejected ("most modern commentators no longer accept a Domitianic persecution of Christians", Thompson). The mid-90s remains the majority date, but the entry states the surrounding circumstance as fact. | `contested` → `en`: "Clement wrote most likely in the mid-90s AD, at the end of or just after Domitian's reign (proposals range from the 70s to the early 2nd century)" · `vi`: "Clêmentê viết nhiều phần chắc vào giữa thập niên 90, vào cuối hoặc ngay sau triều Đôminatianô (các đề nghị trải từ thập niên 70 đến đầu thế kỷ II)" | [earlychristianwritings, First Clement intro (dating survey)](http://www.earlychristianwritings.com/1clement.html), [Biblical Archaeology Society, Domitian's persecution](https://www.biblicalarchaeology.org/daily/biblical-topics/post-biblical-period/domitian-persecution-of-christians/) |
| `sections[martyrdom]` | "confusion with a different, **later** figure, Flavius Clemens" | Flavius Clemens was consul Jan–Apr **95** and executed shortly after — i.e. *earlier* than Clement's traditional death (c. 99), not later. The confusion hypothesis itself is real and correctly reported. | `corrected` → drop "later": `en`: "confusion with a different figure, Flavius Clemens, a Roman consul executed in 95 under Domitian…" · `vi`: "nhầm lẫn với một nhân vật khác là Flavius Clêmentê, một quan chấp chính Rôma bị xử tử năm 95 dưới thời Đôminatianô…" | [Cassius Dio 67.14 (Judaism and Rome)](https://www.judaism-and-rome.org/cassius-dio-roman-history-lxvii141-2), [Titus Flavius Clemens (consul)](https://en.wikipedia.org/wiki/Titus_Flavius_Clemens_(consul)) |
| `sections[martyrdom]` | "the Basilica of San Clemente in Rome, **built over an excavated 1st-century house church**" | The lowest excavated level is a 1st-century Roman domestic/industrial complex (a multi-unit brick building on republican foundations damaged in the AD 64 fire, most likely *horrea* — grain storage); Christian adaptation of the site is dated to roughly the 3rd century, with the first basilica in the 4th. "1st-century house church" states as archaeology what is actually a devotional identification. | `contested` → `en`: "…built over a 1st-century Roman building later adapted for Christian use" · `vi`: "…được xây trên nền một tòa nhà Rôma thế kỷ I về sau được dùng cho việc thờ phượng Kitô giáo" | [Basilica di San Clemente — official site, excavations](https://www.basilicasanclemente.com/eng/the-basilica-and-the-excavations/), [Ancient History Sites, Basilica of San Clemente](https://www.ancient-history-sites.com/sites/basilica-of-san-clemente/) |
| Vietnamese term, `sections[context]` + `sections[martyrdom]`: `Đôminatianô` | Vietnamese form of Domitian | Not found anywhere in the site's own `content/content.json` (0 hits), and I could not find this exact spelling on any Vietnamese Catholic authority. Latin *Domitianus* → the expected transliteration is `Đômitianô`; "Đôminatianô" reads like *Dominatianus*. Confirmed OK by contrast: `Clêmentê` (1 hit in `content.json`) and `Côrintô` (2 hits). | `unverifiable` → verify with HĐGM VN / TGP Sài Gòn and likely correct to `Đômitianô`; flag `[cần kiểm chứng]` until then | [site grep: `content/content.json`], [hdgmvietnam.com, Bách hại tôn giáo](https://hdgmvietnam.com/chi-tiet/bach-hai-ton-giao-52994) |

**Cross-file:** `content/giao-phu/church-fathers.json` id 1 carries no facts that *contradict* the per-slug file, but it repeats the same defective `key_quote.text` ("added an appendix") — fix both together. Its `martyrdom` field is already correctly hedged ("Traditionally said to have been martyred…").

**Not checked:** the Vietnamese form `Krym` for Crimea (no Vietnamese Catholic source consulted); whether Clement's relics at San Clemente have any documented provenance beyond the 9th-c. Cyril–Methodius translation; `portrait` attribution/licence.

**Keep for `sources` retrofit:** [1913 Catholic Encyclopedia, Pope St. Clement I](https://www.newadvent.org/cathen/04012c.htm), [CCEL ANF text of 1 Clement](https://ccel.org/ccel/clement_rome/first_epistle_to_the_corinthians/), [earlychristianwritings.com, First Clement (dating survey)](http://www.earlychristianwritings.com/1clement.html)

---

### 2. ignatius-of-antioch — Ignatius of Antioch

**Checked:** Header `quote` and both `apologetics` quotations collated against Roberts–Donaldson (Smyrnaeans 7 and 8); the `more-quotes` Eucharist quotation collated against Roberts–Donaldson Ephesians 20 **and** Philadelphians 4; `dates` against the 1913 CE and Barnes 2008; `role` ordinal against Eusebius/Origen testimony; the Colosseum claim, the *Martyrium Ignatii* manuscript, the three recensions and the Zahn/Lightfoot/Harnack settlement; the Romans dateline; feast day; Vietnamese forms grepped in `content/content.json` and checked at TGP Sài Gòn / HĐGM VN; cross-checked `church-fathers.json` id 2. Confirmed and **not** flagged below: `quote` "Where Jesus Christ is, there is the Catholic Church" and the fuller apologetics form both exact at Smyrnaeans 8:2 (R–D); Smyrnaeans 7:1 exact; first recorded use of "Catholic Church"; the Colosseum scepticism (the entry is *right* to hedge — condemned *ad bestias* also died in the Circus Flaminius, the Gaianum, the Circus of Hadrian, the Amphitheatrum Castrense and the Stadium of Domitian, and the 1913 CE's Flavian-amphitheatre assertion is not evidenced); *Martyrium Ignatii*'s oldest witness the 10th-c. Codex Colbertinus (Paris); long recension = the seven interpolated + six added = thirteen; the 1870s–80s Zahn/Lightfoot/Harnack settlement; "ten leopards" at Romans 5; Barnes, "The Date of Ignatius", *Expository Times* 120 (2008) 119–30; feast 17 October, moved there in 1969 from 1 February (where it had stood since the 12th c.), 17 October being the Antiochene date; not a Doctor of the Church; `ccc_refs` empty.

| Field | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| `sections[more-quotes]` — the Eucharist quotation | "**[Take care, then, to] use one Eucharist**… breaking one and the same bread, which is the medicine of immortality…" cited as "(Letter to the Ephesians, 20:2, Roberts–Donaldson translation)" | **Two different letters spliced inside one set of quotation marks.** Ephesians 20:2 (R–D) reads "…so that you obey the bishop and the presbytery with an undivided mind, breaking one and the same bread, which is the medicine of immortality, and the antidote to prevent us from dying, but [which causes] that we should live for ever in Jesus Christ." There is no "one Eucharist" clause in Ephesians 20. "Take heed, then, to have but one Eucharist" is **Philadelphians 4**. The bracket disguises the splice as an editorial insertion. This is the most serious finding in the entry. | `corrected` → either cut the bracketed clause and quote Ephesians 20:2 alone, or cite both: `en` "…\"breaking one and the same bread, which is the medicine of immortality…\" (Ephesians 20:2); elsewhere he urges the churches to \"take heed, then, to have but one Eucharist\" (Philadelphians 4)" · `vi` correspondingly "(Thư gửi tín hữu Êphêsô, 20:2)" and "(Thư gửi tín hữu Philađelphia, 4)" | [New Advent, Ignatius to the Ephesians (R–D)](https://www.newadvent.org/fathers/0104.htm), [New Advent, Ignatius to the Philadelphians (R–D)](https://www.newadvent.org/fathers/0108.htm) |
| `dates.born` = `35`; `dates.display` "c. 35 — c. 108"; `facts` "Born / Sinh" = "c. 35 AD" | c. 35 | Unattested. The 1913 CE gives "born in Syria, around the year 50"; other reference works give no birth date at all, and ranges as wide as c. 35–50 circulate with no source behind them. Given the entry's own (correct) note that the *death* may be as late as the 140s, a firm 35 is doubly unsafe. | `contested` → drop or widen: `dates.born` → `null`, `dates.display` → `? — c. 108`; `facts` Born → `en`: "Unknown (some sources c. 50 AD)" · `vi`: "Không rõ (một số nguồn cho khoảng năm 50)" | [1913 CE, St. Ignatius of Antioch](https://www.newadvent.org/cathen/07644a.htm), [encyclopedia.com, Ignatius of Antioch](https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/ignatius-antioch) |
| `role.vi` / `role.en` = "Giám mục **thứ 3** của Antiôkia" / "**3rd** Bishop of Antioch" (same in `church-fathers.json`) | Flat "3rd" | Depends entirely on a counting convention the entry doesn't state. **Origen calls him the second bishop after Peter**; Eusebius has Evodius first and Ignatius next. The 1913 CE is explicit: "*If we include St. Peter*, Ignatius was the third Bishop of Antioch and the immediate successor of Evodius." Walter Bauer questioned Evodius's existence altogether. A Vietnamese Catholic source (TGP Sài Gòn) likewise has him succeeding Evodius who succeeded Peter. | `contested` → `en`: "Bishop of Antioch (traditionally the 3rd, counting St. Peter) · Martyr" · `vi`: "Giám mục Antiôkia (theo truyền thống là vị thứ 3, nếu tính cả Thánh Phêrô) · Tử đạo" | [1913 CE, St. Ignatius of Antioch](https://www.newadvent.org/cathen/07644a.htm), [1913 CE, Evodius](https://www.newadvent.org/cathen/05653a.htm) |
| `facts` "Tác phẩm còn lại / Surviving works" = "1 tác phẩm / 1 work" | 1 | Contradicts the entry's own `life[1]` ("all seven surviving letters") and `works[0]` ("The Seven Letters"). The surviving authentic corpus is seven letters, universally counted as seven. | `corrected` → `vi`: "7 bức thư" · `en`: "7 letters" | [CCEL, The Manuscripts of Ignatius' Letters](https://www.ccel.org/ccel/richardson/fathers.vi.ii.ii.html), [earlychristianwritings, The Epistles of Ignatius](http://www.earlychristianwritings.com/ignatius-intro.html) |
| `sections[context]` | «a single dateline in the Letter to the Romans (**"the 24th of August"**)» — set in quotation marks as if quoting the letter | The letter does not say "24 August". Romans 10:3 gives the Roman-calendar form: "on the ninth [day] before the Kalends of September" (Lightfoot: "These things I write to you on the 9th before the Kalends of September"). 24 August is the correct modern conversion (a.d. IX Kal. Sept., inclusive reckoning), so the *date* is right — but presenting a conversion inside quotation marks misrepresents the text. | `corrected` → `en`: «a single dateline in the Letter to the Romans ("the ninth day before the Kalends of September", i.e. 24 August) with no year given» · `vi`: «một dòng đề ngày trong Thư gửi tín hữu Rôma ("ngày thứ chín trước lịch Kalends tháng Chín", tức 24 tháng Tám) mà không ghi năm» | [Ignatius to the Romans, Lightfoot](https://www.earlychristianwritings.com/text/ignatius-romans-lightfoot.html), [Ignatius to the Romans, Roberts–Donaldson](http://www.earlychristianwritings.com/text/ignatius-romans-roberts.html) |
| `sections[context]` | "later scholars, most notably Timothy Barnes, have argued for a date as late as the **130s–140s**" | Barnes (2008) argues specifically that "the letters were probably written in the **140s**". The wider 130s figure belongs to other revisionists (Hübner, Lechner) and to the general "135–140" range cited in surveys — not to Barnes. Attributing the whole span to him is slightly off. | `corrected` → `en`: "…most notably Timothy Barnes, who argues the letters were probably written in the 140s; other revisionists put them in the 130s or later" · `vi`: "…đáng chú ý nhất là Timothy Barnes, người lập luận rằng các bức thư nhiều phần chắc được viết vào thập niên 140; một số học giả khác đề nghị thập niên 130 hoặc muộn hơn" | [Barnes, "The Date of Ignatius", Expository Times 120 (2008) 119–30](https://journals.sagepub.com/doi/10.1177/0014524608098730), [encyclopedia.com, Ignatius of Antioch](https://www.encyclopedia.com/environment/encyclopedias-almanacs-transcripts-and-maps/ignatius-antioch) |
| Vietnamese naming — internal inconsistency across the file | `name.vi` and `apologetics` use **Inhaxiô**; every `sections` body uses **Ignatiô**. `sections[context]` uses **Antiôkia** and **An-ti-ô-khi-a** in the same paragraph. | `Inhaxiô` is the site's own form (3 hits in `content/content.json`) and the standard Vietnamese Catholic form (TGP Sài Gòn, HĐGM VN). `Ignatiô` has **0** hits on the site and I found it on no Vietnamese Catholic authority. `Antiôkia` (TGP Sài Gòn) and `Antiôkhia` (HĐGM VN) are both attested; the hyphenated `An-ti-ô-khi-a` is not, and appearing beside `Antiôkia` in one paragraph is plainly unintentional. (`Pôlycarpô` checks out — TGP Sài Gòn, 23/02.) | `corrected` → replace every `Ignatiô` with `Inhaxiô`; replace `An-ti-ô-khi-a` with `Antiôkia` for internal consistency | [TGP Sài Gòn, 17/10 Thánh Inhaxiô Antiôkia](https://tgpsaigon.net/bai-viet/ngay-17-10-thanh-inhaxio-antiokiagiam-muc-tu-dao-44153), [HĐGM VN, 17/10 Thánh Inhaxiô thành Antiôkhia](https://hdgmvietnam.com/chi-tiet/ngay-17-thang-10-thanh-inhaxio-thanh-antiokhia-giam-muc-tu-dao-tai-roma), [TGP Sài Gòn, 23/02 Thánh Pôlycarpô](https://tgpsaigon.net/bai-viet/ngay-23-02-thanh-polycarpogiam-muctu-dao-49086) |
| `works[0].date` = "c. 107" | Unhedged | Sits oddly against `facts` Died ("c. 108… some sources up to c. 140; disputed") and the entry's own Barnes note. Not wrong — 107 is the traditional date — but it is the one place the dating debate is silently dropped. | `contested` → `date`: "c. 107 (còn tranh luận)" / "c. 107 (disputed)", or leave as is and rely on the `facts` hedge — low severity | [1913 CE](https://www.newadvent.org/cathen/07644a.htm), [Barnes 2008](https://journals.sagepub.com/doi/10.1177/0014524608098730) |

**Cross-file:** `church-fathers.json` id 2 agrees with the per-slug file on dates, feast, canonization and quotes. Two notes: (a) it repeats "3rd Bishop of Antioch" unhedged, so the `role` fix applies to both; (b) its `key_writings[0].description` names all seven letters, which makes the per-slug `facts` value "1 work" a contradiction *across* files as well as within one.

**Not checked:** the 20 December Eastern feast date (Byzantine calendar not consulted — flag `[cần kiểm chứng]` until verified); the claim in `life[0]` that Ignatius was "possibly appointed bishop by St. Peter" and was a disciple of John (both late traditions — I confirmed they are traditions but did not trace their earliest attestation); `portrait` attribution to Cesare Fracanzano / Galleria Borghese; whether the Romans dateline itself is textually secure.

**Keep for `sources` retrofit:** [1913 Catholic Encyclopedia, St. Ignatius of Antioch](https://www.newadvent.org/cathen/07644a.htm), [Barnes, "The Date of Ignatius", Expository Times 120 (2008)](https://journals.sagepub.com/doi/10.1177/0014524608098730), [CCEL, The Manuscripts of Ignatius' Letters (Richardson)](https://www.ccel.org/ccel/richardson/fathers.vi.ii.ii.html)

---

### 3. polycarp-of-smyrna — Polycarp of Smyrna

**Checked:** Both quotations and the `apologetics` relic quotation traced to the actual Greek-text
translations of the *Martyrdom of Polycarp* (ANF at newadvent.org and Lightfoot at
earlychristianwritings.com) — chapters 9, 11, 15, 16 and 18 read in full; dates and the Rome/Anicetus
chronology checked against the Statius Quadratus and Anicetus-accession literature; the two `works[]`
entries checked for **authorship**; feast day against the current General Roman Calendar; Vietnamese
forms against `content/content.json` and tgpsaigon.net. The `quote` itself (Mart. Pol. 9) and the
`more-quotes` Lightfoot citation (11:2) are **exact and correctly located** — those check out.

| Field | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| `works[1]` + `facts` "Surviving works / Tác phẩm còn lại" = "2 works / 2 tác phẩm" | *The Martyrdom of Polycarp* is listed as one of **Polycarp's** works | Polycarp did not write it. It is a letter **from the church of Smyrna to the church of Philomelium**, penned by a member of that church (Evaristus, per 20:1) and transmitted via Marcianus → Gaius → Socrates → Pionius (22:2–4). Britannica: "The author is unknown." Polycarp has **one** surviving work. The site's own `church-fathers.json` already gets this right: Philippians is "His only certainly authentic surviving work" and the Martyrdom is "Written by his own church shortly after his death." | `corrected` → set `facts` Surviving works to `vi: "1 tác phẩm (Thư gửi tín hữu Philípphê); Tử Đạo Ký Polycarp do giáo đoàn Smyrna viết"` / `en: "1 work (Letter to the Philippians); the Martyrdom was written by the church of Smyrna"`, and either drop the Martyrdom from `works[]` or move it to `works_note` | [Britannica, Martyrdom of Polycarp](https://www.britannica.com/topic/Martyrdom-of-Polycarp), [Lightfoot text, ch. 20–22](https://www.earlychristianwritings.com/text/martyrdompolycarp-lightfoot.html), [Ehrman blog](https://ehrmanblog.org/is-the-martyrdom-of-polycarp-an-authentic-account/) |
| `sections[id=context]` — "\"Away with the Atheists!\" being shouted **at** Polycarp rather than **by** him" / "…nhắm vào Polycarp chứ không phải do ngài nói ra" | The entry asserts Polycarp never said the phrase | **He did.** Mart. Pol. 9: the proconsul urges him to "say, Away with the Atheists," and Polycarp, "waving his hand towards them [the heathen crowd]," said "**Away with the Atheists**." The crowd shouts it separately at ch. 3 ("Away with the Atheists; let Polycarp be sought out!"). Both happen; the point of the scene is that Polycarp *redirected* the phrase at the pagans, which the entry inverts. | `corrected` → e.g. `en: "…\"Away with the Atheists!\" — a cry the crowd had raised against the Christians, which Polycarp then turned back on the pagan crowd itself when the proconsul ordered him to say it"` / `vi: "…\"Hãy diệt trừ bọn vô thần!\" — tiếng hô đám đông nhắm vào các Kitô hữu, mà chính Polycarp đã quay ngược lại nhắm vào đám đông ngoại giáo khi viên tổng trấn buộc ngài phải nói câu ấy"` | [ANF, Mart. Pol. 3 & 9 (newadvent)](https://www.newadvent.org/fathers/0102.htm), [Lightfoot 9:2](https://www.earlychristianwritings.com/text/martyrdompolycarp-lightfoot.html) |
| `life[1]` — "the oldest **fully reliable** eyewitness record of a Christian's death for the faith" | Stated flat, unhedged | Contested. Candida Moss ("On the Dating of Polycarp") argues on historical, literary and conceptual grounds for composition "as late as the middle of the third century"; ch. 4 (Quintus) is widely suspected as a secondary interpolation, and the integrity of the text is a live question. "Earliest surviving martyr act" is defensible; "fully reliable" and "eyewitness" are not. The entry's own `martyrdom` section already hedges the miracle detail, so this line is internally inconsistent with it. | `contested` → soften to `en: "the earliest surviving Christian martyr account, written by his own church, though its integrity and date remain debated"` / `vi: "trình thuật tử đạo Kitô giáo cổ nhất còn lại, do chính giáo đoàn của ngài viết, dù tính toàn vẹn và niên đại vẫn còn được tranh luận"` | [Peter Kirby, Dating the Martyrdom of Polycarp in the Third Century](https://peterkirby.com/martyrdom-polycarp-third-century.html), [BMCR review of Moss, *Ancient Christian Martyrdom*](https://bmcr.brynmawr.edu/2012/2012.12.24/) |
| `life[1]` — "Traveled to Rome **c. 154 AD**" (also in `church-fathers.json` `known_for`) | A bare c. 154 | This collides with `dates.died = 155`. Anicetus's accession is placed c. 155–157 (Jerome's version of Eusebius: 156–57; Britannica/Encyclopedia.com: c. 155). The visit is a **terminus** used to argue Anicetus was in office by c. 155 and is one of the standard arguments for pushing the martyrdom to 156 or later. Some reference works place the visit as late as 160–162. The 1913 CE (the common ancestor of much of the open web here) says outright that scholars "must either give up the date of the martyrdom or suppose that Eusebius post-dated…the accession of Anicetus." | `contested` → hedge to `en: "Traveled to Rome shortly before his death (c. 154–155, on some reckonings later) to discuss the Quartodeciman controversy with Pope Anicetus"` / `vi: "Đi Rôma không lâu trước khi qua đời (khoảng năm 154–155, có tài liệu đặt muộn hơn)…"` | [Catholic Encyclopedia, St. Polycarp](https://www.newadvent.org/cathen/12219b.htm), [Encyclopedia.com, St. Anicetus](https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/anicetus-st-pope), [Britannica, St Anicetus](https://www.britannica.com/biography/Saint-Anicetus) |
| `facts` Died — "(some scholarship to 156 or **167** AD)"; `sections[id=martyrdom]` — "Eusebius's chronology instead points to 167 AD, and the question remains genuinely unresolved" | Presents 155 vs 167 as the live two-sided debate | The live debate is **155 vs 156** (Statius Quadratus's proconsulship, dated 153/4–155/6 from Aelius Aristides). Eusebius's Chronicle date of 166/7 "has now been almost universally abandoned." A separate minority (Moss, and Grégoire's older c. 177) argues for a much later *composition*. Presenting 167 as a co-equal open option overstates it. | `contested` → replace 167 with the real disagreement, e.g. `en: "c. 155 or 156 AD (dated from the proconsulship of Statius Quadratus; Eusebius's later date of 166/7 is now largely abandoned)"` / `vi: "khoảng năm 155 hoặc 156 (tính theo nhiệm kỳ tổng trấn Statius Quadratus; niên đại 166/7 của Êusêbiô nay hầu như không còn được chấp nhận)"` | [Lucius Statius Quadratus (proconsulship 154–155)](https://en.wikipedia.org/wiki/Lucius_Statius_Quadratus) — pointer only; underlying evidence at [earlychurch.org.uk, Polycarp](https://earlychurch.org.uk/polycarp.php) and [Fitzgerald, *Polycarp of Smyrna* (st-philip.net PDF)](https://www.st-philip.net/files/Fitzgerald%20Patristic%20series/polycarp_of_smyrna.pdf) |
| `apologetics[1]` — bones "more precious than precious stones and more valuable than gold" (Mart. Pol. 18) | Given inside quotation marks as a quotation | The **chapter is right**, but this wording matches no standard published translation. ANF 18: "more precious than the most exquisite jewels, and more purified than gold." Lightfoot 18: "more valuable than precious stones and finer than refined gold." The entry's version is a hybrid. | `corrected` → use one attested translation, e.g. `en: "…more precious than the most exquisite jewels, and more purified than gold\" (Martyrdom of Polycarp, 18, ANF translation)"` and adjust the vi accordingly | [ANF Mart. Pol. 18 (newadvent)](https://www.newadvent.org/fathers/0102.htm), [Lightfoot Mart. Pol. 18](https://www.earlychristianwritings.com/text/martyrdompolycarp-lightfoot.html) |
| `sections[id=theology]` — "his **one** surviving letter, to the Philippians" | Treated as a single unified letter | Correct as to count, but the letter's **unity** is a long-standing scholarly question: P. N. Harrison (1936) argued it conflates two letters by Polycarp (ch. 13 written while Ignatius was still alive, the bulk c. 120–135), which held near-consensus status through much of the 20th c. and is still accepted by many. Worth a hedge only because `works[].date` is empty and a future retrofit will need to pick one. | `contested` → optional `works_note` addition: `en: "The Letter to the Philippians is often dated c. 110–135; some scholars (following P. N. Harrison) hold it combines two letters written at different times."` / `vi: "Thư gửi tín hữu Philípphê thường được xác định khoảng năm 110–135; một số học giả (theo P. N. Harrison) cho rằng nó ghép từ hai bức thư viết vào hai thời điểm khác nhau."` | [Harrison, *Polycarp's Two Epistles to the Philippians* (Internet Archive)](https://archive.org/details/polycarpstwoepis0000harr), [Vigiliae Christianae 75.5 (2021), "The Odd Future Participle at Pol. Phil. XIII"](https://brill.com/view/journals/vc/75/5/article-p469_1.xml?language=en) |
| Vietnamese terminology — internal inconsistency | `name.vi` / `apologetics` use **"Pôlycarpô"**; every `sections[]` body uses the bare Latin **"Polycarp"**. `quote.source.vi` / `works[]` use **"Cuộc Tử Đạo của Thánh Pôlycarpô"**; `sections[]` use **"Tử Đạo Ký Polycarp"** | "Pôlycarpô" is the attested Vietnamese Catholic form (TGP Sài Gòn, 23/02 feast page; also gpbanmethuot, daminhthanhtam). No objection to either title style, but the entry uses two of each in one page. | `corrected` → pick one per pair and apply throughout (recommend **"Pôlycarpô"** and **"Cuộc Tử Đạo của Thánh Pôlycarpô"**, matching `church-fathers-vi.json`) | [TGP Sài Gòn, Ngày 23/02: Thánh Pôlycarpô](https://tgpsaigon.net/bai-viet/ngay-23-02-thanh-polycarpogiam-muctu-dao-49086) |
| Cross-file (`church-fathers.json`) | `key_writings` there says Philippians is "His only certainly authentic surviving work" | **Contradicts** the per-slug file's `works[]` + "2 works". The combined file is the correct one. | `corrected` → fix the per-slug file to match | — (see row 1) |

**Not checked:** the `later-influence` section's claim that later martyr acts (Perpetua & Felicity, the
Scillitan Martyrs) structurally borrow from *Mart. Pol.* — plausible and widely repeated, but I did not
find a scholarly source for the specific dependency claim within budget. Also not checked: the
`further-reading` bibliographic details (Holmes 3rd ed. 2007; Dehandschutter, *Polycarpiana*, Peeters
2007) beyond their appearance in search results. Feast day 23 Feb **confirmed** in the current General
Roman Calendar; I did not check the pre-1969 date (26 Jan) since the entry does not claim one.

**Keep for `sources` retrofit:** [ANF *Martyrdom of Polycarp* (newadvent)](https://www.newadvent.org/fathers/0102.htm) · [Lightfoot translation (earlychristianwritings)](https://www.earlychristianwritings.com/text/martyrdompolycarp-lightfoot.html) · [Britannica, *Martyrdom of Polycarp*](https://www.britannica.com/topic/Martyrdom-of-Polycarp)

---

### 4. justin-martyr — Justin Martyr

**Checked:** `era` against the definition of the Apostolic Fathers corpus and against Benedict XVI's
own classification of Justin; the `quote` (1 Apol. 66) and the whole `more-quotes` Sunday-liturgy
passage (1 Apol. 67) verified word-for-word against the ANF/Roberts–Donaldson text at CCEL; dates,
birthplace, lay status and the surviving-works count against Benedict XVI's 2007 catechesis on
vatican.va; the *Acts of Justin* claims (three recensions, Rusticus, scourging and beheading) against
the Musurillo-based literature; 1 Apol. 46 for "Socrates and Heraclitus"; Vietnamese forms against the
site's own `content/content.json` and tgpsaigon.net / hdgmvietnam.com. **The quote and the 1 Apol. 67
block quotation are both exact and correctly cited** — no change needed there.

| Field | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| `era` = `"apostolic"` | Rendered on the site as **"Giáo phụ Tông đồ / Apostolic Fathers"** (span `c. 35 — 130`, `lib/giao-phu/eras.ts`) | **Wrong on a technical label.** "Apostolic Fathers" is a closed, defined corpus — 1 & 2 Clement, Ignatius, Polycarp, Didache, Barnabas, Hermas, *Mart. Pol.*, Diognetus, with Papias and Quadratus as fragments. Justin is never in it; he is the founding **apologist**. Benedict XVI, General Audience 21 Mar 2007: Justin is "the most important of the second-century **apologist** Fathers." He also falls entirely outside the `apostolic` span (c. 100–165 vs c. 35–130), and the site's *own* `ante-nicene` blurb — "the age of persecution and the first apologies: the Church explaining itself to an empire that did not yet understand it" — describes him exactly. **Both legacy datasets already say ante-Nicene**: `church-fathers.json` → `"era": "Ante-Nicene Father"`; `church-fathers-vi.json` → `"era": "Giáo phụ tiền Nixêa"`. | `corrected` → `"era": "ante-nicene"` | [Benedict XVI, General Audience on St Justin (vatican.va)](https://www.vatican.va/content/benedict-xvi/en/audiences/2007/documents/hf_ben-xvi_aud_20070321.html), [Loeb *Apostolic Fathers* vol. I contents](https://www.loebclassics.com/view/LCL024/2003/volume.xml), [Catholic Encyclopedia, The Apostolic Fathers](https://www.newadvent.org/cathen/01637a.htm) |
| `sections[id=context]` — "That **two of his three** major works are addressed to outsiders — an emperor, and a Jewish interlocutor" | Implies the Second Apology is not addressed to an outsider | The *Second Apology* is addressed **to the Roman Senate**. All three of Justin's surviving works are therefore addressed to outsiders. | `corrected` → `en: "That all three of his surviving works are addressed to outsiders — an emperor, the Roman Senate, and a Jewish interlocutor named Trypho — reflects a role…"` / `vi: "Việc cả ba tác phẩm còn lại của ngài đều được viết gửi cho người ngoài — một hoàng đế, Viện Nguyên Lão Rôma, và một người đối thoại Do Thái tên Tryphô — phản ánh một vai trò…"` | [Second Apology of Justin Martyr (addressee: Roman Senate)](https://en.wikipedia.org/wiki/Second_Apology_of_Justin_Martyr) — pointer; corroborated by [Judaism and Rome, Justin, *Second Apology* I–II](https://www.judaism-and-rome.org/justin-martyr-second-apology-i-ii) and [Kyle Pope, *The Second Apology of Justin Martyr*, text & translation (PDF)](https://ancientroad-publications.com/Books/JustinsSecondApology.pdf) |
| `facts` Surviving works = "3 tác phẩm / 3 works"; `works[]` lists the Second Apology as a standalone work | Presented as settled | **Confirmed as the standard count** — Benedict XVI: "three texts remain, two Apologies and the Dialogue with Tryphon" — so do *not* let a later pass "fix" this to 2. But note the count is disputed: Marcovich treats the Second Apology as an appendix to the First, and Minns & Parvis (the very Oxford edition the entry recommends in `further-reading`) argue it is a set of disconnected offcuts from Justin's reworking of the First. Parvis: "There are those who think that there are in fact two apologies, those who think that there is really only one, and those who compromise by opting for one and a half." | `confirmed` (with an optional `works_note` hedge: `en: "Whether the Second Apology is a separate work or an appendix to the First is long disputed."` / `vi: "Việc Hộ Giáo Thứ Hai là một tác phẩm riêng hay chỉ là phần phụ lục của Hộ Giáo Thứ Nhất vẫn còn được tranh luận."`) | [Benedict XVI (vatican.va)](https://www.vatican.va/content/benedict-xvi/en/audiences/2007/documents/hf_ben-xvi_aud_20070321.html), [Minns & Parvis, *Justin, Philosopher and Martyr: Apologies*, OUP](https://global.oup.com/academic/product/justin-philosopher-and-martyr-apologies-9780199542505) |
| Vietnamese terminology — internal inconsistency, same work, two names | `quote.source.vi`, `works[]` and `apologetics` use **"Hộ Giáo Thứ Nhất / Hộ Giáo Thứ Hai"**; `sections[id=context]` and `sections[id=more-quotes]` use **"Đệ Nhất Biện Giáo"** for the same work | Both "Hộ Giáo" and "Biện Giáo" are attested Vietnamese Catholic renderings ("Apologiae (Hộ Giáo)" at TGP Sài Gòn), so neither is wrong — but the entry uses both for one work on one page, and the `quote.source` chip will not match the prose. | `corrected` → standardise on **"Hộ Giáo Thứ Nhất"** (matches `works[]`, the `quote` source chip and `church-fathers-vi.json`) throughout the `sections[]` bodies | [TGP Sài Gòn, Ngày 01/6: Thánh Giustinô, Tử đạo](https://tgpsaigon.net/bai-viet/ngay-01-6-thanh-giustinotu-dao-36945) |
| Vietnamese terminology — `name.vi` = "Justinô Tử Đạo" | vs the site's own Catechism text | The site's own `content/content.json` (Vietnamese Catechism, §1345 on Justin's description of the Mass) uses **"thánh Giustinô"** twice. TGP Sài Gòn also uses "Giustinô". HĐGM VN uses "Justinô", and TGP Hà Nội "Giút-ti-nô" — so all are attested; this is a **site-internal inconsistency**, not a wrong form. Owner's call which way to unify. | `contested` (flag, don't silently change) → either keep "Justinô" (HĐGM VN) and accept the mismatch, or align to "Giustinô" to match the site's own Catechism | [content/content.json §1345](D:/Dropbox/Claude/MinhofGod%20Websites/Hoi%20Dap%20Cong%20Giao%20Website/content/content.json), [HĐGM VN, Ngày 01/6: Thánh Justinô, Triết gia, Tử đạo](https://hdgmvietnam.com/chi-tiet/ngay-01-thang-6-thanh-justino-triet-gia-tu-dao), [TGP Sài Gòn (Giustinô)](https://tgpsaigon.net/bai-viet/ngay-01-6-thanh-giustinotu-dao-36945) |
| Cross-file (`church-fathers.json` / `church-fathers-vi.json`) | Combined datasets place Justin as `"Ante-Nicene Father"` / `"Giáo phụ tiền Nixêa"` | Direct contradiction with the per-slug `era: "apostolic"`. The combined files are correct; the per-slug file is the one to change. Everything else in the combined files (dates, feast, quote, citation, martyrdom, role) **matches** the per-slug file. | `corrected` → see the `era` row | — |

**Not checked:** the specific claim that Tatian was Justin's student and later joined the Encratites is
well attested (Irenaeus, *AH* 1.28.1) but I did not open the Irenaeus text this session — treat as
verified-by-consensus only. Likewise the `later-influence` claim that Tertullian, Athenagoras and
Origen "worked within" the genre Justin created is a broad historiographical statement I did not source.
The `further-reading` bibliographic details (Minns & Parvis 2009 OUP; Falls, FOTC 1948/2008) were
confirmed to exist but not checked page-by-page. `ccc_refs` is **empty** — nothing to verify. Feast day
1 June and `dates` c. 100 – c. 165 both **confirmed** (vatican.va, current General Roman Calendar).

**Keep for `sources` retrofit:** [Benedict XVI, General Audience on St Justin (vatican.va, 21 Mar 2007)](https://www.vatican.va/content/benedict-xvi/en/audiences/2007/documents/hf_ben-xvi_aud_20070321.html) · [First Apology, ANF text at CCEL (ch. 66–67)](https://ccel.org/ccel/schaff/anf01.viii.ii.lxvi.html) · [Minns & Parvis, *Justin, Philosopher and Martyr: Apologies* (OUP 2009)](https://global.oup.com/academic/product/justin-philosopher-and-martyr-apologies-9780199542505)

---

### 5. irenaeus-of-lyons — Irenaeus of Lyons

**Checked:** Both quotations (*Adv. Haer.* III.3.1 and the `apologetics` III.3.2 Roman-primacy text) against the
ANF/Roberts–Donaldson text at newadvent and the scholarship on the Latin crux; `role` "Martyr" against the
attestation for his death; Doctor of the Church status against the Holy See's own 2022 announcement; dates
against the range scholarship actually gives; feast day against the current calendar. Verified by the
coordinating session, not a subagent (the fan-out was cut short by a spend limit).

| Field | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| `apologetics[0]` — Roman primacy | "It is a matter of necessity that every Church should agree with this Church **[Rome]**, on account of its **preeminent authority**" (III.3.2), offered as "one of the earliest and most explicit texts affirming a special, binding authority belonging to the Church of Rome" | **The translation is one of the most disputed sentences in patristics, and the entry states it as settled.** The Greek original is lost; the Latin *propter potentiorem principalitatem* has no agreed rendering — "preeminent authority", "more effective leadership", and "superior origin" are all live scholarly translations, and `principalitas` elsewhere in *Adv. Haer.* carries senses ranging from "sovereignty" to "origin" to "ancient". Nautin's philological study argues "this Church" may not even denote Rome but the universal Church. Note also that newadvent's own ANF text reads **`potiorem`**, not `potentiorem` — a manuscript variant the entry's confident gloss papers over. The bracketed "[Rome]" is an editorial insertion presented inside the quotation marks. | `contested` → keep the quotation but hedge the apparatus, e.g. append: `en: "— though the Latin (propter potentiorem principalitatem, the Greek being lost) is famously disputed, and is also rendered 'more effective leadership' or 'superior origin'."` / `vi: "— tuy nhiên bản Latinh (propter potentiorem principalitatem, nguyên bản Hy Lạp đã mất) vẫn còn được tranh luận sôi nổi, và cũng được dịch là 'vai trò lãnh đạo hữu hiệu hơn' hay 'nguồn gốc cao trọng hơn'."` Move "[Rome]" outside the quote marks. | [ANF *Adv. Haer.* III.3 (newadvent)](https://www.newadvent.org/fathers/0103303.htm), [RSR, *'Propter potentiorem Principalitatem'*](http://www.revue-rsr.com/note-de-lecture/propter-potentiorem-principalitatem-saint-irenee-adversus-haereses-iii-3-2/), [De Gruyter, *Potentiorem principalitatem in Irenaeus*](https://www.degruyterbrill.com/document/doi/10.1515/9783112719015-046/html?lang=en) |
| `role` = "2nd Bishop of Lyons · **Martyr**" / "Giám mục thứ 2 của Lyon · **Tử đạo**" | Martyrdom stated flat | **Historically very thin.** Jerome once calls him a martyr; the next mention is Gregory of Tours at the end of the 6th century. No early source records it, and the tradition "has been generally rejected by the scholarly community". **But** the Church's own liturgical books still title the 28 June memorial "Saint Irenaeus, Bishop, Martyr and Doctor of the Church" — so this is a genuine tension between liturgical title and historical attestation, not a simple error. The entry should not silently drop "Martyr"; it should not assert it as history either. | `contested` → keep `role` as is (it matches the liturgical title) but add the qualification in the entry's `martyrdom` section if not already there; if the owner prefers, `en: "2nd Bishop of Lyons · Martyr (by tradition)"` / `vi: "Giám mục thứ 2 của Lyon · Tử đạo (theo truyền thống)"` | [Catholic Culture, 28 June memorial title](https://www.catholicculture.org/culture/liturgicalyear/calendar/day.cfm?date=2024-06-28), [Catholic Encyclopedia, St. Irenaeus](https://www.newadvent.org/cathen/08130b.htm), [Britannica, Irenaeus](https://www.britannica.com/biography/Irenaeus) |
| `quote` (III.3.1) | "It is within the power of all... to contemplate the tradition of the Apostles, **made manifest** throughout the whole world; and **we are in a position to** reckon up those who were by the Apostles instituted bishops…" | Substantively faithful, but not verbatim in the translation it appears to be quoting. ANF reads: "It is within the power of all, therefore, in every Church, who may wish to see the truth, to contemplate clearly the tradition of the apostles **manifested** throughout the whole world; and **we are able to** reckon up those who were by the apostles instituted bishops in the Churches, and [to demonstrate] the succession of these men to our own times." The ellipsis itself is legitimate. | `corrected` → restore the ANF wording ("manifested", "we are able to") and name the translation, since the entry quotes it as though verbatim | [ANF *Adv. Haer.* III.3.1 (newadvent)](https://www.newadvent.org/fathers/0103303.htm), [Roberts–Donaldson, Book III (earlychristianwritings)](https://earlychristianwritings.com/text/irenaeus-book3.html) |
| `dates` = "c. 130 — c. 202"; `facts` Born "c. 130 AD", Died "c. 202 AD" | A single hedged pair | The "c." is doing the right work, but the real spread is wider than the entry implies. Britannica gives birth **c. 120/140** and death **c. 200/203**; the Catholic Encyclopedia reports the birth "controverted, between the years 115 and 125… or between 130 and 142", and says outright that "nothing is known of the date of his death". The c. 202 figure is not independent evidence — it derives from the Septimius Severus martyrdom tradition flagged above, so a doubted martyrdom is silently supplying the death year. | `contested` → widen, e.g. `display: "c. 130/140 — c. 200/202"`, `facts` Born `en: "c. 130–140 AD"` / `vi: "khoảng năm 130–140"`, Died `en: "c. 200–202 AD (date not securely known)"` / `vi: "khoảng năm 200–202 (niên đại không chắc chắn)"` | [Britannica, Irenaeus](https://www.britannica.com/biography/Irenaeus), [Catholic Encyclopedia, St. Irenaeus](https://www.newadvent.org/cathen/08130b.htm) |
| `facts` "Doctor of the Church: Yes" | Bare "Yes" | **Confirmed, and more recent than the entry suggests** — Pope Francis conferred the title only on **21 January 2022**, making Irenaeus the **37th** Doctor of the Church with the unique title ***Doctor Unitatis*** ("Doctor of Unity"), signed mid-way through the Week of Prayer for Christian Unity. Flagged `confirmed` so a later pass does not "correct" it away, and because the title itself is worth stating. | `confirmed` (notable) → optionally enrich to `en: "Yes — declared Doctor of the Church ('Doctor of Unity') by Pope Francis, 21 January 2022"` / `vi: "Có — được Đức Giáo hoàng Phanxicô tuyên phong Tiến sĩ Hội Thánh ('Tiến sĩ Hiệp Nhất') ngày 21/01/2022"` | [Holy See, Dicastery for Promoting Christian Unity](https://www.christianunity.va/content/unitacristiani/en/news/2022/2022-01-24-sant-iteneo-di-lione-doctor-unitatis.html), [Catholic World Report](https://www.catholicworldreport.com/2022/01/21/pope-francis-declares-st-irenaeus-doctor-of-unity/) |

**Not checked:** the Eastern feast of 23 August (appears on the OCA calendar but I did not confirm it against a
Greek/Slavic liturgical source); the "Surviving works: 2 works" count (correct for complete works — *Adv. Haer.*
and the *Demonstration* — but I did not check whether the surviving fragments should be mentioned); the
`context`, `theology`, `later-influence` and `further-reading` section bodies, which I did not open. `ccc_refs`
is empty. Vietnamese `Irênê thành Lyon` matches the site's own Catechism usage ("Thánh Irênê Lyon") — no issue.

**Keep for `sources` retrofit:** [ANF *Adversus Haereses* (newadvent)](https://www.newadvent.org/fathers/0103303.htm) · [Holy See, *Doctor Unitatis* decree announcement](https://www.christianunity.va/content/unitacristiani/en/news/2022/2022-01-24-sant-iteneo-di-lione-doctor-unitatis.html) · [Britannica, Irenaeus](https://www.britannica.com/biography/Irenaeus)

---

### 6. clement-of-alexandria — Clement of Alexandria

**Checked:** the headline quote against the ANF text of *Stromata* I.5; the Origen-as-student claim and the
"head of the Catechetical School" description against the scholarship on the Alexandrian school; the
surviving-works count against the list of extant treatises; canonization status; dates. Verified by the
coordinating session, not a subagent.

| Field | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| `life[0]` — "His most famous student was **Origen**." | Stated as fact | **Disputed.** It rests on Eusebius (*HE* VI), and "modern historians offer serious objections". Origen **never cites Clement anywhere in his writings**, which is the main ground for doubt; there is also a chronological problem, since Clement appears to have left Alexandria (c. 202) and may already have been dead by the time Alexander of Jerusalem wrote to Origen. Their intellectual affinity is real; the teacher–pupil link is not established. | `contested` → hedge, e.g. `en: "Eusebius names Origen among his pupils, though modern scholars doubt this — Origen never cites him."` / `vi: "Êusêbiô kể Ôrigênê trong số các môn sinh của ngài, dù các học giả hiện đại nghi ngờ điều này — Ôrigênê không hề trích dẫn ngài ở đâu cả."` | [Encyclopedia.com, Clement of Alexandria](https://www.encyclopedia.com/people/philosophy-and-religion/roman-catholic-and-orthodox-churches-general-biographies/clement-alexandria), [Stanford Encyclopedia of Philosophy, Origen](https://plato.stanford.edu/entries/origen/), [IEP, Origen of Alexandria](https://iep.utm.edu/origen-of-alexandria/) |
| `facts` "Surviving works: 3 works" / "3 tác phẩm"; `works[]` lists only the trilogy | Implies three surviving works | **Undercounts.** Beyond the trilogy, ***Quis dives salvetur?*** (*Who Is the Rich Man That Is Saved?*) survives **complete**, as do the *Excerpta ex Theodoto* and the *Eclogae propheticae*; other treatises survive in fragments. *Quis dives salvetur?* is a substantial and widely read work, not a scrap. | `corrected` → `facts` Surviving works `en: "The trilogy complete, plus Quis dives salvetur? and two shorter collections"` / `vi: "Trọn bộ ba tác phẩm chính, cùng với Quis dives salvetur? và hai tuyển tập ngắn hơn"`, and add *Quis dives salvetur?* to `works[]` (`vi: "Người giàu có nào được cứu độ?"`) | [Encyclopedia.com, Clement of Alexandria](https://www.encyclopedia.com/people/philosophy-and-religion/roman-catholic-and-orthodox-churches-general-biographies/clement-alexandria), [Cambridge, *Clement of Alexandria* front matter](https://assets.cambridge.org/97805218/37538/frontmatter/9780521837538_frontmatter.pdf) |
| `role` — "**head of** the Catechetical School of Alexandria"; `life[0]` "whom he **succeeded** c. 180 AD" | An institutional office with a succession | Softer than stated. The same scholarship that doubts the Origen link holds that Clement's teaching "probably never had an official character, but remained a private enterprise, in keeping with the pedagogic practice of other philosophers in those days" — i.e. the "school" as a formal institution with a head and a succession list is largely Eusebius's retrojection. Not a flat error (the entry follows the traditional account), but it states as institutional fact something scholars treat as a later construction. | `contested` → keep the traditional description but hedge the succession, e.g. `life[0]` `en: "Studied under Pantaenus and took over his teaching c. 180 AD, though whether the Alexandrian 'school' was yet a formal institution with an official succession is debated."` / `vi: "Học với Pantaenô và kế tục việc giảng dạy của ông khoảng năm 180, dù việc 'trường' Alexandria khi ấy đã là một định chế chính thức có sự kế nhiệm chính thức hay chưa vẫn còn được tranh luận."` | [Encyclopedia.com, Clement of Alexandria](https://www.encyclopedia.com/people/philosophy-and-religion/roman-catholic-and-orthodox-churches-general-biographies/clement-alexandria) |
| `quote` (*Stromata* I.5) | "Philosophy... was a schoolmaster to bring the Hellenic mind, **as the Law brought the Hebrews**, to Christ." | Near-verbatim but silently smoothed. ANF reads: "For this was a schoolmaster to bring **the** Hellenic mind, **as the law, the Hebrews**, to Christ." The entry supplies "Philosophy" for the pronoun (fair, and clearer) but also expands the deliberately elliptical "as the law, the Hebrews" into "as the Law brought the Hebrews" without marking the insertion. | `corrected` → mark the editorial help, e.g. `en: "[Philosophy]... was a schoolmaster to bring the Hellenic mind, as the law, the Hebrews, to Christ."` | [ANF *Stromata* I.5 (newadvent)](https://www.newadvent.org/fathers/02101.htm) |
| `facts` "Canonized: No" | Bare "No" | **Confirmed and worth keeping** — Clement was dropped from the Roman Martyrology (his name removed under Clement VIII, the decision upheld by Benedict XIV), which is why the entry's own feast-day row correctly says "no longer on the current Roman calendar". Flagged `confirmed` only so a later pass does not "fix" the "No" to "Yes" on seeing him called "St. Clement" in older literature. | `confirmed` (notable) | [Encyclopedia.com, Clement of Alexandria](https://www.encyclopedia.com/people/philosophy-and-religion/roman-catholic-and-orthodox-churches-general-biographies/clement-alexandria) |

**Not checked:** the Eastern feast of 24 November; the "possibly born in Athens" detail; the flight from
Alexandria in the Severan persecution of 202 (widely reported, not separately sourced here); all six
`sections[]` bodies, which I did not open — **the `more-quotes` section in particular has not been
verified and, on the pattern found in entries 1–3, is the single likeliest place for a further
misquotation in this entry.** `ccc_refs` is empty. Vietnamese `Clêmentê thành Alexandria` matches the
site's own Catechism usage.

**Keep for `sources` retrofit:** [ANF *Stromata* (newadvent)](https://www.newadvent.org/fathers/02101.htm) · [Encyclopedia.com, Clement of Alexandria](https://www.encyclopedia.com/people/philosophy-and-religion/roman-catholic-and-orthodox-churches-general-biographies/clement-alexandria)

---

## Entries 7–30 — not verified

Nothing below was checked. Listed so the gap is explicit and so pass 1 can be resumed without
re-deriving the worklist.

| # | Slug | Known risk to check first |
|---|---|---|
| 7 | tertullian | Montanism and his non-canonized status; which works are from the Montanist period |
| 8 | hippolytus-of-rome | The whole identity/authorship question — one author or two, the statue, the antipope tradition |
| 9 | origen | Posthumous condemnation (543 vs 553, and whether Origen himself was named); the self-castration story; Rufinus's Latin |
| 10 | cyprian-of-carthage | The rebaptism dispute with Pope Stephen; martyrdom date |
| 11 | anthony-the-great | Bare "251 — 356" with no "c."; the *Life of Antony*'s reliability; `era: ante-nicene` though he died 356 |
| 12 | pachomius | `era: ante-nicene` though he died 348; the rule's transmission |
| 13 | athanasius-of-alexandria | How many exiles, and their dates |
| 14 | ephrem-the-syrian | Year and pope of the Doctor declaration |
| 15 | hilary-of-poitiers | Year and pope of the Doctor declaration |
| 16 | cyril-of-jerusalem | Authorship of the *Mystagogical Catecheses* (disputed with John II) |
| 17 | gregory-of-nazianzus | His presidency and resignation at Constantinople I (381) |
| 18 | basil-of-caesarea | Died 379 — did **not** attend Constantinople I; episcopal election date |
| 19 | gregory-of-nyssa | Not a Doctor of the Church; the Nyssa/Sebaste chronology |
| 20 | ambrose-of-milan | Bare "339" with no "c." — usually c. 339 *or* c. 340 |
| 21 | jerome | How much of the Vulgate he actually translated vs revised (the usual overclaim) |
| 22 | john-chrysostom | **`name.vi` is "Gioan thành Antiôkia"** — see S4/T1 below; also the exile and death of 407 |
| 23 | augustine-of-hippo | The most-misquoted Father on the open web — treat every quotation as suspect |
| 24 | john-cassian | Sainthood status (local vs universal calendar); the "Semi-Pelagian" charge and Orange II (529) |
| 25 | cyril-of-alexandria | Hypatia; the mechanics of Nestorius's condemnation at Ephesus 431; Formula of Reunion 433 |
| 26 | leo-the-great | Attila 452 (history vs legend); reception of the Tome at Chalcedon; Doctor declaration year |
| 27 | gregory-the-great | Gregorian chant — the popular attribution is largely later and disputed |
| 28 | isidore-of-seville | "Last of the Western Fathers"; *Etymologiae* completion; any "patron of the internet" claim is not a formal papal designation |
| 29 | maximus-the-confessor | The mutilation; whether Constantinople III (680–81) named him |
| 30 | john-of-damascus | The severed-hand miracle is hagiography; Doctor declaration; "last of the Greek Fathers" |

## How to resume pass 1

The verifier brief that produced entries 1–6 is reusable as-is; each verifier needs only the brief
path, its two entry paths, and its output path. The method that worked:

1. Load `WebSearch` / `WebFetch`, read the entry, and spend the search budget in the order
   **quote attribution > dates > works authorship > biographical claims**.
2. Check *every* quotation, including those buried in `sections[]` bodies and `apologetics[]`
   answers — that is where entries 1, 2 and 3 hid their worst problems.
3. Diff the figure against `church-fathers.json` / `church-fathers-vi.json`; per P5, when they
   disagree the legacy file is often the correct one.
4. Grep `content/content.json` for the Vietnamese proper names before reaching for an external
   source.

Entries 5 and 6 were done without opening the `sections[]` bodies, so **they should be finished, not
just trusted** — the un-opened `more-quotes` sections are the likeliest remaining hiding place given
P1.

## Note for the follow-on `sources` retrofit

Per the spec, this is deliberately **not** folded into this audit. Each verified entry ends with a
**Keep for `sources` retrofit** line naming the 2–3 best citations found for that figure, so the
roadmap item can start from those rather than re-researching. The strongest recurring sources across
the six entries: newadvent.org/fathers (ANF texts), earlychristianwritings.com (Lightfoot), the
vatican.va papal catecheses, and Britannica/Encyclopedia.com for date ranges.

## Hand-off state

| # | Step | State |
|---|---|---|
| 1 | Pass 1 — verify Giáo Phụ (30), write this report | **6 of 30 done.** 24 outstanding |
| 2 | Owner reviews + approves corrections | ready for the 6 that are done |
| 3 | Pass 2 — apply approved rows to `content/giao-phu` | not started |
| 4 | Repeat 1–3 for Công Đồng (21) | not started |

**Pass 2 must apply each approved fix in up to three files** — the per-slug file,
`church-fathers.json`, and `church-fathers-vi.json` — because `lib/churchFathers.ts` still feeds the
homepage and search page from the legacy dataset. See S3.
