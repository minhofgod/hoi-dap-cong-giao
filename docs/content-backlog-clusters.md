# Content backlog — Q&A clusters still to write

Consolidated 2026-08-21 at the owner's request: everything raised across sessions, plus gaps found by
auditing the taxonomy against what actually exists. **Ranked.** Each entry says *why it matters*,
*what already exists*, and *what it unblocks* — several of these are load-bearing for content already
published.

**How the gaps were found:** counted every `tags:` id across `content/giai-dap/*.md` against
`lib/giaiDapTaxonomy.ts`. A tag the vocabulary defines but almost nothing carries is a subject the site
claims to cover and doesn't. Re-run that check before planning a batch — it stays honest as content grows.

---

## 1. ⭐ Thánh Thể — the Eucharist / Real Presence  · **the biggest gap on the site**

**Zero Q&As.** Not one answer carries the `eucharist` tag, and there is no Real Presence cluster; the
subject appears only in passing inside answers about other things.

**Why it's first:** this is the central Catholic distinctive and, after authority, the sharpest
Protestant divide. And it leaves published content stranded — **six `content/phep-la` entries are tagged
`eucharist`.** The site presents Eucharistic miracles as evidence for a doctrine it never explains. A
reader arriving at Lanciano has nowhere to learn what it is evidence *of*.

**Unblocks:** the Phép Lạ Thánh Thể entries · the `/cong-giao-va-tin-lanh` sacraments branch · likely
the strongest single addition for the Protestant reader after Sola Scriptura.

**Likely members:** what Catholics mean by Real Presence · "this is my body" — literal or symbol? ·
Ga 6 (the Bread of Life discourse) · transubstantiation without the philosophy jargon · why only a
priest · what the early Church believed (Ignatius, Justin — **note: both are Session 12-verified**).

## 2. Các tín điều về Đức Mẹ — the Marian dogmas

Only **3** Q&As carry the `mary` tag, all inside *Tôn kính ảnh tượng*. The four dogmas — **Mẹ Thiên Chúa ·
Vô nhiễm nguyên tội · trọn đời đồng trinh · hồn xác lên trời** — have no page at all.

**Already load-bearing:** `/cong-giao-va-tin-lanh`'s Mary branch carries a written caveat that the site
has nothing on them. **Delete that clause when this ships** (`lib/congGiaoTinLanhPath.ts` — see
`docs/cong-giao-tin-lanh-spec.md` → "Pending removal").

**Start with Theotokos:** it is a conciliar definition about *Christ* before it is about Mary, it has a
home to link to already (Êphêsô in `content/cong-dong`), and it is by far the easiest of the four for a
Protestant to accept.

## 3. Quyền Giáo hoàng — the Papacy

Only **3** Q&As carry `papacy`, all inside *Duy Kinh Thánh*. **A placeholder line is already waiting on
this** in `hoi-thanh-co-phai-chi-la-cong-doan-vo-hinh` (memory: `todo-papacy-crosslink-sola-scriptura`) —
cross-link or remove it when the cluster lands.

Mt 16,18 is currently mentioned near the end of another answer rather than having its own treatment,
which the owner flagged in the tracker as awkward ordering. There is also a specced **Các Đức Giáo Hoàng**
person-section (`docs/cac-giao-hoang-spec.md`) — different thing (history/biography), but they should
cross-link.

## 4. Quy điển Kinh Thánh — the canon

**Interim cross-links are already pointing at a topic that doesn't exist** (memory:
`todo-canon-topic-crosslink`) — notably the Ân xá anchor's deuterocanon aside → `ai-quyet-dinh-sach-nao`.
Re-point them when this ships. Related material is scattered across the Sola Scriptura cluster today.

## 5. "Hội Thánh không đổi" mà lại đổi — development of doctrine · **already specced**

Spec: `docs/proofread-fixes-round2-sola-scriptura.md` **§G**. Do **not** fold into Sola Scriptura — that
cluster answers *where authority comes from*; this answers *whether that authority contradicts itself
over time.*

Two keys from the spec: **lead with doctrine vs discipline** (most "the Church changed!" examples are
discipline — fasting, Latin, celibacy — which is *meant* to change), and cite **Newman** rather than the
bare seed→tree image. ⚠️ **The analogy alone loses the argument** — a tumour also grows from one cell.
Newman's *Essay* (1845) exists precisely to supply criteria distinguishing development from corruption,
and that is what turns the metaphor into an argument. Newman being an Anglican convert lands well here.

**Overlaps #2 deliberately:** the 1854 and 1950 Marian definitions are simultaneously the sharpest
"you invented this" examples and the missing Marian content. Writing them once serves both clusters.

## 6. ⭐ Thờ cúng ông bà tổ tiên — ancestor veneration

The owner's own starred idea, and **the most distinctive gap** — nothing else on the site covers it, and
no English-language Catholic site serves this question for a Vietnamese reader. Highest
"only-we-can-write-this" value of anything in this list.

## 7. Smaller / thinner

| Subject | Tag coverage | Note |
|---|---|---|
| Luyện ngục (purgatory) | 2, both inside *Ân xá* | Protestant flashpoint; currently only implied |
| Vấn đề sự dữ (problem of evil) | 2 | the *pastoral* side is well covered in Đau khổ; the *philosophical* side is not |
| Đời sau (afterlife) | 2 | heaven/hell/judgement |
| Chúa Ba Ngôi (Trinity) | 4, all in one cluster | |
| Tiến hóa (evolution) | **0** | tag defined, nothing carries it |
| "Cách đi xưng tội" | — | practical/pastoral, pairs with the apologetic Xưng tội cluster |
| "Đạo nào cũng tốt" | — | cultural objection; also the content a Buddhist-facing companion door would need |
| Lịch sử Công giáo VN | — | incl. quốc ngữ; pairs with the VN Martyrs |

---

## Sequencing notes

- **#1 and #2 first.** Both have *published content already depending on them* — the Eucharistic
  miracles, and the Marian caveat written into a live page.
- **#2 and #5 together** if convenient — the Marian definitions are the worked example for development
  of doctrine.
- **#3 and #4 both discharge waiting placeholders**, so shipping them also removes two TODO memories.
- Every one of these is **fact-dense**. `CLAUDE.md` applies: dates, definitions and council references
  web-verified, never from memory. #5 especially — 1854, 1950, and Newman's dates and claims.
