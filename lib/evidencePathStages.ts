// The evidence path's four stages — "Bằng chứng về Chúa Giêsu" (/bang-chung).
//
// Client-safe CONFIG only: no fs, no content loading, so both the server pages and the client
// components can import it. The loader that joins these stages to the real Q&A content lives in
// lib/evidencePath.ts (server-only — it reads content/giai-dap through lib/giaiDap).
//
// Spec: docs/evidence-path-spec.md. The order runs
//   is there a God → what kind of God → can we trust the record → did this actually happen,
// and each stage maps onto ONE already-written, already-proofread Giải Đáp cluster anchor. The path
// asserts nothing those clusters don't already say.

import type { Bi } from '@/lib/churchFathers';

export interface EvidenceStage {
  /** URL segment: /bang-chung/<slug>. */
  slug: string;
  /** 1-based position; rendered as "Bước N / 4". */
  step: number;
  /** The stage's NAME — a short topic noun phrase, not a question. It has to work as a card
   *  heading, a page <h1>, a prev/next label and a <title>, and it sits directly above the
   *  cluster's own question on the index card, so a question here would just stack two questions.
   *  Kept in the site's existing vocabulary rather than a parallel one: "Vũ trụ được thiết kế" is
   *  that cluster's own `topic:`, and "nguyên nhân đầu tiên" is the term its answer already uses. */
  title: Bi;
  /** Slug of the Giải Đáp cluster ANCHOR this stage walks. Its `parts:` supply the member
   *  questions, so the path can never drift out of sync with the cluster. */
  anchor: string;
  /** THE bridge: 2–4 sentences saying what the previous stage established and why that forces this
   *  question. The one piece of genuinely new writing on this path — deliberately connective logic
   *  only, asserting no dates, names, events or citations of its own (see the spec's scope note).
   *  NOT yet proofread: the owner reads these before NEXT_PUBLIC_EVIDENCE_PATH goes on in prod. */
  bridge: Bi;
}

export const EVIDENCE_STAGES: EvidenceStage[] = [
  {
    slug: 'nguyen-nhan-dau-tien',
    step: 1,
    title: {
      vi: 'Nguyên nhân đầu tiên',
      en: 'The first cause',
    },
    anchor: 'ai-tao-ra-chua',
    bridge: {
      vi: 'Lập luận bắt đầu ở chỗ thấp nhất có thể: chưa giả thiết Kinh Thánh, chưa giả thiết Chúa Giêsu, chưa giả thiết điều gì thuộc đức tin. Chỉ một câu hỏi mà bất cứ ai cũng có thể đặt ra — tại sao lại có một cái gì đó, thay vì không có gì? Nếu bước này không đứng vững, ba bước sau không cần đi nữa.',
      en: 'The argument starts as low as it can: assuming no Bible, no Jesus, nothing taken on faith. Only a question anyone at all can ask — why is there anything, rather than nothing? If this step does not hold, there is no reason to walk the other three.',
    },
  },
  {
    slug: 'vu-tru-duoc-thiet-ke',
    step: 2,
    title: {
      vi: 'Vũ trụ được thiết kế',
      en: 'A designed universe',
    },
    anchor: 'vu-tru-ngau-nhien-hay-duoc-thiet-ke',
    bridge: {
      vi: 'Bước trước chỉ mới đưa tới một kết luận rất gọn: phải có một nguyên nhân đầu tiên không được gây ra. Nhưng "một nguyên nhân đầu tiên" thì chưa phải là Thiên Chúa — nó có thể chỉ là một biến cố mù quáng, vô tri. Nên câu hỏi kế tiếp không còn là có hay không, mà là: nguyên nhân ấy thuộc loại nào?',
      en: 'The previous step reaches only a very spare conclusion: there must be a first, uncaused cause. But "a first cause" is not yet God — it could be a blind, mindless event. So the next question is no longer whether, but what kind: what sort of cause is it?',
    },
  },
  {
    // `tan-uoc`, not `kinh-thanh`: this cluster is specifically about the NEW TESTAMENT, not the
    // whole Bible — its own answer says so in its first line.
    slug: 'tan-uoc-co-dang-tin',
    step: 3,
    title: {
      vi: 'Độ tin cậy của Tân Ước',
      en: 'The reliability of the New Testament',
    },
    anchor: 'bang-chung-lich-su-cua-kinh-thanh',
    bridge: {
      vi: 'Hai bước đầu chỉ mới đưa ta tới một Nguyên Nhân có trí tuệ và có ý hướng. Nhưng chưa nói được Đấng ấy là ai, hay đã làm gì trong lịch sử. Kitô giáo đưa ra một lời tuyên bố cụ thể hơn nhiều — và lời ấy đến với ta qua một bộ tài liệu. Nên trước khi hỏi lời tuyên bố ấy có thật không, phải hỏi: các tài liệu đó có đáng tin không?',
      en: 'The first two steps get us only as far as an intelligent, purposeful Cause. They do not yet say who that is, or what it has done in history. Christianity makes a far more specific claim — and that claim reaches us through a set of documents. So before asking whether the claim is true, we have to ask whether the documents can be trusted.',
    },
  },
  {
    slug: 'chua-giesu-song-lai',
    step: 4,
    title: {
      vi: 'Sự sống lại của Chúa Giêsu',
      en: 'The Resurrection of Jesus',
    },
    anchor: 'bang-chung-chua-giesu-song-lai',
    bridge: {
      vi: 'Đến đây, ba bước trước đã dọn đường chứ chưa kết luận: có thể có một Đấng Sáng Tạo, và bản văn kể lại chuyện này là tư liệu lịch sử đáng xét. Tất cả vẫn còn treo trên một điều duy nhất. Kitô giáo không đứng trên một lập luận triết học, mà trên một lời tuyên bố về một biến cố đã xảy ra — hoặc đã không xảy ra. Bước cuối cùng là bước ấy.',
      en: 'By now the three previous steps have cleared the ground without concluding anything: there may well be a Creator, and the documents telling this story are historical sources worth weighing. All of it still hangs on one thing. Christianity does not rest on a philosophical argument but on a claim about an event that either happened or did not. That last step is this one.',
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
