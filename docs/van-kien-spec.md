# Văn Kiện Hội Thánh (Church Documents) — future section spec

*(working name — verify VN: "Văn Kiện Hội Thánh" / "Thông Điệp & Tông Huấn". Route e.g. `/van-kien`.)*

A section that takes **important or relevant Church documents** (encyclicals, exhortations, key
declarations, landmark conciliar constitutions) and gives each a **plain-language reader's guide** that
helps ordinary people actually read and understand it — then **links to the official Vatican text** and
connects to Q&As that clear up common misreadings.

**The ethos:** we don't ask people to trust our paraphrase — we hand them the *primary source* + a guide
to walk through it. Intellectually honest, and it plays to the site's strength (making dense things
readable). Build like Councils/Saints (its own section session; number it when spawned).

## THE RULE THIS SECTION LIVES OR DIES ON: authority levels
Every reader's guide must **honestly situate the document's magisterial weight.** Getting this wrong is a
doctrinal error; getting it right teaches people how the Magisterium actually works (most don't know) and
pre-empts the misreadings the Q&As address. The hierarchy, roughly:
- **Dogmatic definition / *ex cathedra*** — irreformable, infallible (rare; e.g. the Immaculate Conception).
- **Dogmatic constitution of an ecumenical council** (Lumen Gentium, Dei Verbum).
- **Encyclical** — authoritative *ordinary* magisterium; received with religious assent; **NOT** an
  infallible definition (e.g. *Magnifica Humanitas*, *Rerum Novarum*, *Humanae Vitae*).
- **Apostolic exhortation / declaration / motu proprio** — lower still.
- **Addresses, letters** — lowest.

So each guide says plainly, e.g.: *"This is an encyclical — authoritative teaching the faithful receive
with respect, not an infallible dogma."* (Handle *Unam Sanctam* carefully: its closing line is often
cited as a definition, but its political claims are historically conditioned — say so, with sources.)

## Editorial filter — importance OR relevance
Include a document if it's either **historically pivotal** (Unam Sanctam, Rerum Novarum, Humanae Vitae,
the Vatican II constitutions) **or relevant to today** (Magnifica Humanitas, Laudato Si', Fratelli
Tutti). The guide states honestly *which*, and never inflates a fresh encyclical to a dogma's weight.

