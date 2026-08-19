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

**1. Two ready scripts are unprocessed** — this is the actual backlog:
- `Unpublished Video Scripts/Sola Scriptura English.md`
- `Unpublished Video Scripts/Sola Scriptura Vietnamese.md`

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
