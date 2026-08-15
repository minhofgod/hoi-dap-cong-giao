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
4. *Điều thánh thiện nhất bạn có thể làm lúc này là cầu nguyện cho họ. Hội Thánh vẫn luôn cầu nguyện cho những người đã khuất — tình yêu và lời cầu của bạn vẫn chạm tới họ. Bạn có thể xin dâng một Thánh lễ cầu cho họ, và nếu điều này quá nặng nề, hãy tìm đến một linh mục.*
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

## Drafted answers — batch 2 (owner to check; VI wording is a draft)

### 4. Health / illness — QA `dau-om-benh-tat`
Question: *"Tôi đang mang bệnh tật, đau ốm — đức tin nói gì với tôi lúc này?"*
Lead: *Bệnh tật có thể khiến ta cảm thấy yếu đuối, sợ hãi và cô đơn. Bạn không phải đối diện với điều đó một mình.*
1. *Đức Kitô không đứng xa giường bệnh của bạn. "Xúc động trước đau khổ, Người đã lấy những bệnh tật của chúng ta làm của mình."* (Mt 8,17 · GLHTCG 1505)
2. *Những người đã đi trước bạn qua con đường này không lớn lên trong đức tin bất chấp bệnh tật, mà chính nhờ tựa vào Chúa giữa cơn bệnh: Carlô Acutis đã dâng căn bệnh ung thư của mình trong bình an; Bernadette đã mang bệnh tật lâu năm mà vẫn phó thác.*
3. *Nỗi đau của bạn, khi kết hợp với Đức Kitô, không bao giờ vô ích — nhưng đây là một lời mời, không phải một đòi buộc. Hãy mang nỗi sợ và cơn đau đến với Người.*
4. *Và đừng quên: Bí tích Xức Dầu Bệnh Nhân là một ơn sức mạnh và bình an — không chỉ dành cho người hấp hối. Hãy tìm đến một linh mục, các bí tích, và những người thương yêu bạn.*
Scripture gloss: Mt 8,17. Saints: Carlô Acutis, Bernadette. Tags: `consolation`, `suffering`, `saints`.

### 5. Financial / need — QA `lo-lang-tien-bac`
Question: *"Tôi lo lắng về tiền bạc, thiếu thốn — Chúa có bỏ mặc tôi không?"*
Lead: *Lo lắng về cơm áo là một gánh nặng thật, và bạn không có gì phải xấu hổ vì nó.*
1. *Đức Kitô hiểu gánh nặng này từ bên trong: Người sinh ra trong cảnh nghèo, và "không có chỗ tựa đầu." Người không coi thường nỗi lo của bạn.*
2. *Khi Người nói "đừng lo về của ăn áo mặc," đó không phải một lời quở trách, mà một lời hứa: "Cha anh em trên trời biết anh em cần gì." Bạn được nhìn thấy và được chăm sóc — quý giá hơn cả chim trời mà Người vẫn nuôi.* (Mt 6,26.32)
3. *Giá trị của bạn không nằm ở số tiền bạn có. Trước mặt Thiên Chúa, bạn là vô giá — dù đang có hay đang thiếu.*
4. *Hãy mang nỗi lo đến với Người cách chân thành — và cũng đừng ngại tìm đến cộng đoàn, những người có thể giúp. Bạn không phải gánh một mình.*
Scripture gloss: Mt 6,25–34. Tags: `consolation`, `suffering`.

### 6. Loneliness — no one close — QA `co-don-khong-ai-gan-gui`
Question: *"Tôi cảm thấy cô đơn, không có ai thật sự gần gũi — Chúa ở đâu?"*
Lead: *Cô đơn là một nỗi đau thật, và ngay cả Đức Kitô cũng đã nếm trải nó.*
1. *Bạn không bao giờ thật sự một mình: "Thầy ở cùng anh em mọi ngày cho đến tận thế" (Mt 28,20); "Thầy sẽ không để anh em mồ côi" (Ga 14,18). Thiên Chúa còn gần bạn hơn cả hơi thở của bạn.*
2. *Bạn thuộc về một gia đình trải dài từ đất đến trời — các thánh thông công vây quanh bạn. Hội Thánh được sinh ra để làm cho gia đình ấy nên hữu hình.*
3. *Đức Kitô hiện diện thật sự trong Bí tích Thánh Thể — bạn có thể đến và ngồi với Người, không phải trò chuyện với một khoảng trống. Hãy thử một giờ chầu Thánh Thể.*
4. *Và hãy để một ai đó bước vào: một giáo xứ, một cộng đoàn. Bước đầu tiên khó, nhưng bạn không được dựng nên để sống một mình.*
Scripture gloss: Mt 28,20. Tags: `consolation`, `prayer`.

