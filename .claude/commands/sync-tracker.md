---
description: Reconcile the Hỏi Đáp content pipeline tracker from the actual files
---

Reconcile the content pipeline tracker by DERIVING its status from the real files. Never rely on
memory of what changed — the files are the source of truth. Read-only on the repo content and the
vault scripts; the ONLY file you edit is the tracker.

Tracker file: `D:\Dropbox\Obsidian Vault\Hỏi Đáp Content Pipeline.md`

Steps:

1. Read the tracker — especially its `## Mapping` table (topic → script file, video slug, Q&A anchor).

2. For each mapped topic, check the real files and determine true status:
   - **Script** — the mapping's "Script file" cell may list SEVERAL comma-separated names; use any
     that exists as `<name>.md` under `D:\Dropbox\Obsidian Vault\Video Scripts\`. The FOLDER signals
     readiness:
       • Finished Videos / Unpublished Video Scripts / Processed Video Scripts → READY → Script ✅;
       • Drafts (or loose in the root) → a DRAFT, NOT READY → Script 🚧;
       • not found anywhere → Script 🔲 (or `—` if the mapping cell is `—`).
     A ready folder wins over Drafts/root if the script is in both. (Folder meanings: Finished Videos
     = the exact script of a published video · Unpublished = finalized script, no video yet ·
     Processed = a Finished/Unpublished script with CGKPV wikilinks added · Drafts = not ready.)
   - **Processed** — does a mapped script exist specifically in the `Processed Video Scripts/` folder?
     → Processed ✅. Else 🔲 (or `—` if there's no script). This is the gate for Q&A: **a Q&A is made
     ONLY from the Processed (wikilinked) version**, so `Processed 🔲` means the Q&A is blocked until
     the script is wikilinked (Session 4).
   - **Video** — does `content/video/<video-slug>.md` exist? → Video ✅.
   - **Video tagged** — does that video's frontmatter contain BOTH `category:` and `tags:`? → Tagged ✅.
   - **Q&A** — does `content/giai-dap/<qa-anchor>.md` exist? → Q&A ✅.
   Use `—` where the mapping cell is `—`.

3. Find NEW content not yet in the mapping:
   - script files under `Video Scripts/` not listed in ANY topic's "Script file" cell (a cell may
     hold several comma-separated names — all of them count as mapped);
   - `content/video/*.md` (ignore `*.en.md`) whose slug isn't a mapped video slug;
   - `content/giai-dap/*.md` with frontmatter `featured: true` (cluster anchors) not mapped as any
     topic's Q&A anchor.
   List these. Do NOT guess their topic — ask the user which topic each belongs to (or if it's a new
   topic to add a row + mapping for).

4. Update the tracker's `## Pipeline overview` table and the `## To do next` checkboxes to match what
   you found. Change ONLY cells/boxes you can DERIVE from a file existing (set ✅ when the file is
   there; set 🔲 if a file that was ✅ is now gone). **PRESERVE the user's intent:** where the mapping
   slug is `—` (nothing to check), leave the human's existing mark (`🔲` = planned to-do, or `—` = not
   planned) untouched — that's their choice, not a derivable fact. Never flatten a planned `🔲` into
   `—`. You MAY resolve a `(?)` once the files make it definite. DO NOT touch the `## Backlog` section
   or freeform notes. Update the snapshot date line if present.

5. Report a short summary: what changed since the tracker's last state, plus any new/unmapped files
   that need the user's decision. If a path doesn't resolve, say so rather than guessing.
