import { motion } from 'framer-motion';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  update: (updates: Partial<AppState>) => void;
  onNext: () => void;
}

const features = [
  { icon: '🃏', label: 'Step 1', title: '職業興味の可視化', desc: '48枚の職業興味カードを仕分けて職業興味のタイプを特定' },
  { icon: '💎', label: 'Step 2', title: 'キャリアの価値観の可視化', desc: '60枚の価値観カードを仕分けて大切な価値観TOP3を選ぶ' },
  { icon: '🗺️', label: 'Step 3', title: '統合と納得',   desc: '興味×価値観のマトリクスで「働き方のレシピ」を言語化' },
  { icon: '🚀', label: 'Step 4', title: '行動への橋渡し', desc: '24時間以内のスモールステップを設定する' },
];

export default function Intro({ state, update, onNext }: Props) {
  const canStart = state.name.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
          <span>🧭</span> オンライン版 セルフワーク
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
          自分のキャリアの
          <span className="text-indigo-600">「軸」</span>
          を見つける
          <br />
          ワークショップ
        </h1>

        <div className="card-base p-6 text-left mb-8">
          <p className="text-base text-gray-700 leading-relaxed">
            キャリアの軸は「一度決めたら変えられないタトゥー」ではなく、
            <strong className="text-indigo-700">「何度でもルートを変更できるカーナビ」</strong>
            のようなものです。
          </p>
          <p className="text-base text-gray-700 leading-relaxed mt-3">
            正解主義を手放し、直感で進めていきましょう。
          </p>
        </div>
      </motion.div>

      {/* Steps overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="grid grid-cols-2 gap-3 mb-10"
      >
        {features.map((f, i) => (
          <div key={i} className="card-base p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                {f.label}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-800 mb-1">{f.title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Privacy notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="p-4 mb-6 bg-sky-50 border border-sky-100 rounded-xl"
      >
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold text-sky-700">📊 データ利用について</span>
          このワークショップでは、結果をエクスポートする際に、入力内容の全文（お名前・職業興味・価値観・各ステップの回答を含む）をサービス改善のためにワークショップ運営者に自動送信します。送信された内容はワークショップの改善・研究目的にのみ使用されます。
        </p>
      </motion.div>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="card-base p-6 mb-6"
      >
        <label className="label-text text-base">
          お名前を入力してください
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          placeholder="例：山田 太郎"
          value={state.name}
          onChange={e => update({ name: e.target.value })}
          className="input-base text-base py-4"
          autoFocus
        />
        <p className="text-xs text-gray-400 mt-2">
          入力したお名前は、ワークシートのエクスポート時に使用されます
        </p>
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-center"
      >
        <motion.button
          onClick={onNext}
          disabled={!canStart}
          className="btn-primary text-lg px-10 py-4 shadow-lg shadow-indigo-200"
          whileHover={canStart ? { scale: 1.03 } : {}}
          whileTap={canStart ? { scale: 0.97 } : {}}
        >
          ワークショップをはじめる &nbsp; →
        </motion.button>
      </motion.div>

      {!canStart && (
        <p className="text-center text-sm text-gray-400 mt-3">
          お名前を入力すると開始できます
        </p>
      )}

      {/* Resume notice */}
      {Object.keys(state.cardSortResults).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center"
        >
          <p className="text-sm text-amber-700">
            前回の途中データが保存されています。ワークショップを再開できます。
          </p>
        </motion.div>
      )}
    </div>
  );
}
