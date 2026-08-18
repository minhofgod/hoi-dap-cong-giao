# Proofreading round 1 — fixes & follow-ups

From the owner's pre-launch proofreading pass (Obsidian: *Hỏi Đáp — Proofreading Tracker*), 2026-08-16.
Reviewed + diagnosed 2026-08-16. **The owner ticks their own tracker as items land — sessions don't
edit that file (it's outside the repo).**

---

## A. BUG — 4 topic clusters have NO anchor (fix first; a visitor hits this) · Session 3

**Symptom (owner-reported):** clicking the "Đau khổ và mất mát" topic shows only one question; the
cluster can't be browsed from the topic page.

**Diagnosed cause:** the cluster has **8 questions, all `featured: false`, and no `parts:` / `part_of:`
linkage at all.** With no anchor, there's nothing for the topic to land on. The `topic:` strings are
fine (identical on all 8) — the anchor/linkage is what's missing.

**The working pattern** (e.g. "Ai tạo ra Chúa"): anchor has `featured: true` + `parts: [...]` (ordered
member slugs); every member has `part_of: "<anchor-slug>"`.

**All four anchorless topics (same bug — fix all, not just the reported one):**

| Topic | # | Notes |
|---|---|---|
| `Đau khổ và mất mát` | 8 | doi-dien-voi-mat-mat · nguoi-than-qua-doi-duoc-cuu-khong · dau-om-benh-tat · lo-lang-tien-bac · co-don-khong-ai-gan-gui · co-don-chua-nhu-vang-mat · toi-cam-thay-minh-chua-du · dau-kho-noi-chung |
| `Bách hại vì đức tin` | 3 | bi-nguoi-nha-chong-doi-vi-duc-tin · the-gian-ghet-bo-vi-duc-tin · nguy-hiem-tinh-mang-vi-duc-tin |
| `Khoa học và Đức tin` | 1 | single question — just make it its own anchor (`featured: true`, no `parts`) |
| `Cầu nguyện` | 1 | same — single-question anchor |

**Fix:** for each topic pick/*designate* an anchor → set `featured: true` + `parts: [ordered member
slugs]`; set `part_of: "<anchor>"` on every member.

**Judgment call for the owner:** the two pastoral clusters have no natural headline question — every
member is a specific situation. Options: (a) promote an existing one (`doi-dien-voi-mat-mat` for
suffering; `the-gian-ghet-bo-vi-duc-tin` for persecution), or (b) **write a new general anchor** (e.g.
*"Người Công giáo đối diện với đau khổ thế nào?"*) — (b) reads better as a cluster entry point.
**Ask the owner before choosing.** Note: a featured anchor also wants a card banner at
`public/images/giai-dap/<anchor>.jpg` (a monogram fallback exists, but a real image is preferred).

---

## B. Vietnamese wording fixes · Session 3
Owner-flagged during proofreading; assistant reviewed. Reword in the body; keep meaning.

| # | File | Change | Why |
|---|---|---|---|
| B1 | `bang-chung-chua-giesu-song-lai` | **"hậu quả" → "hệ quả"** (or "kết quả") | "Hậu quả" reads negative in modern VN (hậu quả nghiêm trọng). "Hệ quả" = neutral logical consequence. Pick by sentence. |
| B2 | `bi-nguoi-nha-chong-doi-vi-duc-tin` | reword **"chính Chúa đã nói trước rằng nó có thể đến với những ai theo Người cách sát sao"** | "Sát sao" collocates with monitoring (theo dõi sát sao), not with following Christ; "nó" is a weak subject. Suggested: *"…có thể đến với những ai thật lòng bước theo Người."* |
| B3 | `dau-om-benh-tat` | reword **"thật thà như nó là"** | Calque of English "honestly, as it is"; "thật thà" describes a person's character. Suggested: *"cứ mang đến như nó vốn có"* / *"mang đến đúng như lòng bạn đang cảm thấy."* |
| B4 | `moi-bang-chung-song-lai-deu-tu-kinh-thanh` | **"thời điểm và nơi chốn" → "thời điểm và địa điểm"** | "Nơi chốn" is literary; "địa điểm" is precise and parallels "thời điểm". Better for an evidence answer. |
| B5 | `thap-tu-chinh-co-phai-xam-luoc-ep-cai-dao` | **"Cần nói cho cân bằng" → "Cần nói cho công bằng"** | They're different idioms: *công bằng* = "to be fair" (the intended sense); *cân bằng* = "balanced". Standardize on "công bằng" — other Q&As already use it. |

**B6 — DECIDED: do NOT change.** `tai-sao-cau-nguyen-ma-chua-khong-dap-loi` — owner asked whether
*"không phải mặc định"* would beat *"không phải đương nhiên"*. **Keep "đương nhiên."** "Mặc định" is a
computing loanword ("default setting") whose technical flavor clashes with the register of a passage
about prayer. Recorded so it isn't revisited.

---

## C. Content fixes · Session 3

**C1 — Title too long** (`co-the-co-chuoi-nguyen-nhan-vo-han-khong`). `question_vi` currently:
*"Chẳng lẽ không thể cứ nguyên nhân này gây ra nguyên nhân kia, kéo dài ngược về vô tận, khỏi cần
'nguyên nhân đầu tiên'?"* — too long for a card title. Shorten, keep the meaning (e.g. *"Sao không thể
có một chuỗi nguyên nhân kéo dài vô tận?"*). Owner approves the final wording.

**C2 — Explain *dulia*** (`sup-lay-truoc-duc-maria-va-cac-thanh`) — **highest-value content fix.** The
latria / dulia / hyperdulia distinction *is* the answer to "do Catholics worship saints?"; the Q&A
currently argues the conclusion without giving the reader the concept. Add a short, clear explanation.
**Verify the Vietnamese terms** against the Vietnamese Catechism / HĐGM VN (likely **thờ phượng** =
latria, **tôn kính** = dulia, **biệt kính** = hyperdulia — confirm, don't assume). Cross-link the other
veneration Q&As.

**C3 — `sources` on the historical / Crusades Q&As** — **prioritize above the general sources-retrofit
backlog.** These make contested historical claims (Islamic conquests, causes of the Crusades) that a
skeptical reader will want to check; citations are where credibility is won. Files:
`thap-tu-chinh-co-phai-xam-luoc-ep-cai-dao` · `tai-sao-co-thap-tu-chinh` ·
`mot-so-thap-tu-chinh-co-phai-toi-ac` · `ghet-dao-vi-lich-su-thuc-dan-co-nen-theo`.
Use the `sources: [{label, url?}]` field (already built). **Every citation web-verified before it ships**
(CLAUDE.md "Verify facts before they ship") — real, accurately represented, stable links only.

**C4 — New Q&A** (also in the Obsidian backlog): *"Nếu người ngoài Hội Thánh vẫn có thể được cứu, vậy
cần gì gia nhập Hội Thánh?"* — clarify that GLHTCG 847 (those who through no fault of their own never
knew Christ) does **not** excuse someone who *deliberately rejects* the Gospel (invincible vs culpable
ignorance). Answer the "as long as I'm a good person" objection: no one can pay for their own sins —
cross-link the crucifixion cluster (`song-tot-ca-doi-sao-khong-tu-tra-het-toi`). Add `related` both ways;
it also belongs in the companion's "were they saved" path as a follow-up.

---

## D. Feature — sidebar highlights the section you're reading · Session 2
Scrollspy / active-section highlighting: as the reader scrolls a topic page, the corresponding entry in
the sidebar highlights. Standard, genuinely helps on long cluster pages. Lane: `app/giai-dap` +
components/CSS. Not a launch blocker; do after the bug + content fixes.

---

## E. Feature idea — "walk through the evidence for Jesus" · DESIGN DECISION NEEDED FIRST
Owner's idea: a guided walk through the case — historical evidence, the designed (vs eternal/self-
existent) universe, philosophical arguments like first cause, the Resurrection.

**The fork to settle before anyone builds it:** the companion already covers this material via
`doubt-evidence`, `doubt-science`, `explore-god` — but it *branches by situation* ("where are you?").
What the owner describes sounds like a **deliberate, ordered journey** through the argument — a
**learning path / course** (linear, with a sense of progress), which is a genuinely different shape:
- **(a) Learning path** — a fixed, curated order (history → design → first cause → Resurrection), with
  progress through it. New surface; reuses the Q&A content.
- **(b) A specialized companion track** — another branch in the existing tool. Cheaper; keeps one engine.

Recommend deciding (a) vs (b) with the owner, then spec it. Content-wise it reuses existing clusters
(`bang-chung-chua-giesu-song-lai`, `ai-tao-ra-chua`, `vu-tru-ngau-nhien-hay-duoc-thiet-ke`,
`bang-chung-lich-su-cua-kinh-thanh`), so it's mostly a *presentation* build, not new writing.

---

## Hand-off
| # | Session | Task |
|---|---|---|
| A | **3** | Fix the 4 anchorless clusters (ask the owner about the two pastoral anchors first). **Do first.** |
| B1–B5 | **3** | The five VN wording fixes. B6 = decided, no change. |
| C1–C4 | **3** | Title reword · *dulia* explanation · `sources` on the Crusades Q&As · the new "why join the Church" Q&A. |
| D | **2** | Sidebar active-section highlighting. |
| E | owner | Decide learning-path vs companion-track, then spec. |

Run `node scripts/check-tags.mjs` after content edits. Owner ticks their Obsidian tracker as items land.
