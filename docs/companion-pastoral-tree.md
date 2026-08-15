# Companion pastoral decision-tree & Q&A plan

Design for deepening the companion's **suffering/loss** path and adding a **persecution** path — and a
keystone decision about how companion answers relate to the Q&A section.

## Keystone decision (2026-08-15): companion answers ARE Q&As

The substantial pastoral answers below are authored **once, as Q&As** (`content/giai-dap`, tagged). The
companion *situations* hold only a short **present-first lead** + route to the Q&A (via `seedPins`).
Single source of truth — never duplicate a full answer in both `lib/dongHanh.ts` and a Q&A file. The
companion's inline "reading" view already previews the Q&A, so the walk shows it in-flow while it's also
a standalone, searchable page. This:
- fills the relevance audit's **pastoral-content gaps** (F5),
- **justifies the `consolation` tag** (there's finally content to carry it),
- makes the companion what its name promises — a **walk through** the answers, not a separate silo.

**Everything here is bound by `docs/content-guide.md` "Pastoral tone"** (presence → reliance →
closeness; an invitation, never instruction/comparison/demand).

---

## The tree

### Top-level intake — "Điều gì đưa bạn đến đây? / What brings you here?"
Existing: exploring · doubting · defending · loved-one · suffering-or-loss. **NEW top-level:**
**"Tôi bị ghét bỏ / bách hại vì đức tin" (hated / persecuted for my faith)** — deliberately top-level;
it's the Vietnamese Martyrs' own story and a distinct spiritual situation, not a kind of generic suffering.

### "Suffering or loss" — now a deepening sub-tree
More depth = more tailored answers (owner preference). Each screen **opens with a word of comfort
before the fork**, and the priest/human off-ramp stays visible the whole way.

```
Suffering or loss
├─ Chính tôi đang chịu đau khổ  (I myself am suffering)
│  ├─ Sức khỏe / bệnh tật (health, possible death)  → QA: dau-om-benh-tat   [saints bridge + CCC 1505]
│  ├─ Tài chính, thiếu thốn (financial)             → QA: lo-lang-tien-bac   [Mt 6,25–34, providence+dignity]
│  ├─ Cô đơn (loneliness)
│  │   ├─ Không có ai gần gũi (human)               → QA: co-don-khong-ai-gan-gui
│  │   └─ Chúa như vắng mặt (spiritual)             → QA: co-don-chua-nhu-vang-mat  [Teresa Calcutta]
│  └─ Điều khác (something else)                     → QA: dau-kho-noi-chung   [general consolation]
└─ Tôi vừa mất một người thân yêu  (I lost someone dear)
   ├─ Tôi đang đau, không biết đối diện (grief)      → QA: doi-dien-voi-mat-mat   [DRAFTED below]
   └─ Không chắc họ đã được cứu độ (were they saved) → QA: nguoi-than-qua-doi-duoc-cuu-khong  [DRAFTED below]
```

### "Persecuted for my faith" sub-tree
```
Tôi bị ghét bỏ / bách hại vì đức tin
└─ Ai đang chống lại bạn vì bạn theo Đức Kitô?  (who turns against you?)
   ├─ Gia đình / bạn thân (close family/friends)   → QA: bi-nguoi-nha-chong-doi-vi-duc-tin  [Mt 10,34–36]
   ├─ Người ngoài / thế gian (the world)           → QA: the-gian-ghet-bo-vi-duc-tin        [Jn 15,18–19 + saints]
   └─ Nguy hiểm tính mạng (life-threatening)       → QA: nguy-hiem-tinh-mang-vi-duc-tin     [DRAFTED below]
```

---

## Drafted answers (owner to check line-by-line; VI wording is a draft)

### 1. Grief — QA `doi-dien-voi-mat-mat`
Question: *"Tôi vừa mất một người thân yêu — làm sao đối diện với nỗi đau này?"*
Lead: *Mất một người thân yêu là một trong những nỗi đau sâu nhất con người có thể mang. Hội Thánh không vội kéo bạn ra khỏi nỗi đau ấy.*
1. *Nỗi buồn của bạn chính là dấu chứng của tình yêu — và tình yêu ấy không mất đi.*
2. *Chính Chúa Giêsu đã khóc bên mộ người bạn Ladarô. Thiên Chúa không đứng ngoài nước mắt của bạn; Người bước vào đó.* (Ga 11,35)
3. *Và Người không để sự chết nói lời cuối. Vì Đức Kitô đã sống lại, sự chết là một ngưỡng cửa, không phải dấu chấm hết. Người bạn yêu thương được phó thác trong lòng thương xót của Thiên Chúa — và "Người sẽ lau sạch nước mắt họ."* (Kh 21,4)
4. *Bạn không mang nỗi đau này một mình. Đức Maria đã đứng dưới chân thập giá, nhìn Con mình chết — Mẹ hiểu. Hãy mang cả nỗi đau lẫn người thân đến với Chúa trong lời cầu nguyện, và đừng ngại tìm đến một linh mục hay một người có thể ngồi lại với bạn.*
Scripture gloss: Mt 5,4. Saint bridge: Đức Mẹ Sầu Bi (Our Lady of Sorrows). Tags: `consolation`, `suffering`, `afterlife`.

### 2. Were they saved — QA `nguoi-than-qua-doi-duoc-cuu-khong` (MOST delicate on the site)
Question: *"Người thân tôi đã qua đời — làm sao tôi biết họ được cứu độ?"*
Lead: *Đây là một trong những câu hỏi nặng nề nhất một trái tim đang tang chế có thể mang — và chính việc bạn hỏi đã là một hành vi của tình yêu.*
1. *Chúng ta phó thác người ấy cho lòng thương xót của Thiên Chúa — một lòng thương xót rộng lớn hơn chúng ta có thể đo lường. Chỉ một mình Thiên Chúa thấu suốt trọn vẹn tâm hồn một con người; Người xét xử không chỉ điều họ biết bên ngoài, mà cả cách họ đáp lại ánh sáng đã được ban cho.*
2. *Hội Thánh dạy rằng những ai, không do lỗi của mình, đã không biết Đức Kitô hay Hội Thánh Người, nhưng đã thành tâm tìm kiếm Thiên Chúa và cố sống theo tiếng lương tâm — họ vẫn có thể đạt tới ơn cứu độ.* (GLHTCG 847)
3. *Vì thế chúng ta không tuyên bố số phận của ai — không thất vọng, cũng không cả quyết giả tạo. Chúng ta hy vọng. Và "Thiên Chúa muốn mọi người được cứu độ."* (1 Tm 2,4)
4. *Điều thánh thiện nhất bạn có thể làm lúc này là cầu nguyện cho họ. Từ ngàn xưa Hội Thánh vẫn cầu cho người đã khuất — tình yêu và lời cầu của bạn vẫn chạm tới họ. Bạn có thể xin dâng một Thánh lễ cầu cho họ, và nếu điều này quá nặng nề, hãy tìm đến một linh mục.*
Cross-link: CCC 847 popover + crucifixion cluster + `nguoi-chua-tung-nghe-biet-chua-co-duoc-cuu-khong` (the doctrinal version). Tags: `afterlife`, `salvation`, `consolation`, `suffering`.

### 3. Persecution — life-threatening danger — QA `nguy-hiem-tinh-mang-vi-duc-tin`
Question: *"Tôi có thể gặp nguy hiểm tính mạng vì đức tin — tôi phải làm gì?"*
Lead: *Sợ hãi cho mạng sống mình là điều rất con người — không phải là một thất bại của đức tin.*
1. *Trước hết, hãy biết: Đức Giêsu KHÔNG đòi bạn tự tìm cái chết. Chính Người dạy: "khi bị bách hại ở thành này, hãy trốn sang thành khác." Tìm nơi an toàn, tìm sự trợ giúp — đó là điều khôn ngoan và được phép.* (Mt 10,23)
2. *Nhưng nếu một ngày bạn đứng trước lằn ranh không thể lùi — hãy nhớ bạn không đứng đó một mình. Đức Kitô đã đi trước bạn qua chính con đường ấy, và các Thánh Tử Đạo Việt Nam cũng vậy: các ngài đã sợ hãi, nhưng đã bền chí.*
3. *Lời Chúa hứa ở đây không phải một lời đe dọa, mà là một điểm tựa: "ai bền chí đến cùng, người ấy sẽ được cứu."* (Mt 24,13)
4. *Và ơn sức mạnh được ban đúng vào lúc bạn cần đến — không phải trước. Ngay bây giờ: hãy tìm nơi an toàn, hãy tìm một linh mục hoặc người bạn tin cậy, và đừng mang gánh nặng này một mình.*
Scripture gloss: Mt 24,13 (or Mt 10,22). Saint bridge: Các Thánh Tử Đạo Việt Nam. Tags: `persecution`, `suffering`, `saints`.
**Tone guardrails:** never guilt toward martyrdom; flee/safety FIRST; "grace given in the moment, not before"; endure-as-promise, **never** Mt 10,33 ("deny me → I deny you"). For real danger the human/safety off-ramp is non-negotiable — "seek safety and help now."

---

## Answer scaffolds (full drafts pending — say the word and I'll expand each for your check)

- **Health / illness — `dau-om-benh-tat`** — presence first; Christ *took our suffering* (CCC 1505); **companions-in-suffering saints bridge** (Carlo Acutis, Bernadette — relied on God through illness); hope, never "offer it up" as a demand. Tags: `consolation`, `suffering`, `saints`.
- **Financial — `lo-lang-tien-bac`** — frame as **God's providence + your dignity in the struggle**, NOT "just don't worry." Mt 6,25–34 as *reassurance you are seen and provided for*, not a scolding of anxiety. Tags: `consolation`, `suffering`.
- **Loneliness (human) — `co-don-khong-ai-gan-gui`** — *"Thầy ở cùng anh em mọi ngày"* (Mt 28,20); communion of saints; the Church as family; **Christ really present in the Eucharist — go sit with Him** (adoration). Tags: `consolation`, `prayer`.
- **Loneliness (spiritual) — `co-don-chua-nhu-vang-mat`** — the "dark night" is not failure; *Christ himself cried "why have you forsaken me"*; faithfulness in dryness; **Teresa Calcutta** (felt God's silence for decades, kept serving). Tags: `consolation`, `prayer`, `saints`.
- **Persecution (family/friends) — `bi-nguoi-nha-chong-doi-vi-duc-tin`** — Mt 10,34–36 (a sword, not peace; enemies in one's own household); comfort: **Jesus foretold this division — it's not a sign you're wrong**; don't repay hate; pray for them. Tags: `persecution`, `consolation`.
- **Persecution (the world) — `the-gian-ghet-bo-vi-duc-tin`** — Jn 15,18–19 ("it hated me first"; "you are not of the world"); you're **in company with Christ and the martyrs**; bridge to persecuted saints (VN Martyrs, Kolbe); don't be surprised or ashamed. Tags: `persecution`, `saints`.
- **Something else — `dau-kho-noi-chung`** — gentle catch-all consolation + the priest off-ramp. Tags: `consolation`, `suffering`.

---

## Q&As to write — Session 3

| slug | question (VI) | category | tags | key ref | saint bridge |
|---|---|---|---|---|---|
| `doi-dien-voi-mat-mat` | đối diện với nỗi đau mất người thân | god-meaning | consolation, suffering, afterlife | Ga 11,35 · Kh 21,4 | Đức Mẹ Sầu Bi |
| `nguoi-than-qua-doi-duoc-cuu-khong` | làm sao biết người đã khuất được cứu độ | theology-doctrine | afterlife, salvation, consolation, suffering | GLHTCG 847 · 1 Tm 2,4 | — |
| `nguy-hiem-tinh-mang-vi-duc-tin` | nguy hiểm tính mạng vì đức tin, phải làm gì | morality-life | persecution, suffering, saints | Mt 10,23 · Mt 24,13 | VN Martyrs |
| `dau-om-benh-tat` | đang bệnh tật/đau ốm | god-meaning | consolation, suffering, saints | GLHTCG 1505 | Carlo Acutis, Bernadette |
| `lo-lang-tien-bac` | lo lắng về tài chính, thiếu thốn | god-meaning | consolation, suffering | Mt 6,25–34 | — |
| `co-don-khong-ai-gan-gui` | cô đơn, không ai gần gũi | god-meaning | consolation, prayer | Mt 28,20 | — |
| `co-don-chua-nhu-vang-mat` | thấy Chúa như vắng mặt | god-meaning | consolation, prayer, saints | Mc 15,34 | Teresa Calcutta |
| `bi-nguoi-nha-chong-doi-vi-duc-tin` | người nhà chống đối vì đức tin | morality-life | persecution, consolation | Mt 10,34–36 | — |
| `the-gian-ghet-bo-vi-duc-tin` | thế gian ghét bỏ vì đức tin | morality-life | persecution, saints | Ga 15,18–19 | VN Martyrs, Kolbe |

*(Slugs/categories are proposals — verify VN wording per the terminology rule; the owner may re-home
categories. A future "spiritual life / đời sống thiêng liêng" category could group these, but not now —
`consolation` carries the cross-cutting thread.)*

## New tags — Session 2 (`lib/giaiDapTaxonomy.ts`)
- **`consolation`** — vi: *An ủi & hy vọng* / en: *Consolation & hope* (now justified — ~9 pieces above).
- **`persecution`** — vi: *Bách hại & làm chứng* / en: *Persecution & witness* (3 pieces + bridges to the martyrs/VN heritage).
- Add both to `TAGS`, then `scripts/check-tags.mjs` accepts them (and the deferred `consolation` reminder self-clears).

---

## Hand-off (order: 2 → 3 → 7)

| # | Session | Task |
|---|---|---|
| 1 | **2** | Add `consolation` + `persecution` to `TAGS` in `lib/giaiDapTaxonomy.ts`. *(Goes first so the Q&As validate.)* |
| 2 | **3** | Write the 9 pastoral Q&As above (`content/giai-dap`), tagged, pastoral-tone. Use the drafted answers (grief, were-they-saved, danger) and expand the scaffolds. Run `check-tags` clean. |
| 3 | **7** | Build the intake sub-tree in `lib/dongHanh.ts`: new top-level "persecuted for faith"; deepen "suffering/loss" per the diagrams (steps + situation leads, each opening with comfort). Route each leaf to its Q&A via `seedPins` (needs the Q&A slugs from step 2). Persistent off-ramp on every pastoral step. |

Session 7 can build the *structure* (steps, choices, leads) in parallel; only the `seedPins` wait on the
Q&A slugs. Nothing here is blocked by v2 — it extends the same model.
