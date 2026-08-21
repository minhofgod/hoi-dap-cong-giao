// "Công Giáo và Tin Lành" (/cong-giao-va-tin-lanh) — the guided path written FOR a Protestant
// reader. Spec: docs/cong-giao-tin-lanh-spec.md.
//
// Client-safe CONFIG + ALL NEW PROSE, in one file on purpose: the framing text below is the ONLY
// new public writing on this surface (a landing page and four branch intros), it is the whole risk
// of the build, and the owner has to proofread it before NEXT_PUBLIC_CG_TL goes on. Keeping it in
// one file means one file to read. The loader that joins these branches to the real Q&A content is
// lib/congGiaoTinLanh.ts (server-only — it reads content/giai-dap through lib/giaiDap).
//
// ── STRUCTURE ────────────────────────────────────────────────────────────────────────────────────
// One ROOT (authority) plus three BRANCHES, enterable in ANY order. This is deliberately NOT the
// ladder /bang-chung uses: the objections are largely independent — a reader may care about Mary
// and not about indulgences — so there is no step number, no prev/next chain and no progress bar.
// The root is offered first and says out loud that it can be skipped.
//
// Each branch names one or more Giải Đáp cluster ANCHORS and walks their `parts:` in the cluster's
// own order. Seven clusters, 58 answers. NOTE: the spec calls this "the 42 Q&As tagged
// protestant-objections". The clusters actually hold 58: all 42 tagged ones plus 16 that were
// never tagged but are plainly the same conversation (Abraham's justification, the good thief,
// whether the early Fathers opposed images, and the two untagged anchors themselves). Filtering on
// the tag would have dropped Abraham and the good thief out of a branch about salvation, so this
// walks the whole cluster instead. No Q&A belongs to two of these clusters, so nothing is shown
// twice.
//
// ── VOICE (read docs/cong-giao-tin-lanh-spec.md → "Voice and tone" before editing a word) ─────────
// Written TO a Protestant reader, in the second person. Write every line as if the reader will read
// it sitting next to their Catholic spouse — that single test resolves most tone questions.
//   • NEVER "Protestants believe X". Protestantism is not one thing; a Baptist and an Anglican do
//     not agree about baptism. Say "many Protestant traditions", or name the tradition.
//   • NEVER impute bad faith. The model failure to avoid is
//     docs/proofread-fixes-round2-sola-scriptura.md §E1.
//   • No triumphalism, no gotcha framing. Never imply the reader is not a Christian.
//   • Admit fault where there is fault — the indulgence abuses. That honesty is the single most
//     credible thing on the page.
//
// ── WHAT THIS TEXT MAY ASSERT ────────────────────────────────────────────────────────────────────
// Same discipline as the evidence-path bridges: this framing is CONNECTIVE writing. It asserts no
// dates, events or history of its own — every factual claim lives in the already-proofread answers
// below it. The three exceptions are Catechism citations, and each was checked against the site's
// own Catechism corpus (content/content.json) AND cross-checked on vatican.va before shipping:
//   GLHTCG 818  — the baptized of these communities "have a right to be called Christians" and are
//                 accepted as brothers; they cannot be charged with the sin of the separation.
//   GLHTCG 1271 — Baptism is the sacramental bond of unity among all who are reborn through it.
//   GLHTCG 1996 — justification is by God's grace, a free and unmerited gift.
// They are written as "GLHTCG NNN" in BOTH languages because that is the token lib/bibleRefs
// recognises (CCC_CANDIDATE), so each one opens the Catechism popover; the popover itself is
// bilingual. "Anh giáo" is HĐGM VN's own term for Anglicans, and "Báp-tít" is the Vietnamese
// Baptist churches' own name for themselves — both verified rather than coined (see the
// Vietnamese-terminology rule in docs/content-guide.md).

import type { Bi } from '@/lib/churchFathers';

export const CG_TL_ROUTE = '/cong-giao-va-tin-lanh';

/** The name, LOCKED by the owner 2026-08-20. Used verbatim for the <h1>, the <title>, the OG card
 *  and every entry-point label — one name everywhere, no variants. It names BOTH traditions and
 *  targets neither, which is the point: the title itself must not tell the reader that they are a
 *  problem to be solved. (Never "Trả lời người Tin Lành", which makes the reader the object being
 *  answered.) The title is mutual; the CONTENT is still second-person to a Protestant reader. */
