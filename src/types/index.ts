export type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export type SortResult = 'interested' | 'neutral' | 'not-interested';
export type ValueSortResult = 'important' | 'neutral' | 'not-important';

export type SchwartzCategory =
  | 'autonomy'
  | 'stimulation'
  | 'hedonism'
  | 'achievement'
  | 'power'
  | 'security'
  | 'conformity'
  | 'tradition'
  | 'benevolence'
  | 'universalism';

export interface OHBYCard {
  id: number;
  title: string;
  description: string;
  type: RIASECType;
  emoji: string;
}

export interface ValueCard {
  id: number;
  keyword: string;
  category: SchwartzCategory;
  categoryName: string;
  categoryColor: string;
}

export interface ValueEpisode {
  episode: string;
  feeling: string;
}

export interface AppState {
  name: string;
  currentStep: number;

  // Step 1
  cardOrder: number[];
  cardSortResults: Record<number, SortResult>;
  sortHistory: number[];           // 仕分け順（undo用）
  riasecChecked: RIASECType[];
  step1Reflection1: string;
  step1Reflection2: string;

  // Step 2
  valueCardOrder: number[];
  valueSortResults: Record<number, ValueSortResult>;
  valueSortHistory: number[];      // 仕分け順（undo用）
  phase1Selected: number[];   // legacy (unused)
  phase2Selected: number[];
  phase3Selected: number | null;
  valueEpisodes: Record<number, ValueEpisode>;
  step2Reflection: string;

  // Step 3
  matrixData: Record<string, string>;
  step3Alignment1: string;
  step3Alignment2: string;
  step3Summary: string;

  // Step 4
  careerDirection: string;
  actions: [string, string, string];
  finalSummary: string;
}

export const RIASEC_LABELS: Record<RIASECType, string> = {
  R: '現実的（R型）',
  I: '研究的（I型）',
  A: '芸術的（A型）',
  S: '社会的（S型）',
  E: '企業的（E型）',
  C: '慣習的（C型）',
};

export const RIASEC_SHORT: Record<RIASECType, string> = {
  R: 'R型',
  I: 'I型',
  A: 'A型',
  S: 'S型',
  E: 'E型',
  C: 'C型',
};

export const RIASEC_COLORS: Record<RIASECType, string> = {
  R: 'bg-blue-600',
  I: 'bg-purple-600',
  A: 'bg-pink-600',
  S: 'bg-green-600',
  E: 'bg-orange-600',
  C: 'bg-yellow-600',
};

export const RIASEC_TEXT_COLORS: Record<RIASECType, string> = {
  R: 'text-blue-700',
  I: 'text-purple-700',
  A: 'text-pink-700',
  S: 'text-green-700',
  E: 'text-orange-700',
  C: 'text-yellow-700',
};

export const RIASEC_BADGE_COLORS: Record<RIASECType, string> = {
  R: 'bg-blue-100 text-blue-800 border-blue-200',
  I: 'bg-purple-100 text-purple-800 border-purple-200',
  A: 'bg-pink-100 text-pink-800 border-pink-200',
  S: 'bg-green-100 text-green-800 border-green-200',
  E: 'bg-orange-100 text-orange-800 border-orange-200',
  C: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const SCHWARTZ_COLORS: Record<SchwartzCategory, string> = {
  autonomy: 'bg-violet-100 text-violet-800 border-violet-200',
  stimulation: 'bg-red-100 text-red-800 border-red-200',
  hedonism: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  achievement: 'bg-amber-100 text-amber-800 border-amber-200',
  power: 'bg-orange-100 text-orange-800 border-orange-200',
  security: 'bg-sky-100 text-sky-800 border-sky-200',
  conformity: 'bg-teal-100 text-teal-800 border-teal-200',
  tradition: 'bg-stone-100 text-stone-800 border-stone-200',
  benevolence: 'bg-rose-100 text-rose-800 border-rose-200',
  universalism: 'bg-green-100 text-green-800 border-green-200',
};
