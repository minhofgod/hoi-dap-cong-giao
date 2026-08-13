Source of truth: `D:\Dropbox\Claude\Church Fathers\Notes\church_fathers_dataset.json`, maintained
by the user with Claude Cowork. This copy is what the site actually builds from.

**Update loop**: when the Dropbox file changes, re-copy it here and rebuild/redeploy —
```bash
cp "D:\Dropbox\Claude\Church Fathers\Notes\church_fathers_dataset.json" content\giao-phu\church-fathers.json
```
No automatic sync between the two; this is a manual, explicit step by design (see the
discussion in project history — Dropbox-synced folders and this project's git repo are kept
separate on purpose).

Content is English-only right now (`translation_status: "pending_vietnamese"` in the file's own
metadata) — the site shows an English-content notice on Giáo Phụ pages until Vietnamese text
exists. When it does, extend `lib/churchFathers.ts` to read `_vi` fields rather than restructuring
anything.
