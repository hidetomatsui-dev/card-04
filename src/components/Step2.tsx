import { useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { AppState, ValueSortResult } from '../types';
import { valueCards } from '../data/valueCards';

interface Props {
  state: AppState;
  update: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

// ─── Draggable Value Card ─────────────────────────────────────
interface ValueDragCardProps {
  keyword: string;
  onSort: (result: ValueSortResult) => void;
}

function ValueDragCard({ keyword, onSort }: ValueDragCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-22, 22]);
  const importantOpacity    = useTransform(x, [20, 100], [0, 1]);
  const notImportantOpacity = useTransform(x, [-100, -20], [1, 0]);
  const neutralOpacity      = useTransform(y, [20, 100], [0, 1]);

  const handleDragEnd = useCallback(
    (_: PointerEvent, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
      const { offset, velocity } = info;
      const swipeRight = offset.x > 80 || (offset.x > 40 && velocity.x > 400);
      const swipeLeft  = offset.x < -80 || (offset.x < -40 && velocity.x < -400);
      const swipeDown  = offset.y > 80 || (offset.y > 40 && velocity.y > 400);

      if (swipeRight) {
        animate(x, 700, { duration: 0.35, ease: 'easeOut', onComplete: () => onSort('important') });
        animate(y, -30, { duration: 0.35 });
      } else if (swipeLeft) {
        animate(x, -700, { duration: 0.35, ease: 'easeOut', onComplete: () => onSort('not-important') });
        animate(y, -30, { duration: 0.35 });
      } else if (swipeDown) {
        animate(y, 700, { duration: 0.35, ease: 'easeOut', onComplete: () => onSort('neutral') });
      }
    },
    [x, y, onSort]
  );

  return (
    <motion.div
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.75}
      whileDrag={{ scale: 1.04, zIndex: 50 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 1, opacity: 1 }}
      className="drag-card absolute touch-none select-none"
    >
      {/* Direction overlays */}
      <motion.div
        style={{ opacity: importantOpacity }}
        className="absolute top-5 left-5 z-10 bg-green-500 text-white text-sm font-black px-3 py-1.5 rounded-xl border-2 border-green-600 rotate-[-8deg] pointer-events-none"
      >
        とても大切 ✓
      </motion.div>
      <motion.div
        style={{ opacity: notImportantOpacity }}
        className="absolute top-5 right-5 z-10 bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-xl border-2 border-red-600 rotate-[8deg] pointer-events-none"
      >
        大切でない ✕
      </motion.div>
      <motion.div
        style={{ opacity: neutralOpacity }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 bg-gray-500 text-white text-sm font-black px-3 py-1.5 rounded-xl border-2 border-gray-600 pointer-events-none"
      >
        大切 …
      </motion.div>

      {/* Card face — keyword only, no category */}
      <div className="w-72 h-96 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center justify-center p-8">
        <p className="text-3xl font-extrabold text-gray-800 text-center leading-tight">{keyword}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Step2 ───────────────────────────────────────────────
export default function Step2({ state, update, onNext, onBack }: Props) {
  const sorted   = state.valueSortResults;
  const cardOrder = state.valueCardOrder.length > 0 ? state.valueCardOrder : valueCards.map(c => c.id);
  const total    = valueCards.length;
  const sortedCount = Object.keys(sorted).length;
  const isDone   = sortedCount >= total;

  const unsortedIds   = cardOrder.filter(id => sorted[id] === undefined);
  const currentCard   = unsortedIds.length > 0 ? valueCards.find(c => c.id === unsortedIds[0]) : undefined;
  const nextCard      = unsortedIds.length > 1 ? valueCards.find(c => c.id === unsortedIds[1]) : undefined;
  const nextCard2     = unsortedIds.length > 2 ? valueCards.find(c => c.id === unsortedIds[2]) : undefined;

  // 「とても大切」が3枚以上あればそれだけを候補に、2枚以下なら「大切」も含める
  const veryImportantCards = valueCards.filter(c => sorted[c.id] === 'important');
  const candidateCards = veryImportantCards.length >= 3
    ? veryImportantCards
    : valueCards.filter(c => sorted[c.id] === 'important' || sorted[c.id] === 'neutral');
  const candidateLabel = veryImportantCards.length >= 3 ? '「とても大切」' : '「大切」「とても大切」';
  const p2 = state.phase2Selected;
  const p3 = state.phase3Selected;
  const episodes = state.valueEpisodes;

  const progressPct = (sortedCount / total) * 100;

  const handleSort = useCallback(
    (result: ValueSortResult) => {
      if (!currentCard) return;
      update({
        valueSortResults: { ...sorted, [currentCard.id]: result },
        valueSortHistory: [...state.valueSortHistory, currentCard.id],
      });
    },
    [currentCard, sorted, state.valueSortHistory, update]
  );

  // Keyboard shortcuts
  useEffect(() => {
    if (isDone) return;
    const handler = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowRight') handleSort('important');
        if (e.key === 'ArrowLeft')  handleSort('not-important');
        if (e.key === 'ArrowDown')  handleSort('neutral');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDone, handleSort]);

  const toggleP2 = (id: number) => {
    if (p2.includes(id)) {
      update({ phase2Selected: p2.filter(x => x !== id) });
    } else if (p2.length < 3) {
      update({ phase2Selected: [...p2, id] });
    }
  };

  const updateEpisode = (id: number, field: 'episode' | 'feeling', value: string) => {
    update({
      valueEpisodes: {
        ...episodes,
        [id]: { ...episodes[id], [field]: value },
      },
    });
  };

  const top3Cards = valueCards.filter(c => p2.includes(c.id));
  const top1Card  = valueCards.find(c => c.id === p3);

  // Determine current UI phase
  const uiPhase: 'sorting' | 'pick3' | 'pick1' | 'episodes' =
    !isDone ? 'sorting'
    : p3 !== null ? 'episodes'
    : p2.length === 3 ? 'pick1'
    : 'pick3';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shrink-0">2</span>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">キャリアの価値観の可視化</h2>
          <p className="text-sm text-gray-500">Why — あなたが大切にしている価値観の核心を見つける</p>
        </div>
      </div>

      {/* Phase indicator */}
      <div className="flex items-center gap-2 mb-6 no-print overflow-x-auto pb-1">
        {[
          { key: 'sorting', label: '仕分け' },
          { key: 'pick3',   label: '3枚選ぶ' },
          { key: 'pick1',   label: 'TOP1' },
          { key: 'episodes',label: '内省' },
        ].map((ph, i, arr) => {
          const phases = ['sorting', 'pick3', 'pick1', 'episodes'];
          const phaseIdx = phases.indexOf(ph.key);
          const currentIdx = phases.indexOf(uiPhase);
          const isActive = ph.key === uiPhase;
          const isCompleted = phaseIdx < currentIdx;
          return (
            <div key={ph.key} className="flex items-center shrink-0">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isCompleted
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <span>{isCompleted ? '✓' : phaseIdx + 1}</span>
                <span>{ph.label}</span>
              </div>
              {i < arr.length - 1 && <span className="mx-1 text-gray-300 shrink-0">→</span>}
            </div>
          );
        })}
      </div>

      {/* ── Sorting phase ── */}
      {uiPhase === 'sorting' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card-base p-6 mb-8">
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">{sortedCount} / {total} 枚</span>
              <span className="text-xs text-gray-400">残り {total - sortedCount} 枚</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Card stack */}
            <div className="relative h-[26rem] flex items-center justify-center mb-6">
              {nextCard2 && (
                <div className="absolute translate-y-4 scale-[0.88] opacity-30 pointer-events-none">
                  <div className="w-72 sm:w-80 h-96 bg-white rounded-2xl border border-gray-200 shadow-sm" />
                </div>
              )}
              {nextCard && (
                <div className="absolute translate-y-2 scale-[0.94] opacity-60 pointer-events-none">
                  <div className="w-72 sm:w-80 h-96 bg-white rounded-2xl border border-gray-200 shadow-md" />
                </div>
              )}
              {currentCard && (
                <ValueDragCard
                  key={currentCard.id}
                  keyword={currentCard.keyword}
                  onSort={handleSort}
                />
              )}
            </div>

            {/* Hint */}
            <p className="text-center text-xs text-gray-400 mb-5">
              左右にドラッグ、または下にスワイプ &nbsp;|&nbsp; PC: ← → ↓ キー
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSort('not-important')}
                className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 font-bold hover:bg-red-100 active:scale-95 transition-all"
              >
                <span className="text-2xl">👈</span>
                <span className="text-xs">大切でない</span>
              </button>
              <button
                onClick={() => handleSort('neutral')}
                className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-100 active:scale-95 transition-all"
              >
                <span className="text-2xl">👇</span>
                <span className="text-xs">大切</span>
              </button>
              <button
                onClick={() => handleSort('important')}
                className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-green-50 border-2 border-green-200 text-green-600 font-bold hover:bg-green-100 active:scale-95 transition-all"
              >
                <span className="text-2xl">👉</span>
                <span className="text-xs">とても大切</span>
              </button>
            </div>

            {/* Undo */}
            {state.valueSortHistory.length > 0 && (
              <button
                onClick={() => {
                  const history = state.valueSortHistory;
                  const lastId = history[history.length - 1];
                  const newResults = { ...sorted };
                  delete newResults[lastId];
                  update({
                    valueSortResults: newResults,
                    valueSortHistory: history.slice(0, -1),
                  });
                }}
                className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
              >
                ← 1枚戻す
              </button>
            )}
          </div>

          <div className="flex justify-between items-center no-print">
            <button onClick={onBack} className="btn-secondary">← 戻る</button>
          </div>
        </motion.div>
      )}

      {/* ── Pick 3 phase ── */}
      {uiPhase === 'pick3' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Completion banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-base p-6 bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100 text-center mb-6"
          >
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-extrabold text-indigo-700 mb-1">仕分け完了！</h3>
            <p className="text-sm text-gray-600">
              {candidateLabel}カード: <strong className="text-indigo-700">{candidateCards.length}枚</strong>
            </p>
          </motion.div>

          <div className="card-base p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0">{candidateLabel}カードから3枚に絞ってください</h3>
              <span className={`text-2xl font-extrabold tabular-nums transition-colors ${
                p2.length === 3 ? 'text-indigo-600' : 'text-gray-500'
              }`}>
                {p2.length}/3
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              {candidateLabel}に仕分けたカードの中から、特に大切な3枚を選んでください。
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {candidateCards.map(card => (
                <motion.button
                  key={card.id}
                  layout
                  onClick={() => toggleP2(card.id)}
                  disabled={p2.length >= 3 && !p2.includes(card.id)}
                  className={`relative p-3 rounded-xl border-2 text-center transition-all duration-150 select-none ${
                    p2.includes(card.id)
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : p2.length >= 3
                      ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer'
                  }`}
                  whileTap={p2.length < 3 || p2.includes(card.id) ? { scale: 0.95 } : {}}
                >
                  {p2.includes(card.id) && (
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
                  <span className={`text-sm font-bold block ${p2.includes(card.id) ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {card.keyword}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center no-print">
            <button
              onClick={() => update({ valueSortResults: {}, valueSortHistory: [] })}
              className="btn-secondary"
            >
              ← 仕分けに戻る
            </button>
            <button
              onClick={() => {/* uiPhase auto-advances when p2.length===3 */}}
              disabled={p2.length < 3}
              className="btn-primary"
              style={{ display: p2.length < 3 ? 'inline-flex' : 'none' }}
            >
              TOP1を選ぶ（{p2.length}/3枚選択中）
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Pick TOP1 phase ── */}
      {uiPhase === 'pick1' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card-base p-5 mb-5">
            <h3 className="section-title">究極の1枚（TOP1）を選んでください</h3>
            <p className="text-sm text-gray-500 mb-6">
              3枚の中で、あなたの人生の核心にある「最も大切な1つ」を選んでください。
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {top3Cards.map(card => (
                <motion.button
                  key={card.id}
                  onClick={() => update({ phase3Selected: card.id })}
                  className={`relative p-6 rounded-2xl text-center transition-all cursor-pointer ${
                    p3 === card.id
                      ? 'border-amber-500 bg-amber-50 shadow-xl scale-[1.05]'
                      : 'border-gray-200 bg-white hover:border-amber-300 shadow-md'
                  }`}
                  style={{ borderWidth: p3 === card.id ? 3 : 2, borderStyle: 'solid' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {p3 === card.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full whitespace-nowrap"
                    >
                      ★ TOP 1
                    </motion.div>
                  )}
                  <span className="text-2xl font-extrabold text-gray-800 block">{card.keyword}</span>
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

          <div className="flex justify-between items-center no-print">
            <button
              onClick={() => update({ phase2Selected: [], phase3Selected: null })}
              className="btn-secondary"
            >
              ← 3枚選びに戻る
            </button>
            <button
              disabled={p3 === null}
              onClick={() => {/* uiPhase auto-advances when p3 !== null */}}
              className="btn-primary"
              style={{ display: p3 === null ? 'inline-flex' : 'none' }}
            >
              次へ
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Episodes + reflection phase ── */}
      {uiPhase === 'episodes' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* TOP1 summary */}
          {top1Card && (
            <div className="card-base p-4 mb-5 bg-amber-50 border-amber-200 text-center">
              <p className="text-xs font-semibold text-amber-600 mb-1">あなたのTOP1価値観</p>
              <p className="text-2xl font-extrabold text-amber-800">「{top1Card.keyword}」</p>
            </div>
          )}

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
                      <span className="font-extrabold text-gray-800">「{card.keyword}」</span>
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
            <button
              onClick={() => update({ phase3Selected: null })}
              className="btn-secondary"
            >
              ← TOP1選択に戻る
            </button>
            <button onClick={onNext} className="btn-primary">
              Step 3 へ →
            </button>
          </div>
        </motion.div>
      )}

      {/* Reset sorting button */}
      {isDone && uiPhase !== 'sorting' && (
        <div className="mt-4 text-center no-print">
          <button
            onClick={() => {
              if (confirm('仕分け結果をリセットしますか？')) {
                update({
                  valueSortResults: {},
                  valueSortHistory: [],
                  phase2Selected: [],
                  phase3Selected: null,
                });
              }
            }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            仕分けをやり直す
          </button>
        </div>
      )}
    </div>
  );
}
