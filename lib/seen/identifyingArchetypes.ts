// PROVENANCE: bot=claude-code session=2026-10-27 task=rename roster to identifying archetypes, base Human Design gates + I Ching hexagrams

/**
 * The 64 identifying archetypes (formerly "portals", briefly "interrogators").
 * Base: Human Design's 64 gates and I Ching's 64 hexagrams.
 * Names are the original Zhouyi character, its pinyin, and the blunt meaning.
 * Source of truth: docs/64_PORTALS.md. No soft Wilhelm renderings ("Youthful Folly").
 */

export interface IdentifyingArchetype {
  number: number;
  hanzi: string;
  pinyin: string;
  name: string;
}

export const IDENTIFYING_ARCHETYPES_64: IdentifyingArchetype[] = [
  { number: 1, hanzi: "乾", pinyin: "Qián", name: "The Force" },
  { number: 2, hanzi: "坤", pinyin: "Kūn", name: "The Yield" },
  { number: 3, hanzi: "屯", pinyin: "Tún", name: "The Ambush" },
  { number: 4, hanzi: "蒙", pinyin: "Méng", name: "The Covered" },
  { number: 5, hanzi: "需", pinyin: "Xū", name: "The Wait" },
  { number: 6, hanzi: "訟", pinyin: "Sòng", name: "The Dispute" },
  { number: 7, hanzi: "師", pinyin: "Shī", name: "The Host" },
  { number: 8, hanzi: "比", pinyin: "Bǐ", name: "The Bind" },
  { number: 9, hanzi: "小畜", pinyin: "Xiǎo Xù", name: "The Small Restraint" },
  { number: 10, hanzi: "履", pinyin: "Lǚ", name: "The Step" },
  { number: 11, hanzi: "泰", pinyin: "Tài", name: "The Passage" },
  { number: 12, hanzi: "否", pinyin: "Pǐ", name: "The Block" },
  { number: 13, hanzi: "同人", pinyin: "Tóng Rén", name: "The Same Men" },
  { number: 14, hanzi: "大有", pinyin: "Dà Yǒu", name: "The Great Harvest" },
  { number: 15, hanzi: "謙", pinyin: "Qiān", name: "The Low" },
  { number: 16, hanzi: "豫", pinyin: "Yù", name: "The Surge" },
  { number: 17, hanzi: "隨", pinyin: "Suí", name: "The Tail" },
  { number: 18, hanzi: "蠱", pinyin: "Gǔ", name: "The Rot" },
  { number: 19, hanzi: "臨", pinyin: "Lín", name: "The Overseer" },
  { number: 20, hanzi: "觀", pinyin: "Guān", name: "The Watch" },
  { number: 21, hanzi: "噬嗑", pinyin: "Shì Kè", name: "The Bite" },
  { number: 22, hanzi: "賁", pinyin: "Bì", name: "The Ornament" },
  { number: 23, hanzi: "剝", pinyin: "Bō", name: "The Strip" },
  { number: 24, hanzi: "復", pinyin: "Fù", name: "The Return" },
  { number: 25, hanzi: "無妄", pinyin: "Wú Wàng", name: "The Unfeigned" },
  { number: 26, hanzi: "大畜", pinyin: "Dà Xù", name: "The Great Restraint" },
  { number: 27, hanzi: "頤", pinyin: "Yí", name: "The Jaws" },
  { number: 28, hanzi: "大過", pinyin: "Dà Guò", name: "The Overload" },
  { number: 29, hanzi: "坎", pinyin: "Kǎn", name: "The Pit" },
  { number: 30, hanzi: "離", pinyin: "Lí", name: "The Clutch" },
  { number: 31, hanzi: "咸", pinyin: "Xián", name: "The Pull" },
  { number: 32, hanzi: "恆", pinyin: "Héng", name: "The Constant" },
  { number: 33, hanzi: "遁", pinyin: "Dùn", name: "The Flight" },
  { number: 34, hanzi: "大壯", pinyin: "Dà Zhuàng", name: "The Great Strength" },
  { number: 35, hanzi: "晉", pinyin: "Jìn", name: "The Advance" },
  { number: 36, hanzi: "明夷", pinyin: "Míng Yí", name: "The Light Wounded" },
  { number: 37, hanzi: "家人", pinyin: "Jiā Rén", name: "The Kin" },
  { number: 38, hanzi: "睽", pinyin: "Kuí", name: "The Split" },
  { number: 39, hanzi: "蹇", pinyin: "Jiǎn", name: "The Lame" },
  { number: 40, hanzi: "解", pinyin: "Xiè", name: "The Untie" },
  { number: 41, hanzi: "損", pinyin: "Sǔn", name: "The Cut" },
  { number: 42, hanzi: "益", pinyin: "Yì", name: "The Gain" },
  { number: 43, hanzi: "夬", pinyin: "Guài", name: "The Break" },
  { number: 44, hanzi: "姤", pinyin: "Gòu", name: "The Meet" },
  { number: 45, hanzi: "萃", pinyin: "Cuì", name: "The Gather" },
  { number: 46, hanzi: "升", pinyin: "Shēng", name: "The Climb" },
  { number: 47, hanzi: "困", pinyin: "Kùn", name: "The Crush" },
  { number: 48, hanzi: "井", pinyin: "Jǐng", name: "The Well" },
  { number: 49, hanzi: "革", pinyin: "Gé", name: "The Overthrow" },
  { number: 50, hanzi: "鼎", pinyin: "Dǐng", name: "The Vessel" },
  { number: 51, hanzi: "震", pinyin: "Zhèn", name: "The Shock" },
  { number: 52, hanzi: "艮", pinyin: "Gèn", name: "The Still" },
  { number: 53, hanzi: "漸", pinyin: "Jiàn", name: "The Gradual" },
  { number: 54, hanzi: "歸妹", pinyin: "Guī Mèi", name: "The Bride" },
  { number: 55, hanzi: "豐", pinyin: "Fēng", name: "The Full" },
  { number: 56, hanzi: "旅", pinyin: "Lǚ", name: "The Stranger" },
  { number: 57, hanzi: "巽", pinyin: "Xùn", name: "The Enter" },
  { number: 58, hanzi: "兌", pinyin: "Duì", name: "The Open" },
  { number: 59, hanzi: "渙", pinyin: "Huàn", name: "The Scatter" },
  { number: 60, hanzi: "節", pinyin: "Jié", name: "The Limit" },
  { number: 61, hanzi: "中孚", pinyin: "Zhōng Fú", name: "The Center Holds" },
  { number: 62, hanzi: "小過", pinyin: "Xiǎo Guò", name: "The Small Over" },
  { number: 63, hanzi: "既濟", pinyin: "Jì Jì", name: "The Done" },
  { number: 64, hanzi: "未濟", pinyin: "Wèi Jì", name: "The Not Yet" },
];
