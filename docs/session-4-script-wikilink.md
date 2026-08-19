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

## Frontmatter + the no-verse note

Every processed script carries:

```yaml
Wikilink: true      # you set this when you process it
To Q&A: true|false  # whether a Q&A cluster for this topic exists in the repo
```

`To Q&A` is **derived from the repo**, not remembered — check whether the matching cluster anchor
exists under `content/giai-dap/`. It is currently stale on several files (see the queue below).

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