## Content model (JSON, bilingual) + reader's-guide structure
Per document (`content/van-kien/<slug>.json`):
- `slug`, `title { vi, en }` (the document's name), `latinTitle`
- `type`: `encyclical | exhortation | constitution | declaration | motu-proprio | …`
- `author` (pope/council), `date`, `authorityLevel { vi, en }` — the weight, stated per the rule above
- `context { vi, en }` — why it was written
- `guide { vi, en }` — plain-language walkthrough of the main points (rendered via `ScriptureBody`)
- `keyQuotes: [{ text{vi,en}, para, gloss{vi,en} }]` — quotes with explanation
- `notSay { vi, en }` — **"What it does NOT say"** (the common misreadings → feeds the Q&As)
- `officialUrl` — the Vatican.va (or council) primary source
- `related_qa: [<slugs>]` — the connected Giải Đáp questions
- image + Catholic Images row (optional)

## Q&A tie-in — exactly like Councils ↔ Q&A
Each guide spawns tagged Giải Đáp questions addressing misreadings, cross-linked both ways. Example for
Magnifica Humanitas: *"Đức Giáo Hoàng Lêô XIV có cấm người Công giáo dùng AI không?"* → No + what he
actually said; *"Thông điệp có phải là tín điều buộc phải tin không?"* → clarify the authority level.

## Scope / boundary with the Councils section
Councils section = the *councils themselves* (events + their apologetics). This section = *documents*
(mostly papal). Where they overlap (a Vatican II dogmatic constitution), keep the document here and
**cross-link** to the council — don't duplicate.

## Verification (per CLAUDE.md "Verify facts before they ship")
Every guide is written from the **actual document text on Vatican.va**, never from memory or headlines.
Re-verify exact quotes + paragraph numbers against the full text. A guide that misrepresents a document
is worse than none.

## Curated starting lineup (mix pivotal + relevant; curate, grow over time)
Magnifica Humanitas (AI — relevant, first entry below) · Rerum Novarum (labor) · Humanae Vitae (life) ·
Laudato Si' (creation) · Lumen Gentium / Dei Verbum (Vatican II) · Unam Sanctam (with the careful nuance).

## Lane / ownership
A section session builds it: `app/van-kien`, `lib/vanKien*`, `content/van-kien/*.json`, components. Owns
no entry points (Session 8 adds the homepage card + nav once there's a first batch). The connected Q&As
go in `content/giai-dap` (content session). Number the session when spawned.

---

## WORKED FIRST ENTRY — *Magnifica Humanitas* reader's guide (DRAFT)

> Drafted from the Vatican.va text (read 2026-08-16). **Re-verify exact quotes + ¶ numbers against the
> full text before shipping** — this draft was built from a targeted read, not a verbatim full pass.

- **Title / Latin:** Thông Điệp *Magnifica Humanitas* ("Nhân Loại Cao Quý") · **Tác giả:** Đức Giáo Hoàng
  Lêô XIV · **Ký:** 15/5/2026 (công bố 25/5/2026) · phụ đề *Về việc bảo vệ phẩm giá con người trong thời
  đại trí tuệ nhân tạo*.
- **Thẩm quyền (authority level):** Đây là một **Thông Điệp (encyclical)** — giáo huấn chính thức của
  **huấn quyền thông thường**, được tín hữu đón nhận với lòng **tùng phục kính cẩn** (religious assent).
  **KHÔNG** phải một **định tín bất khả ngộ** như các tín điều. Có thẩm quyền và quan trọng, nhưng khác
  mức độ so với một định tín long trọng.
- **Bối cảnh:** Ban hành trùng dịp **kỷ niệm 135 năm Thông Điệp *Rerum Novarum*** (Đức Lêô XIII, 1891) —
  đặt AI như "cuộc cách mạng công nghiệp" mới của thời đại.
- **Các điểm chính:**
  1. **Công nghệ không trung lập** — "nó mang lấy đặc tính của những người tạo ra, tài trợ, quản lý và sử
     dụng nó" (¶9). Vấn đề không phải "AI: được hay không?" mà "việc sử dụng này có phục vụ con người và
     phẩm giá của họ không?"
  2. Công nghệ có thể "chữa lành, kết nối, **giáo dục** và bảo vệ ngôi nhà chung" (¶9); là **"những nén
     bạc được trao cho nhân loại để sinh hoa trái"** (¶9) — hình ảnh dụ ngôn nén bạc.
  3. **Tiêu chuẩn phân định:** phẩm giá con người + công ích (kèm ưu tiên cho người nghèo, chăm sóc ngôi
     nhà chung, hòa bình) (¶14).
  4. **Cảnh báo:** tập trung quyền lực vào tay số ít (¶5, ¶72); phi nhân hóa — biến con người thành
     phương tiện (¶10), hy sinh phẩm giá cho hiệu quả (¶7); lời hứa hão của thuyết siêu nhân/hậu nhân
     (¶12, ch. 3); mờ ám, thiếu minh bạch (¶71); thay thế phán đoán luân lý của con người bằng máy móc.
- **Điều thông điệp KHÔNG nói (chống hiểu lầm):**
  - **KHÔNG cấm** người Công giáo dùng AI hay công nghệ — ngược lại, khẳng định công nghệ là "nén bạc để
    sinh hoa trái" *khi phục vụ con người*.
  - **KHÔNG phải tín điều bất khả ngộ** — mà là giáo huấn để đón nhận, suy tư và áp dụng.
- **Nguồn chính thức:** https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html
- **Q&A liên quan (to write):** "Đức Lêô XIV có cấm người Công giáo dùng AI không?" · "Thông điệp có buộc
  phải tin như tín điều không?" · "Người Công giáo dùng công nghệ/AI thế nào cho đúng?"
