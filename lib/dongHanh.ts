// "Đồng hành" — a guided, deterministic self-assessment (docs/roadmap.md, "Tier A — Guided flow").
//
// A visitor answers 2–3 questions ABOUT THEIR OWN SITUATION (not a question they submit for the
// owner). The answers walk a small decision tree (INTAKE) and land on a SITUATION — each situation
// carries hand-written, doctrinally-safe advice, a fitting Scripture reference, a "next step" link,
// and a mapping into the shared Q&A taxonomy (lib/giaiDapTaxonomy). `matchResources` uses that
// mapping to pull the best-fitting Q&As from the native content AND the councils, so the result
// page feels personal: the branch + the assembled resources are specific to what they told us.
//
// NO LLM: everything here is authored and reviewable. The advice never generates at runtime.

import type { Bi } from './giaiDapTaxonomy';
import type { EnrichedAnswer } from './bibleRefs';

export type { Bi };

/* ------------------------------------------------------------------ intake tree */

/** A choice on an intake step. Selecting it either branches to another step or resolves to a
 *  situation (the end of the flow). */
export interface Choice {
  id: string;
  label: Bi;
  hint?: Bi;
  goto: { step: string } | { situation: string };
}

export interface Step {
  id: string;
  question: Bi;
  intro?: Bi;
  choices: Choice[];
}

/** The whole tree, keyed by step id. `start` is the entry step. Most paths are 2 questions; the
 *  pastoral paths (suffering) resolve in 1, on purpose — fewer clicks for someone who is hurting. */
export const STEPS: Record<string, Step> = {
  start: {
    id: 'start',
    question: { vi: 'Điều gì đưa bạn đến đây hôm nay?', en: 'What brings you here today?' },
    intro: {
      vi: 'Chọn câu gần với bạn nhất. Không có câu trả lời đúng hay sai — đây chỉ là để tìm đúng điều bạn cần.',
      en: 'Pick whichever is closest to you. There are no right or wrong answers — this is just to find what fits you.',
    },
    choices: [
      {
        id: 'exploring',
        label: { vi: 'Tôi đang tìm hiểu về đức tin Công Giáo', en: "I'm exploring the Catholic faith" },
        goto: { step: 'exploring' },
      },
      {
        id: 'doubting',
        label: { vi: 'Tôi đang hoài nghi, thấy khó tin', en: 'I have doubts, I find it hard to believe' },
        goto: { step: 'doubting' },
      },
      {
        id: 'defending',
        label: {
          vi: 'Tôi muốn hiểu và trả lời những phản đối về đạo',
          en: 'I want to understand and answer objections to the faith',
        },
        goto: { step: 'defending' },
      },
      {
        id: 'loved-one',
        label: { vi: 'Tôi lo cho một người thân chưa tin', en: "I'm concerned for a loved one who doesn't believe" },
        goto: { step: 'loved-one' },
      },
      {
        id: 'suffering',
        label: { vi: 'Tôi đang trải qua đau khổ, mất mát', en: "I'm going through suffering or loss" },
        goto: { step: 'suffering-loss' },
      },
      {
        id: 'persecuted',
        label: { vi: 'Tôi bị ghét bỏ, bách hại vì đức tin', en: "I'm hated or persecuted for my faith" },
        goto: { step: 'persecuted' },
      },
    ],
  },

  exploring: {
    id: 'exploring',
    question: { vi: 'Bạn muốn bắt đầu từ đâu?', en: 'Where would you like to begin?' },
    choices: [
      {
        id: 'god',
        label: { vi: 'Thiên Chúa có thật không, và Ngài là ai?', en: 'Is God real, and who is he?' },
        goto: { situation: 'explore-god' },
      },
      {
        id: 'jesus-church',
        label: { vi: 'Chúa Giêsu và Hội Thánh Người lập', en: 'Jesus and the Church he founded' },
        goto: { situation: 'explore-jesus-church' },
      },
      {
        id: 'basics',
        label: { vi: 'Cứ cho tôi xem những câu hỏi thường gặp nhất', en: 'Just show me the most common questions' },
        goto: { situation: 'explore-basics' },
      },
    ],
  },

  doubting: {
    id: 'doubting',
    question: { vi: 'Điều gì khiến bạn hoài nghi nhất?', en: 'What makes you doubt the most?' },
    choices: [
      {
        id: 'science',
        label: { vi: 'Khoa học dường như mâu thuẫn với đức tin', en: 'Science seems to contradict faith' },
        goto: { situation: 'doubt-science' },
      },
      {
        id: 'evidence',
        label: { vi: 'Có bằng chứng nào cho thấy điều này là thật không?', en: 'Is there any evidence this is true?' },
        goto: { situation: 'doubt-evidence' },
      },
      {
        id: 'suffering',
        label: { vi: 'Nếu Chúa có thật, sao lại có quá nhiều đau khổ?', en: 'If God is real, why is there so much suffering?' },
        goto: { situation: 'doubt-suffering' },
      },
    ],
  },

  defending: {
    id: 'defending',
    question: { vi: 'Chủ đề nào bạn đang quan tâm?', en: 'Which topic are you asking about?' },
    choices: [
      {
        id: 'saints',
        label: { vi: 'Cầu nguyện với Đức Mẹ và các thánh', en: 'Praying to Mary and the saints' },
        goto: { situation: 'defend-saints' },
      },
      {
        id: 'faith-works',
        label: { vi: 'Đức tin, việc làm và ơn cứu độ', en: 'Faith, works, and salvation' },
        goto: { situation: 'defend-faith-works' },
      },
      {
        id: 'images',
        label: { vi: 'Ảnh tượng, tượng ảnh và việc tôn kính', en: 'Images, statues, and veneration' },
        goto: { situation: 'defend-images' },
      },
      {
        id: 'church',
        label: { vi: 'Hội Thánh, Giáo hoàng và thẩm quyền', en: 'The Church, the Pope, and authority' },
        goto: { situation: 'defend-church' },
      },
    ],
  },

  'loved-one': {
    id: 'loved-one',
    question: { vi: 'Người ấy là ai với bạn?', en: 'Who are they to you?' },
    choices: [
      {
        id: 'spouse',
        label: { vi: 'Vợ hoặc chồng tôi không cùng đức tin', en: "My spouse doesn't share the faith" },
        goto: { situation: 'loved-one-spouse' },
      },
      {
        id: 'family',
        label: { vi: 'Con cái hoặc người thân đã rời xa đạo', en: 'A child or relative has drifted from the faith' },
        goto: { situation: 'loved-one-family' },
      },
    ],
  },

  /* --- "Suffering or loss" deepening sub-tree (companion-pastoral-tree.md). Each step opens with a
     word of comfort (intro) before the fork; the priest off-ramp stays visible the whole way. --- */
  'suffering-loss': {
    id: 'suffering-loss',
    intro: {
      vi: 'Trước hết, xin được ở lại đây với bạn một chút. Bạn không bước đi một mình.',
      en: 'First, let us stay here with you for a moment. You do not walk alone.',
    },
    question: { vi: 'Nỗi đau nào đang ở gần bạn nhất lúc này?', en: 'What pain is closest to you right now?' },
    choices: [
      {
        id: 'self',
        label: { vi: 'Chính tôi đang chịu đau khổ', en: 'I myself am suffering' },
        goto: { step: 'suffering-self' },
      },
      {
        id: 'bereaved',
        label: { vi: 'Tôi vừa mất một người thân yêu', en: 'I have lost someone dear to me' },
        goto: { step: 'bereaved' },
      },
    ],
  },

  'suffering-self': {
    id: 'suffering-self',
    intro: {
      vi: 'Dù là điều gì, Thiên Chúa vẫn thấy rõ sức nặng riêng bạn đang mang.',
      en: 'Whatever it is, God sees the exact weight you are carrying.',
    },
    question: { vi: 'Điều gì đang đè nặng bạn nhất?', en: 'What weighs on you most?' },
    choices: [
      {
        id: 'health',
        label: { vi: 'Sức khỏe, bệnh tật', en: 'My health, illness' },
        goto: { situation: 's-health' },
      },
      {
        id: 'financial',
        label: { vi: 'Tiền bạc, thiếu thốn', en: 'Money, not having enough' },
        goto: { situation: 's-financial' },
      },
      {
        id: 'loneliness',
        label: { vi: 'Cô đơn', en: 'Loneliness' },
        goto: { step: 'loneliness' },
      },
      {
        id: 'worth',
        label: { vi: 'Cảm thấy mình chưa đủ, không xứng đáng', en: "Feeling I'm not enough, not worthy" },
        goto: { situation: 's-worth' },
      },
      {
        id: 'else',
        label: { vi: 'Một điều khác', en: 'Something else' },
        goto: { situation: 'suffering' },
      },
    ],
  },

  loneliness: {
    id: 'loneliness',
    intro: {
      vi: 'Cô đơn là một nỗi đau thật — và ngay cả Đức Kitô cũng đã nếm trải nó.',
      en: 'Loneliness is a real pain — and even Christ tasted it.',
    },
    question: { vi: 'Nỗi cô đơn ấy là…', en: 'That loneliness is…' },
    choices: [
      {
        id: 'human',
        label: { vi: 'Không có ai thật sự gần gũi', en: 'No one is truly close to me' },
        goto: { situation: 's-lonely-human' },
      },
      {
        id: 'god',
        label: { vi: 'Chúa như vắng mặt, im lặng', en: 'God feels absent, silent' },
        goto: { situation: 's-lonely-god' },
      },
    ],
  },

  bereaved: {
    id: 'bereaved',
    intro: {
      vi: 'Mất một người thân yêu là một trong những nỗi đau sâu nhất. Hội Thánh không vội kéo bạn ra khỏi nó.',
      en: 'Losing someone dear is among the deepest of human pains. The Church will not rush you out of it.',
    },
    question: { vi: 'Điều gì đang nặng nhất trong lòng bạn?', en: 'What is heaviest on your heart?' },
    choices: [
      {
        id: 'grief',
        label: { vi: 'Tôi đang đau, chưa biết đối diện', en: "I'm in pain and don't know how to face it" },
        goto: { situation: 's-grief' },
      },
      {
        id: 'saved',
        label: { vi: 'Tôi không chắc họ đã được cứu độ', en: "I'm not sure they were saved" },
        goto: { situation: 's-saved' },
      },
    ],
  },

  /* --- "Persecuted for my faith" — a NEW top-level path (the Vietnamese Martyrs' own story). --- */
  persecuted: {
    id: 'persecuted',
    intro: {
      vi: 'Chịu ghét bỏ vì đức tin là chính câu chuyện của các Thánh Tử Đạo Việt Nam. Bạn đứng trong một hàng dài chứng nhân.',
      en: 'To be hated for the faith is the very story of the Vietnamese Martyrs. You stand in a long line of witnesses.',
    },
    question: { vi: 'Ai đang chống lại bạn vì bạn theo Đức Kitô?', en: 'Who is turning against you for following Christ?' },
    choices: [
      {
        id: 'family',
        label: { vi: 'Gia đình, bạn thân', en: 'Family, close friends' },
        goto: { situation: 'p-family' },
      },
      {
        id: 'world',
        label: { vi: 'Người ngoài, xã hội', en: 'The world, society' },
        goto: { situation: 'p-world' },
      },
      {
        id: 'danger',
        label: { vi: 'Nguy hiểm đến tính mạng', en: 'My life is in danger' },
        goto: { situation: 'p-danger' },
      },
    ],
  },
};

