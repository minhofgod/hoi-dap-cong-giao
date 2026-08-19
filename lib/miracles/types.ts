// Type + status metadata for the Phép Lạ & Hiện Ra (Miracles & Apparitions) section — the
// event-model counterpart to lib/saints/groups.ts. Deliberately its own client-safe module with NO
// filesystem imports: lib/miraclesV2.ts re-exports these for server components, while client
// components (components/phep-la/*) import directly from here, so the `node:fs` content loader in
// miraclesV2.ts is never bundled for the browser.
//
// Unlike Saints (people grouped by theme) and Giáo Phụ (people grouped by era), this section
// catalogues EVENTS grouped by kind — a Eucharistic miracle, an apparition, a cure, a preserved
// body, an image. The second axis, and the one this section exists for, is `status`: exactly what
// the Church has and has not said about each case. That distinction is rendered everywhere — on the
// index rows, in the detail header — because blurring it is the one failure this section cannot
// afford (docs/phep-la-spec.md, "the integrity backbone").

import type { Bi } from '@/lib/giao-phu/eras';

export type { Bi };

export type MiracleType =
  | 'eucharistic'
  | 'marian-apparition'
  | 'healing'
  | 'incorrupt'
  | 'miraculous-image';

export const TYPE_ORDER: MiracleType[] = [
  'eucharistic',
  'marian-apparition',
  'healing',
  'incorrupt',
  'miraculous-image',
];

export const TYPE_LABEL: Record<MiracleType, Bi> = {
  eucharistic: { vi: 'Phép lạ Thánh Thể', en: 'Eucharistic miracles' },
  'marian-apparition': { vi: 'Đức Mẹ hiện ra', en: 'Marian apparitions' },
  healing: { vi: 'Ơn chữa lành', en: 'Healings' },
  incorrupt: { vi: 'Thi hài không hư nát', en: 'Incorrupt bodies' },
  'miraculous-image': { vi: 'Ảnh tượng lạ', en: 'Miraculous images' },
};

/** Short form used in the detail-page eyebrow and compact rows. */
export const TYPE_LABEL_SHORT: Record<MiracleType, Bi> = {
  eucharistic: { vi: 'Thánh Thể', en: 'Eucharistic' },
  'marian-apparition': { vi: 'Hiện ra', en: 'Apparition' },
  healing: { vi: 'Chữa lành', en: 'Healing' },
  incorrupt: { vi: 'Không hư nát', en: 'Incorrupt' },
  'miraculous-image': { vi: 'Ảnh tượng', en: 'Image' },
};

/** The uppercase gold kicker above each group band. */
export const TYPE_KICKER: Record<MiracleType, Bi> = {
  eucharistic: { vi: 'Bánh và rượu', en: 'Bread and wine' },
  'marian-apparition': { vi: 'Mặc khải tư', en: 'Private revelation' },
  healing: { vi: 'Hồ sơ y khoa', en: 'The medical files' },
  incorrupt: { vi: 'Điều thường bị thổi phồng', en: 'The most over-claimed' },
  'miraculous-image': { vi: 'Một tấm vải', en: 'A piece of cloth' },
};

