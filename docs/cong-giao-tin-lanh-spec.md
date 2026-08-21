# Công giáo & Tin Lành — a guided path written FOR a Protestant reader (spec)

Decided with the owner 2026-08-20. A third guided surface, alongside the companion (`/dong-hanh`,
branches by *situation*) and the evidence path (`/bang-chung`, one linear cumulative argument).

**Route:** `/cong-giao-va-tin-lanh` (free — no collision).
**Session:** **15** (next free number).
**Flag:** `NEXT_PUBLIC_CG_TL`, Canvas shape (`=== '1'`, default **off**) — local-only until the owner
signs off the framing. There is no staging; `main` is production.

---

## Why this earns a surface (it is NOT the companion's `defending` branch)

The companion already has a Protestant-objections door. Read what it actually says:

> `defending` → *"Tôi muốn hiểu và **trả lời những phản đối** về đạo"* / "I want to understand and
> **answer objections** to the faith."

That is written for a **Catholic gathering ammunition**. A Protestant who lands there instantly sees
they are not the audience — they are the thing being answered. **Same content, different reader, and
the existing framing actively excludes them.**

**The content is already there:** **42 Q&As tagged `protestant-objections`** across 7 clusters —
about a third of the site's Q&A output, currently scattered across topic cards with no through-line.

**The use case neither existing surface serves: sending a link.** A Vietnamese Catholic with a
Protestant spouse, sibling or friend wants to hand over *one URL*. "Go to `/dong-hanh` and pick the
fourth option" is not a link you send. This is also why it gets its own route rather than living inside
the companion — and why the site's `Hôn nhân khác đạo` (mixed-marriage) cluster is a natural entry
point.

