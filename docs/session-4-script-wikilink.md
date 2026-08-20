# Session 4 — Script Wikilink (kickoff brief)

You are **Session 4** in the numbered session registry (`docs/STATE.md`). Read that registry to see
who owns what; this doc is your lane.

## What you do

Take a **finished** video script and make it **Q&A-ready**: copy it into
`Video Scripts/Processed Video Scripts/` with every Bible reference converted to a CGKPV Obsidian
wikilink. That's the gate for the whole content pipeline — the content-guide rule is that a Q&A is
authored **only** from the Processed (wikilinked) version, so `Processed 🔲` means the Q&A is blocked
on you.

**The wikilink mechanics are already fully specified** in
`D:\Dropbox\Obsidian Vault\Bible\CGKPV\CGKPV_Wikilink_Rules.md` — vault structure, the exact
Vietnamese book names, the alias table for any reference form, embed-vs-link, ranges, display text.
**Read that file and follow it exactly; do not re-derive book names from memory.** This brief covers
only what that file doesn't: the project context around it.

## Your lane — and the new boundary

**You own:** `D:\Dropbox\Obsidian Vault\Video Scripts\**` (all subfolders) and nothing else.

**You now also have read access to the website repo. It is READ-ONLY for you.** Read it to check what
already exists — which Q&A clusters are live, the taxonomy, the content guide. **Never edit any repo
file.** In particular `content/giai-dap/**` belongs to **Session 3**: you make a script Q&A-*ready*,
you do not write the Q&A. If you spot a Q&A that should exist, say so in your report and let it be
routed; don't write it yourself.

## The folder convention (this is the status signal)

| Folder | Meaning |
|---|---|
| `Drafts/` (or loose in the root) | not ready — the owner is still writing it. **Never touch the prose.** |
| `Unpublished Video Scripts/` | finalized script, no video yet — **ready for you** |
| `Finished Videos/` | the exact script of a published video — **ready for you** |
| `Processed Video Scripts/` | your output: a ready script with wikilinks added |

Copy into `Processed Video Scripts/` — the source file stays where it is.

**"Leave alone" means the prose, not the metadata.** Frontmatter flags are bookkeeping, not writing, so
you may correct a wrong `Wikilink:` / `To Q&A:` value **in any folder**, including `Drafts/`. A draft
carrying `Wikilink: true` or `To Q&A: true` is simply wrong and should be fixed. **If a file is ever
moved back to `Drafts/`, reset both flags to `false`** — it is no longer processed and no longer
Q&A-ready.

## Never overwrite the source

`Finished Videos/` holds the owner's **exact voiceover wording**, which can differ slightly from the
official CGKPV verse text. Always **copy** to `Processed Video Scripts/` (same filename) and apply
wikilinks to the copy only. Read-aloud verses become embeds that render official CGKPV text, which
would otherwise collide with the owner's own phrasing in the source he records from.

## Leftover AI/tool chatter — strip it from the Processed copy (ruling 2026-08-18)

Some scripts carry text that isn't the owner's voice at all, but a previous tool talking to him —
*"Dưới đây là bản dịch tiếng Việt đầy đủ…"*, *"Bạn muốn mình chỉnh lại phần nào…"*, *"I'll process
this Vietnamese Catholic script…"*, *"✅ Vietnamese Version – Fully Converted"*. **Session 3 authors
public Q&As from the Processed copies**, so this is a live contamination path into site content.
"Never alter the script's prose" protects the owner's *voice* — chatter isn't his voice, so:

- **In `Processed Video Scripts/`: remove it.** This is the copy Session 3 reads.
  Record what you removed in an HTML comment at the top so nothing vanishes silently, e.g.
  `<!-- GHI CHÚ: đã gỡ phần chatter của công cụ AI (dòng mở đầu "Dưới đây là bản dịch…" và câu hỏi cuối bài). -->`
- **In `Finished Videos/` and `Unpublished Video Scripts/`: never.** Those are the voiceover masters —
  a bad judgment call there costs the owner his own wording. Report what you saw instead.
- **In `Drafts/`: never** — they're his working files.
- **If a line is ambiguous** — it might be his — **leave it and flag it** with
  `<!-- check: chatter or script? -->`. Do not guess.