export const TYPE_BLURB: Record<MiracleType, Bi> = {
  eucharistic: {
    vi: 'Những trường hợp bánh thánh được ghi nhận biến đổi hoặc được gìn giữ cách bất thường. Hội Thánh cho phép tôn kính các thánh tích này, nhưng chưa bao giờ tuyên bố rằng khoa học đã chứng minh chúng — và một vài "bằng chứng khoa học" lưu truyền rộng rãi trên mạng thì hoàn toàn không có thật.',
    en: 'Hosts reported to have changed, or to have kept from decaying. The Church permits veneration of these relics; it has never declared that science proves them — and a few of the "scientific proofs" circulating online turn out not to exist at all.',
  },
  'marian-apparition': {
    vi: 'Những cuộc hiện ra đã qua điều tra của thẩm quyền Hội Thánh. Phần lớn đã được chuẩn nhận; một vài trường hợp có tình trạng khác — chưa từng có phán quyết, hoặc do một Giáo hội khác công nhận — và nhãn trên mỗi dòng nói rõ điều đó. Tất cả đều thuộc mặc khải tư: được nhìn nhận là "đáng tin", nhưng không buộc phải tin như tín điều. Mặc khải công khai đã kết thúc với các Tông Đồ (GLHTCG 66).',
    en: 'Apparitions investigated by Church authority. Most were approved; a few stand differently — never ruled on, or recognised by another Church — and the label on each row says which. Every one of them is private revelation: judged "worthy of belief," never binding as an article of faith. Public revelation closed with the apostles (GLHTCG 66).',
  },
  healing: {
    vi: 'Nơi bằng chứng ở dạng chặt chẽ nhất: hồ sơ bệnh án, hội đồng bác sĩ, và một quy trình sẵn sàng nói "không giải thích được" mà vẫn không nói "đây là phép lạ". Trong hơn 7.000 hồ sơ tại Lộ Đức, chỉ 70 trường hợp được Hội Thánh nhìn nhận.',
    en: 'Where the evidence is at its most disciplined: case files, medical boards, and a process willing to say "unexplained" without saying "miracle." Of more than 7,000 claims at Lourdes, 70 have been recognised by the Church.',
  },
  incorrupt: {
    vi: 'Loại trường hợp bị phóng đại nhiều nhất. Hội Thánh không hề tuyên bố ai đó "không hư nát", cũng không coi đó là điều kiện để phong thánh — và nhiều thi hài được trưng bày đã qua ướp xác hoặc phủ mặt nạ sáp. Ở đây chúng tôi nói rõ điều gì thật sự đã được ghi nhận.',
    en: 'The most over-claimed category on the internet. The Church issues no declaration of incorruptibility, does not require it for canonization — and several displayed bodies were embalmed or wear a wax mask. Here we say plainly what was actually recorded.',
  },
  'miraculous-image': {
    vi: 'Những ảnh tượng được tôn kính vì nguồn gốc và sự bền bỉ của chúng. Đây cũng là nơi cần thận trọng nhất với các khẳng định khoa học — vì chính các cuộc khảo sát do đền thánh đặt hàng đôi khi lại đưa ra kết luận trái ngược nhau.',
    en: 'Images venerated for their origin and their endurance. This is also where scientific claims need the most care — examinations commissioned by the shrines themselves have reached opposite conclusions.',
  },
};

// ---------------------------------------------------------------------------
// Recognition status — the honest axis
// ---------------------------------------------------------------------------

/** What the Church has actually said about THIS case. Never a measure of how impressive the
 *  evidence looks; only of the canonical act on record.
 *   - `approved`      a competent authority issued a formal decree on the event itself
 *                     (e.g. Lourdes 1862, La Salette 1851, Fatima 1930).
 *   - `venerated`     the Church sanctions the cult, the relic, the feast — but no modern decree
 *                     ever adjudicated the event (most of the medieval Eucharistic cases).
 *   - `not-ruled`     the devotion is fully approved, the event itself has never been judged
 *                     (La Vang). Named explicitly rather than left to the reader to assume.
 *   - `cure-approved` a cure or canonization miracle formally recognised after medical review.
 *   - `other-church`  a Church in apostolic succession — not the Catholic Church — issued the
 *                     formal act, and Rome deferred to it rather than ruling (Zeitoun, recognised
 *                     by the Coptic Orthodox Church in 1968). Neither `approved` nor `not-ruled`
 *                     tells that truth: the first would credit Rome with an act it never made,
 *                     the second would erase a real canonical judgement. */
export type RecognitionStatus =
  | 'approved'
  | 'venerated'
  | 'not-ruled'
  | 'cure-approved'
  | 'other-church';

export const STATUS_LABEL: Record<RecognitionStatus, Bi> = {
  approved: { vi: 'Đã được phê chuẩn', en: 'Formally approved' },
  venerated: { vi: 'Được tôn kính lâu đời', en: 'Long venerated' },
  'not-ruled': { vi: 'Chưa có phán quyết', en: 'No formal ruling' },
  'cure-approved': { vi: 'Đã được công nhận', en: 'Officially recognised' },
  'other-church': { vi: 'Giáo hội khác công nhận', en: 'Recognised by another Church' },
};

