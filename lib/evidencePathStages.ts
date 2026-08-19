// The evidence path's four stages — "Bằng chứng về Chúa Giêsu" (/bang-chung).
//
// Client-safe CONFIG only: no fs, no content loading, so both the server pages and the client
// components can import it. The loader that joins these stages to the real Q&A content lives in
// lib/evidencePath.ts (server-only — it reads content/giai-dap through lib/giaiDap).
//
// Spec: docs/evidence-path-spec.md, with the ORDER revised by the owner 2026-08-18. It now runs
//   is the universe designed → then who made the designer → who is he, and is the record about him
//   reliable → did the event actually happen,
// so each step answers the objection the previous step provokes. (The spec's original order opened
// with the first-cause cluster; that made "who created God?" a rebuttal to a premise the reader had
// not been given yet. Design first puts a *someone* on the table, and "then who made him?" becomes
// the natural next question rather than a non-sequitur.)
//
// Each stage maps onto ONE already-written, already-proofread Giải Đáp cluster anchor. The path
// asserts nothing those clusters don't already say.

import type { Bi } from '@/lib/churchFathers';

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
  /** Slug of the Giải Đáp cluster ANCHOR this stage walks. Its `parts:` supply the member
   *  questions, so the path can never drift out of sync with the cluster. */
  anchor: string;
  /** Optional: show ONLY these member slugs, in this order, instead of the anchor's whole `parts:`
   *  list. Omit it and the stage walks the entire cluster (what all four stages do today).
   *
   *  This exists because THE PATH IS AN EVIDENCE CHAIN, NOT A THEOLOGY COURSE (owner, 2026-08-18).
   *  Some clusters are theologically rich and much larger than the evidential slice the path needs
   *  — the coming "did Jesus claim to be God?" cluster is the case in point: it will have many
   *  parts, but the path only needs the one verse or argument that carries the evidence, and the
   *  reader who wants the rest follows the link into /giai-dap.
   *
   *  Without this field the failure is silent: point a stage at a big anchor and it quietly drags
   *  the whole cluster in. Prefer naming one or two slugs over adding a stage that walks twelve.
   *  Unknown slugs are ignored, so a renamed part degrades to a shorter list rather than a crash. */
  only?: string[];
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
    anchor: 'vu-tru-ngau-nhien-hay-duoc-thiet-ke',
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
    anchor: 'ai-tao-ra-chua',
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
    anchor: 'bang-chung-lich-su-cua-kinh-thanh',
    bridge: {
      vi: 'Hai bước đầu, nếu đứng vững, mới chỉ đưa ta tới một Đấng có trí tuệ và có ý hướng — chưa nói được Ngài là ai. Mà câu hỏi "Thiên Chúa là ai?" thì không thể trả lời bằng cách suy luận thêm về vũ trụ: chỉ chính Ngài tỏ mình ra mới trả lời được. Kitô giáo trả lời rằng Ngài đã tỏ mình ra nơi một con người có thật trong lịch sử — và câu trả lời ấy đến với ta qua một bộ tài liệu. Nên trước khi cân nhắc lời tuyên bố, phải cân nhắc tài liệu đã: chúng có đáng tin không?',
      en: 'The first two steps, if they hold, get us only as far as an intelligent, purposeful Someone — not to who he is. And "who is God?" cannot be answered by reasoning further about the universe: only his showing himself could answer it. Christianity answers that he did show himself, in a real man in history — and that answer reaches us through a set of documents. So before weighing the claim, we have to weigh the documents: can they be trusted?',
    },
  },
  {
    slug: 'chua-giesu-song-lai',
    step: 4,
    title: {
      vi: 'Chúa Giêsu có thật sự sống lại?',
      en: 'Did Jesus really rise from the dead?',
    },
    covers: {
      vi: 'Làm sao chứng minh một phép lạ, các nhân chứng, ngôi mộ trống, giả thuyết ngất đi, chuyện trộm xác, ảo giác tập thể, và những khác biệt giữa các sách Phúc Âm.',
      en: 'How you prove a miracle, the witnesses, the empty tomb, the swoon and stolen-body theories, mass hallucination, and the differences between the Gospels.',
    },
    anchor: 'bang-chung-chua-giesu-song-lai',
    bridge: {
      vi: 'Đến đây, ba bước trước đã dọn đường chứ chưa kết luận: có thể có một Đấng Sáng Tạo có ý hướng, và bản văn kể lại chuyện này là tư liệu lịch sử đáng xét. Tất cả vẫn còn treo trên một điều duy nhất. Kitô giáo không đứng trên một lập luận triết học, mà trên một biến cố đã xảy ra — hoặc đã không xảy ra. Nếu biến cố ấy có thật, thì điều Chúa Giêsu nói về chính mình được chứng thực; nếu không, thì không còn gì để bàn nữa.',
      en: 'By now the three previous steps have cleared the ground without concluding anything: there may well be a purposeful Creator, and the documents telling this story are historical sources worth weighing. All of it still hangs on one thing. Christianity rests not on a philosophical argument but on an event that either happened or did not. If it happened, what Jesus said about himself is vindicated; if it did not, there is nothing left to discuss.',
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
