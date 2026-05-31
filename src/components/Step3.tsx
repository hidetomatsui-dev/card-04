import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppState, RIASECType } from '../types';
import { RIASEC_TEXT_COLORS, RIASEC_BADGE_COLORS } from '../types';
import { valueCards } from '../data/valueCards';
import { ohbyCards } from '../data/ohbyCards';

interface Props {
  state: AppState;
  update: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const RIASEC_TYPES: RIASECType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
const RIASEC_DESC: Record<RIASECType, string> = {
  R: '現実的・具体的',
  I: '研究・分析的',
  A: '芸術・創造的',
  S: '社会・支援的',
  E: '企業・説得的',
  C: '慣習・整理的',
};

const HINT_EXAMPLES: { value: string; type: RIASECType; text: string }[] = [
  { value: '達成', type: 'R', text: '手を動かして確かな成果物を作り上げる技術者' },
  { value: '達成', type: 'I', text: 'データを検証して発見を積み重ねる研究者' },
  { value: '達成', type: 'A', text: '作品を完成させ、世界に届けるクリエイター' },
  { value: '達成', type: 'S', text: '人の成長という成果を見届ける伴走者' },
  { value: '達成', type: 'E', text: '事業目標を達成するためにチームを率いるリーダー' },
  { value: '達成', type: 'C', text: '正確な管理でプロジェクトを完成に導く縁の下の力持ち' },
  { value: '社会貢献', type: 'S', text: '誰かの困りごとに寄り添い、地域社会を支える支援者' },
  { value: '自由',     type: 'A', text: '制約なく表現し、自分の世界観を形にするアーティスト' },
  { value: '挑戦',     type: 'E', text: 'リスクを取って新市場を開拓する先駆者' },
  { value: '安定',     type: 'C', text: '正確・丁寧な業務で組織の基盤を守る管理者' },
  { value: '育成',     type: 'S', text: '目に見える成長を促す教育支援者' },
  { value: '探求',     type: 'I', text: '問いを立て、実験で検証し続ける科学者' },
];

interface CellModalProps {
  cellKey: string;
  valueLabel: string;
  riasecType: RIASECType;
  initialValue: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

function CellModal({ cellKey: _key, valueLabel, riasecType, initialValue, onSave, onClose }: CellModalProps) {
  const [text, setText] = useState(initialValue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.35 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">「{valueLabel}」</span>
            <span>×</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${RIASEC_BADGE_COLORS[riasecType]}`}>
              {riasecType}型
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          この組み合わせで「どんな働き方・役割」が思い浮かびますか？<br />
          <span className="text-indigo-600">動詞ベース</span>で自由に書いてみてください。
        </p>

        <textarea
          rows={4}
          autoFocus
          className="textarea-base mb-4"
          placeholder={`例：「${valueLabel}」を感じながら${RIASEC_DESC[riasecType]}な仕事で〜する人`}
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">キャンセル</button>
          <button
            onClick={() => { onSave(text); onClose(); }}
            className="btn-primary flex-1"
          >
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HintModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.35 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-extrabold text-gray-800">記入例ヒント集</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          あくまで参考です。自分の言葉で書くことが大切です。
        </p>
        <div className="space-y-2">
          {HINT_EXAMPLES.map((ex, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-gray-500">「{ex.value}」</span>
                <span className="text-xs text-gray-400">×</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${RIASEC_BADGE_COLORS[ex.type]}`}>
                  {ex.type}型
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">→ {ex.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Step3({ state, update, onNext, onBack }: Props) {
  const [modalCell, setModalCell] = useState<{ key: string; valueLabel: string; type: RIASECType } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const top3Ids = state.phase2Selected;
  const top3Cards = valueCards.filter(c => top3Ids.includes(c.id));
  const hasTop3 = top3Cards.length > 0;

  // Compute top-3 RIASEC types by count (from user's "interested" sort results)
  const riasecCounts: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  ohbyCards.forEach(c => {
    if (state.cardSortResults[c.id] === 'interested') riasecCounts[c.type]++;
  });
  const sortedRiasec = [...state.riasecChecked].sort((a, b) => riasecCounts[b] - riasecCounts[a]);
  const matrixTypes: RIASECType[] = sortedRiasec.length > 0 ? sortedRiasec.slice(0, 3) : RIASEC_TYPES;

  const saveCell = (key: string, value: string) => {
    update({ matrixData: { ...state.matrixData, [key]: value } });
  };

  const filledCells = Object.values(state.matrixData).filter(v => v.trim().length > 0).length;
  const totalCells = top3Cards.length * matrixTypes.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shrink-0">3</span>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">統合と納得</h2>
          <p className="text-sm text-gray-500">Alignment — 興味と価値観が交差する「働き方のレシピ」を言語化する</p>
        </div>
      </div>

      {!hasTop3 ? (
        <div className="card-base p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 font-bold mb-2">Step 2を完了してください</p>
          <p className="text-sm text-gray-400 mb-6">マトリクスを作成するには、Step 2で価値観TOP3を選択する必要があります。</p>
          <button onClick={onBack} className="btn-primary">← Step 2 に戻る</button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Matrix */}
          <div className="card-base p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="section-title mb-0">マイ・統合マトリクス</h3>
                {totalCells > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {filledCells} / {totalCells} セル記入済み &nbsp;
                    <span className="text-indigo-500">（セルをクリックして入力）</span>
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold hover:bg-amber-100 transition-colors no-print"
              >
                💡 ヒントを見る
              </button>
            </div>

            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full border-collapse print-matrix text-sm">
                <thead>
                  <tr>
                    <th className="p-3 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-semibold min-w-[90px] sticky left-0 z-10">
                      価値観 ＼ タイプ
                    </th>
                    {matrixTypes.map(t => (
                      <th key={t} className="p-3 bg-gray-50 border border-gray-200 min-w-[120px]">
                        <span className={`font-extrabold text-sm ${RIASEC_TEXT_COLORS[t]}`}>{t}型</span>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">{RIASEC_DESC[t]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {top3Cards.map(vCard => (
                    <tr key={vCard.id}>
                      <td className="p-3 border border-gray-200 bg-gray-50 sticky left-0 z-10">
                        <span className={`text-xs font-extrabold px-2 py-1 rounded-full border block text-center ${vCard.categoryColor}`}>
                          {vCard.keyword}
                        </span>
                        {vCard.id === state.phase3Selected && (
                          <span className="block text-center text-[10px] font-bold text-amber-600 mt-1">★TOP1</span>
                        )}
                      </td>
                      {matrixTypes.map(t => {
                        const key = `${vCard.id}-${t}`;
                        const text = state.matrixData[key] || '';
                        return (
                          <td
                            key={t}
                            onClick={() => setModalCell({ key, valueLabel: vCard.keyword, type: t })}
                            className={`p-3 border border-gray-200 cursor-pointer transition-colors align-top no-print-interactive ${
                              text
                                ? 'bg-white hover:bg-indigo-50'
                                : 'bg-white hover:bg-indigo-50/50'
                            }`}
                          >
                            {text ? (
                              <p className="text-xs text-gray-700 leading-relaxed">{text}</p>
                            ) : (
                              <span className="text-xs text-gray-300 italic">+ クリックして入力</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alignment forms */}
          <div className="card-base p-5 space-y-5">
            <h3 className="section-title">交差点の言語化</h3>

            <div>
              <label className="label-text">
                一致していたこと（職業興味と価値観が重なっていた部分）
              </label>
              <textarea
                rows={3}
                className="textarea-base"
                placeholder="例：「S型×社会貢献」と「S型×育成」が一致していた。人を支えることへの一貫した動機が見えた。"
                value={state.step3Alignment1}
                onChange={e => update({ step3Alignment1: e.target.value })}
              />
            </div>

            <div>
              <label className="label-text">
                ズレていたこと（意外だったこと・説明がつかなかった部分）
              </label>
              <textarea
                rows={3}
                className="textarea-base"
                placeholder="例：「達成」を選んだのに、E型（企業的）の仕事はあまり興味がなかった。競争より協力で達成したいのかも。"
                value={state.step3Alignment2}
                onChange={e => update({ step3Alignment2: e.target.value })}
              />
            </div>

            <div>
              <label className="label-text font-extrabold text-indigo-700">
                自分の職業興味のタイプ × 価値観の「交差点」を一言で表すと？
              </label>
              <textarea
                rows={2}
                className="textarea-base border-indigo-200 focus:ring-indigo-400 text-base"
                placeholder="例：「人と関わりながら（S型）、誰かの成長に貢献したい（育成）」"
                value={state.step3Summary}
                onChange={e => update({ step3Summary: e.target.value })}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center no-print">
            <button onClick={onBack} className="btn-secondary">← 戻る</button>
            <button onClick={onNext} className="btn-primary">Step 4 へ →</button>
          </div>
        </div>
      )}

      {/* Cell modal */}
      <AnimatePresence>
        {modalCell && (
          <CellModal
            key={modalCell.key}
            cellKey={modalCell.key}
            valueLabel={modalCell.valueLabel}
            riasecType={modalCell.type}
            initialValue={state.matrixData[modalCell.key] || ''}
            onSave={val => saveCell(modalCell.key, val)}
            onClose={() => setModalCell(null)}
          />
        )}
      </AnimatePresence>

      {/* Hint modal */}
      <AnimatePresence>
        {showHint && <HintModal key="hint" onClose={() => setShowHint(false)} />}
      </AnimatePresence>
    </div>
  );
}