/** One line spelling out what the label does and does not mean — rendered next to every badge, so
 *  the distinction never depends on the reader already knowing it. */
export const STATUS_NOTE: Record<RecognitionStatus, Bi> = {
  approved: {
    vi: 'Thẩm quyền Hội Thánh đã điều tra và ra văn kiện chính thức về chính biến cố này: không có gì nghịch với đức tin và luân lý, và các tín hữu có thể tin. Đây không phải là tín điều, cũng không phải là chứng minh khoa học.',
    en: 'Church authority investigated and issued a formal act on the event itself: nothing contrary to faith or morals, and the faithful may believe it. This is not a dogma, and not a scientific proof.',
  },
  venerated: {
    vi: 'Hội Thánh cho phép và khuyến khích việc tôn kính thánh tích, đền thánh hay ngày lễ — nhưng không có văn kiện thời nay phán quyết về chính biến cố. Truyền thống lâu đời không đồng nghĩa với chứng cứ lịch sử.',
    en: 'The Church permits and encourages veneration of the relic, shrine, or feast — but no modern act has adjudicated the event itself. A long tradition is not the same thing as historical evidence.',
  },
  'not-ruled': {
    vi: 'Lòng sùng kính đã được Hội Thánh chuẩn nhận trọn vẹn, nhưng chính cuộc hiện ra thì chưa bao giờ được Tòa Thánh hay hàng giám mục ra phán quyết chính thức. Chúng tôi nói rõ điều này thay vì để người đọc tự suy đoán.',
    en: 'The devotion is fully approved by the Church, but the reported apparition itself has never received a formal ruling from the Holy See or the bishops. We say so rather than let the reader assume.',
  },
  'cure-approved': {
    vi: 'Một hội đồng y khoa kết luận trường hợp này không giải thích được theo hiểu biết y học hiện nay, và sau đó giám mục giáo phận tuyên bố nhìn nhận. Hai bước tách biệt: y khoa nói "không giải thích được", Hội Thánh mới nói "phép lạ".',
    en: 'A medical board concluded the case is unexplained by current medical knowledge, after which the diocesan bishop declared it recognised. Two separate steps: medicine says "unexplained," only then does the Church say "miracle."',
  },
  'other-church': {
    vi: 'Một Giáo hội có sự kế vị tông đồ — mà Hội Thánh Công giáo nhìn nhận chức thánh và các bí tích là thành sự — đã điều tra và ra tuyên bố chính thức về biến cố này. Tòa Thánh không tự ra phán quyết riêng, nhưng minh nhiên tôn trọng thẩm quyền của Giáo hội địa phương ấy. Vì thế đây không phải là "Rôma đã phê chuẩn", và cũng không phải là "chưa ai phán quyết".',
    en: 'A Church in apostolic succession — whose orders and sacraments the Catholic Church recognises as valid — investigated and issued a formal statement on this event. The Holy See made no separate ruling of its own, but expressly deferred to that local Church’s authority. So this is neither “Rome approved it” nor “nobody has ruled.”',
  },
};

/** The standing note carried on the section index and on every apparition page. Public revelation
 *  closed with the apostles (GLHTCG 66–67); approved apparitions are private revelation. */
export const PRIVATE_REVELATION_NOTE: Bi = {
  vi: 'Mặc khải công khai đã hoàn tất nơi Đức Kitô và kết thúc với các Tông Đồ (GLHTCG 66). Mọi cuộc hiện ra, kể cả những cuộc đã được Hội Thánh phê chuẩn, đều là mặc khải tư: chúng không thêm gì vào đức tin, không buộc phải tin, và vai trò của chúng là giúp ta sống Tin Mừng trọn vẹn hơn trong một thời điểm nhất định (GLHTCG 67).',
  en: 'Public revelation is complete in Christ and closed with the apostles (GLHTCG 66). Every apparition, including those the Church has approved, is private revelation: it adds nothing to the faith, no one is obliged to believe it, and its role is to help us live the Gospel more fully at a given moment (GLHTCG 67).',
};