export const START_STEP = 'start';

/* ------------------------------------------------------------------ situations */

export interface Situation {
  id: string;
  /** Warm headline for the result page. */
  title: Bi;
  /** One line naming their situation back to them ("You're here because…"). */
  lead: Bi;
  /** Hand-written advice/encouragement, 1–2 short paragraphs. Doctrinally safe, warm. */
  advice: Bi[];
  /** Broad taxonomy category ids to match (lib/giaiDapTaxonomy CATEGORIES). */
  categories: string[];
  /** Cross-cutting tag ids to match (lib/giaiDapTaxonomy TAGS). */
  tags: string[];
  /** A fitting Scripture line — a reference (VN abbreviation) plus a hand-written framing. The
   *  `gloss` is a paraphrase, never a verbatim quote, so no copyrighted verse text ships even
   *  when the popover flag is off. When the flag is on, `ref` becomes a clickable popover. */
  scripture: { ref: string; gloss: Bi };
  /** A concrete next step within the site. */
  nextStep: { href: string; label: Bi };
  /** Label shown above the matched resources ("Start with these"). Optional override. */
  resourcesLabel?: Bi;
  /** "Show me the common questions" path — surface the featured cluster anchors regardless of
   *  taxonomy. Only the explore-basics situation sets this; every other situation surfaces only
   *  genuinely-matching Q&As (and none when the site has no fitting content yet, resting on the
   *  hand-written advice instead of padding with off-topic answers). */
  showCommon?: boolean;
  /** Heavy / pastoral branches (suffering, doubting, an unbelieving loved one). When true, the
   *  companion keeps a gentle "talk to a priest / RCIA / your parish" off-ramp visible across the
   *  whole walk — some burdens are better carried with a person than a web page. */
  pastoral?: boolean;
  /** Resource keys to force to the top of THIS situation's matches, ahead of tag scoring — for
   *  curation the taxonomy can't reach (e.g. the authoritative council for a topic that ties with
   *  everything else, or a consoling piece pool order would bury). Optional; absent = pure tag
   *  scoring. Mirrors how `followUps` honours per-item `seed.pins`, bringing the anchor step to
   *  parity. Apply with the pastoral lens on grief paths: the advice stays primary, the pin is a
   *  gentle secondary. */
  seedPins?: string[];
  /** "Companions in suffering" — 1–2 saints who relied on God THROUGH their suffering, linking to
   *  their live /cac-thanh pages. HAND-CURATED, never tag-matched: pastoral tone is too important to
   *  leave to the matcher, and a tonally-wrong saint here does real harm. Only the two suffering
   *  situations carry this. `line` is the one-sentence reliance, SHOWN not told — presence →
   *  reliance → closeness, an invitation ("you can ask them to walk with you"), never "so should
   *  you." Sits alongside, never replaces, the priest off-ramp. See docs/content-guide.md
   *  "Pastoral tone". */
  companions?: { href: string; name: Bi; line: Bi }[];
}