## Frontmatter

Every script file — **source files too**, not just processed ones — carries:

```yaml
YouTube Video Number:      # e.g. "MOG YT01" (blank = not on YouTube) — the OWNER fills these in
Tiktok Video Number:       # e.g. "MOG TT02"                          — leave blank
YouTube Folder:            # location of the YouTube video file        — leave blank
Tiktok Folder:             # location of the TikTok video file         — leave blank
Wikilink: <true|false>     # true ONLY in Processed Video Scripts/; source folders are false
To Q&A: <true|false>       # true = that content is published on the website as Q&A
```

- Adding frontmatter to a source file is safe — it only prepends metadata and never touches the
  voiceover wording. **Prepend or replace the first `---…---` block only; never double-add one.**
- `To Q&A` is **derived from the repo**, not remembered — check whether the matching cluster anchor
  exists under `content/giai-dap/`. It is currently stale on several files (see the queue below).

## Verify every verse against the actual CGKPV text

A wikilink that points at the wrong verse silently misattributes Scripture, so this is not optional:

- For every cited verse, **open the actual CGKPV chapter file** and confirm the `###### N` anchor
  exists **and** that the quoted text really is that verse or range. The owner's typed citation label
  can be off.

### English scripts get the FULL treatment, against the Vietnamese Bible (ruling 2026-08-20)

**English scripts are wikilinked exactly like Vietnamese ones** — links *and* embeds — pointing at the
**CGKPV (Vietnamese) Bible**, with **Vietnamese display text**. An embed inside an English script
therefore renders Vietnamese verse text. That is intended, not a bug.

**Why:** there is no English Bible in the vault — `Bible/NRSVCE` is empty — so CGKPV is the only
linkable text. A reference left bare would be worse than one that resolves to the Vietnamese.

- Book names + display text follow the normal rules (`CGKPV_Wikilink_Rules.md`): full Vietnamese book
  names, never abbreviations. `![[Gioan 3#16|Gioan 3:16]]`, not `John 3:16`.
- Detection still reads **English** references in the script (`John 3:16`, `Rom 5:8`) and maps them via
  the alias table.
- **Versification is the trap here, not an edge case.** An English script carries *English* verse
  numbers, and CGKPV follows the Hebrew/Masoretic numbering — so the offsets below apply to **every**
  English script by default. Open the chapter file; never convert from memory.

*(If an English Bible is ever added to the vault, revisit this — it exists because CGKPV is the only
option today.)*

### Nested quotations — link the QUOTING verse, not the quoted source (ruling 2026-08-20)

When the New Testament quotes the Old — *Jesus quoting Isaiah inside Mark 7*, Paul quoting the
Psalms — the script's prose is following the **NT** wording. **Embed the NT verse.** Do **not** embed
the OT source in its place.

**Why this is a correctness rule, not a preference.** The NT authors quote the Septuagint; the OT books
are translated from the Hebrew. **CGKPV renders them separately, and the Vietnamese differs
noticeably.** Verified 2026-08-20:

> **Máccô 7,6-7** — “Dân này **tôn kính** Ta bằng môi bằng miệng, còn lòng chúng thì lại xa Ta. Chúng
> có thờ phượng Ta thì cũng vô ích, vì **giáo lý chúng giảng dạy chỉ là giới luật phàm nhân**.”
>
> **Isaia 29,13** — “Dân này chỉ **đến gần** Ta bằng miệng, **tôn vinh** Ta bằng môi, còn lòng chúng
> thì xa Ta lắm; chúng chỉ **kính sợ Ta theo lệnh của người phàm**, nhưng đó chỉ là **sáo ngữ**.”

Embedding `Isaia 29,13` where the script quotes *Jesus quoting Isaiah* would render text that does not
match what the script says Jesus said. The reader sees prose and verse disagree.

