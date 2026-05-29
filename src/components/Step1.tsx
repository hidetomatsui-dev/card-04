import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { AppState, RIASECType, SortResult } from '../types';
import { RIASEC_LABELS, RIASEC_COLORS, RIASEC_TEXT_COLORS, RIASEC_BADGE_COLORS } from '../types';
import { ohbyCards } from '../data/ohbyCards';

interface Props {
  state: AppState;
  update: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const RIASEC_TYPES: RIASECType[] = ['R', 'I', 'A', 'S', 'E', 'C'];

// ─── Draggable Card ───────────────────────────────────────────
interface DragCardProps {
  card: (typeof ohbyCards)[number];
  onSort: (result: SortResult) => void;
}

function DragCard({ card, onSort }: DragCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-22, 22]);
  const interestedOpacity  = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity        = useTransform(x, [-100, -20], [1, 0]);
  const neutralOpacity     = useTransform(y, [20, 100], [0, 1]);

  const handleDragEnd = useCallback(
    (_: PointerEvent, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
      const { offset, velocity } = info;
      const swipeRight = offset.x > 80 || (offset.x > 40 && velocity.x > 400);
      const swipeLeft  = offset.x < -80 || (offset.x < -40 && velocity.x < -400);
      const swipeDown  = offset.y > 80 || (offset.y > 40 && velocity.y > 400);

      if (swipeRight) {
        animate(x, 700, { duration: 0.35, ease: 'easeOut', onComplete: () => onSort('interested') });
        animate(y, -30, { duration: 0.35 });
      } else if (swipeLeft) {
        animate(x, -700, { duration: 0.35, ease: 'easeOut', onComplete: () => onSort('not-interested') });
        animate(y, -30, { duration: 0.35 });
      } else if (swipeDown) {
        animate(y, 700, { duration: 0.35, ease: 'easeOut', onComplete: () => onSort('neutral') });
      }
      // else: snap back via dragConstraints
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
        style={{ opacity: interestedOpacity }}
        className="absolute top-5 left-5 z-10 bg-green-500 text-white text-sm font-black px-3 py-1.5 rounded-xl border-2 border-green-600 rotate-[-8deg] pointer-events-none"
      >
        興味がある ✓
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-5 right-5 z-10 bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-xl border-2 border-red-600 rotate-[8deg] pointer-events-none"
      >
        興味がない ✕
      </motion.div>
      <motion.div
        style={{ opacity: neutralOpacity }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 bg-gray-500 text-white text-sm font-black px-3 py-1.5 rounded-xl border-2 border-gray-600 pointer-events-none"
      >
        どちらでもない …
      </motion.div>

      {/* Card face */}
      <div className="w-72 h-96 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center justify-center p-8 gap-4">
        <div className="text-6xl">{card.emoji}</div>
        <h3 className="text-xl font-extrabold text-gray-800 text-center leading-tight">{card.title}</h3>
        <p className="text-sm text-gray-500 text-center leading-relaxed">{card.description}</p>
      </div>
    </motion.div>
  );
}

// ─── RIASEC Bar Chart ────────────────────────────────────────
function RIASECChart({ counts }: { counts: Record<RIASECType, number> }) {
  const max = Math.max(...Object.values(counts), 1);
  return (
    <div className="space-y-3">
      {RIASEC_TYPES.map((t, i) => (
        <div key={t} className="flex items-center gap-3">
          <span className={`w-10 text-xs font-black shrink-0 ${RIASEC_TEXT_COLORS[t]}`}>{t}型</span>
          <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${RIASEC_COLORS[t]} flex items-center justify-end pr-2`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max((counts[t] / max) * 100, counts[t] > 0 ? 8 : 0)}%` }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
            >
              {counts[t] > 0 && (
                <span className="text-white text-xs font-bold">{counts[t]}</span>
              )}
            </motion.div>
          </div>
          <span className="w-6 text-sm font-bold text-gray-600 text-right shrink-0">{counts[t]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Step1 ──────────────────────────────────────────────
export default function Step1({ state, update, onNext, onBack }: Props) {
  const sorted = state.cardSortResults;
  const sortedCount = Object.keys(sorted).length;
  const total = ohbyCards.length;
  const isDone = sortedCount >= total;

  // Use shuffled cardOrder; fall back to static order for legacy data
  const cardOrder = state.cardOrder.length > 0 ? state.cardOrder : ohbyCards.map(c => c.id);
  const unsortedIds = cardOrder.filter(id => sorted[id] === undefined);
  const currentCard = unsortedIds.length > 0 ? ohbyCards.find(c => c.id === unsortedIds[0]) : undefined;

  const handleSort = useCallback(
    (result: SortResult) => {
      if (!currentCard) return;
      const newResults = { ...sorted, [currentCard.id]: result };
      const newHistory = [...state.sortHistory, currentCard.id];

      // Auto-update RIASEC checks when done
      if (Object.keys(newResults).length >= total) {
        const counts: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        ohbyCards.forEach(c => {
          if (newResults[c.id] === 'interested') counts[c.type]++;
        });
        const checked = RIASEC_TYPES.filter(t => counts[t] > 0);
        update({ cardSortResults: newResults, sortHistory: newHistory, riasecChecked: checked });
      } else {
        update({ cardSortResults: newResults, sortHistory: newHistory });
      }
    },
    [currentCard, sorted, state.sortHistory, total, update]
  );

  // Keyboard shortcuts
  useEffect(() => {
    if (isDone) return;
    const handler = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowRight') handleSort('interested');
        if (e.key === 'ArrowLeft')  handleSort('not-interested');
        if (e.key === 'ArrowDown')  handleSort('neutral');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDone, handleSort]);

  // RIASEC counts from interested cards
  const counts: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  ohbyCards.forEach(c => {
    if (sorted[c.id] === 'interested') counts[c.type]++;
  });

  const interestedCards = ohbyCards.filter(c => sorted[c.id] === 'interested');
  const progressPct = (sortedCount / total) * 100;

  const toggleRIASEC = (t: RIASECType) => {
    const checked = state.riasecChecked.includes(t)
      ? state.riasecChecked.filter(r => r !== t)
      : [...state.riasecChecked, t];
    update({ riasecChecked: checked });
  };

  // Stack background cards (from shuffled order)
  const nextCard  = unsortedIds.length > 1 ? ohbyCards.find(c => c.id === unsortedIds[1]) : undefined;
  const nextCard2 = unsortedIds.length > 2 ? ohbyCards.find(c => c.id === unsortedIds[2]) : undefined;
  const stackRef  = useRef<typeof currentCard>(currentCard);
  stackRef.current = currentCard;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shrink-0">1</span>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">職業興味の可視化</h2>
          <p className="text-sm text-gray-500">What — あなたが惹かれる仕事の世界を見つける</p>
        </div>
      </div>

      {!isDone ? (
        /* ── Sorting phase ── */
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
            {/* Background cards (stack effect) */}
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

            {/* Current draggable card */}
            {currentCard && (
              <DragCard
                key={currentCard.id}
                card={currentCard}
                onSort={handleSort}
              />
            )}
          </div>

          {/* Hint text */}
          <p className="text-center text-xs text-gray-400 mb-5">
            左右にドラッグ、または下にスワイプ &nbsp;|&nbsp; PC: ← → ↓ キー
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSort('not-interested')}
              className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 font-bold hover:bg-red-100 active:scale-95 transition-all"
            >
              <span className="text-2xl">👈</span>
              <span className="text-xs">興味がない</span>
            </button>
            <button
              onClick={() => handleSort('neutral')}
              className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-100 active:scale-95 transition-all"
            >
              <span className="text-2xl">👇</span>
              <span className="text-xs">どちらでもない</span>
            </button>
            <button
              onClick={() => handleSort('interested')}
              className="flex flex-col items-center gap-1 py-4 rounded-2xl bg-green-50 border-2 border-green-200 text-green-600 font-bold hover:bg-green-100 active:scale-95 transition-all"
            >
              <span className="text-2xl">👉</span>
              <span className="text-xs">興味がある</span>
            </button>
          </div>

          {/* Undo button */}
          {state.sortHistory.length > 0 && (
            <button
              onClick={() => {
                const history = state.sortHistory;
                const lastId = history[history.length - 1];
                const newResults = { ...sorted };
                delete newResults[lastId];
                update({
                  cardSortResults: newResults,
                  sortHistory: history.slice(0, -1),
                });
              }}
              className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              ← 1枚戻す
            </button>
          )}
        </div>
      ) : (
        /* ── Results phase ── */
        <div className="space-y-6">
          {/* Completion banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-base p-6 bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100 text-center"
          >
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-extrabold text-indigo-700 mb-1">仕分け完了！</h3>
            <p className="text-sm text-gray-600">
              「興味がある」カード: <strong className="text-indigo-700">{interestedCards.length}枚</strong>
            </p>
          </motion.div>

          {/* RIASEC Chart */}
          <div className="card-base p-6">
            <h3 className="section-title">職業興味のタイプ集計</h3>
            <RIASECChart counts={counts} />

            {/* RIASEC checkboxes */}
            <div className="mt-5">
              <p className="text-sm text-gray-500 mb-3">
                自動チェックを確認・調整してください（複数選択可）
              </p>
              <div className="flex flex-wrap gap-2">
                {RIASEC_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleRIASEC(t)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${
                      state.riasecChecked.includes(t)
                        ? `border-current ${RIASEC_TEXT_COLORS[t]} bg-current/10`
                        : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span>{state.riasecChecked.includes(t) ? '✓' : '○'}</span>
                    <span>{RIASEC_LABELS[t].split('（')[0]}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${state.riasecChecked.includes(t) ? '' : 'bg-gray-100'}`}>
                      {counts[t]}枚
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interested cards list */}
          {interestedCards.length > 0 && (
            <div className="card-base p-6">
              <h3 className="section-title">「興味がある」カード一覧</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {interestedCards.map(c => (
                  <div key={c.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-2xl shrink-0">{c.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${RIASEC_BADGE_COLORS[c.type]}`}>
                          {c.type}型
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-800">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reflections */}
          <div className="card-base p-6 space-y-5">
            <h3 className="section-title">内省メモ</h3>

            <div>
              <label className="label-text">
                「興味がある」カードに共通していたこと・気づいたパターンは何ですか？
              </label>
              <textarea
                rows={3}
                className="textarea-base"
                placeholder="例：「人と関わる仕事」「手を動かして成果が見える仕事」が多かった…"
                value={state.step1Reflection1}
                onChange={e => update({ step1Reflection1: e.target.value })}
              />
            </div>

            <div>
              <label className="label-text">
                その職業興味のタイプに惹かれる背景・理由は？（過去の経験や得意だったことから）
              </label>
              <textarea
                rows={3}
                className="textarea-base"
                placeholder="例：学生時代に…が得意で、〜をしたときに達成感を感じた…"
                value={state.step1Reflection2}
                onChange={e => update({ step1Reflection2: e.target.value })}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center no-print">
            <button onClick={onBack} className="btn-secondary">← 戻る</button>
            <button onClick={onNext} className="btn-primary">Step 2 へ →</button>
          </div>
        </div>
      )}

      {/* Reset button (small) */}
      {isDone && (
        <div className="mt-4 text-center no-print">
          <button
            onClick={() => {
              if (confirm('仕分け結果をリセットしますか？')) {
                update({ cardSortResults: {}, sortHistory: [], riasecChecked: [] });
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