### 7. Loneliness — God feels absent — QA `co-don-chua-nhu-vang-mat`
Question: *"Tôi cầu nguyện nhưng thấy Chúa như vắng mặt, im lặng — tôi có làm gì sai không?"*
Lead: *Cảm thấy Chúa xa cách không phải là một thất bại của đức tin — nhiều vị thánh lớn nhất đã đi qua chính bóng tối ấy.*
1. *Đôi khi Thiên Chúa dường như im lặng không phải vì Người vắng mặt, mà vì Người đang mời bạn yêu mến Người vì chính Người, chứ không vì cảm giác an ủi. Sự trung thành giữa lúc khô khan là một tình yêu sâu xa.*
2. *Chính Đức Kitô trên thập giá đã thốt lên: "Lạy Thiên Chúa của con, sao Ngài bỏ con?" (Mc 15,34). Ngay cả tiếng kêu ấy cũng là một lời cầu nguyện Người thấu hiểu từ bên trong.*
3. *Thánh Têrêsa Calcutta đã sống trong sự im lặng của Thiên Chúa suốt nhiều thập niên mà vẫn phục vụ và mỉm cười — bóng tối ấy không dập tắt tình yêu của ngài, mà thanh luyện nó. Bạn đang ở trong hàng ngũ thánh thiện.*
4. *Hãy cứ tiếp tục đến — lời cầu nguyện bạn dâng khi chẳng cảm thấy gì thường là điều đẹp lòng Chúa nhất. Và hãy nói với một linh mục hay người linh hướng để cùng bạn đi qua chặng này.*
Scripture gloss: Mc 15,34. Saint: Têrêsa Calcutta. Tags: `consolation`, `prayer`, `saints`.

### 8. Persecution — family / friends — QA `bi-nguoi-nha-chong-doi-vi-duc-tin`
Question: *"Chính người thân, bạn bè chống đối và chế giễu tôi vì tôi theo Chúa — tôi phải làm sao?"*
Lead: *Bị chính những người mình yêu thương quay lưng vì đức tin là một nỗi đau riêng — sâu và khó.*
1. *Đức Giêsu đã báo trước chính vết thương này: "Thầy đến không phải để đem bình an, nhưng để đem gươm giáo... kẻ thù của mình chính là người nhà" (Mt 10,34-36). Sự chia rẽ bạn đang cảm nhận không phải dấu chỉ bạn làm sai — Người đã nói trước nó sẽ đến với những ai theo Người sát.*
2. *Nhưng điều đó không bao giờ cho phép bạn lấy lạnh lùng đáp lại lạnh lùng. Hãy yêu thương họ, kiên nhẫn, để bình an và niềm vui của bạn trở thành lời chứng mà tranh luận không thắng được. Nhiều tâm hồn đã đổi thay sau nhiều năm — không nhờ lời cãi, mà nhờ chứng tá.*
3. *Hãy cầu nguyện cho họ và phó thác kết quả cho Chúa. Bạn chịu trách nhiệm về tình yêu và lòng trung thành, không phải về việc hoán cải họ.*
4. *Và đừng mang điều này một mình — hãy tìm một cộng đoàn đức tin, và một linh mục nếu nỗi đau quá nặng.*
Scripture gloss: Mt 10,34–36. Tags: `persecution`, `consolation`.

### 9. Persecution — the world — QA `the-gian-ghet-bo-vi-duc-tin`
Question: *"Người ngoài, xã hội chế giễu và ghét bỏ tôi vì tôi tin Chúa — làm sao đứng vững?"*
Lead: *Bị thế gian coi thường vì đức tin có thể khiến ta thấy lạc lõng — nhưng Đức Kitô đã nói trước điều này, và Người gọi đó là một dấu chỉ.*
1. *"Nếu thế gian ghét anh em, thì hãy biết rằng nó đã ghét Thầy trước" (Ga 15,18). Bạn không bị chối từ vì một khiếm khuyết — bạn đang được kể vào hàng ngũ với chính Đức Kitô.*
2. *"Anh em không thuộc về thế gian" (Ga 15,19) — sự khó chịu ấy là dấu chỉ bạn thuộc về một nơi cao hơn. Đây không phải lời mời gọi kiêu hãnh hay ghét lại, mà là một sự khác biệt thầm lặng và vui tươi.*
3. *Bạn đứng trong một hàng dài các chứng nhân — các Thánh Tử Đạo Việt Nam, Thánh Maximilianô Kolbe — những người bị chế giễu, ruồng bỏ và hơn thế, mà vẫn can đảm. Lòng can đảm ấy không phải của riêng họ; đó là ân sủng, và cùng một ân sủng ấy được ban cho bạn.*
4. *Đừng giấu đức tin vì sợ hãi, nhưng cũng đừng mang sự ghét bỏ của thế gian như một vết thương — hãy mang nó như Đức Kitô đã mang, với bình an. Và hãy tựa vào cộng đoàn của bạn; đừng đứng một mình.*
Scripture gloss: Ga 15,18–19. Saints: VN Martyrs, Kolbe. Tags: `persecution`, `saints`.

### 10. Something else — QA `dau-kho-noi-chung` (gentle catch-all)
Question: *"Tôi đang đau khổ vì một điều khác..."*
Lead: *Dù nỗi đau của bạn không hợp với khung nào ở trên, Thiên Chúa vẫn thấy rõ sức nặng riêng bạn đang mang.*
1. *Người không đòi bạn phải gọi tên hay giải thích nó cho đúng — Người chỉ mời bạn mang nó đến, như nó là.*
2. *"Tất cả những ai đang vất vả mang gánh nặng nề, hãy đến cùng Ta, Ta sẽ cho nghỉ ngơi bồi dưỡng." (Mt 11,28)*
3. *Bạn không phải mang một mình. Hãy nói với Chúa cách chân thật, và đừng ngại tìm đến một linh mục hoặc một người có thể lắng nghe bạn.*
Scripture gloss: Mt 11,28. Tags: `consolation`, `suffering`.

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
