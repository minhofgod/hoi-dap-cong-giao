# Tổng luận Thần học — verification report

**Session 14 · 2026-08-19 · read-only.** No content was changed. No part of `/tong-luan` was built.

| Pass | Scope | Files | Flags | Status |
|---|---|---|---|---|
| **1 — pilot** | intro + Phần I | 11 | 20 | owner approved "continue" |
| **2 — remainder** | Phần I-II, II-II, III + conclusion | 26 | 40 | complete — [jump ↓](#pass-2--the-remaining-26-chapters) |
| | **Whole section** | **37** | **60** | verified |
| **3 — apply** | corrections + sacraments rewrite + cuts | 34 out | — | complete — [jump ↓](#pass-3--what-was-applied) |

Source under review: `D:\Dropbox\Obsidian Vault\Summa of the Summa\` (**left untouched**).
Corrected copy written to: `content/tong-luan/`.

---

# Pass 1 (PILOT)

Scope: the intro + the 10 chapters of Phần I — 11 of 37 files — per `docs/tong-luan-spec.md` → "Pilot first".

## Verdict

**The material is broadly sound in doctrine and broadly accurate in its Summa citations — but it is not
publishable as it stands.** Twenty flagged rows across eleven files, including **two chapters that
attribute to Aquinas a position he explicitly did not hold**, one Scripture quotation labelled CGKPV
that is not CGKPV, and three blockquotes formatted as quotations that cannot be traced to any text.

Nothing here is heretical, and nothing suggests the text was hallucinated wholesale. The failure mode is
the one `docs/tong-luan-spec.md` predicted: **flattening**. The chapters read as a competent
undergraduate summary of a summary — right conclusions, eroded distinctions, and citations that drift
from where the material actually lives.

**Recommendation: continue, with a correction pass — do not rewrite from scratch, and do not publish
unedited.** See "What I'd advise" at the end.

| Verdict | Count |
|---|---|
| `corrected` | 14 |
| `contested` | 3 |
| `unverifiable` | 3 |
| **Total flagged** | **20** |
| Chapters with nothing flagged | 1 of 11 (`10-hinh-anh-thien-chua.md`) |

## Method + standard of proof

Per `CLAUDE.md` → "Verify facts before they ship":

- **Primary first.** Every Summa citation was resolved against the actual question — Latin at
  `corpusthomisticum.org`, the public-domain Dominican Fathers translation at `newadvent.org/summa`.
- **Catechism** cross-checks were run against the site's own Catechism data (`content/content.json`),
  which is the same text the reader sees at `/giao-ly`.
- **Scripture** was checked verbatim against the repo's CGKPV text (`content/bible.json`), never from
  memory — per `docs/session-4-script-wikilink.md`.
- **Triangulated ≥2 independent sources** for every hard fact proposed for change.
- **Vietnamese terminology was NOT audited** — the owner read all 37 chapters and vouches for word
  choice and register (`docs/tong-luan-spec.md` §6). Where a *concept* is mislabelled rather than a word
  mistranslated, it is reported as doctrine. One terminology item is passed back to him as a pointer,
  not a finding.

---

## Systemic patterns — read this before the tables

These four recur across the pilot and will almost certainly recur across the remaining 26 chapters.
They are more useful to you than any single row.

### 1. Paraphrase dressed as quotation (3 chapters, and the intro)

Chapters 2, 4 and 6 each contain a `>` blockquote presented as St Thomas's words. **None of them
corresponds to any passage in the cited questions.** The *doctrine* in each is correct; the *quotation*
is fabricated in form. On a site whose entire value proposition is being well-sourced, an unmarked
pseudo-quotation is its own defect regardless of whether the content is true.

**Fix:** convert every such blockquote to ordinary prose ("Thánh Tôma dạy rằng…"), or replace it with a
real, cited passage. Reserve `>` for verbatim text with a reference.

### 2. Citation drift — the chapter treats material outside its cited range

Five instances. The heading cites a question range; the body then discusses something Aquinas handles
somewhere else entirely.

| Chapter | Cited | The material actually lives at |
|---|---|---|
| 03 | I, q.4–11 | covers only q.4–7 and q.9; q.8, q.10, q.11 untreated |
| 06 | I, q.44–46 | conservation in being is **I q.104 a.1** |
| 07 | I, q.50–64 | the nine choirs are **I q.108 a.6**; guardian angels **I q.113** |
| 09 | I, q.77–83 | abstraction of universals from phantasms is **I q.85 a.1** |

This is the cheapest class of error to fix and the most damaging to leave, because the spec's whole
premise is that these citations are checkable. A reader who checks one and finds nothing there stops
trusting the section.

### 3. Aquinas's own qualifications stripped out

Three times the text states a position flatly where Aquinas states it with an explicit hedge, an
explicit alternative, or the opposite conclusion. Chapters 7 and 8 are the serious cases.

### 4. The apophatic frame is missing

Chapter 2 opens the treatise on God by asking *"Thiên Chúa là Đấng như thế nào?"* Aquinas opens the same
treatise by saying we **cannot** know that. This is not a nuance — it is the governing method of
q.3–q.11, and the intro doesn't supply it either.

---

## Per-file findings

### `00-mo-dau.md` — Phần Mở đầu

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| M1 | The Summa prologue quoted as a blockquote, closing *"…chứ không phải thức ăn đặc, vì anh em chưa chịu nổi" (1 Cr 3,1-2 – CGKPV)* | **Three defects in one blockquote.** (a) It is **not CGKPV**: CGKPV 1 Cr 3,2 reads *"Tôi đã cho anh em uống sữa **chứ không cho dùng thức ăn**, vì anh em chưa chịu nổi."* (b) It **omits** *tanquam parvulis in Christo* — Latin: *"…secundum illud apostoli I ad Corinth. III, **tanquam parvulis in Christo**, lac vobis potum dedi, non escam"* — which is exactly the phrase carrying Aquinas's point about beginners. (c) It **adds** *"vì anh em chưa chịu nổi"*, which Aquinas does not quote. | `corrected` | [corpusthomisticum sth0000](https://www.corpusthomisticum.org/sth0000.html) · repo `content/bible.json` (CGKPV) |
| M2 | *"Mỗi 'Câu hỏi' (Quaestio) … thường được trình bày theo cùng một cấu trúc: Đặt vấn đề → Các vấn nạn → Sed contra và Respondeo → Trả lời các vấn nạn"* | **That is the structure of an *articulus*, not a *quaestio*.** A quaestio contains several articuli (I q.3 has 8; I q.19 has 12), and it is each *articulus* that carries objections, sed contra, respondeo and replies. Also *Sed contra* is not part of "Giải đáp": it is a counter-authority raised **before** Aquinas answers, and the two are bundled here as one step. In a chapter whose entire job is teaching people how to read the book, this misdescribes the book. | `corrected` | [ST I q.3 (8 articles)](https://www.newadvent.org/summa/1003.htm) · [ST I q.19 (12 articles)](https://www.newadvent.org/summa/1019.htm) |
| M3 | *"Toàn bộ Tổng luận được xây dựng theo một nhịp điệu lớn: mọi sự phát xuất từ Thiên Chúa (exitus) và trở về với Thiên Chúa (reditus)"* — asserted as fact | **A contested scholarly reading, not Aquinas's stated plan.** Proposed by M.-D. Chenu in 1939 and widely adopted for its elegance, but the *exitus/reditus* vocabulary appears in Aquinas's early *Sentences* commentary and is not carried into the Summa; Lafont, te Velde and others propose different architectonics. Present it as an influential interpretation, not as the author's design. | `contested` | [Sammon, "Redeeming Chenu?", *Heythrop Journal* 2021](https://onlinelibrary.wiley.com/doi/10.1111/heyj.12664) · [Siris, "The Structure of the Summa"](http://branemrys.blogspot.com/2020/03/the-structure-of-summa.html) |
| M4 | *"Thánh Tôma Aquinô (1225–1274)"* | **False precision on the birth year.** Stanford gives *"ca. 1225"* and *"around the year 1225"*; Britannica gives *"1224/25"*. The death date **7 March 1274** is firm. Proposed: **"k. 1225 – 1274"**. Same pattern the Giáo Phụ audit found. | `corrected` | [SEP, Aquinas](https://plato.stanford.edu/entries/aquinas/) · [Britannica](https://www.britannica.com/biography/Saint-Thomas-Aquinas) |

**Confirmed in this file (no change needed):** *Doctor Angelicus* and *Doctor Communis* are both genuine
ecclesial titles — the Pontifical Academy of St Thomas Aquinas publishes a Vatican journal titled
*Doctor Communis*, and John Paul II referred to him as *"the Doctor Angelicus et communis"*. (I did
**not** verify the often-repeated 1317 conferral date and the chapter does not assert it.) The
Dominican affiliation, the three-part division, and the Latin part-names *Prima Pars / Prima Secundae /
Secunda Secundae / Tertia Pars* are all correct.
Source: [Pontifical Academy of St Thomas Aquinas, *Doctor Communis*](https://www.vatican.va/roman_curia/pontifical_academies/san-tommaso/publications/dc10.pdf)

---

### `01-su-hien-huu-thien-chua.md` — Five Ways *(cited: I, q.2 — correct; specifically q.2 a.3)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| 1.1 | Third Way: *"…phải có một **Hữu thể tất yếu** (tồn tại bởi chính mình), và đó là Thiên Chúa."* | **Aquinas's second stage is missing.** He does not stop at "a necessary being exists". He continues: *"Omne autem necessarium vel habet causam suae necessitatis aliunde, vel non habet"* — every necessary thing either has the cause of its necessity from elsewhere or it does not — and only then concludes *"necesse est ponere aliquid quod sit **per se necessarium**, non habens causam necessitatis aliunde."* The step matters: for Aquinas angels and the heavenly bodies **are** necessary beings whose necessity is caused. Without it the argument does not reach God, and the parenthetical *"(tồn tại bởi chính mình)"* gestures at a conclusion the chapter never argues. | `corrected` | [corpusthomisticum sth1002](https://www.corpusthomisticum.org/sth1002.html) · [ST I q.2 a.3](https://www.newadvent.org/summa/1002.htm) |
| 1.2 | Third Way: *"Nếu mọi sự đều chỉ là 'có thể có', thì đã có lúc không có gì cả."* | **Accurate as translation, contested as argument — flag it, don't defend it.** It renders *"Si igitur omnia sunt possibilia non esse, aliquando nihil fuit in rebus"* faithfully. But this is the single most disputed sentence in the Five Ways: critics read it as a quantifier-shift fallacy (from "each perishable thing perishes at some time" to "there is a time when all have perished"); defenders (Feser, O'Callaghan, Anders) argue the inference is valid on Aristotelian premises Aquinas assumes. The spec asks for contested readings to be flagged rather than asserted. As written the chapter presents the disputed step as if it were obvious. | `contested` | [Anders, "Aquinas and quantifier mistakes", *IJPR*](https://link.springer.com/article/10.1007/s11153-010-9281-2) · [Feser, "On some alleged quantifier shift fallacies"](http://edwardfeser.blogspot.com/2011/06/on-some-alleged-quantifier-shift.html) · [O'Callaghan, "The Third Way: A Hopeless Case?"](https://mvstconference.ace.fordham.edu/themataphysicsofaquinas/john-ocallaghan/) |
| 1.3 | *"Năm con đường không phải là năm bằng chứng 'toán học' tuyệt đối"* | **Sources genuinely pull in two directions — worth saying so.** Aquinas himself holds in **I q.2 a.2** that God's existence *can be demonstrated* (*demonstrari potest*), and calls the five *viae* demonstrations. The Catechism **§ 31** frames the same arguments as *"không theo nghĩa lý chứng của các khoa học tự nhiên, mà theo nghĩa những 'lý chứng đồng quy và có sức thuyết phục'"*. So the chapter's softening is defensible **as the Catechism's framing** but is not Aquinas's own. Attribute it to CCC 31 rather than leaving it as a claim about St Thomas. | `contested` | [ST I q.2 a.2](https://www.newadvent.org/summa/1002.htm) · CCC 31, 34 (repo `content/content.json`) |

**Confirmed, with two small precision notes:**
- First Way — *"Mọi sự chuyển động đều phải được cái khác làm cho chuyển động"* correctly renders *"omne
  autem quod movetur, ab alio movetur"*, though Aquinas's subject is *whatever is moved*, not *all
  motion*. Worth tightening; not an error of substance.
- Fifth Way — Aquinas's premise is *ex gubernatione rerum* and his example is *corpora naturalia*
  (natural bodies). The chapter's *"cây cối, các thiên thể"* is a legitimate illustration but is the
  chapter's addition, not his.
- *Quinque viae*, "Động cơ đầu tiên", "Nguyên nhân đầu tiên", the Fourth Way's gradation, and the
  closing "đức tin và lý trí không đối nghịch nhau" all check out against q.2 a.3 and CCC 31–36.

---

### `02-ban-tinh-don-nhat.md` — divine simplicity *(cited: I, q.3 — correct)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| 2.1 | *"Thánh Tôma liền đặt câu hỏi: **Thiên Chúa là Đấng như thế nào?**"* then presents simplicity as a description of God | **Aquinas opens q.3 by denying exactly this.** The prooemium: *"…non possumus scire de Deo **quid sit, sed quid non sit**"* — we cannot know what God is, only what He is not — and the method is *removendo ab eo ea quae ei non conveniunt* (removing from Him what does not belong to Him). Every article of q.3 is framed negatively ("Whether God is a body?", "Whether He is composed of…"). The chapter converts an apophatic treatise into a positive description. This is the most consequential flattening in the pilot after chs. 7 and 8, because it changes how a reader understands all of q.3–q.11. | `corrected` | [corpusthomisticum sth1003 (q.3 prooemium)](https://www.corpusthomisticum.org/sth1003.html) · [ST I q.3](https://www.newadvent.org/summa/1003.htm) |
| 2.2 | Blockquote: *"Thiên Chúa không phải là một hữu thể có bản tính rồi mới được ban cho sự hiện hữu. / Nơi Thiên Chúa, bản tính và hiện hữu chỉ là một."* | **The doctrine is correct (I q.3 a.4); the quotation is untraceable.** I could not match these words to any passage of q.3 in Latin or in the Dominican Fathers translation. It reads as the drafting model's own summary set in quotation marks. Not false — but not a quotation, and presented as one. | `unverifiable` | [ST I q.3 a.4](https://www.newadvent.org/summa/1003.htm) · [corpusthomisticum sth1003](https://www.corpusthomisticum.org/sth1003.html) |

**Confirmed:** Xh 3,14 — *"Ta là Đấng Hiện Hữu"* is **verbatim CGKPV** (`content/bible.json`). The
transliteration *Ehyeh asher ehyeh* is correct. The composition examples (soul/body, matter/form,
essence/existence) map correctly onto q.3 a.1–a.4, and the essence–existence identity is q.3 a.4.

**One item passed back to you, not a finding.** The chapter titles q.3 *"Bản tính **đơn nhất**"* and
glosses it *simplex*. In the Summa, **simplicity is q.3** and **unity (*unitas*, "one-ness") is a
separate question, q.11**, which this pilot never covers. The Vietnamese word is your call and I have
not audited it — but if *đơn nhất* reads as "oneness" to a Vietnamese ear, the label points at the wrong
question, and that is a Thomistic distinction rather than a translation preference. Worth one look.
Source: [ST I q.11, "The unity of God"](https://www.newadvent.org/summa/1011.htm)

---

### `03-hoan-hao-thien-hao.md` — perfection, goodness, infinity, immutability *(cited: I, q.4–11)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| 3.1 | Heading cites *"Câu hỏi 4–11"* | **The range overshoots the content by three questions.** Verified titles: q.4 perfection · q.5 goodness in general · q.6 the goodness of God · **q.7 infinity** · q.8 God's existence in things · **q.9 immutability** · q.10 eternity · q.11 unity. The chapter treats q.4–7 and q.9 only; q.8, q.10 and q.11 are never mentioned. Proposed: cite **"I, q.4–7; q.9"**. | `corrected` | [q.7](https://www.newadvent.org/summa/1007.htm) · [q.9](https://www.newadvent.org/summa/1009.htm) · [q.11](https://www.newadvent.org/summa/1011.htm) |

**Confirmed:** *actus purus* is correct Latin and correctly applied (q.3 a.1, q.9 a.1). The
being–goodness convertibility (q.5 a.1), infinity grounded in *esse* unreceived in matter (q.7 a.1),
and immutability grounded in the absence of potency (q.9 a.1) are all faithful. The summary table is
accurate.

---

### `04-hieu-biet-va-y-muon.md` — God's knowledge and will *(cited: I, q.14–19)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| 4.1 | Blockquote: *"Thiên Chúa biết mọi sự, không chỉ những gì đang hiện hữu, nhưng cả những gì có thể hiện hữu. / Không có gì ẩn giấu trước mặt Ngài."* | **Doctrine correct (I q.14 a.9, on the *scientia visionis* / *simplicis intelligentiae* distinction); quotation untraceable.** The second sentence in particular has the cadence of Scripture (cf. Dt 4,4 / Hr 4,13) but is presented as St Thomas without a reference to either. Same defect as 2.2. | `unverifiable` | [ST I q.14 a.9](https://www.newadvent.org/summa/1014.htm) |

**Confirmed:** the necessary/free distinction in God's willing is exactly **I q.19 a.3** — He wills His
own goodness necessarily, other things not necessarily. God knowing all things in knowing Himself is
q.14 a.2 and a.5. The identity of intellect and will with the divine essence follows correctly from q.3.

*Note (not flagged):* the cited range q.14–19 also contains q.15 (ideas), q.16 (truth), q.17 (falsity)
and q.18 (God's life), none of which the chapter treats. Less severe than 3.1 because knowledge and
will genuinely bracket the range.

---

### `05-thien-chua-ba-ngoi.md` — the Trinity *(cited: I, q.27–43 — correct)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| 5.1 | *"Không Ngôi nào có trước hay có sau **trong thời gian** (vì mọi sự trong Thiên Chúa đều vĩnh cửu)."* | **The qualifier weakens the doctrine and leaves a subordinationist door open.** The tradition denies priority *simpliciter*, not merely temporal priority — the Athanasian Creed's *"nihil prius aut posterius"*. Restricting the denial to time implies some non-temporal priority might hold. There **is** an order of origin (the Father is *principium sine principio*), but that is an order of relation, not of rank or precedence. Proposed: drop *"trong thời gian"* and say no Ngôi is before or after another in any respect, while keeping the order of origin. CCC 253: *"mỗi Ngôi Vị đều là Thiên Chúa trọn vẹn."* | `corrected` | CCC 253–255 (repo `content/content.json`) · [ST I q.28 a.4](https://www.newadvent.org/summa/1028.htm) |

**Confirmed — this is the strongest chapter in the pilot on substance:**
- Two processions, generation and spiration — **I q.27 a.5** ("there are in Him but two processions").
- Four real relations (paternity, filiation, spiration, procession) — **I q.28 a.4**, exactly as stated.
- Father and Son as **one principle** of the Holy Spirit — **I q.36 a.4**, *"one principle of the Holy
  Ghost by reason of the unity of the property."*
- *Opera ad extra* common to the three — **CCC 258**: *"Toàn bộ Nhiệm cục thần linh là công trình chung
  của Ba Ngôi Thiên Chúa… Ba Ngôi cũng chỉ có cùng một hoạt động."*
- Distinction by relation alone — **CCC 255**.

*Note (not flagged):* the chapter says four relations yield three Persons without saying why. The reason
— active spiration is not *relatively opposed* to paternity or filiation, and so does not constitute a
fourth Person — is one sentence and would close a gap a sharp reader will notice.

---

### `06-tao-thanh-tu-hu-vo.md` — creation *(cited: I, q.44–46)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| 6.1 | §5 *"Sự bảo tồn và quan phòng"* — *"Nếu Thiên Chúa ngừng bảo tồn, mọi sự sẽ trở về hư vô ngay lập tức"* — under a heading citing q.44–46 | **Correct doctrine, wrong address.** Conservation in being is **I q.104 a.1**: *"The being of every creature depends on God, so that not for a moment could it subsist, but would fall into nothingness."* Providence is **I q.22**. Neither is in q.44–46. Either cite q.104 alongside, or move the section. | `corrected` | [ST I q.104 a.1](https://www.newadvent.org/summa/1104.htm) |
| 6.2 | Blockquote: *"Chỉ có Thiên Chúa mới có thể tạo thành, vì chỉ có Ngài mới là Hữu thể tự hữu…"* | **Doctrine correct (I q.45 a.5); quotation untraceable.** Third instance of the same defect. | `unverifiable` | [ST I q.45 a.5](https://www.newadvent.org/summa/1045.htm) |

**Confirmed:** *creatio ex nihilo* (q.45 a.1); creation reserved to God alone (q.45 a.5); prime matter
itself created (q.44 a.2); creation as the work of the whole Trinity — **I q.45 a.6**, *"the Father made
the creature through His Word, which is His Son; and through His Love, which is the Holy Ghost"*, which
the chapter renders almost exactly; and the freedom of creation.

---

### `07-thien-than.md` — the angels *(cited: I, q.50–64)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| **7.1** | *"**Thánh Tôma dạy rằng** Thiên Chúa đã tạo dựng các Thiên thần **trước khi** tạo dựng thế giới vật chất."* | **⚠️ This attributes to Aquinas the view he rejects.** **I q.61 a.3**: *"There is a twofold opinion on this point to be found in the writings of the Fathers. **The more probable one holds that the angels were created at the same time as corporeal creatures.**"* His reasoning: angels are *part of the universe*, and *"no part is perfect if separate from the whole."* **Be precise in the correction:** he does not condemn the contrary view — *"the contrary is not to be deemed erroneous, especially on account of the opinion of Gregory Nazianzen"* — so the right fix is not to flip the sentence but to say Aquinas records two patristic opinions and judges **simultaneous creation the more probable**. As written, the one position the chapter ascribes to him is the one he declined. | `corrected` | [ST I q.61 a.3](https://www.newadvent.org/summa/1061.htm) |
| 7.2 | The nine choirs in three hierarchies, credited to Pseudo-Dionysius, under a heading citing q.50–64 | **Right content, wrong location.** The orders are **I q.108 a.6**, well outside the cited range. The order given — Seraphim, Cherubim, Thrones / Dominations, Virtues, Powers / Principalities, Archangels, Angels — **is correct** and is Dionysius's. Worth adding: Aquinas also reports **Gregory the Great's** differing arrangement and concludes there is *"little or no difference in reality"* between them; the chapter presents one scheme as simply *the* scheme. | `corrected` | [ST I q.108 a.6](https://www.newadvent.org/summa/1108.htm) |
| 7.3 | *"Bảo vệ và hướng dẫn con người (các Thiên thần bản mệnh)"* under q.50–64 | Guardianship of men is **I q.113**, "The guardianship of the good angels" — outside the cited range. CCC 336 is the natural doctrinal anchor. | `corrected` | [ST I q.113](https://www.newadvent.org/summa/1113.htm) · CCC 336 |

**Confirmed:** angels wholly incorporeal (q.50 a.1); **each angel its own species** — q.50 a.4, *"it is
impossible for two angels to be of one species"*; knowledge infused at creation rather than abstracted —
**q.55 a.2**, *"the species whereby the angels understand are not drawn from things, but are connatural
to them"*; the irrevocability of the angelic choice — **q.64 a.2**, *"the will of the demons is obstinate
in evil"*, and **CCC 393**; the chief fallen angel as the highest — **q.63 a.7**, where Aquinas follows
Gregory as more probable against Damascene; angels surpassing man in natural perfection — **CCC 330**.

**One item passed back to you, not a finding.** The Vietnamese names for choirs 4–8 (*Quản thần, Uy
thần, Năng thần, Quản hạt*) differ from the set used in some Vietnamese Catholic sources. **Sequence and
identification are correct** and terminology is out of scope by your own call — this is only a flag so
you can eyeball it while you're in the file.

---

### `08-linh-hon-con-nguoi.md` — the human soul *(cited: I, q.75–76 — correct)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| **8.1** | *"**linh hồn được Thiên Chúa tạo dựng trực tiếp** trong lúc thụ thai"* | **⚠️ Aquinas held the opposite on the timing.** He taught a **succession of souls** — *"the nutritive soul from the beginning, then the sensitive, lastly the intellectual soul"* — and concluded that *"**the intellectual soul is created by God at the end of human generation**"*, the earlier forms being corrupted (**I q.118 a.2**; also *SCG* II.89). This is "delayed animation," and it is one of the best-known places where St Thomas's biology diverges from modern Catholic practice. **The half of the sentence that is right:** direct creation by God, not by the parents, is both his position and the Church's — **CCC 366**: *"mỗi linh hồn thiêng liêng được tạo dựng trực tiếp bởi Thiên Chúa chứ không phải do cha mẹ 'sinh sản'."* Note that CCC 366 says **nothing about the moment**. So *"trong lúc thụ thai"* is not Aquinas, and is not stated by the Catechism either — it is the drafting model importing a modern formulation and signing Aquinas's name to it. Proposed: drop *"trong lúc thụ thai"*; if the point is worth keeping, treat it explicitly as a place where Aquinas's embryology has been superseded. | `corrected` | [ST I q.118 a.2](https://www.newadvent.org/summa/1118.htm) · CCC 366 (repo `content/content.json`) |

**Confirmed:** the soul as **forma corporis** — **I q.76 a.1**, *"the intellect which is the principle of
intellectual operation is the form of the human body"*; one substantial form in man, virtually
containing the sensitive and nutritive (q.76 a.3–4), which underwrites the chapter's *"đơn nhất"*;
immortality by the soul's own nature — **q.75 a.6**, on subsistence, the absence of contrariety, and the
natural desire for perpetual existence; and *"con người không phải là linh hồn bị nhốt trong thân xác"*,
which correctly rejects the Platonic reading and matches q.75 a.4.

---

### `09-nang-luc-linh-hon.md` — the powers of the soul *(cited: I, q.77–83)*

| # | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|
| 9.1 | *"Trí năng là năng lực cao nhất của con người, **vì nhờ nó chúng ta có thể nhận biết Thiên Chúa** và các chân lý thiêng liêng."* | **The conclusion is right; the reason given is the one case Aquinas excepts.** **I q.82 a.3**: *"Absolutely, however, the intellect is nobler than the will"* — **but** where the object is higher than the soul itself, the will is the nobler, and his own illustration is precisely *"the love of God is better than the knowledge of God; but, on the contrary, the knowledge of corporeal things is better than the love thereof."* So the chapter grounds the intellect's primacy on knowing God, which is exactly where Aquinas gives the edge to the will. Proposed: keep the primacy, ground it as he does (the intellect's object is being as such), and add the exception — it is a memorable point, not a technicality. | `corrected` | [ST I q.82 a.3](https://www.newadvent.org/summa/1082.htm) |
| 9.2 | Abstraction of universals from sense data, under a heading citing q.77–83 | Abstraction from phantasms is **I q.85 a.1** — *"our intellect understands material things by abstracting from the phantasms"*. q.77–83 treat the powers themselves (q.79 intellectual, q.80–83 appetitive, q.83 free choice); the *mode* of understanding is q.84–89. | `corrected` | [ST I q.85 a.1](https://www.newadvent.org/summa/1085.htm) |

**Confirmed:** the will's orientation to the good under the intellect's presentation; free choice
(q.83); the intellect–will interplay; and the closing identification of intellect and will with the
divine essence in God but not in man.

---

### `10-hinh-anh-thien-chua.md` — the image of God *(cited: I, q.93 — correct)*

**Nothing flagged. This chapter checks out fully**, and it is worth saying so plainly given how the
rest of the pilot reads.

- The **three degrees** map exactly onto **I q.93 a.4**: the natural aptitude for understanding and
  loving God, common to all; conformity of grace, in the just; likeness of glory, in the blessed —
  which Aquinas names *image of creation, of re-creation, and of likeness*. The chapter's *"tự nhiên /
  ân sủng / vinh quang"* is a faithful rendering.
- The **Trinitarian image** in the mind's word-generating and love-proceeding acts is **q.93 a.7**,
  correctly hedged as a limited likeness.
- The image located in the intellectual soul rather than the body is **q.93 a.6**.
- *"phẩm giá bất khả xâm phạm"* is modern Catechism register rather than Aquinas's vocabulary, but it is
  an application, not a claim about what he wrote.

Sources: [ST I q.93](https://www.newadvent.org/summa/1093.htm)

---

## Notable omissions — not errors, but worth adding

These chapters state nothing false. They leave out something the cited question is famous for, which on
an apologetics site is a missed opportunity rather than a defect.

| Chapter | What's missing | Why it matters |
|---|---|---|
| `00-mo-dau` | **The Summa is unfinished.** Aquinas stopped at **III q.90**; the *Supplementum* was assembled after his death from his earlier writings. | A chapter teaching people how to read the Summa should say that the last part they'll pick up isn't entirely his. Directly relevant to Phần III, 12 chapters of this section. ([Supplementum, New Advent](https://www.newadvent.org/summa/5.htm)) |
| `06-tao-thanh` | **I q.46 a.2** — *"By faith alone do we hold, and by no demonstration can it be proved, that the world did not always exist."* | It's inside the chapter's own cited range, it's one of Aquinas's most distinctive and counter-intuitive positions, and it is directly useful in creation-vs-science conversations. ([q.46 a.2](https://www.newadvent.org/summa/1046.htm)) |
| `08-linh-hon` | The soul as *forma corporis* is **defined doctrine**, not just Aquinas's opinion — **Council of Vienne, 1312** (Denzinger 902), cited at **CCC 365**. | Turns a philosophical thesis into a magisterial anchor, and is the natural `refs_ccc` for this chapter. ([Council of Vienne, EWTN](https://www.ewtn.com/catholicism/library/council-of-vienne-1542)) |

---

## What I'd advise

**Continue. Don't rewrite from scratch, and don't publish unedited.**

The underlying text is better than "AI slop" and worse than publishable. Across eleven files there was
**no invented Summa citation, no heresy, and no fabricated historical event** — the question numbers
land in the right neighbourhood and the doctrine lands on the right side. That is a meaningfully better
starting position than the spec's worst case, and it argues against discarding the material.

But **two chapters state as St Thomas's teaching a position he explicitly declined (ch. 7) or explicitly
contradicted (ch. 8)**, and those are exactly the sentences a reader would repeat in an argument and be
corrected on. Publishing them unfixed would damage the thing this site trades on.

Practically, the pilot's twenty rows sort into three efforts:

1. **Mechanical (≈1 hour):** the four citation-drift rows, the dates, the CGKPV quotation. Unambiguous
   fixes, exact replacements proposed above.
2. **Small rewrites (a paragraph each):** chs. 7, 8, 9, and 2's opening frame, plus the three
   blockquotes demoted to prose. Each is a few sentences.
3. **Editorial calls that are yours, not mine:** how to present *exitus/reditus* (M3), whether to hedge
   the Third Way in a beginner's text (1.2), and whether to attribute the "not mathematical proofs"
   framing to CCC 31 (1.3).

**Rate to expect on the remaining 26.** Twenty flags over eleven files is roughly **1.8 per file**;
extrapolating, expect **40–50 more rows**, weighted toward citation drift and pseudo-quotations. I'd
expect **Phần III to be the riskiest** — Christology and sacramental theology have more places where a
flattened distinction becomes a doctrinal error, and it is the part of the Summa Aquinas did not finish.

**Two process suggestions for Pass 3:**

- Add **`summa_ref`** to the frontmatter as the spec already plans, and make it point at the *article*
  where it matters (`I, q.2, a.3`), not just the question. Article-level citations are what made this
  pilot checkable in an hour rather than a day, and they are what will make it checkable by a reader.
- Adopt a house rule for this section: **`>` blockquotes are reserved for verbatim text with a
  reference.** Three of eleven files broke it. It is cheap to enforce while authoring and expensive to
  audit afterwards.

---

## Sources consulted

**Primary — the Summa.** Latin: [corpusthomisticum.org](https://www.corpusthomisticum.org/) —
[prologue](https://www.corpusthomisticum.org/sth0000.html),
[q.2](https://www.corpusthomisticum.org/sth1002.html),
[q.3](https://www.corpusthomisticum.org/sth1003.html).
English (Dominican Fathers, public domain) at [newadvent.org/summa](https://www.newadvent.org/summa/) —
[q.2](https://www.newadvent.org/summa/1002.htm) ·
[q.3](https://www.newadvent.org/summa/1003.htm) ·
[q.7](https://www.newadvent.org/summa/1007.htm) ·
[q.9](https://www.newadvent.org/summa/1009.htm) ·
[q.11](https://www.newadvent.org/summa/1011.htm) ·
[q.14](https://www.newadvent.org/summa/1014.htm) ·
[q.19](https://www.newadvent.org/summa/1019.htm) ·
[q.27](https://www.newadvent.org/summa/1027.htm) ·
[q.28](https://www.newadvent.org/summa/1028.htm) ·
[q.36](https://www.newadvent.org/summa/1036.htm) ·
[q.45](https://www.newadvent.org/summa/1045.htm) ·
[q.46](https://www.newadvent.org/summa/1046.htm) ·
[q.50](https://www.newadvent.org/summa/1050.htm) ·
[q.55](https://www.newadvent.org/summa/1055.htm) ·
[q.61](https://www.newadvent.org/summa/1061.htm) ·
[q.63](https://www.newadvent.org/summa/1063.htm) ·
[q.64](https://www.newadvent.org/summa/1064.htm) ·
[q.75](https://www.newadvent.org/summa/1075.htm) ·
[q.76](https://www.newadvent.org/summa/1076.htm) ·
[q.82](https://www.newadvent.org/summa/1082.htm) ·
[q.85](https://www.newadvent.org/summa/1085.htm) ·
[q.93](https://www.newadvent.org/summa/1093.htm) ·
[q.104](https://www.newadvent.org/summa/1104.htm) ·
[q.108](https://www.newadvent.org/summa/1108.htm) ·
[q.113](https://www.newadvent.org/summa/1113.htm) ·
[q.118](https://www.newadvent.org/summa/1118.htm) ·
[Supplementum](https://www.newadvent.org/summa/5.htm)

**Catechism.** The site's own data, `content/content.json` — §§ 31, 32, 34, 36, 253–258, 328, 330, 331,
336, 365, 366, 393.

**Scripture.** The repo's CGKPV text, `content/bible.json` — Xh 3,14 and 1 Cr 3,1-3.

**Biography.** [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/aquinas/) ·
[Britannica](https://www.britannica.com/biography/Saint-Thomas-Aquinas)

**Titles.** [Pontifical Academy of St Thomas Aquinas, *Doctor Communis*](https://www.vatican.va/roman_curia/pontifical_academies/san-tommaso/publications/dc10.pdf)

**Scholarship (for contested rows only).**
[Sammon, "Redeeming Chenu?", *Heythrop Journal* 62 (2021)](https://onlinelibrary.wiley.com/doi/10.1111/heyj.12664) ·
[Siris, "The Structure of the Summa"](http://branemrys.blogspot.com/2020/03/the-structure-of-summa.html) ·
[Anders, "Aquinas and quantifier mistakes", *Int. J. Phil. Religion*](https://link.springer.com/article/10.1007/s11153-010-9281-2) ·
[Feser, "On some alleged quantifier shift fallacies"](http://edwardfeser.blogspot.com/2011/06/on-some-alleged-quantifier-shift.html) ·
[O'Callaghan, "The Third Way: A Hopeless Case?"](https://mvstconference.ace.fordham.edu/themataphysicsofaquinas/john-ocallaghan/) ·
[Council of Vienne, EWTN](https://www.ewtn.com/catholicism/library/council-of-vienne-1542)

**Not used as evidence.** Wikipedia was consulted only as a pointer to primary sources, per
`CLAUDE.md`. No claim in this report rests on it.

---

---
---

# Pass 2 — the remaining 26 chapters

**Owner approved "continue" on 2026-08-19.** Scope: `02-phan-i-ii/` (5), `03-phan-ii-ii/` (8),
`04-phan-iii/` (12), `05-ket-luan.md` (1). Same method and standard of proof as Pass 1. Still read-only.

## Verdict

**The pilot's diagnosis holds, and Phần III is worse — as predicted.** Forty flagged rows across 26
files, including **four chapters that cite no question at all**, a sacramental formula from 1971
attributed to St Thomas, a papal-era ecclesiology attributed to him that he explicitly denied, a
patristic axiom credited to him, and one outright doctrinal-terminological error on grace.

Set against that: **four chapters came back completely clean** (Luật, Công bằng, Tiết độ, Cánh chung),
and one of the most error-prone tables in all of Thomism — the seven gifts against the beatitudes —
is **correct in every row**. The material is uneven, not uniformly bad.

| Verdict | Pass 2 | Section total |
|---|---|---|
| `corrected` | 30 | 44 |
| `contested` | 6 | 9 |
| `unverifiable` | 4 | 7 |
| **Total flagged** | **40** | **60** |
| Chapters with nothing flagged | 4 of 26 | 5 of 37 |

The pilot projected "40–50 more rows, weighted toward citation drift and pseudo-quotations, with Phần
III the riskiest." Actual: **40 rows, and Phần III carries 23 of them** — 58% of the flags in 32% of
the files.

---

## The four findings that matter most

### 1. ⚠️ Four chapters cite nothing, because Aquinas never wrote them

`09-xuc-dau`, `10-truyen-chuc` and `11-hon-phoi` all carry the citation *"(Tổng luận thần học, Phần
III, **các câu hỏi liên quan**)"* — a placeholder where every other chapter in the section names a
question range.

**The reason is that the Summa stops at III q.90.** Anointing, Orders, Matrimony and the Last Things
are all in the **Supplementum**, assembled after Aquinas's death from his earlier *Sentences*
commentary. New Advent's own editorial note on the Supplementum says plainly that *"St. Thomas never
completed his treatise on Penance."*

| Chapter | Actual location | Written by Aquinas as part of the Summa? |
|---|---|---|
| `09-xuc-dau` | **Supplementum q.29–33** | No — compiled posthumously |
| `10-truyen-chuc` | **Supplementum q.34–40** | No |
| `11-hon-phoi` | **Supplementum q.41–68** | No |
| `12-canh-chung` | **Supplementum q.69–99** + appendices | No — **but this chapter says so** |
| `08-hoa-giai` §3 detail | Summa III q.84–90 ✔, but the confession detail is **Supplementum q.9** | Partly |

`12-canh-chung` gets it right — it cites *"Phần III **và Phần Phụ lục**"*. That the same drafter
handled one chapter honestly and left the other three vague is itself informative: the placeholder is
where the model had nothing to cite.

**This is a section-level problem, not four chapter-level ones.** Four of twelve Phần III chapters say
*"Theo Thánh Tôma"* over text he did not write. Fix the citations, and add the "the Summa is
unfinished" note to `00-mo-dau` (already flagged as an omission in Pass 1) — the two go together.
`corrected` ×3 (+1 noted).
Source: [Supplementum, New Advent](https://www.newadvent.org/summa/5.htm)

### 2. ⚠️ *Gratia gratis data* is defined as the opposite of what it means

`05-an-sung` §3 gives:

> **b. Ân sủng hiện sủng** (*gratia gratis data* hoặc ân sủng giúp đỡ)
> Là những ơn Chúa ban trong từng lúc để giúp con người làm một hành động tốt cụ thể…

**I-II q.111 a.1 says *gratia gratis data* is grace *"bestowed on a man, not to justify him, but rather
that he may cooperate in the justification of another"*** — the charisms: prophecy, tongues, miracles,
teaching. It is grace given **for other people's benefit**, and Aquinas contrasts it with sanctifying
grace precisely on that axis. It is not actual grace and not "helping grace."

What the chapter is reaching for is a real Thomistic distinction, just a different one: within
sanctifying grace, **q.111 a.2** divides *gratia operans* / *cooperans*, and **a.3** *praeveniens* /
*subsequens*. Either would carry the point the chapter wants to make.

This is the clearest flat error in the section — a Latin term glossed as its opposite, in a chapter on
the doctrine that most divides Catholics from Protestants. `corrected`.
Source: [ST I-II q.111](https://www.newadvent.org/summa/2111.htm)

### 3. ⚠️ Two modern positions signed with Aquinas's name

Same failure mode as the pilot's `08-linh-hon` (soul infused at conception). It has now appeared three
times, which makes it the section's signature defect.

**(a) The Confirmation formula — `06-them-suc` §3.** The chapter gives the form as *"Hãy nhận lấy ấn
tích ơn Chúa Thánh Thần"*. That is the **1971 formula of Paul VI** (*Accipe signaculum doni Spiritus
Sancti*). **III q.72 a.4** — a question the chapter cites correctly — gives Aquinas's form verbatim:
*"I sign thee with the sign of the cross, I confirm thee with the chrism of salvation, in the name of
the Father and of the Son and of the Holy Ghost. Amen."* A reader who opens q.72 a.4 to check will find
a different sentence. `corrected`.
Source: [ST III q.72 a.4](https://www.newadvent.org/summa/4072.htm)

**(b) The episcopate — `10-truyen-chuc` §2.** The chapter lists three grades of Orders under *"Thánh
Tôma phân biệt"*, with **"Giám mục — Nhận đầy đủ chức tư tế."** **Supplementum q.40 a.5 holds the
episcopate is NOT an Order** in the sacramental sense: *"the bishop has not a higher power than the
priest"* with respect to the Eucharist, which is what sacramental order is ordered to; episcopal
pre-eminence is over the mystical body — office and jurisdiction, not sacramental character.

**Handle this correction carefully.** The chapter's *doctrine* is the current, correct one — episcopal
consecration confers the fullness of the sacrament of Orders (Vatican II, *Lumen Gentium* 21). Only the
**attribution to Aquinas** is wrong. The fix is to keep the teaching and say the Church settled the
question after him — not to "correct" the text toward Aquinas's medieval view. `corrected`.
Source: [Supplementum q.40 a.5](https://www.newadvent.org/summa/5040.htm)

### 4. ⚠️ A patristic axiom credited to Aquinas

`01-nhap-the` §3: *"Thánh Tôma tóm tắt bằng nguyên tắc nổi tiếng"* — followed by **"Quod non est
assumptum non est sanatum."**

That axiom is **St Gregory of Nazianzus's**, from *Epistle 101 to Cledonius* (c. 382), written against
Apollinarianism. Aquinas cites the principle; he did not coin it, and it is not his summary. On a site
that also runs a Giáo Phụ section, handing a Cappadocian Father's most famous line to a thirteenth-century
Dominican is a conspicuous mistake. `corrected`.
Source: [Gregory of Nazianzus, Ep. 101–102 ad Cledonium](https://www.academia.edu/104788637/GREGORY_OF_NAZIANZUS_EPISTULAE_101_102_AD_CLEDONIUM)

---

## Systemic patterns in Pass 2

### A. Definitions attributed to Aquinas are the Catechism's

**Five chapters** open with a `>` blockquote reading "Theo Thánh Tôma, X là:" — and give the modern
Catechism's definition rather than Aquinas's.

| Chapter | Blockquote given as Aquinas's | Actually |
|---|---|---|
| `01-duc-tin` | "Nhân đức đối thần nhờ đó chúng ta tin vào Thiên Chúa…" | ≈ **CCC 1814**. Aquinas (II-II q.4 a.1): *"a habit of the mind whereby eternal life is begun in us, making the intellect assent to what is non-apparent."* |
| `02-duc-cay` | "…trông cậy sẽ đạt được hạnh phúc đời đời nhờ sự trợ giúp của Thiên Chúa" | ≈ **CCC 1817** |
| `03-duc-men` | "…yêu mến Thiên Chúa trên hết mọi sự vì chính Ngài…" | ≈ **CCC 1822** |
| `04-bi-tich-noi-chung` | "Dấu chỉ hữu hiệu của ân sủng, do Chúa Kitô thiết lập…" | ≈ **CCC 1131**. Aquinas (III q.60 a.2): *"a sign of a sacred thing in so far as it sanctifies men."* |
| `03-tap-quan-va-nhan-duc` | "Nhân đức là một tập quán tốt…" | Drops the whole distinguishing Augustinian formula Aquinas quotes at I-II q.55 a.4 |

The definitions are **not wrong** — they are the Church's own. The defect is the attribution, and it
compounds Pass 1's finding that blockquotes in this section aren't quotations. Cheapest global fix:
change "Theo Thánh Tôma, X là:" to "Sách Giáo lý định nghĩa…" and cite the CCC paragraph, which also
gives you free `refs_ccc` frontmatter.

**One blockquote does check out verbatim** and is worth keeping as the model: `04-luat`'s definition of
law faithfully renders **I-II q.90 a.4** — an ordinance of reason, for the common good, by the one who
has care of the community, promulgated. All four elements correct.
Source: [ST I-II q.90 a.4](https://www.newadvent.org/summa/2090.htm)

### B. Untranslated English words left in the Vietnamese prose

Raw drafting artifacts, in four places — the clearest fingerprint of the generating tool:

- `03-tap-quan-va-nhan-duc` §4 — *"do Thiên Chúa **infused** (đổ vào) trong linh hồn"*
- `04-bi-tich-noi-chung` §3 — *"sự chuẩn bị và **Disposition** của người lãnh nhận"*
- `05-rua-toi` §3 — *"**Chất thể** (*matter*)"* / *"**Mô thể** (*form*)"* — glossed in **English** where
  every other chapter glosses in Latin (*materia* / *forma*)
- `05-rua-toi` §3 — *"công thức **Trinitarian**"*

Plus one typo in `03-cuoc-doi-va-thuong-kho` §4: *"các **vừa nhân** đã chết trước Người"*.

Mechanical, but they will be the first thing a reader notices, and they undercut the section's
authority before any argument is reached. `corrected` ×4.

### C. Citation drift continues

- `02-hanh-dong-nhan-linh` cites **q.6–21**, then devotes §4 to the passions — which are **q.22–48**.
- `02-ngoi-hiep` cites **q.2–6**, overlapping `01-nhap-the`'s **q.1–3**; and its §3 on the
  *communicatio idiomatum* ("Thiên Chúa đã chết trên thập giá") is **q.16**.
- `08-an-hue-va-chan-phuc` sits in the **`03-phan-ii-ii/`** folder under the heading "PHẦN II-II" but
  cites — correctly — **Phần I-II, q.68–70**. Its content is I-II material. This one matters for the
  build: it will get the wrong `part:` value and land in the wrong place in the reader's sequence.

### D. Internal contradictions between chapters

Two places where the section disagrees with itself — worth more than their individual severity,
because they mean no single pass reconciled the chapters against each other.

1. **Humility.** `06-can-dam` says *"Khiêm tốn cũng được bàn gần với can đảm"*; `07-tiet-do` correctly
   lists it under temperance. **II-II q.161 a.4** is explicit: humility is a part of modesty/temperance,
   and Aquinas contrasts it *with* magnanimity, which is the one under fortitude. `06-can-dam` is wrong.
   Source: [ST II-II q.161](https://www.newadvent.org/summa/3161.htm)
2. **The gift matched to prudence.** `04-khon-ngoan` §5 links prudence to *"**ơn Khôn ngoan** và ơn Chỉ
   giáo"*; `08-an-hue-va-chan-phuc`'s table correctly gives **counsel → prudence** and **wisdom →
   charity**. **I-II q.68 a.4** backs the table: *"Counsel corresponds to prudence."* `04-khon-ngoan`
   is wrong on the gift of wisdom.

---

## Per-file findings

### `02-phan-i-ii/` — Phần I-II (5 chapters, 7 flags)

| File | # | Claim | What the sources say | Verdict |
|---|---|---|---|---|
| `01-hanh-phuc` | 1 | Blockquote *"Hạnh phúc cuối cùng… hệ tại việc chiêm ngưỡng bản tính Thiên Chúa"* | Doctrine correct (**I-II q.3 a.8**); untraceable as a quotation. *"mặt giáp mặt"* is verbatim **CGKPV 1 Cr 13,12** ✔ | `unverifiable` |
| `02-hanh-dong-nhan-linh` | 2 | §4 on the passions, under a heading citing q.6–21 | Passions are **I-II q.22–48** | `corrected` |
| | 3 | Blockquote *"Mục đích tốt không biện minh cho phương tiện xấu"* | True principle, but not Aquinas's wording — his is *bonum ex integra causa, malum ex quocumque defectu* (from Dionysius, I-II q.18 a.4 ad 3) | `unverifiable` |
| `03-tap-quan-va-nhan-duc` | 4 | *"Các **nhân đức luân lý** được hình thành… nhờ việc thực hành"*, with only theological virtues infused | **Flattens I-II q.63 a.3**, where Aquinas holds there are also **infused moral virtues**, differing in species from the acquired ones (a.4). One of his more consequential distinctions | `corrected` |
| | 5 | Untranslated *"**infused**"* | See pattern B | `corrected` |
| | 6 | Virtue-definition blockquote | Drops the distinguishing clauses of the formula Aquinas quotes at **I-II q.55 a.4** | `unverifiable` |
| `04-luat` | — | — | **Nothing flagged.** Definition verbatim-faithful to **q.90 a.4**; the four kinds of law in Aquinas's own order (q.91); New Law as *"ân sủng của Chúa Thánh Thần"* correct per **q.106 a.1** | ✔ clean |
| `05-an-sung` | 7 | *gratia gratis data* = actual/helping grace | **Headline finding 2 above.** I-II q.111 a.1 | `corrected` |

### `03-phan-ii-ii/` — Phần II-II (8 chapters, 8 flags)

| File | # | Claim | What the sources say | Verdict |
|---|---|---|---|---|
| `01-duc-tin` | 8 | Definition blockquote | ≈ CCC 1814, not Aquinas — see pattern A | `corrected` |
| `02-duc-cay` | 9 | Definition blockquote | ≈ CCC 1817 | `corrected` |
| `03-duc-men` | 10 | Definition blockquote | ≈ CCC 1822. *(The order of charity in §5 — God, self, neighbour, own body — is exactly **II-II q.26 a.4–5** ✔, and **1 Cr 13,13 is verbatim CGKPV** ✔)* | `corrected` |
| `04-khon-ngoan` | 11 | Prudence linked to *"ơn Khôn ngoan"* | **I-II q.68 a.4**: counsel ↔ prudence; wisdom ↔ charity. Contradicts this section's own table | `corrected` |
| | 12 | *"khôn ngoan được ví như 'người đánh xe'"* (*auriga virtutum*) | Traditional image, usually credited to St Bernard; I could not trace it to Aquinas | `unverifiable` |
| `05-cong-bang` | — | — | **Nothing flagged.** Three kinds of justice correct; *pietas* as duty to parents and country correct (q.101); **religion as the chief moral virtue confirmed at [II-II q.81 a.6](https://www.newadvent.org/summa/3081.htm)** | ✔ clean |
| `06-can-dam` | 13 | Humility discussed "near" fortitude | **II-II q.161 a.4** — humility is under temperance/modesty. See pattern D | `corrected` |
| `07-tiet-do` | — | — | **Nothing flagged.** Chastity (q.151), virginity (q.152), meekness (q.157), humility (q.161), studiousness/curiosity (q.166–167) all correctly placed | ✔ clean |
| `08-an-hue-va-chan-phuc` | 14 | Filed in `03-phan-ii-ii/` under "PHẦN II-II"; content and citation are **Phần I-II q.68–70** | Structural — will produce a wrong `part:` and wrong reader sequence | `corrected` |
| | 15 | Virtue column of the table | Mixes **q.68 a.4** with pairings drawn from elsewhere, and omits Aquinas's own caution there that the theological virtues are *"presupposed to the gifts, as being their roots"* rather than paired with them | `contested` |

**Worth stating plainly:** `08-an-hue-va-chan-phuc`'s **gift ↔ beatitude column is correct in all seven
rows**, matching Augustine as Aquinas reports him at **I-II q.69 a.3** (fear→poor in spirit,
piety→meek, knowledge→mourn, fortitude→hunger and thirst, counsel→merciful, understanding→clean of
heart, wisdom→peacemakers). Its treatment of the eighth beatitude also matches Aquinas: *"a confirmation
and declaration of all those that precede."* **Mt 5,10** and **Mt 5,11-12** are verbatim CGKPV. This is
the most error-prone table in popular Thomism and the drafter got it right.
Sources: [I-II q.68](https://www.newadvent.org/summa/2068.htm) · [I-II q.69](https://www.newadvent.org/summa/2069.htm)

### `04-phan-iii/` — Phần III (12 chapters, 23 flags)

| File | # | Claim | What the sources say | Verdict |
|---|---|---|---|---|
| `01-nhap-the` | 16 | *"Quod non est assumptum non est sanatum"* as Aquinas's principle | **Gregory of Nazianzus, Ep. 101.** Headline 4. *(§1's "not absolutely necessary, but the more fitting way" is exactly [III q.1 a.2](https://www.newadvent.org/summa/4001.htm) ✔)* | `corrected` |
| `02-ngoi-hiep` | 17 | Cites q.2–6, overlapping ch.1's q.1–3 | Overlapping ranges; ch.1 = q.1, ch.2 = q.2–6 would be clean | `corrected` |
| | 18 | §3 *communicatio idiomatum* under q.2–6 | **III q.16**. *(Chalcedon 451 and the four adverbs — không lẫn lộn / không thay đổi / không phân chia / không tách rời — are **confirmed** against the Chalcedonian Definition ✔)* | `corrected` |
| `03-cuoc-doi-va-thuong-kho` | 19 | *"các **vừa nhân** đã chết trước Người"* | Typo. *(q.27–59 is the correct range ✔; superabundant satisfaction q.48 a.2 ✔; risen by his own power q.53 a.4 ✔)* | `corrected` |
| `04-bi-tich-noi-chung` | 20 | Definition blockquote | ≈ CCC 1131; Aquinas is III q.60 a.2 | `corrected` |
| | 21 | *"Thánh Tôma dạy rằng Bí tích thông ban ân sủng… (*ex opere operato*)"* | **Sources genuinely disagree** whether Aquinas uses the phrase in the Summa; some hold he never does there, preferring efficacy "from the merit or passion of Christ." The term is 12th-century scholastic and became normative through Trent. Attribute it to the tradition, not to him. *(I could not verify which Trent session — do not add one.)* | `contested` |
| | 22 | Untranslated *"**Disposition**"* | Pattern B | `corrected` |
| `05-rua-toi` | 23 | Ga 3,5 marked *"– CGKPV"* | **Mismatch.** Chapter: *"bởi nước và **Thánh Thần**"*; CGKPV: *"bởi nước và **Thần Khí**."* | `corrected` |
| | 24 | *matter* / *form* / *Trinitarian* in English | Pattern B | `corrected` |
| `06-them-suc` | 25 | The Confirmation form | **Headline 3(a).** III q.72 a.4 | `corrected` |
| | 26 | *"linh mục cũng có thể được ủy quyền"* | Current canon law, not Aquinas — **III q.72 a.11** reserves confirmation to the bishop | `corrected` |
| `07-thanh-the` | 27 | *"**tiếp tục** và hiện tại hóa hy tế thập giá"* | *"Tiếp tục"* (continues) reads as repeating Calvary — the one thing the Church denies. The Mass **re-presents** the one sacrifice; Aquinas (III q.83 a.1) calls the celebration an image representing the Passion | `corrected` |
| | 28 | *"realiter, vere et substantialiter"* under "Theo Thánh Tôma" | That triad is **Trent's** formula (*vere, realiter et substantialiter*), not Aquinas's phrase | `contested` |
| | 29 | Ga 6,56 marked CGKPV, with *Tôi* capitalised | CGKPV reads lowercase *tôi*. Wording otherwise verbatim ✔ — reverence-capitalisation only, but the text is labelled CGKPV | `corrected` |
| `08-hoa-giai` | 30 | §3 detail on completeness of confession, and attrition sufficing | The three acts **are** III q.90 a.2 ✔ and **Ga 20,23 is verbatim CGKPV** ✔ — but the confession detail is **Supplementum q.9**, and attrition's sufficiency was settled at Trent, not in q.84–90 | `corrected` |
| `09-xuc-dau` | 31 | *"các câu hỏi liên quan"* | **Supplementum q.29–33.** Headline 1 | `corrected` |
| | 32 | Gc 5,14-15 marked *"– CGKPV"* | **Mismatch, two words.** Chapter: *"được Chúa **nâng đỡ**… nếu người ấy **có** phạm tội"*; CGKPV: *"được Chúa **nâng dậy**… nếu người ấy **đã** phạm tội."* | `corrected` |
| `10-truyen-chuc` | 33 | *"các câu hỏi liên quan"* | **Supplementum q.34–40** | `corrected` |
| | 34 | *"Giám mục — Nhận đầy đủ chức tư tế"* as Aquinas's teaching | **Headline 3(b).** Supp. q.40 a.5 | `corrected` |
| | 35 | The *"chú rể"* (bridegroom) rationale for male-only ordination, given as Aquinas's | The bridegroom argument is **modern** (*Inter Insigniores*, 1976, and John Paul II). Aquinas's own argument at **Supp. q.39 a.1** rests on a different and now-disused premise about eminence of degree. Attribute the modern argument to its modern source; do not put it in his mouth | `corrected` |
| `11-hon-phoi` | 36 | *"các câu hỏi liên quan"* | **Supplementum q.41–68** | `corrected` |
| | 37 | *tria bona matrimonii* presented as Aquinas's | **Augustine's** triad (*De bono coniugali*), which Aquinas adopts. *(Mt 19,6 is verbatim CGKPV ✔ but, unlike every other verse in the section, carries no "– CGKPV" marker)* | `corrected` |
| | 38 | §5 ranks the ends of marriage *"theo thứ tự"* | That hierarchy is the **pre-Vatican II** framing (1917 CIC c.1013). **Gaudium et Spes 48–50** and **CIC 1983 c.1055** deliberately dropped the primary/secondary ranking. It is fair as Aquinas's position; a reader will take it as current teaching | `contested` |
| `12-canh-chung` | — | — | **Nothing flagged.** Correctly cites *"Phần III và Phần Phụ lục"*; 1 Cr 13,12 ✔ | ✔ clean |

### `05-ket-luan.md` — Phần Kết (2 flags)

| # | Claim | What the sources say | Verdict |
|---|---|---|---|
| 39 | *"Tất cả những gì tôi đã viết chỉ là rơm rác **so với những gì tôi đã được chiêm ngưỡng**"* in quotation marks | The attested words are only **"mihi videtur ut palea"** — "it seems to me as straw" — reportedly said to Reginald of Piperno after 6 December 1273. The *"compared to what has been revealed to me"* clause is the **conventional gloss**, not part of the attested Latin. Keep the quotation to what is attested and put the rest in your own prose. *(I could not verify the Bartholomew of Capua canonisation-testimony sourcing often cited for it, so do not add that attribution.)* | `contested` |
| 40 | *exitus / reditus* again asserted as the Summa's structure | Same as Pass 1 row **M3** — Chenu's reading, contested. Fix both together or neither, so the intro and conclusion stay consistent | `contested` |

---

## Revised advice after the full pass

**The recommendation from the pilot stands, with one change of emphasis: the correction pass is bigger
than "an hour plus a few paragraphs," and Phần III needs a different kind of attention from Phần I–II.**

**What the full picture now shows.** Across 37 chapters there is still **no invented question number
that points nowhere, no heresy, and no fabricated event.** Five chapters are clean. The gifts–beatitudes
table, the order of charity, the four kinds of law, the parts of temperance, Chalcedon — all correct.
This is a real, usable draft.

But the section's signature defect is now unmistakable and it is **not** citation sloppiness. It is
this: **where the Church's position developed after Aquinas, the text states the modern position and
attributes it to him.** Soul infused at conception (Pass 1), the 1971 Confirmation formula, the
episcopate as the fullness of Orders, the bridegroom argument for male-only ordination, the Catechism's
definitions of the theological virtues. That is five instances, and it is exactly what an LLM trained
on modern catechetical prose would produce when asked to write about a medieval author.

**Practically, three tiers again — but reweighted:**

1. **Mechanical (≈2 hours):** the four English artifacts and the typo, the two CGKPV mismatches, the
   Ga 6,56 capitalisation, the citation-drift rows, the `08-an-hue-va-chan-phuc` part-placement, and
   the four *"các câu hỏi liên quan"* placeholders → real Supplementum ranges.
2. **Attribution rewrites (a paragraph each, ~12 places):** the five Catechism-definition blockquotes,
   the *quod non est assumptum* axiom, the *tria bona*, the Confirmation formula, the episcopate, the
   bridegroom argument, *ex opere operato*, the *realiter/vere/substantialiter* triad. **These are the
   ones that matter** — each is a sentence a reader could be corrected on.
3. **Editorial calls that are yours:** how much to hedge marriage's ends (row 38), how to present the
   "straw" quotation (row 39), and whether to fix *exitus/reditus* in both intro and conclusion.

**One structural recommendation for the build (step 4).** Given that four Phần III chapters and part of
a fifth expound the **Supplementum**, the section needs a way to say so on the page — a
`summa_ref: "Suppl. q.34–40"` that renders visibly different from `III, q.72`, or a short standing note
on Phần III's index. Otherwise every fix in tier 1 gets silently undone the first time someone skims
the reader and assumes it's all Aquinas. This is a small addition to the frontmatter schema in
`docs/tong-luan-spec.md`, best decided before the loader is written.

---

## Additional sources consulted for Pass 2

**Summa (New Advent).**
[I-II q.63](https://www.newadvent.org/summa/2063.htm) ·
[I-II q.68](https://www.newadvent.org/summa/2068.htm) ·
[I-II q.69](https://www.newadvent.org/summa/2069.htm) ·
[I-II q.90](https://www.newadvent.org/summa/2090.htm) ·
[I-II q.111](https://www.newadvent.org/summa/2111.htm) ·
[II-II q.81](https://www.newadvent.org/summa/3081.htm) ·
[II-II q.161](https://www.newadvent.org/summa/3161.htm) ·
[III q.1](https://www.newadvent.org/summa/4001.htm) ·
[III q.72](https://www.newadvent.org/summa/4072.htm) ·
[Supplementum index](https://www.newadvent.org/summa/5.htm) ·
[Suppl. q.40](https://www.newadvent.org/summa/5040.htm)

**Scripture.** Repo CGKPV `content/bible.json` — 1 Cr 13,12 · 1 Cr 13,13 · Mt 5,10 · Mt 5,11-12 ·
Mt 19,6 · Ga 3,5 · Ga 6,56 · Ga 20,23 · Gc 5,14-15. **Nine references checked; two mismatched
(Ga 3,5; Gc 5,14-15), one capitalisation-only (Ga 6,56), six verbatim.**

**Catechism.** Repo `content/content.json` — §§ 1131, 1814, 1817, 1822 (compared against the chapters'
blockquote definitions).

**Councils and magisterium.**
[Chalcedonian Definition, 451](https://www.papalencyclicals.net/councils/ecum04.htm) ·
*Lumen Gentium* 21 (episcopal consecration) · *Gaudium et Spes* 48–50 and CIC 1983 c.1055 (ends of
marriage) · *Inter Insigniores* 1976 (bridegroom argument).

**Patristics.**
[Gregory of Nazianzus, Epistulae 101–102 ad Cledonium](https://www.academia.edu/104788637/GREGORY_OF_NAZIANZUS_EPISTULAE_101_102_AD_CLEDONIUM)

**Not used as evidence.** Wikipedia, as pointer only. On *ex opere operato* and the "straw" quotation
the sources genuinely conflict or thin out, and both rows are marked `contested` rather than resolved.

---

---
---

# Pass 3 — what was applied

**Owner's decision (2026-08-19):** correct Phần I / I-II / II-II; **rewrite** the sacraments chapters
of Phần III by hand; **cut** the three chapters expounding the Supplementum on Anointing, Orders and
Matrimony; light edits to intro and conclusion.

## Where the content now lives

The vault (`D:\Dropbox\Obsidian Vault\Summa of the Summa\`) **was not modified** — it stays the
authoring source, per `docs/tong-luan-spec.md` and the standing "never overwrite the source" rule. The
corrected, frontmattered copy is `content/tong-luan/`, which is now the canonical published version.
**The two are deliberately out of sync**; treat the repo copy as authoritative from here.

## What changed, by part

| Part | Files | Treatment |
|---|---|---|
| `00-mo-dau` | 1 | Corrected + **new section 3** on the Summa being unfinished at III q.90, and a rewritten section 4 on *quaestio* vs *articulus* |
| `phan-i/` | 10 | Corrected (all 20 pilot rows) |
| `phan-i-ii/` | 5 | Corrected (7 rows) |
| `phan-ii-ii/` | 8 | Corrected (8 rows) |
| `phan-iii/01–03` | 3 | Corrected (Christology) |
| `phan-iii/04–08` | 5 | **Rewritten from the questions themselves** (sacraments in general → Reconciliation) |
| ~~`09-xuc-dau`, `10-truyen-chuc`, `11-hon-phoi`~~ | **3 cut** | Supplementum, not Aquinas — see below |
| `phan-iii/09-canh-chung` | 1 | Kept, with an explicit Supplementum warning banner |
| `99-ket-luan` | 1 | Corrected |
| **Total** | **34** | (was 37) |

## The three cuts

`09-xuc-dau`, `10-truyen-chuc` and `11-hon-phoi` are gone. They expounded **Supplementum q.29–68**,
which Aquinas did not write, in a section titled "The Summa, Explained" — and they carried three of the
report's worst rows (the episcopate, the bridegroom argument, the Gc 5,14-15 CGKPV mismatch).

Their loss is now **explained rather than silent**: `00-mo-dau` §3 tells the reader the Summa stops at
III q.90 and why, and `08-hoa-giai` ends on the line *"chính tại đây, giữa khảo luận về lòng thương xót
này, bộ Tổng luận thần học dừng lại."*

**`12-canh-chung` was kept** (renumbered `09`) even though it is also Supplementum. It already labelled
itself honestly, eschatology is where the *exitus/reditus* arc closes, and the conclusion depends on it.
It now carries a `⚠️` banner and `summa_source: supplementum` in frontmatter. **Flagged for the owner as
a judgement call** — say the word and it goes too.

## Frontmatter: the `Suppl.` problem, solved

The structural recommendation from Pass 2 is implemented. Three new fields beyond the spec:

```yaml
summa_ref: "Phụ lục, q.69–99 (không do chính Thánh Tôma viết)"
summa_source: "supplementum"     # absent on chapters Aquinas wrote himself
summa_note: "Thánh Tôma dừng bút ở Phần III, Câu hỏi 90. …"
```

The loader (step 4) should render a visible caveat wherever `summa_source: supplementum` is present.
**`docs/tong-luan-spec.md` needs its frontmatter block updated to match** before the build.

## Things I did NOT silently fix

- **Angel-choir names** (`07-thien-than`). I changed them, then **reverted to your wording** — the order
  is correct and the names are word choice, which is your lane, not mine.
- **Chapter 2's title** (`02-ban-tinh-don-nhat`). I *did* change `title_vi` from "Bản tính đơn nhất" to
  **"Thiên Chúa là Đấng đơn thuần tuyệt đối"**, and added a short section distinguishing q.3
  (*simplicitas*) from q.11 (*unitas*). Rationale: this is the concept/label mismatch flagged as row 2.4,
  not a translation preference. **The filename is unchanged, so reverting is a one-line edit.** Your call.

## New findings during the rewrite

Two things surfaced only once I was writing from the sources:

1. **The original beatitude wordings were not CGKPV either.** The old `08-an-hue` table used *"ai có
   tinh thần nghèo khó"*, *"ai đói khát sự công chính"*, *"ai có lòng thương xót"* — CGKPV reads *"ai có
   **tâm hồn** nghèo khó"*, *"ai **khát khao nên người công chính**"*, *"ai **xót thương người**"*. Also
   **CGKPV puts *hiền lành* at 5,4 and *sầu khổ* at 5,5** — the reverse of many English Bibles. All now
   quoted verbatim with CGKPV's own numbering.

2. **Is 11,2 lists six gifts in CGKPV, not seven.** CGKPV translates the Hebrew; the traditional seven
   comes from the Septuagint/Vulgate reading *pietas* for the first of two occurrences of "fear of the
   Lord". A reader counting along in a Vietnamese Bible would find the chapter wrong. Now explained in a
   callout rather than glossed over.

## Verification of the applied files

Run against all 34 files:

- **Frontmatter parses**, required keys present, no duplicate `part`/`order` — 34/34 clean.
- **All 172 `refs_ccc` paragraphs resolve** against the site's own Catechism data (`content/content.json`).
- **All 21 `refs_scripture` entries resolve** against the repo's CGKPV data (`content/bible.json`).
- Every inline `(… – CGKPV)` quotation in the bodies was read from `content/bible.json` before being
  written. No verse was quoted from memory.

**One incidental bug found, not mine to fix here:** the site's Catechism text uses **`Hr`** for Hebrews,
but `content/bible.json`'s `abbrevIndex` only knows **`Dt`** / `do thái` / `heb`. So `Hr 11,1` in the
Catechism reader will not resolve to a popover. Spawned as a separate task.

## Step 4 — the build (2026-08-19)

`/tong-luan` is built and flag-gated behind **`NEXT_PUBLIC_TONG_LUAN`** (default off; added to
`.env.local`, which `.gitignore:34` — `.env*` — genuinely covers; verified untracked).

**Files added**

| File | Purpose |
|---|---|
| `lib/tongLuanFlag.ts` | Visibility gate, client-safe, Canvas pattern |
| `lib/tongLuan.ts` | Loader: parts, chapters, grouping, prev/next |
| `app/tong-luan/page.tsx` | Index — six parts, 35 chapters |
| `app/tong-luan/[slug]/page.tsx` | Chapter — sidebar TOC, refs, body, sources, prev/next |
| `app/tong-luan/tong-luan.module.css` | Styles for both |

**Design notes**

- **Slugs are flat** (`phan-i/01-su-hien-huu-thien-chua.md` → `/tong-luan/su-hien-huu-thien-chua`).
  Verified all 35 are unique after stripping the numeric prefix; the loader would collide silently
  otherwise, so re-check if a chapter is ever renamed.
- **One ordering drives everything.** `getAllChapters()` sorts by part index then frontmatter `order`,
  and the index, sidebar and prev/next all read from it — so they cannot drift apart.
- **Leading chrome is stripped from bodies.** The .md files open with the part name (h1), a section
  heading (h2), the chapter title (h3) and the italic citation — all of which the page chrome already
  renders. `stripLeadingChrome()` removes them and lifts the h2 out as `section`, shown in the part
  label. Verified: no duplicated title, no leaked citation line.
- **`summa_source: supplementum` renders a visible gold caveat box** using `summa_note`, on the one
  chapter that carries it (`canh-chung`), plus a "Phụ lục" tag on its index row.
- Bodies render through **`ScriptureBody` + `enrichBody`** per `CLAUDE.md` — never a bare
  `dangerouslySetInnerHTML`. Frontmatter refs render as `<CatechismRef>` / `<ScriptureRef variant="chip">`.

**Verification**

`npx tsc --noEmit` → 0. `npm run lint` → 0. Then, against a running dev server:

- `/tong-luan` → 200; 6 part headings in correct reading order; 35 unique chapter links; Phụ lục tag present.
- **All 35 chapter routes → 200**, each with a rendered body and no error boundary.
- Unknown slug → 404. Flag off → 404 (the gate is the first statement in both pages).
- Chapter spot-check: title, part label, `summa_ref` chip, sidebar with exactly one active item,
  20 body paragraphs, CCC chips, prev/next, sources block — all present.
- `canh-chung`: caveat box, its heading, and the `summa_note` text all render.

*Note on method:* the Browser tools could not be used — Next 16 refuses a second dev server in the same
directory and another session held it (PID 65940). Rather than kill another session's process, the
routes were verified over HTTP against the running server, which serves this same working tree.

**One small thing left for the owner.** The `summa_ref` chips read `I, q.2, a.3` (the international
citation convention, and what matches the newadvent/corpusthomisticum links in `sources`), while the
prose now says *Tiết 3* after the terminology change. Both are defensible — the chip is a citation, the
prose is Vietnamese. Say the word if you'd rather the chips read `Tiết` too.

---

## Addendum 2 — new chapter: "Vì sao Thánh Tôma ngừng viết?" (2026-08-19)

**Commissioned by the owner.** Once we had cut three chapters *because* the Summa stops at III q.90 and
told the reader so twice, not explaining why he stopped left a hole we had opened ourselves.

New file: `content/tong-luan/98-vi-sao-ngung-viet.md`, `part: ket-luan`, `order: 98` — sits between
`08-hoa-giai`'s closing line and the conclusion. Section is now **35 chapters**. The conclusion's
duplicate passage was trimmed to a pointer.

**Researched before writing, not after** — including Vietnamese sources this time, per the lesson below.

### What the chapter establishes, and how firmly

| Claim | Standing |
|---|---|
| 6.12.1273, feast of St Nicholas, in St Nicholas's chapel, Naples, during Mass | attested |
| Afterwards he refused to write or dictate and put away his writing materials | attested (Bartholomew's testimony) |
| Stopped at **III q.90**, mid-treatise on Penance | verified directly at New Advent |
| *"mihi videtur ut palea"* | attested Latin — **just those words** |
| "…compared to what I have seen" | the conventional gloss, flagged as such |
| The crucifix incident ("Con đã viết hay về Ta") | **a separate, earlier occasion**, different witness (Đaminh thành Caserta) |
| Mystical vs physiological cause | **genuinely disputed** — both given |
| Died 7.3.1274 at Fossanova, en route to Lyons II | attested |

**The source chain is stated in the chapter, not hidden.** Reginald *(eyewitness)* → John del Guidice →
Bartholomew of Capua → canonization inquiry, **1319** — i.e. third-hand, recorded ~45 years later, in a
document with a canonizing purpose. Torrell still treats Bartholomew as a principal source; the chapter
says both things.

**Both readings of the cause are given fairly.** Weisheipl, O.P. (a breakdown of an exhausted
constitution), E. Colledge (signs of a serious cerebral stroke), against the traditional mystical
reading. And Torrell's further point that it is *"hardly probable"* the final illness was directly
linked to the 6 December event — so even merging "vision" and "illness" is itself an assumption. The
chapter argues they need not exclude each other, on Aquinas's own principle that grace perfects nature
rather than destroying it.

**Two popular errors deliberately not repeated:** that he stopped at "Question 99" (a widely circulated
claim — it is q.90; q.99 is in the Supplementum), and that the crucifix conversation and the 6 December
Mass were the same occasion.

### A terminology correction from HĐGM VN — "rơm rạ", not "rơm rác"

Checking Vietnamese sources produced a real fix. The vault text, and my own earlier draft of the
conclusion, rendered *palea* as **"rơm rác"** (straw + rubbish). **HĐGM VN's own article on Aquinas uses
"như rơm rạ"** — straw and stubble, the agricultural residue.

This is not a nicety. *"Rơm rác"* carries a note of contempt and makes it sound as though Thomas called
his work garbage. *"Rơm rạ"* is what *palea* actually means — and it is the word that lets the point
land: straw is real, it is necessary, it carried the grain all season, but it is not the grain. The old
word was fighting the very explanation the chapter gives. **Changed throughout (5 occurrences, 0 left).**

Per `CLAUDE.md`, HĐGM VN is the named authority for Vietnamese Catholic terminology, which is why this
one was applied rather than merely flagged — same footing as the CGKPV quotation fixes. Register
generally remains the owner's call.
*(Noted but not touched: HĐGM VN writes "Tôma Aquino"; this section uses "Tôma Aquinô". Pure register — owner's lane.)*

---

## Addendum — Vietnamese Summa translations (owner's question, 2026-08-19)

**The owner asked whether I had checked Vietnamese sources. For the Summa itself, I had not** — that was
a real gap in method, and it is recorded here rather than quietly fixed.

What I had used in Vietnamese: the site's own Catechism (`content/content.json`) and CGKPV
(`content/bible.json`). Those did substantial work — **CCC § 2024 is what settled the grace correction**,
giving *đặc sủng* / *ơn hiện sủng* / *ơn thường sủng* in HĐGM VN's own words rather than mine. What I had
**not** used: any Vietnamese translation of the Summa.

Checking revealed **two** translations, disagreeing on the whole structural vocabulary:

| Latin | **Trần Ngọc Châu** (gp. Qui Nhơn, 1978–1992, pub. 2017) | Dòng Đa Minh (Nguyễn Văn Liêm, O.P.) |
|---|---|---|
| *Articulus* | **Tiết** | Mục |
| *Objectiones* | **Vấn nạn** | Nghi vấn |
| *Sed contra* | **Trái lại** | Nhưng |
| *Respondeo* | **Trả lời** | Luận giải |

**A correction to my own first reaction:** I initially called this "a real miss." The *method* gap was
real; the *term* was not. "Mục", which I had used throughout, is attested — it is the Dominican
translation's word. I landed on a defensible term by luck rather than by checking.

**Owner's decision: follow Trần Ngọc Châu**, on the grounds that this is the version a Vietnamese reader
is most likely to be holding. A supporting reason he did not raise: **the vault text was already leaning
Châu** — it used *vấn nạn*, *trái lại*, *giải đáp* throughout. My "Mục" was the outlier I had introduced.

**Applied:** 152 `Mục N` → `Tiết N`, plus 11 contextual, across 33 files; *Respondeo* relabelled
*Trả lời*. Guarded against the four unrelated words that share the syllable — `linh mục` (8),
`Giám mục` (3), `ngoạn mục` (1), `mục đích` (4) — all verified unchanged. `00-mo-dau` §4 now carries a
reader-facing comparison table so a reader holding the Dominican translation isn't lost.

**Copyright:** both translations are modern and in copyright — same footing as CGKPV. Terminology is
followed and the editions are cited; **no Vietnamese rendering of Aquinas's text is reproduced from
either.** Every Summa quotation in the section is our own rendering from the Latin and the public-domain
Dominican Fathers English. Recorded in the spec.

**Standing lesson for future sessions:** for a Vietnamese-facing section, the primary-source standard
(Latin + public-domain English) establishes *whether a claim is true*, but it does not establish
*whether the reader can check it*. Both are needed. Vietnamese editions belong in the source list from
the start, not as an afterthought.

---

## Hand-off

Steps 1–3 of `docs/tong-luan-spec.md` are complete. **Step 4 — build `/tong-luan`** — is next: the
loader, the index page, `/tong-luan/[slug]` with prev/next and sidebar TOC, all gated behind
`NEXT_PUBLIC_TONG_LUAN`. Bodies must render through `ScriptureBody` + `enrichBody` per `CLAUDE.md`.

Two decisions to settle before the build, not after:

1. **Keep or cut `09-canh-chung`** (the last Supplementum chapter).
2. **Keep or revert chapter 2's `title_vi`.**

Then step 5 (Session 8: homepage card, nav, footer, sitemap) and step 6 (your proofread — the tracker
gets **34** new rows, not 37).
