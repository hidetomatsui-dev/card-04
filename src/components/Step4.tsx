import { motion } from 'framer-motion';
import type { AppState } from '../types';
import { valueCards } from '../data/valueCards';

interface Props {
  state: AppState;
  update: (updates: Partial<AppState>) => void;
  onBack: () => void;
}

export default function Step4({ state, update, onBack }: Props) {
  const top3Cards  = valueCards.filter(c => state.phase2Selected.includes(c.id));
  const top1Card   = valueCards.find(c => c.id === state.phase3Selected);

  const updateAction = (index: 0 | 1 | 2, value: string) => {
    const newActions: [string, string, string] = [...state.actions];
    newActions[index] = value;
    update({ actions: newActions });
  };

  const isComplete =
    state.careerDirection.trim().length > 0 &&
    state.actions.some(a => a.trim().length > 0) &&
    state.finalSummary.trim().length > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shrink-0">4</span>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">行動への橋渡し</h2>
          <p className="text-sm text-gray-500">Action — 今日の気づきを明日の一歩につなげる</p>
        </div>
      </div>

      {/* Summary recap */}
      {(top3Cards.length > 0 || state.step3Summary) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base p-5 mb-6 bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100"
        >
          <h3 className="text-sm font-extrabold text-indigo-700 mb-3">これまでの気づきのまとめ</h3>
          <div className="space-y-2 text-sm">
            {state.riasecChecked.length > 0 && (
              <p className="text-gray-700">
                <span className="font-bold">職業興味のタイプ: </span>
                {state.riasecChecked.join('型・')}型
              </p>
            )}
            {top3Cards.length > 0 && (
              <p className="text-gray-700">
                <span className="font-bold">価値観TOP3: </span>
                {top3Cards.map(c => c.keyword).join(' ／ ')}
                {top1Card && <span className="text-amber-600 font-bold ml-1">（TOP1: {top1Card.keyword}）</span>}
              </p>
            )}
            {state.step3Summary && (
              <p className="text-gray-700">
                <span className="font-bold">交差点: </span>
                {state.step3Summary}
              </p>
            )}
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Career direction */}
        <div className="card-base p-6">
          <h3 className="section-title">キャリアの方向性</h3>
          <label className="label-text">
            これまでの気づきをもとに、"自分らしいキャリアの方向性"を短い文にまとめてください
          </label>
          <textarea
            rows={4}
            className="textarea-base"
            placeholder="例：こういう働き方がしたい、こんな環境が合いそう、こんな役割を担いたい…"
            value={state.careerDirection}
            onChange={e => update({ careerDirection: e.target.value })}
          />
        </div>

        {/* Small steps */}
        <div className="card-base p-6">
          <h3 className="section-title">24時間以内のスモールステップ</h3>
          <p className="text-sm text-gray-500 mb-4">
            自分らしいキャリアのためにすぐにできることを3つ書いてください。小さなことで十分です。
          </p>

          <div className="space-y-3">
            {([0, 1, 2] as const).map(i => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black shrink-0 text-sm ${
                  i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-indigo-400' : 'bg-indigo-300'
                }`}>
                  {i + 1}
                </div>
                <input
                  type="text"
                  className="input-base flex-1"
                  placeholder={
                    i === 0 ? '例：キャリア相談のイベントを検索してみる'
                    : i === 1 ? '例：興味のある職業の求人を3件だけ読んでみる'
                    : '例：信頼できる人に今日の気づきを話してみる'
                  }
                  value={state.actions[i]}
                  onChange={e => updateAction(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Final summary */}
        <div className="card-base p-6">
          <h3 className="section-title text-indigo-700">今日の一文まとめ</h3>
          <label className="label-text font-bold text-gray-700">
            このワークショップで一番大切だと思った気づきを一文で書いてください
          </label>
          <textarea
            rows={3}
            className="textarea-base border-indigo-200 focus:ring-indigo-400 text-base"
            placeholder="例：「人と関わる」ことへの欲求は、仕事の楽しさだけでなく、「育成」という価値観とも深くつながっていることに気づいた。"
            value={state.finalSummary}
            onChange={e => update({ finalSummary: e.target.value })}
          />
        </div>

        {/* Completion message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-base p-6 text-center bg-gradient-to-r from-green-50 to-teal-50 border-green-100"
          >
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-extrabold text-green-700 mb-2">ワークショップ完了！</h3>
            <p className="text-sm text-gray-600">
              お疲れ様でした。下部のエクスポートボタンで記録を保存できます。
            </p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center no-print">
          <button onClick={onBack} className="btn-secondary">← 戻る</button>
          <div className="text-sm text-gray-400">
            全ステップ完了・エクスポート可能
          </div>
        </div>
      </div>
    </div>
  );
}