export const SITUATIONS: Record<string, Situation> = {
  'explore-god': {
    id: 'explore-god',
    title: { vi: 'Bắt đầu với câu hỏi lớn nhất', en: 'Starting with the biggest question' },
    lead: {
      vi: 'Bạn đang tìm hiểu xem Thiên Chúa có thật không, và Ngài là ai.',
      en: "You're exploring whether God is real, and who he is.",
    },
    advice: [
      {
        vi: 'Đây là câu hỏi đáng để hỏi, và Hội Thánh không hề sợ nó. Đức tin Công Giáo tin rằng lý trí và đức tin không chống nhau: chính trật tự, vẻ đẹp và sự hiện hữu của vũ trụ đã là dấu chỉ mời gọi ta tìm đến Đấng Tạo Hóa. Bạn không cần “gạt lý trí sang một bên” để tin.',
        en: "This is a question worth asking, and the Church is not afraid of it. Catholic faith holds that reason and faith are not enemies: the order, beauty, and sheer existence of the universe are signs that point toward a Creator. You don't have to switch off your mind to believe.",
      },
      {
        vi: 'Hãy cứ đi từng bước. Bắt đầu bằng việc để cho câu hỏi được sống, đọc chậm rãi, và nếu có thể, trò chuyện với một người có đức tin mà bạn quý mến. Ơn tin là một quà tặng — ta xin, ta tìm, và Chúa không bỏ rơi người thành tâm tìm kiếm.',
        en: 'Take it one step at a time. Begin by letting the question breathe, reading slowly, and if you can, talking with a believer you respect. Faith is a gift — we ask, we seek, and God does not abandon anyone who searches sincerely.',
      },
    ],
    categories: ['god-meaning'],
    tags: ['atheism', 'science', 'trinity', 'miracles'],
    scripture: {
      ref: 'Rm 1,20',
      gloss: {
        vi: 'Thánh Phaolô nói rằng những gì Thiên Chúa dựng nên giúp ta nhận ra Ngài — trời đất như một lời mời.',
        en: 'St Paul says that what God has made helps us recognize him — creation itself is an invitation.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem mục Giải Đáp', en: 'Browse the Q&A' } },
  },

  'explore-jesus-church': {
    id: 'explore-jesus-church',
    title: { vi: 'Chúa Giêsu và Hội Thánh của Người', en: 'Jesus and his Church' },
    lead: {
      vi: 'Bạn muốn hiểu về Chúa Giêsu và Hội Thánh Người đã lập.',
      en: 'You want to understand Jesus and the Church he founded.',
    },
    advice: [
      {
        vi: 'Trung tâm của đức tin không phải là một hệ thống ý tưởng, mà là một Con Người: Chúa Giêsu Kitô. Người có thật trong lịch sử, đã chết và sống lại, và đã lập một Hội Thánh hữu hình để tiếp tục sứ mạng của Người qua các thời đại. Tìm hiểu Hội Thánh chính là tìm hiểu xem Người đã để lại gì cho chúng ta.',
        en: "The heart of the faith is not a system of ideas but a Person: Jesus Christ. He is real in history, died and rose, and founded a visible Church to continue his mission through the ages. To explore the Church is to explore what he left for us.",
      },
      {
        vi: 'Các Công Đồng của Hội Thánh — từ Nicêa đến nay — là nơi Hội Thánh gìn giữ và làm sáng tỏ đức tin ấy qua từng thế kỷ. Đó là một mạch truyền liên tục, không đứt đoạn, từ các Tông Đồ cho đến hôm nay.',
        en: 'The Councils of the Church — from Nicaea onward — are where the Church guarded and clarified that faith across the centuries. It is an unbroken line, from the Apostles down to today.',
      },
    ],
    categories: ['the-church', 'evidence-history'],
    // `authority` intentionally dropped: it's shared with defend-church and dragged medieval
    // papal-politics councils in front of an explorer (audit F2). Keep this path doctrinal.
    tags: ['jesus', 'church-history', 'trinity'],
    scripture: {
      ref: 'Mt 16,18',
      gloss: {
        vi: 'Chúa Giêsu nói Người sẽ xây Hội Thánh trên đá tảng, và cửa hỏa ngục sẽ không thắng được.',
        en: 'Jesus says he will build his Church on rock, and the gates of hell will not prevail against it.',
      },
    },
    nextStep: { href: '/cong-dong', label: { vi: 'Tìm hiểu các Công Đồng', en: 'Explore the Councils' } },
  },

  'explore-basics': {
    id: 'explore-basics',
    title: { vi: 'Những câu hỏi thường gặp nhất', en: 'The most common questions' },
    lead: {
      vi: 'Bạn muốn xem qua những thắc mắc mà nhiều người hay hỏi nhất.',
      en: 'You want to see the questions people ask most often.',
    },
    advice: [
      {
        vi: 'Cách tốt nhất để bắt đầu thường là đọc những câu trả lời ngắn, rõ ràng, có trích dẫn nguồn. Dưới đây là những chủ đề được hỏi nhiều nhất trên trang — bạn có thể đọc bất cứ câu nào khiến bạn tò mò, không cần theo thứ tự.',
        en: 'The best way to begin is often to read short, clear answers that cite their sources. Below are the topics asked about most on this site — read whichever one draws you, in any order.',
      },
    ],
    categories: [],
    tags: [],
    showCommon: true,
    scripture: {
      ref: '1 Pr 3,15',
      gloss: {
        vi: 'Thánh Phêrô khuyên hãy luôn sẵn sàng trả lời cho những ai hỏi về niềm hy vọng nơi bạn.',
        en: 'St Peter urges us to be always ready to give a reason for the hope that is in us.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Mở toàn bộ mục Giải Đáp', en: 'Open the full Q&A' } },
  },

  'doubt-science': {
    id: 'doubt-science',
    title: { vi: 'Khi khoa học và đức tin có vẻ va nhau', en: 'When science and faith seem to clash' },
    lead: {
      vi: 'Bạn cảm thấy khoa học khiến đức tin trở nên khó tin.',
      en: 'You feel that science makes faith hard to believe.',
    },
    advice: [
      {
        vi: 'Hội Thánh không coi khoa học là kẻ thù — trái lại. Nhiều nhà khoa học lớn là người tin, và chính một linh mục Công Giáo, cha Georges Lemaître, đã đề ra thuyết “Vụ Nổ Lớn”. Đức tin nói về việc “tại sao có gì đó thay vì không có gì”, và về ý nghĩa của sự sống; khoa học mô tả “bằng cách nào” các sự vật vận hành. Hai cách nhìn ấy trả lời hai câu hỏi khác nhau, nên không thật sự loại trừ nhau.',
        en: "The Church does not treat science as an enemy — quite the opposite. Many great scientists were believers, and it was a Catholic priest, Fr Georges Lemaître, who first proposed the Big Bang. Faith speaks to why there is something rather than nothing, and to the meaning of life; science describes how things work. They answer different questions, so they don't truly exclude each other.",
      },
      {
        vi: 'Nếu một điểm cụ thể đang làm bạn vướng mắc — nguồn gốc vũ trụ, tiến hóa, phép lạ — thì hãy nêu nó ra rõ ràng và tìm câu trả lời cẩn thận, thay vì để một cảm giác mơ hồ rằng “khoa học đã bác bỏ Chúa” quyết định thay bạn.',
        en: 'If a specific point is troubling you — the origin of the universe, evolution, miracles — name it clearly and look for a careful answer, rather than letting a vague sense that "science has disproved God" decide the matter for you.',
      },
    ],
    categories: ['god-meaning'],
    tags: ['science', 'atheism', 'evolution', 'miracles'],
    pastoral: true,
    scripture: {
      ref: 'Kn 11,20',
      gloss: {
        vi: 'Sách Khôn Ngoan ca ngợi Thiên Chúa đã sắp đặt mọi sự theo mức độ, số lượng và cân nặng — một vũ trụ có trật tự để ta khám phá.',
        en: 'The Book of Wisdom praises God for arranging all things by measure, number, and weight — an ordered universe for us to discover.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem mục Giải Đáp', en: 'Browse the Q&A' } },
  },

  'doubt-evidence': {
    id: 'doubt-evidence',
    title: { vi: 'Có bằng chứng nào không?', en: 'Is there any evidence?' },
    lead: {
      vi: 'Bạn muốn biết có bằng chứng thật cho những gì Kitô giáo tuyên xưng hay không.',
      en: 'You want to know whether there is real evidence for what Christianity claims.',
    },
    advice: [
      {
        vi: 'Kitô giáo là một tôn giáo lịch sử: nó đặt cược vào những biến cố có thật, nhất là cái chết và sự phục sinh của Chúa Giêsu. Đây không phải chuyện “nhắm mắt tin bừa”. Có những chứng cứ đáng để cân nhắc nghiêm túc — các thư của thánh Phaolô viết chỉ vài chục năm sau biến cố, lời chứng của những người sẵn sàng chết vì điều họ tận mắt thấy, và sự lan rộng nhanh chóng của Hội Thánh sơ khai.',
        en: "Christianity is a historical religion: it stakes itself on real events, above all the death and resurrection of Jesus. This is not blind belief. There is evidence worth taking seriously — Paul's letters written just decades after the events, the testimony of people willing to die for what they claimed to have seen, and the rapid spread of the early Church.",
      },
      {
        vi: 'Bằng chứng lịch sử không “ép buộc” đức tin như một phép tính, nhưng nó cho thấy tin là điều hợp lý. Hãy đọc và tự cân nhắc — sự thật không sợ những câu hỏi thẳng thắn.',
        en: "Historical evidence doesn't force faith the way a math proof does, but it shows that believing is reasonable. Read and weigh it yourself — the truth is not afraid of honest questions.",
      },
    ],
    categories: ['evidence-history'],
    tags: ['resurrection', 'church-history', 'bible', 'miracles', 'jesus'],
    pastoral: true,
    scripture: {
      ref: '1 Cr 15,3-4',
      gloss: {
        vi: 'Thánh Phaolô trao lại lời tuyên xưng cổ xưa nhất: Đức Kitô đã chết, được mai táng, và ngày thứ ba đã sống lại.',
        en: 'St Paul hands on the oldest creed: Christ died, was buried, and rose on the third day.',
      },
    },
    nextStep: { href: '/video', label: { vi: 'Xem video về bằng chứng', en: 'Watch the evidence videos' } },
  },

  'doubt-suffering': {
    id: 'doubt-suffering',
    title: { vi: 'Đau khổ và một Thiên Chúa nhân lành', en: 'Suffering and a good God' },
    lead: {
      vi: 'Đau khổ trên thế gian khiến bạn khó tin vào một Thiên Chúa yêu thương.',
      en: 'The suffering in the world makes it hard to believe in a loving God.',
    },
    advice: [
      {
        vi: 'Đây có lẽ là câu hỏi thành thật và nhức nhối nhất mà con người có thể hỏi, và Kitô giáo không trả lời bằng cách xem nhẹ đau khổ. Phần lớn sự dữ đến từ việc con người lạm dụng tự do — một tự do mà Thiên Chúa ban vì không có tự do thì cũng không có tình yêu thật. Nhưng câu trả lời sâu xa nhất của Kitô giáo không phải là một lời giải thích, mà là một Con Người: Thiên Chúa đã không đứng ngoài đau khổ, Người bước vào đó trên thập giá.',
        en: 'This may be the most honest and painful question a person can ask, and Christianity does not answer it by making light of suffering. Much evil comes from the human misuse of freedom — a freedom God gives because without it there is no real love. But Christianity\'s deepest answer is not an explanation but a Person: God did not stay outside our suffering, he entered it on the cross.',
      },
      {
        vi: 'Nếu nỗi đau này là của riêng bạn ngay lúc này, xin đừng mang nó một mình. Đọc có thể giúp phần nào, nhưng trò chuyện với một linh mục hay một người có đức tin mà bạn tin cậy còn quý hơn nhiều.',
        en: "If this pain is your own right now, please don't carry it alone. Reading can help, but talking with a priest or a trusted believer is worth far more.",
      },
    ],
    categories: [],
    // `free-will` keeps the theodicy answer (sao-chua-khong-tao…) reachable on this intellectual
    // path once Session 3 re-tags that piece off `suffering` (audit F1a) — the pastoral `suffering`
    // path below deliberately sheds it.
    tags: ['suffering', 'free-will'],
    pastoral: true,
    companions: [
      {
        href: '/cac-thanh/tu-dao-viet-nam',
        name: { vi: 'Các Thánh Tử Đạo Việt Nam', en: 'The Vietnamese Martyrs' },
        line: {
          vi: 'Hàng trăm ngàn tín hữu Việt Nam đã giữ vững lòng tin đến chết, tựa nương vào Chúa giữa cơn bách hại tối tăm nhất.',
          en: 'Hundreds of thousands of Vietnamese faithful held to their faith unto death, leaning on God through the darkest persecution.',
        },
      },
      {
        href: '/cac-thanh/teresa-calcutta',
        name: { vi: 'Thánh Têrêsa Calcutta', en: 'St Teresa of Calcutta' },
        line: {
          vi: 'Suốt nhiều năm cảm thấy Chúa như vắng bóng, Mẹ vẫn phục vụ người nghèo khổ và bám chặt lấy Người trong đêm tối nội tâm.',
          en: 'For years she felt God as absent, yet kept serving the poorest and held fast to him through a long interior darkness.',
        },
      },
    ],
    scripture: {
      ref: 'Rm 8,28',
      gloss: {
        vi: 'Thánh Phaolô tin rằng với những ai yêu mến Thiên Chúa, mọi sự — kể cả điều đau đớn — đều sinh ích cho họ.',
        en: 'St Paul trusts that for those who love God, all things — even painful ones — work together for good.',
      },
    },
    // Land on CCC 324 (the hope-forward answer — "Christ died and rose to conquer evil… God draws
    // good from evil"), not CCC 309 (the cold "why is there evil?" question at the article top).
    nextStep: {
      href: '/giao-ly/324#324',
      label: { vi: 'Giáo Lý: Đức Kitô và chiến thắng sự dữ', en: 'The Catechism: Christ conquers evil' },
    },
  },

  'defend-saints': {
    id: 'defend-saints',
    title: { vi: 'Đức Mẹ, các thánh và lời cầu nguyện', en: 'Mary, the saints, and prayer' },
    lead: {
      vi: 'Bạn muốn hiểu và trình bày việc cầu nguyện với Đức Mẹ và các thánh.',
      en: 'You want to understand and explain praying to Mary and the saints.',
    },
    advice: [
      {
        vi: 'Đây là một trong những điểm bị hiểu lầm nhiều nhất, và cũng là điểm dễ trình bày rõ nếu ta phân biệt đúng. Người Công Giáo không “thờ” các thánh — chỉ một mình Thiên Chúa được thờ phượng. Xin các thánh cầu nguyện cũng giống như nhờ một người bạn đạo đức cầu nguyện cho mình, chỉ khác là các thánh đang sống trọn vẹn trong Chúa. Đức Mẹ được tôn kính cách đặc biệt, nhưng vẫn là thụ tạo, và mọi vinh dự dành cho Mẹ đều quy về Chúa Con.',
        en: "This is one of the most misunderstood points — and one of the easiest to explain clearly once the right distinctions are made. Catholics do not worship the saints; God alone is worshipped. Asking a saint to pray for you is like asking a holy friend to pray for you, except that the saints are fully alive in God. Mary is honored in a special way, but she remains a creature, and every honor given to her points back to her Son.",
      },
      {
        vi: 'Giữ giọng điệu ôn hòa và bác ái khi trình bày — mục đích là làm sáng tỏ, không phải để thắng một cuộc tranh luận. Những câu trả lời dưới đây theo đúng tinh thần đó.',
        en: 'Keep a gentle, charitable tone — the goal is to clarify, not to win an argument. The answers below are written in exactly that spirit.',
      },
    ],
    categories: ['mary-saints'],
    tags: ['saints', 'prayer', 'mary'],
    scripture: {
      ref: 'Gc 5,16',
      gloss: {
        vi: 'Thánh Giacôbê dạy rằng lời cầu nguyện của người công chính có sức mạnh lớn lao.',
        en: 'St James teaches that the prayer of a righteous person has great power.',
      },
    },
    nextStep: {
      href: '/giai-dap/tai-sao-cau-nguyen-voi-cac-thanh',
      label: { vi: 'Đọc bài: Tại sao cầu nguyện với các thánh', en: 'Read: Why pray to the saints' },
    },
  },

  'defend-faith-works': {
    id: 'defend-faith-works',
    title: { vi: 'Đức tin, việc làm và ơn cứu độ', en: 'Faith, works, and salvation' },
    lead: {
      vi: 'Bạn muốn hiểu điều Hội Thánh dạy về việc được cứu độ nhờ đức tin và việc làm.',
      en: 'You want to understand what the Church teaches about being saved by faith and works.',
    },
    advice: [
      {
        vi: 'Câu hỏi “chỉ cần đức tin, hay cần cả việc làm?” thường bắt nguồn từ một sự hiểu lầm về từ ngữ. Hội Thánh dạy rằng ơn cứu độ hoàn toàn là ân sủng nhưng không của Thiên Chúa — ta không thể “tự mua” nó. Đồng thời, đức tin thật luôn sống động và sinh hoa trái trong tình yêu; một đức tin không hề đổi đời sống thì thánh Giacôbê gọi là đức tin “chết”. Ân sủng đến trước, và việc lành là hoa trái của ân sủng, chứ không phải cái giá ta trả.',
        en: 'The question "faith alone, or faith and works?" usually comes from a misunderstanding of terms. The Church teaches that salvation is entirely God\'s free grace — we cannot buy it. At the same time, real faith is always alive and bears fruit in love; a faith that changes nothing in one\'s life is what St James calls "dead." Grace comes first, and good works are the fruit of grace, not a price we pay.',
      },
      {
        vi: 'Các câu trả lời dưới đây đi qua những đoạn Kinh Thánh thường được nêu ra và cho thấy chúng ăn khớp với nhau ra sao.',
        en: 'The answers below walk through the Scripture passages most often raised and show how they fit together.',
      },
    ],
    categories: [],
    tags: ['faith', 'works', 'salvation', 'grace'],
    scripture: {
      ref: 'Gc 2,17',
      gloss: {
        vi: 'Thánh Giacôbê nói đức tin không có việc làm là đức tin chết.',
        en: 'St James says that faith without works is dead.',
      },
    },
    nextStep: {
      href: '/giai-dap/duc-tin-va-viec-lam',
      label: { vi: 'Đọc bài: Đức tin và việc làm', en: 'Read: Faith and works' },
    },
  },

  'defend-images': {
    id: 'defend-images',
    title: { vi: 'Ảnh tượng và việc tôn kính', en: 'Images and veneration' },
    lead: {
      vi: 'Bạn muốn trả lời thắc mắc về tượng ảnh trong nhà thờ Công Giáo.',
      en: 'You want to answer questions about statues and images in Catholic churches.',
    },
    advice: [
      {
        vi: 'Điều răn cấm tạc tượng để thờ ngẫu tượng — chứ không cấm mọi hình ảnh. Chính Thiên Chúa đã truyền làm hai tượng thần hộ giá (Kêrubim) trên Hòm Bia và con rắn đồng. Người Công Giáo tôn kính điều mà ảnh tượng nhắc nhớ — Chúa, Đức Mẹ, các thánh — chứ không thờ gỗ đá. Một tấm ảnh gia đình giúp ta nhớ đến người thân; ảnh tượng thánh cũng nâng lòng ta lên với các thực tại thánh thiêng.',
        en: 'The commandment forbids carving idols to worship — not every image. God himself commanded the two cherubim over the Ark and the bronze serpent. Catholics venerate what an image points to — the Lord, Mary, the saints — not the wood or stone. A family photo helps us remember loved ones; sacred images likewise lift our hearts to holy realities.',
      },
      {
        vi: 'Những câu trả lời dưới đây làm rõ sự khác biệt giữa tôn kính và thờ phượng, và trả lời các phản đối thường gặp một cách ôn hòa.',
        en: 'The answers below clarify the difference between veneration and worship, and address the common objections gently.',
      },
    ],
    categories: [],
    tags: ['icons'],
    // Every icon Q&A ties at one tag, so pool order buries the council that actually DEFINED icon
    // veneration. Pin it to the top (audit F3).
    seedPins: ['c:nicaea-ii-hoi-1'],
    scripture: {
      ref: 'Xh 25,18',
      gloss: {
        vi: 'Chính Thiên Chúa truyền cho ông Môsê làm hai tượng thần hộ giá bằng vàng trên nắp Hòm Bia.',
        en: 'God himself commands Moses to make two golden cherubim over the cover of the Ark.',
      },
    },
    nextStep: {
      href: '/giai-dap/nguoi-cong-giao-co-tho-nguong-tuong-khong',
      label: { vi: 'Đọc bài: Người Công Giáo có thờ ngẫu tượng không?', en: 'Read: Do Catholics worship idols?' },
    },
  },

  'defend-church': {
    id: 'defend-church',
    title: { vi: 'Hội Thánh, Giáo hoàng và thẩm quyền', en: 'The Church, the Pope, and authority' },
    lead: {
      vi: 'Bạn muốn hiểu về thẩm quyền của Hội Thánh và của Giáo hoàng.',
      en: 'You want to understand the authority of the Church and the Pope.',
    },
    advice: [
      {
        vi: 'Chúa Giêsu không để lại một cuốn sách rồi thôi — Người lập một Hội Thánh, trao cho thánh Phêrô và các Tông Đồ quyền dạy dỗ nhân danh Người. Nhờ đó đức tin được gìn giữ nguyên vẹn qua các thế kỷ. Các Công Đồng chung — nơi các giám mục hiệp nhất với Giáo hoàng — là cách Hội Thánh phân định những vấn đề lớn và tuyên xưng đức tin, từ Nicêa cho đến Vaticanô II.',
        en: 'Jesus did not leave a book and nothing more — he founded a Church, giving Peter and the Apostles authority to teach in his name. Through it the faith has been kept intact across the centuries. The ecumenical Councils — where the bishops in union with the Pope decide the great questions — are how the Church discerns and professes the faith, from Nicaea to Vatican II.',
      },
      {
        vi: 'Các câu trả lời dưới đây rút từ chính lịch sử các Công Đồng, cho thấy thẩm quyền ấy đã hoạt động thế nào trong thực tế.',
        en: 'The answers below are drawn from the history of the Councils themselves, showing how that authority actually worked.',
      },
    ],
    categories: ['the-church'],
    tags: ['authority', 'papacy', 'church-history'],
    scripture: {
      ref: 'Mt 16,18-19',
      gloss: {
        vi: 'Chúa Giêsu trao cho thánh Phêrô chìa khóa Nước Trời và đặt ông làm đá tảng của Hội Thánh.',
        en: 'Jesus gives Peter the keys of the kingdom and makes him the rock of the Church.',
      },
    },
    nextStep: { href: '/cong-dong', label: { vi: 'Tìm hiểu các Công Đồng', en: 'Explore the Councils' } },
  },

  'loved-one-spouse': {
    id: 'loved-one-spouse',
    title: { vi: 'Khi bạn đời chưa cùng đức tin', en: 'When your spouse does not share the faith' },
    lead: {
      vi: 'Bạn mong ước vợ hoặc chồng mình cũng chia sẻ đức tin.',
      en: 'You long for your spouse to share the faith with you.',
    },
    advice: [
      {
        vi: 'Nỗi khắc khoải này là dấu chỉ của tình yêu, và Hội Thánh nhìn hôn nhân khác biệt tôn giáo với nhiều hy vọng. Thánh Phêrô và thánh Phaolô đều nói rằng một người phối ngẫu có thể được “thánh hóa” và cảm hóa không phải bằng tranh luận, mà bằng một đời sống dịu dàng, kiên nhẫn và tràn đầy an bình. Chứng tá âm thầm của bạn thường có sức mạnh hơn mọi lời lẽ.',
        en: 'This ache is a sign of love, and the Church views interfaith marriage with real hope. Both St Peter and St Paul say a spouse can be "sanctified" and won over not by argument but by a gentle, patient, peace-filled life. Your quiet witness is often more powerful than any words.',
      },
      {
        vi: 'Đừng ép buộc hay biến đức tin thành chiến trường trong nhà. Hãy cầu nguyện đều đặn cho người ấy, sống đức tin của bạn cách vui tươi, và tin tưởng vào thời gian của Chúa. Nếu thấy nặng lòng, một linh mục có thể đồng hành và cầu nguyện cùng bạn.',
        en: "Don't force it or turn faith into a battleground at home. Pray for them steadily, live your own faith joyfully, and trust God's timing. If it weighs on you, a priest can walk with you and pray alongside you.",
      },
    ],
    categories: ['morality-life'],
    tags: ['marriage'],
    pastoral: true,
    scripture: {
      ref: '1 Cr 7,14',
      gloss: {
        vi: 'Thánh Phaolô nói người chồng hay vợ không tin được thánh hóa nhờ người phối ngẫu có đức tin.',
        en: 'St Paul says the unbelieving spouse is made holy through the believing one.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem mục Giải Đáp', en: 'Browse the Q&A' } },
  },

  'loved-one-family': {
    id: 'loved-one-family',
    title: { vi: 'Khi người thân rời xa đức tin', en: 'When a loved one drifts from the faith' },
    lead: {
      vi: 'Bạn lo cho con cái hay người thân đã xa rời đạo.',
      en: 'You are concerned for a child or relative who has drifted from the faith.',
    },
    advice: [
      {
        vi: 'Rất nhiều bậc cha mẹ và người thân mang nỗi lo này — bạn không cô đơn. Dụ ngôn người cha nhân hậu nhắc ta rằng Thiên Chúa yêu thương người con lạc lối còn hơn ta yêu, và Người vẫn đứng đợi. Điều bạn làm được không phải là kiểm soát chọn lựa của họ, mà là giữ cho cánh cửa luôn mở: yêu thương vô điều kiện, không cằn nhằn, và âm thầm cầu nguyện.',
        en: "So many parents and relatives carry this worry — you are not alone. The parable of the merciful father reminds us that God loves the lost child even more than we do, and he keeps watch for them. What you can do is not to control their choices but to keep the door open: love unconditionally, without nagging, and pray quietly.",
      },
      {
        vi: 'Thánh Mônica đã cầu nguyện và khóc cho con trai mình, Âutinh, suốt nhiều năm trước khi ông trở lại và thành một vị đại thánh. Hạt giống đức tin bạn đã gieo không mất đi. Hãy kiên nhẫn, hãy hy vọng, và nếu cần, xin một linh mục cùng cầu nguyện với bạn.',
        en: 'St Monica prayed and wept for her son Augustine for many years before he returned and became a great saint. The seed of faith you planted is not lost. Be patient, keep hope, and if you need it, ask a priest to pray with you.',
      },
    ],
    categories: ['morality-life'],
    tags: [],
    pastoral: true,
    scripture: {
      ref: 'Lc 15,20',
      gloss: {
        vi: 'Trong dụ ngôn, người cha thấy con từ đàng xa đã chạnh lòng thương, chạy ra ôm lấy con.',
        en: 'In the parable, the father sees his son far off, is moved with compassion, and runs to embrace him.',
      },
    },
    nextStep: { href: '/giao-phu', label: { vi: 'Đọc các Giáo Phụ', en: 'Read the Church Fathers' } },
  },

  suffering: {
    id: 'suffering',
    title: { vi: 'Bạn không bước đi một mình', en: 'You do not walk alone' },
    lead: {
      vi: 'Bạn đang trải qua đau khổ hoặc mất mát.',
      en: 'You are going through suffering or loss.',
    },
    advice: [
      {
        vi: 'Trước hết: xin được chia sẻ với bạn lúc này. Đức tin không hứa rằng người tin sẽ không bao giờ đau, nhưng hứa rằng ta không phải chịu đau một mình. Chúa Giêsu đã tự mình đi qua phản bội, cô đơn và cái chết — nên không có bóng tối nào của bạn mà Người chưa từng bước vào. Người ở với bạn ngay trong lúc này, đặc biệt khi bạn cảm thấy trống rỗng nhất.',
        en: "First: I'm sorry for what you are carrying right now. Faith does not promise that believers will never hurt, but it promises we do not hurt alone. Jesus himself passed through betrayal, loneliness, and death — so there is no darkness of yours he has not already entered. He is with you in this very moment, especially when you feel most empty.",
      },
      {
        vi: 'Bạn không cần phải có lời cầu nguyện “cho đúng”, cũng không cần cảm thấy mạnh mẽ. Chỉ cần thưa với Chúa điều đang có trong lòng bạn, dù đó là giận dữ hay im lặng. Nương tựa vào Người trong lúc tối tăm không làm bạn yếu đi — đó thường lại là nơi người ta gặp được Người gần gũi hơn cả. Và xin đừng mang gánh nặng này một mình — hãy tìm đến một linh mục, hay một người bạn tin cậy, để có người cùng đi với bạn.',
        en: "You don't need the 'right' prayer, and you don't need to feel strong. Just tell God what is actually in your heart, even if it is anger or silence. Leaning on him in the dark doesn't make you weaker — it's often the very place people come to know him more closely. And please don't carry this alone — reach out to a priest, or a friend you trust, so that someone walks with you.",
      },
    ],
    categories: [],
    tags: ['suffering'],
    pastoral: true,
    // The one grief pin that survived the pastoral-tone confirm-pass (Good-Thief/atonement pins
    // dropped as too instructional). "Why the cross" closes present-first — God entered our
    // suffering out of love. The hand-written advice above stays primary; this is a gentle second.
    seedPins: ['n:tai-sao-chua-giesu-chiu-dong-dinh'],
    companions: [
      {
        href: '/cac-thanh/carlo-acutis',
        name: { vi: 'Thánh Carlo Acutis', en: 'St Carlo Acutis' },
        line: {
          vi: 'Một thiếu niên thời nay, đã dâng căn bệnh ung thư máu của mình cho Chúa trong bình an, tin cậy Người đến cùng.',
          en: 'A teenager of our own day, who offered his leukemia to God in peace, trusting him to the very end.',
        },
      },
      {
        href: '/cac-thanh/therese-lisieux',
        name: { vi: 'Thánh Têrêsa Hài Đồng Giêsu', en: 'St Thérèse of Lisieux' },
        line: {
          vi: 'Qua bệnh tật và những đêm tối của lòng tin, thánh nữ chọn “con đường nhỏ”: phó thác trọn vẹn như một trẻ thơ trong vòng tay Cha.',
          en: 'Through illness and dark nights of faith, she chose her “little way”: entrusting herself completely, like a child in her Father’s arms.',
        },
      },
    ],
    scripture: {
      ref: 'Mt 11,28',
      gloss: {
        vi: 'Chúa Giêsu mời gọi: hãy đến với Ta, hỡi những ai đang vất vả mang gánh nặng, Ta sẽ cho nghỉ ngơi.',
        en: 'Jesus invites: come to me, all who labor and are burdened, and I will give you rest.',
      },
    },
    // Land on CCC 1505 ("Moved by our suffering, Christ made it his own" — mirrors this situation's
    // advice, "God entered your darkness"), not CCC 1500 (the cold "illness is a grave problem" top).
    nextStep: {
      href: '/giao-ly/1505#1505',
      label: { vi: 'Giáo Lý: Đức Kitô mang lấy đau khổ của ta', en: 'The Catechism: Christ took our suffering' },
    },
  },

  /* --- Deepened suffering/loss leaves + the persecution leaves (companion-pastoral-tree.md). Each
     holds a short present-first lead and routes to its hand-authored, tagged Q&A via seedPins — the
     Q&A carries the substance (shown in the inline reading view + its own consolation-tag follow-ups).
     tags:[] on purpose: these are HAND-CURATED, never tag-matched. pastoral:true keeps the priest
     off-ramp visible on every step. --- */
  's-health': {
    id: 's-health',
    title: { vi: 'Khi thân xác yếu đau', en: 'When the body is weak' },
    lead: { vi: 'Bạn đang mang bệnh tật, đau ốm.', en: 'You are carrying illness or physical pain.' },
    advice: [
      {
        vi: 'Bệnh tật có thể khiến ta thấy yếu đuối, sợ hãi và cô đơn — nhưng bạn không đối diện với điều đó một mình. Đức Kitô không đứng xa giường bệnh của bạn; chính Người đã mang lấy những bệnh tật và đau yếu của chúng ta.',
        en: 'Illness can make us feel weak, afraid, and alone — but you do not face it by yourself. Christ does not stand far from your sickbed; he himself took up our infirmities and bore our diseases.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:dau-om-benh-tat'],
    companions: [
      {
        href: '/cac-thanh/carlo-acutis',
        name: { vi: 'Thánh Carlo Acutis', en: 'St Carlo Acutis' },
        line: {
          vi: 'Một thiếu niên thời nay đã dâng căn bệnh ung thư máu của mình cho Chúa trong bình an.',
          en: 'A teenager of our own day who offered his leukemia to God in peace.',
        },
      },
      {
        href: '/cac-thanh/bernadette-soubirous',
        name: { vi: 'Thánh Bernadette', en: 'St Bernadette' },
        line: {
          vi: 'Mang bệnh tật lâu năm, thánh nữ vẫn phó thác đời mình trong tay Chúa cho đến cùng.',
          en: 'Chronically ill for years, she entrusted her life into God’s hands to the very end.',
        },
      },
    ],
    scripture: {
      ref: 'Mt 8,17',
      gloss: {
        vi: 'Thánh Mátthêu nói về Đức Giêsu: chính Người đã gánh lấy những bệnh tật và đau yếu của chúng ta.',
        en: 'Matthew says of Jesus: he himself took up our infirmities and carried our diseases.',
      },
    },
    nextStep: {
      href: '/giao-ly/1505#1505',
      label: { vi: 'Giáo Lý: Đức Kitô mang lấy đau khổ của ta', en: 'The Catechism: Christ took our suffering' },
    },
  },

  's-financial': {
    id: 's-financial',
    title: { vi: 'Khi lo lắng về cơm áo', en: 'When money worries weigh' },
    lead: { vi: 'Bạn đang lo lắng về tiền bạc, về sự thiếu thốn.', en: "You're anxious about money, about not having enough." },
    advice: [
      {
        vi: 'Lo lắng về cơm áo là một gánh nặng thật, và bạn không có gì phải xấu hổ vì nó. Đức Kitô hiểu gánh nặng này từ bên trong — Người sinh ra trong cảnh nghèo — và giá trị của bạn trước mặt Thiên Chúa không hề đo bằng những gì bạn có.',
        en: "Worrying about daily needs is a real burden, and there's no shame in it. Christ knows this weight from the inside — he was born into poverty — and your worth before God is never measured by what you own.",
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:lo-lang-tien-bac'],
    scripture: {
      ref: 'Mt 6,26',
      gloss: {
        vi: 'Chúa Giêsu nhắc: Cha trên trời nuôi cả chim trời — anh em còn quý giá hơn nhiều.',
        en: 'Jesus reminds us: your heavenly Father feeds the birds of the air — and you are worth far more than they.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem thêm trong mục Giải Đáp', en: 'Browse more in the Q&A' } },
  },

  's-lonely-human': {
    id: 's-lonely-human',
    title: { vi: 'Khi không có ai gần bên', en: 'When no one is near' },
    lead: { vi: 'Bạn cảm thấy cô đơn, không có ai thật sự gần gũi.', en: 'You feel alone, with no one truly close to you.' },
    advice: [
      {
        vi: 'Cô đơn là một nỗi đau thật, và ngay cả Đức Kitô cũng đã nếm trải nó. Nhưng bạn không bao giờ thật sự một mình: Người hứa ở cùng bạn mọi ngày, và Người đặt bạn vào một gia đình trải dài từ đất đến trời.',
        en: 'Loneliness is a real pain, and even Christ tasted it. Yet you are never truly alone: he promises to be with you always, and he places you within a family that stretches from earth to heaven.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:co-don-khong-ai-gan-gui'],
    scripture: {
      ref: 'Mt 28,20',
      gloss: {
        vi: 'Lời hứa cuối cùng của Chúa Giêsu: “Thầy ở cùng anh em mọi ngày cho đến tận thế.”',
        en: 'Jesus’ closing promise: “I am with you always, to the end of the age.”',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem thêm trong mục Giải Đáp', en: 'Browse more in the Q&A' } },
  },

  's-lonely-god': {
    id: 's-lonely-god',
    title: { vi: 'Khi Chúa như im lặng', en: 'When God seems silent' },
    lead: { vi: 'Bạn cầu nguyện nhưng thấy Chúa như vắng mặt, im lặng.', en: 'You pray, but God feels absent, silent.' },
    advice: [
      {
        vi: 'Cảm thấy Chúa xa cách không phải là một thất bại của đức tin — nhiều vị thánh lớn nhất đã đi qua chính bóng tối ấy. Đôi khi Người dường như im lặng không phải vì vắng mặt, mà vì đang mời bạn yêu mến Người vì chính Người.',
        en: 'Feeling God is distant is not a failure of faith — some of the greatest saints walked through that same darkness. Sometimes he seems silent not because he is absent, but because he is inviting you to love him for his own sake.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:co-don-chua-nhu-vang-mat'],
    companions: [
      {
        href: '/cac-thanh/teresa-calcutta',
        name: { vi: 'Thánh Têrêsa Calcutta', en: 'St Teresa of Calcutta' },
        line: {
          vi: 'Suốt nhiều năm cảm thấy Chúa như vắng bóng, Mẹ vẫn phục vụ và bám chặt lấy Người trong đêm tối nội tâm.',
          en: 'For years she felt God as absent, yet kept serving and held fast to him through an interior darkness.',
        },
      },
    ],
    scripture: {
      ref: 'Mc 15,34',
      gloss: {
        vi: 'Chính Đức Kitô trên thập giá đã kêu lên: “Lạy Thiên Chúa của con, sao Ngài bỏ con?” — Người thấu hiểu tiếng kêu ấy từ bên trong.',
        en: 'Christ himself cried from the cross, “My God, why have you forsaken me?” — he knows that cry from the inside.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem thêm trong mục Giải Đáp', en: 'Browse more in the Q&A' } },
  },

  's-worth': {
    id: 's-worth',
    title: { vi: 'Khi thấy mình chưa đủ', en: 'When you feel not enough' },
    lead: { vi: 'Bạn luôn cảm thấy mình chưa đủ, không xứng đáng được yêu.', en: 'You keep feeling you are not enough, not worthy of love.' },
    advice: [
      {
        vi: 'Cảm giác “mình chưa đủ” thường bắt nguồn từ những vết thương thật — và nó xứng đáng được lắng nghe. Nhưng sự thật đi trước mọi thành tích của bạn: bạn được dựng nên theo hình ảnh Thiên Chúa, và Người đã yêu bạn trước cả khi bạn làm được điều gì.',
        en: 'The sense of “not being enough” often grows from real wounds — and it deserves to be heard. But the truth runs deeper than anything you achieve: you are made in God’s image, and he loved you before you had done anything at all.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:toi-cam-thay-minh-chua-du'],
    scripture: {
      ref: 'Tv 139,13',
      gloss: {
        vi: 'Tác giả Thánh Vịnh thưa với Chúa: chính Ngài đã dệt nên con trong lòng mẹ — bạn không phải là một tình cờ.',
        en: 'The Psalmist tells God: you knit me together in my mother’s womb — you are no accident.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem thêm trong mục Giải Đáp', en: 'Browse more in the Q&A' } },
  },

  's-grief': {
    id: 's-grief',
    title: { vi: 'Khi vừa mất một người thân yêu', en: 'When you have lost someone dear' },
    lead: { vi: 'Bạn vừa mất một người thân yêu và đang mang nỗi đau ấy.', en: 'You have just lost someone dear, and you carry that grief.' },
    advice: [
      {
        vi: 'Nỗi buồn của bạn chính là dấu chứng của tình yêu — và tình yêu ấy không mất đi. Chính Chúa Giêsu đã khóc bên mộ người bạn của Người; Thiên Chúa không đứng ngoài nước mắt của bạn, Người bước vào đó. Đức Maria cũng đã đứng dưới chân thập giá, nhìn Con mình chết — Mẹ hiểu nỗi đau này.',
        en: 'Your sorrow is itself a sign of love — and that love is not lost. Jesus himself wept at the tomb of his friend; God does not stand outside your tears, he enters them. Mary too stood at the foot of the cross, watching her Son die — she understands this pain.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:doi-dien-voi-mat-mat'],
    scripture: {
      ref: 'Kh 21,4',
      gloss: {
        vi: 'Sách Khải Huyền hứa một ngày Thiên Chúa sẽ lau sạch mọi giọt nước mắt, và sự chết sẽ không còn nữa.',
        en: 'Revelation promises a day when God will wipe away every tear, and death shall be no more.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem thêm trong mục Giải Đáp', en: 'Browse more in the Q&A' } },
  },

  's-saved': {
    id: 's-saved',
    title: { vi: 'Họ có được cứu độ không?', en: 'Were they saved?' },
    lead: {
      vi: 'Bạn không chắc người thân đã khuất của mình có được cứu độ.',
      en: "You're unsure whether your loved one who died was saved.",
    },
    advice: [
      {
        vi: 'Đây là một trong những câu hỏi nặng nề nhất một trái tim đang tang chế có thể mang — và chính việc bạn hỏi đã là một hành vi của tình yêu. Chúng ta không tuyên bố số phận của ai; chúng ta phó thác người ấy cho lòng thương xót của Thiên Chúa, một lòng thương xót rộng lớn hơn ta có thể đo lường.',
        en: 'This is one of the heaviest questions a grieving heart can carry — and the very asking of it is an act of love. We do not pronounce anyone’s fate; we entrust them to the mercy of God, a mercy wider than we can measure.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:nguoi-than-qua-doi-duoc-cuu-khong'],
    scripture: {
      ref: '1 Tm 2,4',
      gloss: {
        vi: 'Thánh Phaolô nhắc: Thiên Chúa muốn cho mọi người được cứu độ — nên ta được phép hy vọng.',
        en: 'St Paul reminds us: God desires everyone to be saved — so we are free to hope.',
      },
    },
    nextStep: {
      href: '/giao-ly/847#847',
      label: { vi: 'Giáo Lý: lòng thương xót và ơn cứu độ', en: 'The Catechism: mercy and salvation' },
    },
  },

  'p-family': {
    id: 'p-family',
    title: { vi: 'Khi chính người nhà chống đối', en: 'When your own family turns against you' },
    lead: {
      vi: 'Chính người thân, bạn bè chống đối hay chế giễu bạn vì đức tin.',
      en: 'Your own family or friends oppose or mock you for your faith.',
    },
    advice: [
      {
        vi: 'Bị chính những người mình yêu thương quay lưng vì đức tin là một nỗi đau riêng, sâu và khó. Đức Giêsu đã báo trước chính vết thương này — nên sự chia rẽ bạn đang cảm nhận không phải là dấu chỉ bạn làm sai. Nhưng nó không bao giờ cho phép ta lấy lạnh lùng đáp lại lạnh lùng.',
        en: 'To be turned on by the very people you love, because of the faith, is a particular and deep pain. Jesus foretold this very wound — so the division you feel is not a sign that you have done wrong. Yet it never permits us to answer coldness with coldness.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:bi-nguoi-nha-chong-doi-vi-duc-tin'],
    scripture: {
      ref: 'Mt 10,34-36',
      gloss: {
        vi: 'Chúa Giêsu nói trước rằng theo Người đôi khi sẽ gây chia rẽ ngay trong nhà — không phải để cổ vũ chia rẽ, mà để bạn khỏi ngỡ ngàng.',
        en: 'Jesus foretells that following him can bring division even at home — not to encourage it, but so it will not take you by surprise.',
      },
    },
    nextStep: { href: '/giai-dap', label: { vi: 'Xem thêm trong mục Giải Đáp', en: 'Browse more in the Q&A' } },
  },

  'p-world': {
    id: 'p-world',
    title: { vi: 'Khi thế gian ghét bỏ', en: 'When the world hates you' },
    lead: {
      vi: 'Người ngoài, xã hội chế giễu hay ghét bỏ bạn vì bạn tin Chúa.',
      en: 'The world around you mocks or resents you for believing.',
    },
    advice: [
      {
        vi: 'Bị thế gian coi thường vì đức tin có thể khiến ta thấy lạc lõng — nhưng Đức Kitô đã nói trước điều này, và Người gọi đó là một dấu chỉ: “Nếu thế gian ghét anh em, hãy biết rằng nó đã ghét Thầy trước.” Bạn đang được kể vào hàng ngũ với chính Người.',
        en: 'Being looked down on by the world for the faith can leave us feeling out of place — but Christ foretold this, and he calls it a sign: “If the world hates you, know that it hated me first.” You are being counted in his own company.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:the-gian-ghet-bo-vi-duc-tin'],
    companions: [
      {
        href: '/cac-thanh/tu-dao-viet-nam',
        name: { vi: 'Các Thánh Tử Đạo Việt Nam', en: 'The Vietnamese Martyrs' },
        line: {
          vi: 'Hàng trăm ngàn tín hữu Việt Nam đã chịu ruồng bỏ và cái chết mà vẫn giữ vững lòng tin, tựa nương vào Chúa.',
          en: 'Hundreds of thousands of Vietnamese faithful endured rejection and death yet held their faith, leaning on God.',
        },
      },
      {
        href: '/cac-thanh/maximilian-kolbe',
        name: { vi: 'Thánh Maximilianô Kolbe', en: 'St Maximilian Kolbe' },
        line: {
          vi: 'Trong trại Auschwitz, ngài đã tự nguyện chết thay cho một người xa lạ — tình yêu mạnh hơn cả sợ hãi.',
          en: 'In Auschwitz he freely gave his life in place of a stranger — love stronger than fear.',
        },
      },
    ],
    scripture: {
      ref: 'Ga 15,18',
      gloss: {
        vi: 'Chúa Giêsu nói: nếu thế gian ghét anh em, hãy nhớ nó đã ghét Thầy trước anh em.',
        en: 'Jesus says: if the world hates you, remember that it hated me before it hated you.',
      },
    },
    nextStep: { href: '/cac-thanh/tu-dao-viet-nam', label: { vi: 'Gặp các Thánh Tử Đạo Việt Nam', en: 'Meet the Vietnamese Martyrs' } },
  },

  'p-danger': {
    id: 'p-danger',
    title: { vi: 'Khi tính mạng bị đe dọa', en: 'When your life is in danger' },
    lead: {
      vi: 'Bạn có thể gặp nguy hiểm đến tính mạng vì đức tin của mình.',
      en: 'You may be in danger of your life because of your faith.',
    },
    advice: [
      {
        vi: 'Sợ hãi cho mạng sống mình là điều rất con người — không phải một thất bại của đức tin. Và xin biết rõ điều này trước hết: Đức Giêsu KHÔNG đòi bạn tự tìm cái chết. Chính Người dạy hãy tìm nơi an toàn khi bị bách hại. Ngay bây giờ, hãy tìm nơi an toàn và tìm sự trợ giúp — đó là điều khôn ngoan và được phép.',
        en: 'To fear for your life is deeply human — not a failure of faith. And know this first of all: Jesus does NOT ask you to seek death. He himself taught his followers to flee to safety when persecuted. Right now, seek safety and seek help — that is wise, and it is allowed.',
      },
    ],
    categories: [],
    tags: [],
    pastoral: true,
    seedPins: ['n:nguy-hiem-tinh-mang-vi-duc-tin'],
    companions: [
      {
        href: '/cac-thanh/tu-dao-viet-nam',
        name: { vi: 'Các Thánh Tử Đạo Việt Nam', en: 'The Vietnamese Martyrs' },
        line: {
          vi: 'Các ngài cũng đã sợ hãi, nhưng đã bền chí đến cùng nhờ ơn Chúa ban đúng lúc cần đến.',
          en: 'They too were afraid, yet endured to the end by the grace given exactly when it was needed.',
        },
      },
      {
        href: '/cac-thanh/maximilian-kolbe',
        name: { vi: 'Thánh Maximilianô Kolbe', en: 'St Maximilian Kolbe' },
        line: {
          vi: 'Ngay giữa trại Auschwitz, khi đối diện cái chết, ngài vẫn giữ được bình an và tình yêu — bằng ơn Chúa, chứ không bằng sức riêng.',
          en: 'Even in Auschwitz, in the face of death, he kept his peace and his love — by God’s grace, not his own strength.',
        },
      },
    ],
    scripture: {
      ref: 'Mt 24,13',
      gloss: {
        vi: 'Lời Chúa hứa không phải một lời đe dọa, mà một điểm tựa: ai bền chí đến cùng sẽ được cứu.',
        en: 'This word of the Lord is not a threat but a handhold: whoever endures to the end will be saved.',
      },
    },
    nextStep: { href: '/cac-thanh/tu-dao-viet-nam', label: { vi: 'Gặp các Thánh Tử Đạo Việt Nam', en: 'Meet the Vietnamese Martyrs' } },
  },
};

/* ------------------------------------------------------------------ matching */

export type ResourceKind = 'native' | 'council' | 'video';

/** A retrievable resource, unified across native Giải Đáp questions, council apologetics, and
 *  videos, so the matcher can score them all with the taxonomy. Built server-side, passed to the
 *  client. */
export interface Resource {
  key: string;
  kind: ResourceKind;
  href: string;
  questionVi: string;
  questionEn: string;
  metaVi: string;
  metaEn: string;
  category?: string;
  tags: string[];
  featured?: boolean;
  /** Plain-text answer preview (bilingual). A fallback for items with no inline `body` (videos), and
   *  used for the excerpt card before the full answer renders. */
  excerpt?: Bi;
  /** The FULL answer, enriched server-side and ScriptureBody-ready ({ html, data, ccc } — inline
   *  refs open the popover, honoring the SCRIPTURE_POPOVER gate). Rendered inline in the reading view
   *  so the walk never navigates away. `vi` is always present; `en` only for truly bilingual content
   *  (council answers) — native Q&As are VI-only, so EN readers see the VI answer (as on its page),
   *  and omitting `en` there keeps the shipped payload lean. Videos carry none — you watch them. */
  body?: { vi: EnrichedAnswer; en?: EnrichedAnswer };
  /** Resource keys to force to the top of THIS item's follow-ups — from the content pins
   *  (`related` / `related_video` on a Q&A, `related_qa` on a video). */
  pins?: string[];
  /** Punchy 4–8 word button label for follow-ups; falls back to the question when absent. Populated
   *  later once lib/giaiDap exposes a `short:` frontmatter field (content Sessions 2/3) — the flow
   *  ships on the title fallback, so this stays optional. */
  short?: Bi;
}

/** Deterministically pick the Q&As that best fit a situation. Relevance is TAG-driven: a precise
 *  tag match is the signal, a broad category is only a booster.
 *
 *  Scoring: +2 per matching tag, +2 for a matching broad category, featured +0.5 as a tiebreak.
 *  Crucially, a result must share AT LEAST ONE tag to qualify — a bare category match never
 *  qualifies on its own. That stops an over-broad category from burying precise matches (e.g. a
 *  "suffering" path must not fill with abstract `god-meaning` apologetics that merely share the
 *  category). Returns ONLY genuine matches — a page shows an empty list rather than a misleading
 *  one when the site has no fitting content yet. The one exception is the "show me common
 *  questions" path (`showCommon`), which surfaces the featured anchors. Pure + stable. */
export function matchResources(sit: Situation, pool: Resource[], limit = 6): Resource[] {
  if (sit.showCommon) {
    return pool.filter((r) => r.featured).slice(0, limit);
  }
  // Curated seed pins lead, in listed order, ahead of tag scoring; the tag-scored rest follows with
  // the pinned items removed so they're never duplicated.
  const pinned = (sit.seedPins ?? [])
    .map((k) => pool.find((r) => r.key === k))
    .filter((r): r is Resource => Boolean(r));
  const pinnedKeys = new Set(pinned.map((r) => r.key));

  const scored = pool
    .filter((r) => !pinnedKeys.has(r.key))
    .map((r) => {
      let tagHits = 0;
      for (const t of r.tags) if (sit.tags.includes(t)) tagHits++;
      if (tagHits === 0) return { r, score: 0 }; // require ≥1 tag overlap to qualify
      let score = tagHits * 2;
      if (r.category && sit.categories.includes(r.category)) score += 2;
      if (r.featured) score += 0.5;
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.r);

  return [...pinned, ...scored].slice(0, limit);
}

/* ------------------------------------------------------------------ guided journey (v2) */

/** How many answers deep the branching walk goes before offering the satisfaction check. A
 *  backstop, not the primary end — the reader can leave at any step. (docs/roadmap.md v2 spec.) */
export const MAX_CYCLES = 5;

/** The next ~4 follow-up suggestions for the branching journey — the questions a reader would
 *  naturally have next after `seed` (the answer they just read; undefined at the situation anchor).
 *
 *  Deterministic, no LLM, and TAG-driven like `matchResources`: at the anchor the first set IS the
 *  situation's matches (reuses the fixed matcher); once walking, candidates are scored by tag
 *  overlap — primarily with `seed`, secondarily with the intake `situation` to stay on-theme — and
 *  must share at least one tag (with seed or situation) to qualify, so a bare category match can't
 *  drift the chain off-topic. Already-read items (`visited`) and the seed drop out, so the pool
 *  shrinks as they explore. Content pins on the seed (`related`/`related_video`/`related_qa` →
 *  `pins`) are forced to the top. */
export function followUps(params: {
  situation: Situation;
  seed?: Resource;
  pool: Resource[];
  visited: ReadonlySet<string>;
  limit?: number;
}): Resource[] {
  const { situation, seed, pool, visited, limit = 4 } = params;

  // Anchor: the first set is exactly the situation's matches (or the featured anchors for the
  // "common questions" path), minus anything already read.
  if (!seed) {
    return matchResources(situation, pool, pool.length)
      .filter((r) => !visited.has(r.key))
      .slice(0, limit);
  }

  const pinned = new Set(seed.pins ?? []);
  return pool
    .filter((r) => !visited.has(r.key) && r.key !== seed.key)
    .map((r) => {
      let seedTagHits = 0;
      for (const t of r.tags) if (seed.tags.includes(t)) seedTagHits++;
      let sitTagHits = 0;
      for (const t of r.tags) if (situation.tags.includes(t)) sitTagHits++;
      const isPinned = pinned.has(r.key);
      if (seedTagHits === 0 && sitTagHits === 0 && !isPinned) return { r, score: 0 };
      let score = seedTagHits * 3; // the just-read answer is the strongest signal
      if (r.category && seed.category && r.category === seed.category) score += 2;
      score += sitTagHits; // keep the walk anchored to the original situation
      if (r.category && situation.categories.includes(r.category)) score += 1;
      if (r.featured) score += 0.5;
      if (isPinned) score += 100; // explicit content pins always lead
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.r);
}
