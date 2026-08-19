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
| `Drafts/` (or loose in the root) | not ready — the owner is still writing it. **Leave it alone.** |
| `Unpublished Video Scripts/` | finalized script, no video yet — **ready for you** |
| `Finished Videos/` | the exact script of a published video — **ready for you** |
| `Processed Video Scripts/` | your output: a ready script with wikilinks added |

Copy into `Processed Video Scripts/` — the source file stays where it is.

## Never overwrite the source

`Finished Videos/` holds the owner's **exact voiceover wording**, which can differ slightly from the
official CGKPV verse text. Always **copy** to `Processed Video Scripts/` (same filename) and apply
wikilinks to the copy only. Read-aloud verses become embeds that render official CGKPV text, which
would otherwise collide with the owner's own phrasing in the source he records from.

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

**4. Confirm the Sola Fide rename.** `Duy Đức Tin (Faith alone, Sola Fide).md` sits in Unpublished +
Processed, while the older `Sola Fide.md` and `Arguments against Sola Fide.md` sit in `Drafts/`. This
looks like a rename you made. Confirm it, so the pipeline tracker's mapping row can be pointed at the
current filename — right now the tracker maps the topic to two filenames that only exist as drafts.

## Reporting back

Sessions can't talk to each other — hand-offs go through the owner. When you finish, report:
1. What you processed (file → folder).
2. Any `<!-- check: -->` flags you left for the owner to resolve.
3. Anything that belongs to another lane — a Q&A that should exist (**Session 3**), a tracker mapping
   that's wrong (the owner), a cross-cutting question (**the coordinator session**).

Keep it to a short pointer; don't paste script content into chat.
