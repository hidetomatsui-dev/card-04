import type { ValueCard } from '../types';

export const valueCards: ValueCard[] = [
  // 自律・自由
  { id: 1,  keyword: '自由',         category: 'autonomy',      categoryName: '自律・自由',        categoryColor: 'bg-violet-100 text-violet-800 border-violet-200' },
  { id: 2,  keyword: '自律',         category: 'autonomy',      categoryName: '自律・自由',        categoryColor: 'bg-violet-100 text-violet-800 border-violet-200' },
  { id: 3,  keyword: '独立',         category: 'autonomy',      categoryName: '自律・自由',        categoryColor: 'bg-violet-100 text-violet-800 border-violet-200' },
  { id: 4,  keyword: '裁量',         category: 'autonomy',      categoryName: '自律・自由',        categoryColor: 'bg-violet-100 text-violet-800 border-violet-200' },
  { id: 5,  keyword: '主体性',       category: 'autonomy',      categoryName: '自律・自由',        categoryColor: 'bg-violet-100 text-violet-800 border-violet-200' },
  { id: 6,  keyword: '創造性',       category: 'autonomy',      categoryName: '自律・自由',        categoryColor: 'bg-violet-100 text-violet-800 border-violet-200' },

  // 刺激・挑戦
  { id: 7,  keyword: '挑戦',         category: 'stimulation',   categoryName: '刺激・挑戦',        categoryColor: 'bg-red-100 text-red-800 border-red-200' },
  { id: 8,  keyword: '変化',         category: 'stimulation',   categoryName: '刺激・挑戦',        categoryColor: 'bg-red-100 text-red-800 border-red-200' },
  { id: 9,  keyword: '冒険',         category: 'stimulation',   categoryName: '刺激・挑戦',        categoryColor: 'bg-red-100 text-red-800 border-red-200' },
  { id: 10, keyword: '刺激',         category: 'stimulation',   categoryName: '刺激・挑戦',        categoryColor: 'bg-red-100 text-red-800 border-red-200' },
  { id: 11, keyword: '探求',         category: 'stimulation',   categoryName: '刺激・挑戦',        categoryColor: 'bg-red-100 text-red-800 border-red-200' },
  { id: 12, keyword: '革新',         category: 'stimulation',   categoryName: '刺激・挑戦',        categoryColor: 'bg-red-100 text-red-800 border-red-200' },

  // 楽しさ・快楽
  { id: 13, keyword: '楽しさ',       category: 'hedonism',      categoryName: '楽しさ・快楽',      categoryColor: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 14, keyword: '喜び',         category: 'hedonism',      categoryName: '楽しさ・快楽',      categoryColor: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 15, keyword: '快適さ',       category: 'hedonism',      categoryName: '楽しさ・快楽',      categoryColor: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 16, keyword: '遊び心',       category: 'hedonism',      categoryName: '楽しさ・快楽',      categoryColor: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 17, keyword: '充足感',       category: 'hedonism',      categoryName: '楽しさ・快楽',      categoryColor: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 18, keyword: '余裕',         category: 'hedonism',      categoryName: '楽しさ・快楽',      categoryColor: 'bg-yellow-100 text-yellow-800 border-yellow-200' },

  // 達成・成功
  { id: 19, keyword: '達成',         category: 'achievement',   categoryName: '達成・成功',        categoryColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 20, keyword: '成果',         category: 'achievement',   categoryName: '達成・成功',        categoryColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 21, keyword: '勝利',         category: 'achievement',   categoryName: '達成・成功',        categoryColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 22, keyword: '完遂',         category: 'achievement',   categoryName: '達成・成功',        categoryColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 23, keyword: '評価',         category: 'achievement',   categoryName: '達成・成功',        categoryColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 24, keyword: '卓越',         category: 'achievement',   categoryName: '達成・成功',        categoryColor: 'bg-amber-100 text-amber-800 border-amber-200' },

  // 権力・影響力
  { id: 25, keyword: '影響力',       category: 'power',         categoryName: '権力・影響力',      categoryColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 26, keyword: 'リーダーシップ', category: 'power',       categoryName: '権力・影響力',      categoryColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 27, keyword: '主導',         category: 'power',         categoryName: '権力・影響力',      categoryColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 28, keyword: '決断',         category: 'power',         categoryName: '権力・影響力',      categoryColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 29, keyword: '権限',         category: 'power',         categoryName: '権力・影響力',      categoryColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 30, keyword: '富',           category: 'power',         categoryName: '権力・影響力',      categoryColor: 'bg-orange-100 text-orange-800 border-orange-200' },

  // 安全・安定
  { id: 31, keyword: '安定',         category: 'security',      categoryName: '安全・安定',        categoryColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 32, keyword: '安心',         category: 'security',      categoryName: '安全・安定',        categoryColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 33, keyword: '継続',         category: 'security',      categoryName: '安全・安定',        categoryColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 34, keyword: '保証',         category: 'security',      categoryName: '安全・安定',        categoryColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 35, keyword: '秩序',         category: 'security',      categoryName: '安全・安定',        categoryColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 36, keyword: '見通し',       category: 'security',      categoryName: '安全・安定',        categoryColor: 'bg-sky-100 text-sky-800 border-sky-200' },

  // 規範・順応
  { id: 37, keyword: '礼儀',         category: 'conformity',    categoryName: '規範・順応',        categoryColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 38, keyword: '自制',         category: 'conformity',    categoryName: '規範・順応',        categoryColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 39, keyword: '規律',         category: 'conformity',    categoryName: '規範・順応',        categoryColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 40, keyword: '調和',         category: 'conformity',    categoryName: '規範・順応',        categoryColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 41, keyword: '責任',         category: 'conformity',    categoryName: '規範・順応',        categoryColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 42, keyword: '誠実さ',       category: 'conformity',    categoryName: '規範・順応',        categoryColor: 'bg-teal-100 text-teal-800 border-teal-200' },

  // 伝統
  { id: 43, keyword: '伝統',         category: 'tradition',     categoryName: '伝統',              categoryColor: 'bg-stone-100 text-stone-800 border-stone-200' },
  { id: 44, keyword: '謙虚さ',       category: 'tradition',     categoryName: '伝統',              categoryColor: 'bg-stone-100 text-stone-800 border-stone-200' },
  { id: 45, keyword: '感謝',         category: 'tradition',     categoryName: '伝統',              categoryColor: 'bg-stone-100 text-stone-800 border-stone-200' },
  { id: 46, keyword: '信仰',         category: 'tradition',     categoryName: '伝統',              categoryColor: 'bg-stone-100 text-stone-800 border-stone-200' },
  { id: 47, keyword: '節度',         category: 'tradition',     categoryName: '伝統',              categoryColor: 'bg-stone-100 text-stone-800 border-stone-200' },
  { id: 48, keyword: '継承',         category: 'tradition',     categoryName: '伝統',              categoryColor: 'bg-stone-100 text-stone-800 border-stone-200' },

  // 身近な人への善意
  { id: 49, keyword: '親切',         category: 'benevolence',   categoryName: '身近な人への善意',  categoryColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 50, keyword: '思いやり',     category: 'benevolence',   categoryName: '身近な人への善意',  categoryColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 51, keyword: '信頼',         category: 'benevolence',   categoryName: '身近な人への善意',  categoryColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 52, keyword: '育成',         category: 'benevolence',   categoryName: '身近な人への善意',  categoryColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 53, keyword: '家族愛',       category: 'benevolence',   categoryName: '身近な人への善意',  categoryColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 54, keyword: '友情',         category: 'benevolence',   categoryName: '身近な人への善意',  categoryColor: 'bg-rose-100 text-rose-800 border-rose-200' },

  // 社会・自然への配慮
  { id: 55, keyword: '平等',         category: 'universalism',  categoryName: '社会・自然への配慮', categoryColor: 'bg-green-100 text-green-800 border-green-200' },
  { id: 56, keyword: '社会貢献',     category: 'universalism',  categoryName: '社会・自然への配慮', categoryColor: 'bg-green-100 text-green-800 border-green-200' },
  { id: 57, keyword: '自然との調和', category: 'universalism',  categoryName: '社会・自然への配慮', categoryColor: 'bg-green-100 text-green-800 border-green-200' },
  { id: 58, keyword: '美しさ',       category: 'universalism',  categoryName: '社会・自然への配慮', categoryColor: 'bg-green-100 text-green-800 border-green-200' },
  { id: 59, keyword: '寛容',         category: 'universalism',  categoryName: '社会・自然への配慮', categoryColor: 'bg-green-100 text-green-800 border-green-200' },
  { id: 60, keyword: '共生',         category: 'universalism',  categoryName: '社会・自然への配慮', categoryColor: 'bg-green-100 text-green-800 border-green-200' },
];
