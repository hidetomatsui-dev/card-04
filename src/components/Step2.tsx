import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppState } from '../types';
import { valueCards } from '../data/valueCards';
import type { ValueCard } from '../types';

interface Props {
  state: AppState;
  update: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

type Phase = 1 | 2 | 3;

const PHASE_TARGET = [5, 3, 1];
const PHASE_LABEL  = ['5枚', '3枚', '1枚（TOP1）'];

function ValueCardButton({
  card,
  isSelected,
  onToggle,
  disabled,
  highlight,
}: {
  card: ValueCard;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean;
  highlight?: boolean;
}) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled && !isSelected}
      layout
      className={`relative p-3 rounded-xl border-2 text-center transition-all duration-150 select-none ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 shadow-md'
          : disabled
          ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer'
      } ${highlight ? 'ring-2 ring-amber-400' : ''}`}
      whileTap={!disabled || isSelected ? { scale: 0.95 } : {}}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
      <span className={`text-sm font-bold block mb-1 ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
        {card.keyword}
      </span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${card.categoryColor}`}>
        {card.categoryName.split('・').slice(-1)[0]}
      </span>
    </motion.button>
  );
}

export default function Step2({ state, update, onNext, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>(() => {
    if (state.phase3Selected !== null) return 3;
    if (state.phase2Selected.length > 0) return 2;
    return 1;
  });

  const p1 = state.phase1Selected;
  const p2 = state.phase2Selected;
  const p3 = state.phase3Selected;
  const episodes = state.valueEpisodes;

  const target = PHASE_TARGET[phase - 1];
  const canProceed1 = p1.length === PHASE_TARGET[0];
  const canProceed2 = p2.length === PHASE_TARGET[1];
  const canProceed3 = p3 !== null;

  const toggleP1 = (id: number) => {
    if (p1.includes(id)) {
      update({ phase1Selected: p1.filter(x => x !== id) });
    } else if (p1.length < PHASE_TARGET[0]) {
      update({ phase1Selected: [...p1, id] });
    }
  };

  const toggleP2 = (id: number) => {
    if (p2.includes(id)) {
      update({ phase2Selected: p2.filter(x => x !== id) });
    } else if (p2.length < PHASE_TARGET[1]) {
      update({ phase2Selected: [...p2, id] });
    }
  };

  const selectP3 = (id: number) => {
    update({ phase3Selected: id });
  };

  const updateEpisode = (id: number, field: 'episode' | 'feeling', value: string) => {
    update({
      valueEpisodes: {
        ...episodes,
        [id]: { ...episodes[id], [field]: value },
      },
    });
  };

  const top3Cards   = valueCards.filter(c => p2.includes(c.id));
  const top1Card    = valueCards.find(c => c.id === p3);
  const phase2Cards = valueCards.filter(c => p1.includes(c.id));
  const phase3Cards = valueCards.filter(c => p2.includes(c.id));

  // Group cards by category for Phase 1
  const grouped = valueCards.reduce<Record<string, ValueCard[]>>((acc, c) => {
    if (!acc[c.categoryName]) acc[c.categoryName] = [];
    acc[c.categoryName].push(c);
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shrink-0">2</span>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">動機の深掘り</h2>
          <p className="text-sm text-gray-500">Why — あなたが大切にしている価値観の核心を見つける</p>
        </div>
      </div>

      {/* Phase indicator */}
      <div className="flex items-center gap-2 mb-6 no-print">
        {([1, 2, 3] as Phase[]).map(p => (
          <div key={p} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                phase === p
                  ? 'bg-indigo-600 text-white shadow-md'
                  : p < phase
                  ? 'bg-indigo-100 text-indigo-600 cursor-pointer hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-400'
              }`}
              onClick={() => p < phase && setPhase(p)}
            >
              <span>{p < phase ? '✓' : p}</span>
              <span>フェーズ{p}（{PHASE_LABEL[p - 1]}）</span>
            </div>
            {p < 3 && <span className="mx-1 text-gray-300">→</span>}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Phase 1: Select 5 from 60 ── */}
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div className="card-base p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">ピンとくるカードを{PHASE_TARGET[0]}枚選んでください</h3>
                <span className={`text-2xl font-extrabold tabular-nums transition-colors ${
                  p1.length === target ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {p1.length}/{target}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                直感で選んでOK。「なんとなくピンとくる」で十分です。
              </p>

              {Object.entries(grouped).map(([catName, cards]) => (
                <div key={catName} className="mb-5">
                  <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">{catName}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {cards.map(card => (
                      <ValueCardButton
                        key={card.id}
                        card={card}
                        isSelected={p1.includes(card.id)}
                        onToggle={() => toggleP1(card.id)}
                        disabled={p1.length >= target}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center no-print">
              <button onClick={onBack} className="btn-secondary">← 戻る</button>
              <button
                onClick={() => setPhase(2)}
                disabled={!canProceed1}
                className="btn-primary"
              >
                フェーズ2へ（{p1.length}/{target}枚選択中）
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Phase 2: Select 3 from 5 ── */}
        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div className="card-base p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">さらに大切なものを{PHASE_TARGET[1]}枚に絞ってください</h3>
                <span className={`text-2xl font-extrabold tabular-nums transition-colors ${
                  p2.length === PHASE_TARGET[1] ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {p2.length}/{PHASE_TARGET[1]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                フェーズ1で選んだ5枚から、さらに「本当に大切なもの」を3枚選んでください。
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {phase2Cards.map(card => (
                  <motion.button
                    key={card.id}
                    layout
                    onClick={() => toggleP2(card.id)}
                    disabled={p2.length >= PHASE_TARGET[1] && !p2.includes(card.id)}
                    className={`relative p-5 rounded-2xl border-2 text-center transition-all ${
                      p2.includes(card.id)
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-[1.02]'
                        : p2.length >= PHASE_TARGET[1]
                        ? 'border-gray-100 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 bg-white hover:border-indigo-300 cursor-pointer'
                    }`}
                    whileTap={{ scale: 0.96 }}
                  >
                    {p2.includes(card.id) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <span className="text-xl font-extrabold text-gray-800 block mb-2">{card.keyword}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${card.categoryColor}`}>
                      {card.categoryName}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center no-print">
              <button onClick={() => setPhase(1)} className="btn-secondary">← フェーズ1に戻る</button>
              <button
                onClick={() => setPhase(3)}
                disabled={!canProceed2}
                className="btn-primary"
              >
                フェーズ3へ（{p2.length}/{PHASE_TARGET[1]}枚選択中）
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Phase 3: Select 1 TOP ── */}
        {phase === 3 && (
          <motion.div
            key="phase3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div className="card-base p-5 mb-5">
              <h3 className="section-title">究極の1枚（TOP1）を選んでください</h3>
              <p className="text-sm text-gray-500 mb-5">
                3枚の中で、あなたの人生の核心にある「最も大切な1つ」を選んでください。
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {phase3Cards.map(card => (
                  <motion.button
                    key={card.id}
                    onClick={() => selectP3(card.id)}
                    className={`relative p-6 rounded-2xl border-3 text-center transition-all ${
                      p3 === card.id
                        ? 'border-amber-500 bg-amber-50 shadow-xl scale-[1.05]'
                        : 'border-gray-200 bg-white hover:border-amber-300 cursor-pointer shadow-md'
                    }`}
                    style={{ borderWidth: p3 === card.id ? 3 : 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {p3 === card.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full"
                      >
                        ★ TOP 1
                      </motion.div>
                    )}
                    <span className="text-2xl font-extrabold text-gray-800 block mb-2">{card.keyword}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${card.categoryColor}`}>
                      {card.categoryName}
                    </span>
                  </motion.button>
                ))}
              </div>

              {top1Card && (
                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm font-bold text-amber-700">
                    あなたのTOP1: <span className="text-lg">「{top1Card.keyword}」</span>
                  </p>
                </div>
              )}
            </div>

            {/* Episode forms for TOP3 */}
            {top3Cards.length > 0 && (
              <div className="card-base p-5 mb-5">
                <h3 className="section-title">TOP3の価値観について教えてください</h3>
                <div className="space-y-6">
                  {top3Cards.map((card, i) => (
                    <div key={card.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {card.id === p3 && (
                          <span className="bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                            TOP1
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${card.categoryColor}`}>
                          {card.categoryName}
                        </span>
                        <span className="font-extrabold text-gray-800">「{card.keyword}」</span>
                        <span className="text-sm text-gray-400">（第{i + 1}位）</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="label-text text-xs">具体的なエピソード・経験</label>
                          <textarea
                            rows={2}
                            className="textarea-base"
                            placeholder={`「${card.keyword}」を大切にした経験、感じた瞬間は？`}
                            value={episodes[card.id]?.episode || ''}
                            onChange={e => updateEpisode(card.id, 'episode', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="label-text text-xs">そのとき感じたこと・大切だと思ったこと</label>
                          <textarea
                            rows={2}
                            className="textarea-base"
                            placeholder="どんな気持ちでしたか？なぜ大切だと気づきましたか？"
                            value={episodes[card.id]?.feeling || ''}
                            onChange={e => updateEpisode(card.id, 'feeling', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reverse reflection */}
            <div className="card-base p-5 mb-5">
              <h3 className="section-title">「興味がない」の裏返し内省</h3>
              <label className="label-text">
                Step 1で「興味がない」に分類したカードを振り返って、見えてきたことはありますか？
                <span className="text-gray-400 font-normal text-xs ml-1">（大切にしていることの裏返し）</span>
              </label>
              <textarea
                rows={3}
                className="textarea-base"
                placeholder="例：「一人でコツコツ作業する職業」を選ばなかったのは、人と関わることへの強い欲求の表れかもしれない…"
                value={state.step2Reflection}
                onChange={e => update({ step2Reflection: e.target.value })}
              />
            </div>

            <div className="flex justify-between items-center no-print">
              <button onClick={() => setPhase(2)} className="btn-secondary">← フェーズ2に戻る</button>
              <button
                onClick={onNext}
                disabled={!canProceed3}
                className="btn-primary"
              >
                Step 3 へ →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
