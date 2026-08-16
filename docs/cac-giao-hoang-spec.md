# Các Đức Giáo Hoàng (The Popes) — section spec

*(working name — verify VN: "Các Đức Giáo Hoàng". Route e.g. `/cac-giao-hoang` or `/giao-hoang`.)*
**Design is a proposal — the owner may adjust the angle/lineup.**

## What makes this section NOT redundant (the angle)
Popes already appear elsewhere — as saints (Gioan Phaolô II), document-authors (encyclicals), council-
conveners. So this section's unique value is **two things:**
1. **The connective HUB.** Each pope's page **ties the threads together** — cross-links to their
   sainthood (Các Thánh), their encyclicals (Văn Kiện), the councils they convened (Công Đồng), their
   era (Lịch Sử Hội Thánh). The pope is the person who connects the site's other sections.
2. **The papacy itself** — a foundational page: **Phêrô as the first pope** (Mt 16,18-19, "chìa khóa
   Nước Trời"), apostolic succession, the pope's role/authority. This is the **apologetics anchor**
   (serves "is the papacy biblical / where did it come from?" — complements the councils' papal-
   authority Q&As).

Distinct from: Giáo Phụ (early doctrine) · Các Thánh (devotion) · Công Đồng (events) · Văn Kiện (texts).

## ⚠️ VERIFICATION IS PARAMOUNT — this is the most fact-dense section on the site
Pope names, **regnal numbers**, election/death (or resignation) dates, the **order of succession**, and
the **current pope** are exactly the "hard facts" the owner cannot check from memory — and where errors
love to hide (antipopes, disputed successions, off-by-one regnal numbers). Per `CLAUDE.md` "Verify facts
before they ship": **web-verify every date/number/name against authoritative sources** (Vatican.va, the
Annuario Pontificio / official Church records) — never from memory. **The current pope (Leo XIV,
elected 2025) is past the assistant's knowledge cutoff — verify him especially carefully.**

## Content model (person + office; JSON, bilingual)
Per pope (`content/cac-giao-hoang/<slug>.json`):
- `slug`, `name { vi, en }` (regnal, e.g. "Đức Lêô Cả / Leo the Great"), `birthName`, `regnalNumber`
- `papacy` (elected–ended, display + years), `era`/century, `origin`
- `summary { vi, en }`, `facts[]`, `significance { vi, en }`
- `story { vi, en }` — a narrative for the pivotal ones (mirror the saints life-story model), via `ScriptureBody`
- cross-links: `related_saint`, `related_documents: []`, `related_councils: []` (the hub role)
- image (PD) + Catholic Images row

## Curated starting lineup (curate — NOT all 266+; grow over time)
St. Phêrô (first pope) · Lêô Cả / Leo the Great · Grêgôriô Cả / Gregory the Great · Grêgôriô VII ·
Innôcentê III · Piô IX (Vatican I) · Lêô XIII (Rerum Novarum) · Piô X · Piô XII · Gioan XXIII (Vatican II) ·
Phaolô VI · Gioan Phaolô II · Bênêđictô XVI · Phanxicô · **Lêô XIV (current — verify)**.
*(Every VN regnal name verified per the terminology rule; every date web-verified.)*

## Cross-section links (make the hub real)
- Popes who are saints → `/cac-thanh/<slug>` (and back). Popes who wrote key encyclicals →
  `/van-kien/<slug>`. Popes who convened councils → `/cong-dong/<slug>`. Reciprocal where possible.

## IA note (for Session 8, later)
Popes may belong under the **Lịch Sử Hội Thánh** hub (with Fathers + Councils, all era-organized) rather
than as a separate top-level — Session 8's call once there's a first batch.

## Lane / ownership
A section session builds it: `app/cac-giao-hoang`, `lib/popes*`, `content/cac-giao-hoang/*.json`,
`components/cac-giao-hoang`, `public/images/cac-giao-hoang`. Owns no entry points (Session 8 wires the
card/nav once there's a first batch). Number the session when spawned.