**So:**
- Nested quote, no citation of its own → **embed the NT verse** (here `![[Máccô 7#6]]` + `#7`).
- Add a **link** to the OT source **only if the script makes a point about the original** (e.g. "Isaiah
  said this centuries earlier") — as `[[Isaia 29#13|Isaia 29:13]]`, a link, never a competing embed.
- **This resolves the recurring `<!-- check: … Isaia 29:13 … embed? -->` flags** in the Sola Scriptura
  VI *and* EN scripts: embed Máccô 7,6-7, leave Isaiah as prose or a link. Apply the same rule to any
  future nested quotation instead of raising it each time.

### ⚠️ CGKPV versification differs from English/Protestant Bibles (verified 2026-08-18)

**This is the single most likely source of a wrong-but-plausible wikilink**, because scripts drafted
from English sources (or from Grok) carry English verse numbers. A missing `###### N` anchor is usually
*this*, not a typo.

**The direction: CGKPV follows the Hebrew/Masoretic versification. English Protestant numbering runs
one BEHIND CGKPV in the affected passages.** Two recurring causes, both verified against the CGKPV
files themselves:

1. **Chapter-break differences.** Confirmed: **English Deut 12:32 = CGKPV `Đệ Nhị Luật 13,1`** — the
   *"đừng thêm gì vào đó cũng đừng bớt gì"* verse. CGKPV `Đnl 12` ends at **v31** and `Đnl 13` runs to
   **v19**; the offset continues through the chapter (English 13:x = CGKPV 13:x+1) and realigns at 14:1.
2. **Psalm superscriptions are counted as verse 1.** CGKPV `Tv 22,1` is the superscription
   (*"Phần nhạc trưởng…"*); the famous *"Ngài nỡ lòng ruồng bỏ con sao"* is **`Tv 22,2`** — English
   Bibles call it Ps 22:1. So for any psalm with a superscription, expect **English + 1**.

**When an anchor is missing, check the neighbouring verse/chapter (usually +1, and the adjacent
chapter's v1) before concluding it's a typo.**

> **Do NOT reason from "CGKPV = Vulgate/LXX numbering" — that is false and would send you the wrong
> way.** Checked directly: CGKPV Psalms use **Hebrew** numbering, not Vulgate — `Tv 23` is
> *"CHÚA là mục tử chăn dắt tôi"* (Vulgate numbers that psalm 22). The reliable move is always to
> **open the chapter file and read the text**, not to apply a remembered offset.
- **When they disagree, fix the number/range to match what is actually quoted** — updating *both* the
  citation label in the prose *and* the embed/link. E.g. a quote labelled `Giacôbê 1:6` whose text
  actually spans 1:5-6 → correct it to `1:5-6` and embed the full range
  (`![[Giacôbê 1#5|…1:5]]` + `![[Giacôbê 1#6|…1:6]]`).
- **Catch allusions, not just explicit citations** — a paraphrase or a reference with no chapter:verse
  ("thư gửi tín hữu Cô-rin-tô", "the 500 witnesses") still gets linked or embedded. Read aloud →
  embed; merely cited or alluded to → link.
- **Placement:** when a verse is only partly quoted or alluded to inline, keep the inline citation as a
  **link** and add the full verse **embed on its own line after the paragraph** — the owner prefers the
  CGKPV text to render on screen.

**Scripts with no Bible references still get processed** — copy them over, set `Wikilink: true`, and
keep the established note so it's clear the file was handled rather than skipped:

```
<!-- GHI CHÚ: Bản này KHÔNG có câu Kinh Thánh (chapter:verse) nào để tạo wikilink — chép nguyên văn từ <source folder> sang Processed Video Scripts. -->
```

## Standing rules that apply to you

- **`CLAUDE.md` → "Verify facts before they ship."** Applies here as much as anywhere: a wikilink that
  points at the wrong chapter silently misattributes Scripture. Verify the target file actually exists
  and the verse number is really there (`###### N`) rather than assuming.
- **Vietnamese terminology** (`docs/content-guide.md`): use the exact book names from the rules file.
  Never invent a transliteration, never take one from Vietnamese Wikipedia.
- **Never alter the CGKPV Bible files themselves** — you link into them, you don't touch them.
- **Never alter the script's prose** — only the verse references change. Don't fix wording, don't
  shorten, don't summarize. The owner's voice is the point.
- Flag anything uncertain with `<!-- check: embed or link? -->` rather than guessing.

## Your current queue (derived from the real files, 2026-08-18)

**1. ~~Two ready scripts are unprocessed.~~ CORRECTED 2026-08-18 (owner).**
- `Sola Scriptura Vietnamese` — **DONE.** Session 4 processed it, and Session 3 has already authored the
  full **Duy Kinh Thánh (Sola Scriptura)** cluster from it (anchor + 9 parts, commit `2edd4b1`).
- `Sola Scriptura English` — **NOT a pending Q&A source.** It exists for the future **English Q&A**
  project (`docs/roadmap.md` → "English Q&A bodies"), not for a Vietnamese cluster. **Do not treat it
  as a blocked Q&A**, and don't expect `To Q&A: true` to follow from processing it — the English
  content model doesn't exist yet. Wikilink it if useful; otherwise leave it.

**2. Fix stale `To Q&A` flags.** The flag disagrees with the repo on four files — the repo is the
truth. Verify each against `content/giai-dap/` before changing it:

| Processed script | flag says | repo has | should be |
|---|---|---|---|
| `Ai Tạo Ra Chúa` | false | `ai-tao-ra-chua` (5-part cluster) | **true** |
| `Fine-tuning Argument` | false | `vu-tru-ngau-nhien-hay-duoc-thiet-ke` (4) | **true** |
| `Why God doesn't answer our prayers` | false | `tai-sao-cau-nguyen-ma-chua-khong-dap-loi` | **true** |
| `Ten plaques` | false | — nothing | false (correct, leave it) |

**3. `Tithe Requirement in Catholic History.md` is missing its frontmatter entirely** — no `Wikilink`,
no `To Q&A`, and no GHI CHÚ note despite having zero links. It's the only processed file in that
state. Add the frontmatter (`Wikilink: true`; `To Q&A: true` — `giao-hoi-co-tung-bat-buoc-nop-thap-phan`
is live) and, if the script genuinely has no verse references, the GHI CHÚ note.

**4. ~~Confirm the Sola Fide rename.~~ RESOLVED 2026-08-18 — there was no rename.** (Session 4's audit
corrected this; the original guess here was wrong.) `Duy Đức Tin (Faith alone, Sola Fide).md` is a
**distinct, clean Vietnamese Sola Fide script**; `Sola Fide.md` and `Arguments against Sola Fide.md`
are **separate older drafts** (the ones carrying tool chatter), since moved to `Drafts/`. So the
pipeline tracker's row must **not** be repointed as a rename — instead its "Script file" cell should
**add** `Duy Đức Tin (Faith alone, Sola Fide)`, which is the Q&A-ready file for `duc-tin-va-viec-lam`.
*(Owner: that's the tracker edit; nothing for Session 4 here.)*

**5. Fix the flag errors the audit found** (all in-lane, all metadata):
- `Unpublished/Fine-tuning Argument.md` has `Wikilink: true` — it's a **source** file, so `false`.
- `Drafts/Sola Fide.md` has `Wikilink: true` **and `To Q&A: true`** — both wrong on a draft.
- `Drafts/Arguments against Sola Fide.md` has `Wikilink: true` — wrong on a draft.

**6. Strip the tool chatter** from the Processed copies per the ruling above:
`Duy Đức Tin` (opening line + closing question) and
`Tại sao người Công Giáo cầu nguyện với các Thánh` (opening line). Leave the `Drafts/Sola Fide.md`
chatter in place — it's a draft.

**Note for the two Sola Scriptura scripts:** no Sola Scriptura cluster exists in `content/giai-dap/`
yet, so they process with `To Q&A: false`. Once they're wikilinked, that's a **→ Session 3** flag: a
Sola Scriptura Q&A cluster becomes authorable. Report it; don't write it.

## Reporting back

Sessions can't talk to each other — hand-offs go through the owner. When you finish, report:
1. What you processed (file → folder).
2. Any `<!-- check: -->` flags you left for the owner to resolve.
3. Anything that belongs to another lane — a Q&A that should exist (**Session 3**), a tracker mapping
   that's wrong (the owner), a cross-cutting question (**the coordinator session**).

Keep it to a short pointer; don't paste script content into chat.
