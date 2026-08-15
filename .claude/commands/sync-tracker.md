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
   - **Script** — does `<script file>.md` exist anywhere under
     `D:\Dropbox\Obsidian Vault\Video Scripts\` (any subfolder)? Note the subfolder it's in
     (Finished Videos / Processed / Unpublished / root) — that's the script's stage.
   - **Video** — does `content/video/<video-slug>.md` exist? → Video ✅.
   - **Video tagged** — does that video's frontmatter contain BOTH `category:` and `tags:`? → Tagged ✅.
   - **Q&A** — does `content/giai-dap/<qa-anchor>.md` exist? → Q&A ✅.
   Use `—` where the mapping cell is `—`.

3. Find NEW content not yet in the mapping:
   - script files under `Video Scripts/` not listed as any topic's script;
   - `content/video/*.md` (ignore `*.en.md`) whose slug isn't a mapped video slug;
   - `content/giai-dap/*.md` with frontmatter `featured: true` (cluster anchors) not mapped as any
     topic's Q&A anchor.
   List these. Do NOT guess their topic — ask the user which topic each belongs to (or if it's a new
   topic to add a row + mapping for).

4. Update the tracker's `## Pipeline overview` table and the `## To do next` checkboxes to match what
   you found. Change ONLY status cells/boxes you can derive from files. DO NOT touch the `## Backlog`
   section or any freeform notes the user wrote. Update the snapshot date line if present.

5. Report a short summary: what changed since the tracker's last state, plus any new/unmapped files
   that need the user's decision. If a path doesn't resolve, say so rather than guessing.
