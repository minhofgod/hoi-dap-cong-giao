// The evidence path's four stages — "Bằng chứng về Chúa Giêsu" (/bang-chung).
//
// Client-safe CONFIG only: no fs, no content loading, so both the server pages and the client
// components can import it. The loader that joins these stages to the real Q&A content lives in
// lib/evidencePath.ts (server-only — it reads content/giai-dap through lib/giaiDap).
//
// Spec: docs/evidence-path-spec.md, but the shape has moved on with the owner (2026-08-18, -20).
// SEVEN steps now. Steps 1–6 are the argument, each answering the question the previous provokes:
//
//   1 is the universe designed  →  2 then who made the designer  →  3 can the record be trusted
//   →  4 what did he actually claim  →  5 did the event happen  →  6 what does that ask of you
//
// Step 7 (miracles) sits AFTER the argument closes, deliberately: it is further evidence appended
// to a case already made, not a rung in it. See its own note below.
//
// Two ordering calls worth not re-litigating:
//   • Design comes before "who made God?". The spec opened with the first-cause cluster, which made
//     "who created God?" a rebuttal to a premise the reader had not been given. Design first puts a
//     *someone* on the table, so the objection follows naturally.
//   • The CLAIM (4) comes before the RESURRECTION (5), not after. The Resurrection cluster is
//     self-contained — all 8 parts argue "did it happen", none argue "therefore he is God" — so the
//     reverse order also works, and was considered. It loses on the reader's experience: step 5 is
//     the longest, most forensic stage on the path, and a reader who already knows the claim reads
//     those nine answers with stakes rather than doing tomb forensics for no stated reason. Two
//     answers buy the whole stage its motivation.
//
// Steps 4 and 6 are deliberately SHORT hinges either side of the long Resurrection stage, sliced
// with `only` (below). Step 6 is openly past the evidence — its bridge says so.
//
// Stages 1–6 each map onto ONE Giải Đáp cluster anchor; stage 7 draws from content/phep-la by tag.
// The path asserts nothing those sources don't already say. NOTE: the stage-4 cluster is new
// (2026-08-18) and NOT yet proofread.

import type { Bi } from '@/lib/churchFathers';

export type StageSource =
  | {
      kind: 'cluster';
      /** Slug of the Giải Đáp cluster anchor this stage walks. */
      anchor: string;
      /** Show ONLY these member slugs, in this order, instead of the anchor's whole `parts:` list.
       *  Omit and the stage walks the entire cluster.
       *
       *  This exists because THE PATH IS AN EVIDENCE CHAIN, NOT A THEOLOGY COURSE (owner,
       *  2026-08-18). Some clusters are theologically rich and much larger than the evidential
       *  slice the path needs — "did Jesus claim to be God?" has many parts, but the path needs
       *  only the one verse-argument that carries the evidence; the reader who wants the rest
       *  follows the link into /giai-dap.
       *
       *  Without this the failure is silent: point a stage at a big anchor and it quietly drags the
       *  whole cluster in. Unknown slugs are ignored, so a renamed part degrades to a shorter list
       *  rather than a crash. */
      only?: string[];
    }
  | {
      kind: 'miracles';
      /** Tag ids from lib/giaiDapTaxonomy, resolved through getMiraclesByTag(). Tag-driven so the
       *  stage stays current as miracles are added — never a hardcoded slug list. */
      tags: string[];
    };

export interface EvidenceStage {
  /** URL segment: /bang-chung/<slug>. Kept aligned with `title` so the URL and the visible name
   *  say the same thing. */
  slug: string;
  /** 1-based position; rendered as "Bước N / 4". */
  step: number;
  /** The stage's NAME, in the reader's own words — a full question, not a label (owner's call
   *  2026-08-18). Has to work as a card heading, a page <h1>, a prev/next label and a <title>. */
  title: Bi;
  /** One line naming WHAT IS INSIDE this step — the objections it actually works through. This is
   *  deliberately not a restatement of `title`: on stages 1 and 4 the cluster's own question is
   *  nearly the same sentence as the name, so the card would say the same thing twice. Factual
   *  contents only, no claims. */
  covers: Bi;
  /** WHERE this stage's content comes from. A discriminated union rather than a bag of optional
   *  fields, so "a miracles stage with an anchor" or "a cluster stage with tags" cannot be written
   *  at all.
   *
   *  - `cluster` — a Giải Đáp anchor; its `parts:` supply the members, so the stage can never drift
   *    out of sync with the cluster.
   *  - `miracles` — Church-recognised cases selected from content/phep-la BY TAG, never by a slug
   *    list, so entries added later appear on their own (docs/miracles-taxonomy-and-evidence-stage.md
   *    §B). Only formally recognised statuses are shown; see lib/evidencePath.
   */
  source: StageSource;
  /** THE bridge: 2–4 sentences saying what the previous stage established and why that forces this
   *  question. The one piece of genuinely new writing on this path — deliberately connective logic
   *  only, asserting no dates, names, events or citations of its own (see the spec's scope note).
   *  Where a bridge reports a Christian claim it says so explicitly ("Kitô giáo trả lời rằng…")
   *  rather than asserting it, because the path has no cluster backing that claim yet.
   *  NOT yet proofread: the owner reads these before NEXT_PUBLIC_EVIDENCE_PATH goes on in prod. */
  bridge: Bi;
}