export const CG_TL_TITLE: Bi = {
  vi: 'Công Giáo và Tin Lành',
  en: 'Catholic and Protestant',
};

export interface CgTlBranch {
  /** URL segment: /cong-giao-va-tin-lanh/<slug>. */
  slug: string;
  /** The root is offered first and rendered as the opening card; branches are peers below it.
   *  Nothing about this forces an order — it only decides emphasis on the landing page. */
  root?: boolean;
  /** The branch's NAME, as a question in the reader's own words. Has to work as a card heading, a
   *  page <h1>, an <title> and a "the other parts" label. */
  title: Bi;
  /** One line naming WHAT IS INSIDE — the actual topics, no claims. Deliberately not a restatement
   *  of `title`. */
  covers: Bi;
  /** The intro: 2–4 sentences of new writing, addressed to the reader. See the voice notes above. */
  intro: Bi;
  /** Giải Đáp cluster anchor slugs, in reading order. Each anchor's own `parts:` supply the member
   *  questions, so a branch can never drift out of sync with its cluster: add a part to the cluster
   *  and it appears here automatically. */
  anchors: string[];
}

export const CG_TL_BRANCHES: CgTlBranch[] = [
  {
    slug: 'kinh-thanh-va-quyen-binh',
    root: true,
    title: {
      vi: 'Đâu là thẩm quyền tối hậu?',
      en: 'What has the final authority?',
    },
    covers: {
      vi: 'Duy Kinh Thánh, quy điển Kinh Thánh, Thánh Truyền và Huấn Quyền — cùng những câu Kinh Thánh mà cả hai bên đều trích.',
      en: 'Sola Scriptura, the canon of Scripture, Tradition and the Magisterium — and the verses both sides quote.',
    },
    // The root. Session 3 reframed this cluster around authority with Apostolic Succession as the
    // explicit foundation, and it is load-bearing: "why confess to a priest?" only becomes a real
    // question once authority is settled. So the intro's job is to say why it comes first WITHOUT
    // making it a gate — the last sentence hands the reader permission to leave.
    intro: {
      vi: 'Phần này được đặt trước, vì phần lớn những khác biệt còn lại đều quay về đây. Người Công giáo cũng như bạn đều tin Kinh Thánh là Lời Thiên Chúa được linh hứng — chỗ khác nhau không nằm ở lòng yêu mến Kinh Thánh, mà ở một câu hỏi đến sau đó: khi hai người đọc cùng một đoạn và hiểu ngược nhau, điều gì phân xử? Bạn không buộc phải bắt đầu ở đây. Nhưng nếu bạn bắt đầu ở một phần khác, rất có thể câu hỏi này sẽ đợi bạn ở cuối con đường ấy.',
      en: 'This part comes first because most of the remaining differences lead back to it. Catholics, like you, believe Scripture is the inspired word of God — the difference is not about who loves the Bible more, but about a question that comes after that: when two people read the same passage and understand it in opposite ways, what settles it? You do not have to start here. But if you start somewhere else, this question will most likely be waiting for you at the end of that road.',
    },
    anchors: ['chi-can-kinh-thanh-sola-scriptura-co-dung-khong'],
  },
  {
    slug: 'on-cuu-do',
    title: {
      vi: 'Chúng ta được cứu độ thế nào?',
      en: 'How are we saved?',
    },
    covers: {
      vi: 'Đức tin và việc làm, thư Rôma và thư Giacôbê, ơn bền đỗ — và chuyện ân xá.',
      en: 'Faith and works, Romans and James, perseverance — and the matter of indulgences.',
    },
    // "nhưng không" is glossed ("nghĩa là một món quà cho không") and the gloss must STAY — it is
    // not redundant with "không ai mua hay kiếm được". The phrase is Catholic catechetical
    // Vietnamese that people rarely meet outside the Catechism (owner, 2026-08-21), so the one
    // audience least likely to know it is the Protestant reader this page is written for. It earns
    // its place twice over: the GLHTCG 1996 popover the sentence links to says "một sự trợ giúp
    // nhưng không", so the gloss also equips the reader to read the citation itself. The EN needs
    // no equivalent — it already says "a free gift", with no jargon to unpack.
    //
    // This intro carries the fault admission, and it is the most important sentence on the page:
    // the Ân xá cluster already says the Tetzel preaching was "sai nghiêm trọng", so the intro can
    // say so plainly without overclaiming. Note what it does NOT say — it does not say the Church
    // sold forgiveness, because the cluster itself shows that is not what happened. Admitting the
    // real fault and refusing the false charge are the same act of honesty.
    intro: {
      vi: 'Không có câu nào trong phần này nói rằng bạn có thể tự cứu lấy mình. Hội Thánh Công giáo dạy rằng ơn công chính hóa là do ân sủng của Thiên Chúa — một hồng ân nhưng không, nghĩa là một món quà cho không, không ai mua hay kiếm được (GLHTCG 1996). Điều được bàn ở đây là chuyện đến sau đó: một đức tin như thế thì sống ra sao. Phần này cũng gồm chuyện ân xá; và nếu điều đầu tiên bạn từng nghe về đạo Công giáo là chuyện tiền bạc đổi lấy ơn tha tội, thì bạn có lý do chính đáng để hỏi. Trong câu chuyện ấy có một sự lạm dụng có thật, và các bài dưới đây gọi thẳng nó là sai chứ không tìm cách chối.',
      en: 'Nothing in this part says you can save yourself. The Catholic Church teaches that justification comes from the grace of God — a free gift, which no one buys or earns (GLHTCG 1996). What is discussed here is what comes after that: how a faith like that lives. This part also covers indulgences; and if the first thing you ever heard about the Catholic faith was money exchanged for forgiveness, you have good reason to ask. There is a real abuse inside that story, and the answers below call it wrong rather than explain it away.',
    },
    anchors: ['duc-tin-va-viec-lam', 'an-xa-la-gi-co-phai-mua-on-tha-toi'],
  },
  {
    slug: 'hoi-thanh-va-bi-tich',
    title: {
      vi: 'Bí tích có thật sự làm điều gì không?',
      en: 'Do the sacraments actually do something?',
    },
    covers: {
      vi: 'Xưng tội với linh mục, quyền tha tội, Phép Rửa cho trẻ em, và Phép Rửa thật sự làm gì.',
      en: 'Confession to a priest, the power to forgive sins, infant baptism, and what baptism actually does.',
    },
    // The one place where "never say 'Protestants believe X'" is not just a rule to obey but the
    // actual content: the traditions genuinely disagree with each other here, which is why the
    // intro refuses to assume anything about the reader's own position. Only two traditions are
    // named, and both names were verified — see the header note.
    intro: {
      vi: 'Đây có lẽ là chỗ khác biệt sắc nét nhất — và cũng là chỗ mà chính các hệ phái Tin Lành khác nhau nhiều nhất giữa mình với nhau: một tín hữu Báp-tít và một tín hữu Anh giáo không nói cùng một điều về Phép Rửa. Vì thế phần này không giả định sẵn bạn tin điều gì. Câu hỏi chung nằm dưới cả hai chủ đề ở đây chỉ là một: bí tích là dấu chỉ cho một điều đã xảy ra rồi, hay chính Thiên Chúa làm một điều gì đó qua nó?',
      en: 'This is probably where the difference is sharpest — and also where Protestant traditions differ most among themselves: a Baptist and an Anglican do not say the same thing about baptism. So this part does not assume in advance what you believe. There is one question underneath both topics here: is a sacrament a sign of something that has already happened, or does God actually do something through it?',
    },
    anchors: ['tai-sao-xung-toi-voi-linh-muc', 'phep-rua-co-can-thiet-de-duoc-cuu-do-khong'],
  },
  {
    slug: 'duc-me-va-cac-thanh',
    title: {
      vi: 'Tôn kính Đức Mẹ và các thánh có lấy mất chỗ của Đức Kitô không?',
      en: 'Does honouring Mary and the saints take anything away from Christ?',
    },
    covers: {
      vi: 'Xin các thánh chuyển cầu, Đức Kitô là Đấng trung gian duy nhất, điều răn về ảnh tượng, và việc sùng kính ảnh tượng.',
      en: 'Asking the saints to intercede, Christ the one mediator, the commandment about images, and the veneration of images.',
    },
    // Grants the objection its force before answering it — if what the reader sees really were
    // worship of a creature, the objection would be right, and saying so is both true and the only
    // way the answer can be heard. The closing sentence is an honest scope note: the two Marian
    // answers live inside the images cluster, and the site has no cluster on the Marian dogmas
    // themselves. Better to say that than to let the branch name promise what it cannot deliver.
    intro: {
      vi: 'Với nhiều người Tin Lành, đây là điều khó chịu nhất khi bước vào một nhà thờ Công giáo — và sự khó chịu ấy không phải vô cớ: nếu điều bạn nhìn thấy đúng là sự thờ phượng dành cho một thụ tạo, thì phản đối của bạn là đúng. Phần này trả lời đúng câu hỏi đó: người Công giáo thật sự đang làm gì khi xin các thánh cầu nguyện cho mình, và Hội Thánh phân biệt việc ấy với sự thờ phượng chỉ dành riêng cho Thiên Chúa như thế nào. Cũng xin nói rõ trước: ở đây bàn tới việc chuyển cầu và ảnh tượng — còn các tín điều về chính Đức Maria thì trang này chưa có bài.',
      en: 'For many Protestants this is the hardest thing about walking into a Catholic church — and that discomfort is not baseless: if what you are looking at really is worship offered to a creature, then your objection is right. This part answers exactly that question: what Catholics are actually doing when they ask a saint to pray for them, and how the Church distinguishes that from the worship due to God alone. One thing said plainly up front: what is covered here is intercession and images — the doctrines about Mary herself do not yet have answers on this site.',
    },
    anchors: ['tai-sao-cau-nguyen-voi-cac-thanh', 'nguoi-cong-giao-co-tho-nguong-tuong-khong'],
  },
];