**Not on the homepage** (owner's call). It serves a specific reader; homepage space is for everyone.

---

## ⚠️ Voice and tone — the hardest part, and the part that decides whether this works

**Audience decision (owner, 2026-08-20): written to a Protestant reader DIRECTLY, in the second
person.** Not "how Catholics should answer Protestants."

**Write every page as if the reader will read it sitting next to their Catholic spouse.** That single
test resolves most tone questions.

**DO:**
- **Open with shared ground, and mean it** — Scripture as the word of God, one baptism, the Nicene
  faith, Christ crucified and risen. Not as a rhetorical softener before the real business; because it
  is true and it is most of what we hold.
- Say *"what the Catholic Church actually teaches"* and let the difference emerge, rather than opening
  on the disagreement.
- **Admit fault where there is fault.** The Ân xá cluster already does this about the pre-Reformation
  abuses. That honesty is the single most credible thing on the page — keep it.
- Cite the Catechism and Scripture, not rhetoric.

**DON'T:**
- ❌ **Never "Protestants believe X."** Protestantism is not one thing — Lutheran, Reformed, Baptist,
  Pentecostal and Anglican readers hold materially different positions on baptism, the Eucharist, and
  authority. A blanket claim is both inaccurate *and* tells the reader you are not really addressing
  them. Say *"many Protestant traditions hold…"*, or name the tradition.
- ❌ **Never impute bad faith.** See `docs/proofread-fixes-round2-sola-scriptura.md` §E1: the claim
  that Protestant Bibles "hide" the word *truyền thống* is false (RVV11 — the Vietnamese Protestant
  church's own revision — uses it) and would have read as an accusation. **That is the model failure
  to avoid.**
- ❌ No triumphalism, no gotcha framing, no "as we have now proven".
- ❌ Never imply the reader is not a Christian.

**This is pastoral content, not polemics.** Many Vietnamese Catholic families have Protestant members;
the person most likely to be hurt by getting this wrong is a reader's own family.

---

## Structure — one root, then branches (not linear)

The objections are largely independent — a reader may care about Mary and not about indulgences — so
this is **not** a ladder like `/bang-chung`. But it is not flat either: **authority is the root.**
Session 3 has just reframed the Sola Scriptura cluster around exactly that, with Apostolic Succession
as the explicit foundation, and it is load-bearing — *"why confess to a priest?"* only becomes a real
question once authority is settled.

| | Stage | Clusters | Q&As |
|---|---|---|---|
| **Root** | **Where does authority come from?** | Duy Kinh Thánh (Sola Scriptura) | 14 |
| Branch | **How are we saved?** | Đức tin và việc làm · Ân xá | 8 + 5 |
| Branch | **The Church and the sacraments** | Xưng tội · Phép Rửa | 7 + 8 |
| Branch | **Mary and the saints** | Cầu nguyện với các thánh · Tôn kính ảnh tượng | 6 + 10 |

Branches are **enterable in any order**; the root is offered first but never forced.

**Answers render INLINE, expanding in place** — same as `/bang-chung` and the companion. The
click-out-and-come-back round trip was tested and rejected (memory: `no-navigate-away-mid-flow`), and
inline keeps bodies out of the server-rendered HTML so the path does not compete with `/giai-dap` in
search. **Read from the cluster `.md` at build time; never copy answer text into new files.**

**New writing = the framing only:** a landing page (shared ground + what divides us) and one short
intro per branch. Everything else is existing, proofread content.

---

## Naming — LOCKED 2026-08-20

**VI `Công Giáo và Tin Lành` · EN `Catholic and Protestant` · route `/cong-giao-va-tin-lanh`.**

Use it verbatim for the page title, the `<title>`, the OG card, and every entry-point label — one
name everywhere, no variants.

It names **both** traditions and targets neither, which is the point: the title itself should not
tell the reader they are a problem to be solved.

*(Considered and rejected: "Những câu hỏi giữa chúng ta" — warm but tells a cold arrival nothing;
"Người Tin Lành thường hỏi" and "Gửi anh chị em Tin Lành" — clearer about audience, but put the
reader in a category before they read a word; "Điều Hội Thánh Công giáo thật sự dạy" — too long, and
it describes the **whole site**, so it fails to distinguish this surface. And ❌ never "Trả lời
người Tin Lành", which makes the reader the object being answered.)*

⚠️ **The title is mutual; the CONTENT is still written to a Protestant reader in the second person.**
A neutral name does not soften the audience decision — see the voice section above.

---

## Cross-lane traps

- **Entry points are Session 8's**, plus two in-section ones. When built, hand over ONE combined
  request: the **companion `defending` branch** link (Session 7), the **Sola Scriptura anchor** and the
  **7 cluster anchors** (Session 3), and **`app/sitemap.ts` routes** (Session 8) — all gated on the
  flag. Content is automatic in the sitemap; **new ROUTES are not.**
- **Do NOT put it on the homepage** (owner's decision) — but it still needs its own OG card, since the
  whole point is that the URL gets shared. `lib/pageMetadata.ts` already exists for this.
- Bilingual VI/EN via `<T>`; Scripture/CCC refs through `ScriptureBody` + `enrichBody`, never bare
  `dangerouslySetInnerHTML` (`CLAUDE.md`).
- The framing text is **new public content** → it gets rows in the proofreading tracker and the
  owner's sign-off before the flag is switched on.

## Hand-off

| # | Session | Task |
|---|---|---|
| 1 | **15** (new) | Build `/cong-giao-va-tin-lanh` behind `NEXT_PUBLIC_CG_TL`; write the landing + 4 branch intros in the voice above; render cluster answers inline. Owns `app/cong-giao-va-tin-lanh`, `lib/congGiaoTinLanh*`, its flag file. NO entry points. |
| 2 | **8** | Nav/footer treatment (not homepage) + sitemap routes — flag-gated. |
| 3 | **7** | Link from the companion's `defending` branch, flag-gated. |
| 4 | **3** | `related`-style links from the Sola Scriptura anchor + the 7 cluster anchors, and from `Hôn nhân khác đạo`. |
| 5 | owner | Pick the name; proofread the framing text; then set the flag on Vercel. |

**Sequencing:** 1 → 2/3/4 in parallel → owner proofreads → flag on.