export const EVIDENCE_STAGES: EvidenceStage[] = [
  {
    slug: 'vu-tru-duoc-thiet-ke',
    step: 1,
    title: {
      vi: 'Vũ trụ được tạo ra ngẫu nhiên hay được thiết kế?',
      en: 'Was the universe made by chance, or was it designed?',
    },
    covers: {
      vi: 'Bằng chứng về sự điều chỉnh tinh vi, thuyết đa vũ trụ, và phản đối "Thiên Chúa của những lỗ hổng".',
      en: 'The fine-tuning evidence, the multiverse, and the "God of the gaps" objection.',
    },
    source: { kind: 'cluster', anchor: 'vu-tru-ngau-nhien-hay-duoc-thiet-ke' },
    bridge: {
      vi: 'Lập luận bắt đầu ở chỗ thấp nhất có thể: chưa giả thiết Kinh Thánh, chưa giả thiết Chúa Giêsu, chưa giả thiết điều gì thuộc đức tin. Chỉ một điều mà bất cứ ai cũng có thể xem xét — vũ trụ này vận hành trên những hằng số chính xác đến mức kinh ngạc. Câu hỏi đầu tiên chỉ là: sự chính xác ấy đến từ đâu?',
      en: 'The argument starts as low as it can: assuming no Bible, no Jesus, nothing taken on faith. Only something anyone at all can examine — this universe runs on constants of astonishing precision. The first question is simply where that precision comes from.',
    },
  },
  {
    slug: 'ai-tao-ra-chua',
    step: 2,
    title: {
      vi: 'Nếu Chúa tạo ra vũ trụ, thì ai tạo ra Chúa?',
      en: 'If God made the universe, then who made God?',
    },
    covers: {
      vi: 'Chuỗi nguyên nhân vô tận, làm sao biết vũ trụ có khởi đầu, thuyết "vũ trụ nảy", và tại sao nguyên nhân đầu tiên lại phải là Thiên Chúa.',
      en: 'Infinite causal chains, how we know the universe began, the bouncing universe, and why the first cause has to be God.',
    },
    source: { kind: 'cluster', anchor: 'ai-tao-ra-chua' },
    bridge: {
      vi: 'Bước trước dừng lại ở một suy luận, không phải một chứng minh: lời giải thích hợp lý nhất cho sự chính xác ấy là một Đấng có ý hướng, chứ không phải thuần túy ngẫu nhiên. Và ngay khi nói tới một Đấng như thế, phản đối đầu tiên bao giờ cũng là câu này — nếu mọi thứ đều cần ai đó tạo ra, thì ai tạo ra chính Ngài? Bước này trả lời thẳng vào đó.',
      en: 'The previous step ends in an inference, not a proof: the best explanation for that precision is a purposeful Someone rather than sheer chance. And the moment you say that, the first objection is always this one — if everything needs a maker, who made him? This step answers it head on.',
    },
  },
  {
    slug: 'tan-uoc-co-dang-tin',
    step: 3,
    title: {
      vi: 'Thiên Chúa là ai, và bản văn kể về Ngài có đáng tin không?',
      en: 'Who is God — and can the record about him be trusted?',
    },
    covers: {
      vi: 'Các nhân vật Tân Ước có phải người thật, chuyện không còn bản gốc, các dị bản, và chuyện Giáo Hội có sửa Kinh Thánh không.',
      en: 'Whether the New Testament figures were real people, the lost originals, the variants, and whether the Church altered the Bible.',
    },
    source: { kind: 'cluster', anchor: 'bang-chung-lich-su-cua-kinh-thanh' },
    bridge: {
      vi: 'Hai bước đầu, nếu đứng vững, mới chỉ đưa ta tới một Đấng có trí tuệ và có ý hướng — chưa nói được Ngài là ai. Mà câu hỏi "Thiên Chúa là ai?" thì không thể trả lời bằng cách suy luận thêm về vũ trụ: chỉ chính Ngài tỏ mình ra mới trả lời được. Kitô giáo nói rằng điều đó đã xảy ra, và câu trả lời được ghi lại trong một bộ tài liệu cụ thể. Bước sau sẽ đọc xem các tài liệu ấy ghi gì; nhưng trước hết phải hỏi: chúng có đáng tin không?',
      en: 'The first two steps, if they hold, get us only as far as an intelligent, purposeful Someone — not to who he is. And "who is God?" cannot be answered by reasoning further about the universe: only his showing himself could answer it. Christianity says that is exactly what happened, and that the answer was written down in a particular set of documents. The next step reads what those documents record; but first we have to ask whether they can be trusted at all.',
    },
  },
  {
    // The hinge. Deliberately TWO answers — the anchor plus one verse-argument — because the path
    // needs the claim, not a course in Christology. `only` keeps the rest of the cluster out; the
    // stage page links to it. Ga 10,30 + 10,33 is the pick because it carries the claim AND the
    // reaction of the people who heard it, so the argument rests on how they understood it rather
    // than on how a modern reader parses the words. (Ga 20,28 was the alternative; Ga 14,28 is a
    // defence against an objection, not a claim.) The verse itself lives in the answer, where it
    // has been checked — never quoted in this bridge.
    slug: 'chua-giesu-tuyen-bo-la-thien-chua',
    step: 4,
    title: {
      vi: 'Chúa Giêsu có tuyên bố mình là Thiên Chúa không?',
      en: 'Did Jesus claim to be God?',
    },
    covers: {
      vi: 'Câu "Tôi và Chúa Cha là một", và phản ứng của chính những người đang đứng nghe câu ấy.',
      en: 'The sentence "I and the Father are one", and how the people standing there reacted to it.',
    },
    source: {
      kind: 'cluster',
      anchor: 'chua-giesu-co-tuyen-bo-minh-la-thien-chua-khong',
      only: ['toi-va-chua-cha-la-mot-nghia-la-gi'],
    },
    bridge: {
      vi: 'Nếu bản văn đáng tin, thì việc tiếp theo là đọc xem nó thật sự ghi lại điều gì. Và đến đây toàn bộ lập luận thu lại thành một điểm duy nhất: chính Chúa Giêsu đã nói gì về mình? Đây là bước ngắn nhất trong con đường này, vì nó chỉ xoay quanh một câu nói — và quanh chuyện những người đang đứng nghe đã hiểu câu ấy ra sao.',
      en: 'If the record can be trusted, the next thing to do is read what it actually records. And here the whole argument narrows to a single point: what did Jesus say about himself? This is the shortest step on the path, because it turns on one sentence — and on how the people standing there understood it.',
    },
  },
  {
    slug: 'chua-giesu-song-lai',
    step: 5,
    title: {
      vi: 'Chúa Giêsu có thật sự sống lại?',
      en: 'Did Jesus really rise from the dead?',
    },
    covers: {
      vi: 'Làm sao chứng minh một phép lạ, các nhân chứng, ngôi mộ trống, giả thuyết ngất đi, chuyện trộm xác, ảo giác tập thể, và những khác biệt giữa các sách Phúc Âm.',
      en: 'How you prove a miracle, the witnesses, the empty tomb, the swoon and stolen-body theories, mass hallucination, and the differences between the Gospels.',
    },
    source: { kind: 'cluster', anchor: 'bang-chung-chua-giesu-song-lai' },
    bridge: {
      vi: 'Bước trước cho thấy lời tuyên bố ấy đã thật sự được nói ra. Nhưng một lời tuyên bố, tự nó, chưa chứng minh được gì — ai cũng có thể nói ra một câu như thế. Điều duy nhất có thể chứng thực hoặc phá đổ nó là một biến cố trong lịch sử: hoặc đã xảy ra, hoặc đã không. Kitô giáo không đứng trên một lập luận triết học, mà đứng đúng ở chỗ đó. Đây là bước dài nhất, và cũng là bước quyết định.',
      en: 'The previous step showed that the claim really was made. But a claim on its own proves nothing — anyone can say such a thing. The only thing that can vindicate it or destroy it is an event in history: it either happened or it did not. Christianity rests not on a philosophical argument but on exactly that. This is the longest step, and the deciding one.',
    },
  },
  {
    // The closing hinge, and openly PAST the evidence — its bridge says so out loud. Sliced to the
    // two members that speak to the reader's own position; the cluster's other six are the doctrinal
    // mechanics (atonement, grace, the unevangelised, joining the Church) and belong in /giai-dap,
    // not at the end of an evidence walk where they would be the heaviest thing on the path.
    slug: 'thien-chua-muon-gi',
    step: 6,
    title: {
      vi: 'Vậy Thiên Chúa muốn gì nơi chúng ta?',
      en: 'So what does God want from us?',
    },
    covers: {
      vi: 'Sống tốt cả đời đã đủ chưa, "chuộc tội" thật sự nghĩa là gì, và ông bà tổ tiên chưa từng nghe biết Chúa thì sao.',
      en: 'Whether living a good life is enough, what "atonement" actually means, and what becomes of ancestors who never heard of Christ.',
    },
    // Order matters here. It builds: "isn't a good life enough?" → "what did the cross actually
    // do?" → "so what about those who never heard?". The last one carries Ga 14,2-3 ("Thầy đi dọn
    // chỗ cho anh em… để Thầy ở đâu, anh em cũng ở đó"), the most literal answer this stage's title
    // can have — he wants you where he is. Putting it first would open the step on a fairness
    // objection instead.
    source: {
      kind: 'cluster',
      anchor: 'tai-sao-chua-giesu-chiu-dong-dinh',
      only: [
        'song-tot-ca-doi-sao-khong-tu-tra-het-toi',
        'chua-giesu-chuoc-toi-nghia-la-gi',
        'nguoi-chua-tung-nghe-biet-chua-co-duoc-cuu-khong',
      ],
    },
    bridge: {
      vi: 'Nếu năm bước trước đứng vững, thì câu hỏi không còn là "có Thiên Chúa hay không", mà là một câu riêng tư hơn nhiều: nếu chuyện đó có thật, thì nó liên quan gì tới tôi? Đến đây phần bằng chứng đã xong việc của nó. Bước cuối này không chứng minh thêm điều gì nữa — nó chỉ trả lời câu hỏi còn lại: Thiên Chúa muốn gì nơi bạn, và tại sao câu trả lời ấy lại đi qua thập giá.',
      en: 'If the five previous steps hold, the question is no longer whether there is a God but something far more personal: if this is true, what does it have to do with me? The evidence has finished its work by here. This last step proves nothing further — it only answers the question that is left: what God wants of you, and why that answer runs through the cross.',
    },
  },
  {
    // Miracles come LAST, after the invitation, at the owner's call (2026-08-20): they are further
    // evidence appended to a case already made, not a rung in it. That also preserves the reason
    // docs/miracles-taxonomy-and-evidence-stage.md §B gives for keeping them late — miracles are
    // weak as an OPENING argument ("unexplained ≠ miracle" and the skeptic leaves) and strong as
    // confirmation for someone already persuaded. Its bridge says out loud that the argument is
    // finished, so landing here after the closing invitation reads as an appendix, not a climax.
    slug: 'thien-chua-con-dang-hanh-dong',
    step: 7,
    title: {
      vi: 'Thiên Chúa còn đang hành động cho tới hôm nay không?',
      en: 'Is God still acting today?',
    },
    covers: {
      vi: 'Văn phòng Y khoa Lộ Đức và các trường hợp đã được y khoa điều tra, các cuộc hiện ra đã được Hội Thánh phê chuẩn — và điều mỗi trường hợp KHÔNG chứng minh.',
      en: 'The Lourdes Medical Bureau and the medically investigated cures, the Church-approved apparitions — and what each case does NOT establish.',
    },
    // By TAG, never a slug list, so miracles added later appear on their own. `miracles` is carried
    // by all 18 entries, which makes it the selector; lib/evidencePath then gates on recognition
    // status, because §B allows formally recognised cases only.
    source: { kind: 'miracles', tags: ['miracles'] },
    bridge: {
      vi: 'Con đường lập luận đã xong ở bước trước. Bước này không thêm một mắt xích nào vào đó, và tự nó cũng không chứng minh được điều gì — đặt nó ở đầu con đường thì đã là một sai lầm, vì "chưa giải thích được" không có nghĩa là "phép lạ", và một người còn hoài nghi sẽ dừng lại ngay ở đó. Nhưng với người đã đi hết sáu bước trên, còn một câu hỏi tự nhiên: nếu chuyện ấy đã xảy ra hai ngàn năm trước, thì hôm nay Thiên Chúa có còn hành động không? Dưới đây là những trường hợp Hội Thánh đã chính thức nhìn nhận — cùng với điều mà mỗi trường hợp không hề chứng minh.',
      en: 'The argument finished at the previous step. This one adds no link to it, and on its own it proves nothing — putting it first would have been a mistake, because "unexplained" does not mean "miracle" and a doubting reader would stop right there. But for anyone who has walked the six steps above, a natural question remains: if that happened two thousand years ago, is God still acting now? What follows are cases the Church has formally recognised — together with what each of them does not establish.',
    },
  },
];

export const EVIDENCE_PATH_TITLE: Bi = {
  vi: 'Bằng chứng về Chúa Giêsu',
  en: 'The Evidence for Jesus',
};

/** Look up a stage by its URL segment. */
export function getStageBySlug(slug: string): EvidenceStage | undefined {
  return EVIDENCE_STAGES.find((s) => s.slug === slug);
}