/** The landing page's copy. Everything here is new writing — proofread it with the branch intros. */
export const CG_TL_LANDING = {
  eyebrow: {
    vi: 'Những câu hỏi giữa chúng ta',
    en: 'The questions between us',
  } satisfies Bi,

  // Do NOT presume the reader has a Catholic in their life. The spec's motivating use case is a
  // Catholic sending the link to a spouse or sibling, but plenty of readers arrive simply because
  // they want to know (owner, 2026-08-21) — and telling a curious reader why they are here, wrongly,
  // is exactly the kind of small misfire that makes someone stop reading. Both reasons are offered,
  // neither is asserted. Same correction applies to the root branch's intro below.
  lede: {
    vi: 'Nếu bạn là người Tin Lành và đang mở trang này — có thể vì ai đó thân với bạn là người Công giáo, có thể chỉ vì bạn muốn tự mình tìm hiểu — thì trang này được viết cho bạn. Không phải để thắng một cuộc tranh luận, mà để bạn nghe chính Hội Thánh Công giáo nói về mình, thay vì nghe lại qua lời người khác. Bạn có thể bắt đầu ở bất cứ câu hỏi nào bạn thật sự mang theo.',
    en: 'If you are a Protestant Christian and you have opened this page — perhaps because someone close to you is Catholic, perhaps simply because you want to find out for yourself — then this page is written for you. Not to win an argument, but so that you can hear what the Catholic Church says about itself, instead of hearing it second-hand. Start wherever the question you actually came with is.',
  } satisfies Bi,

  // The page opens on shared ground and MEANS it — not as a softener before the real business, but
  // because it is true and it is most of what we hold. Both Catechism citations were verified (see
  // the header note); they are here because "the Church you are reading about already calls you a
  // Christian and a brother" is the single most useful thing this page can tell a reader in its
  // first ten lines, and it is the Church's own text saying it, not the site's rhetoric.
  sharedGround: {
    kicker: { vi: 'Điều chúng ta cùng tin', en: 'What we hold together' } satisfies Bi,
    body: {
      vi: 'Trước khi nói tới chỗ khác nhau, xin nói cho rõ chỗ giống nhau — không phải nói cho có lệ, mà vì đó mới là phần lớn hơn. Chúng ta cùng tin một Thiên Chúa Ba Ngôi, cùng tuyên xưng đức tin của Kinh Tin Kính Nicêa, cùng tin Kinh Thánh là Lời Thiên Chúa được linh hứng, cùng tin Đức Giêsu Kitô đã chịu đóng đinh và đã sống lại thật. Và Hội Thánh Công giáo không coi bạn là người ngoài: Sách Giáo Lý dạy rằng những ai đã được công chính hóa nhờ đức tin trong bí tích Rửa Tội thì "có quyền mang danh Kitô hữu" và xứng đáng được nhìn nhận là anh em trong Chúa (GLHTCG 818), và chính bí tích Rửa Tội là mối dây liên kết mọi người đã được tái sinh nhờ bí tích ấy (GLHTCG 1271). Những khác biệt trong trang này là có thật, và không nhỏ. Nhưng chúng nằm bên trong một đức tin chung, chứ không phải giữa hai tôn giáo khác nhau.',
      en: 'Before saying where we differ, let us be clear about where we do not — not as a formality, but because that is the larger part. We believe together in one God, Father, Son and Holy Spirit; we confess together the faith of the Nicene Creed; we hold together that Scripture is the inspired word of God, and that Jesus Christ was crucified and truly rose. And the Catholic Church does not regard you as an outsider: the Catechism teaches that all who have been justified by faith in Baptism "have a right to be called Christians" and are rightly accepted as brothers in the Lord (GLHTCG 818), and that Baptism itself is the bond of unity among all who are reborn through it (GLHTCG 1271). The differences on this page are real, and they are not small. But they sit inside a shared faith — not between two different religions.',
    } satisfies Bi,
  },

  // The seam this page has to be honest about: the 58 answers were written for a Catholic
  // readership and sometimes refer to the reader in the third person ("anh em Tin Lành cho
  // rằng…"). Rewriting them for this surface was never an option — they are proofread content and
  // this path owns no answer text — so the page says so out loud instead. Naming the seam costs
  // nothing and buys the reader a reason to trust everything else on the page.
  honestNote: {
    kicker: { vi: 'Một điều nên nói trước', en: 'One thing worth saying first' } satisfies Bi,
    body: {
      vi: 'Những giải đáp trong trang này vốn được viết cho độc giả Công giáo, và chúng tôi không viết lại cho vừa tai bạn. Vì thế đôi khi bạn sẽ thấy mình được nhắc tới ở ngôi thứ ba. Chúng tôi để nguyên như vậy, vì bạn đáng được đọc đúng bản mà người Công giáo vẫn đọc, chứ không phải một bản đã làm dịu đi dành riêng cho bạn. Cũng chính vì thế, ở chỗ nào Hội Thánh có lỗi trong lịch sử, các bài ấy nói thẳng ra là có lỗi.',
      en: 'The answers on this page were written for a Catholic readership, and we have not rewritten them to suit you. So you will sometimes find yourself spoken about in the third person. We have left it that way, because you deserve to read the same text Catholics read, and not a softened version made for you. And for the same reason, where the Church has been at fault in its history, those answers say plainly that it was.',
    } satisfies Bi,
  },

  closing: {
    vi: 'Trang này không nói điều gì mới. Mọi câu trả lời ở đây đều đã có sẵn trong mục Giải Đáp — việc của trang này chỉ là gom chúng lại theo đúng những câu hỏi thường được đặt ra, và nói rõ mỗi phần đang bàn tới điều gì.',
    en: 'This page says nothing new. Every answer here already exists in the Giải Đáp section — all this page does is gather them under the questions people actually ask, and say what each part is about.',
  } satisfies Bi,
};

/** Meta description for the landing page — VI, plain text, no markup. */
export const CG_TL_DESCRIPTION =
  'Điều Hội Thánh Công giáo thật sự dạy về thẩm quyền, ơn cứu độ, các bí tích, Đức Mẹ và các thánh — viết cho bạn đọc Tin Lành, bắt đầu từ điều chúng ta cùng tin.';

/** Look up a branch by its URL segment. */
export function getBranchBySlug(slug: string): CgTlBranch | undefined {
  return CG_TL_BRANCHES.find((b) => b.slug === slug);
}
