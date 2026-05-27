import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppState } from '../types';
import { generatePlainText } from '../utils/export';

interface Props {
  state: AppState;
}

export default function ExportPanel({ state }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = generatePlainText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <footer className="max-w-4xl mx-auto px-4 pb-12 no-print">
      <div className="card-base p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">📄</span>
          <div>
            <h3 className="font-extrabold text-gray-800">エクスポート</h3>
            <p className="text-xs text-gray-500">データはブラウザに自動保存されています</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Copy to clipboard */}
          <motion.button
            onClick={handleCopy}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
              copied
                ? 'border-green-400 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">{copied ? '✅' : '📋'}</span>
            <div className="text-left">
              <p className="text-sm font-extrabold">
                {copied ? 'コピーしました！' : 'テキストコピー'}
              </p>
              <p className="text-xs font-normal text-gray-400">
                全入力内容をクリップボードにコピー
              </p>
            </div>
          </motion.button>

          {/* Print / PDF */}
          <motion.button
            onClick={handlePrint}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-bold hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">🖨️</span>
            <div className="text-left">
              <p className="text-sm font-extrabold">印刷・PDF出力</p>
              <p className="text-xs font-normal text-gray-400">
                A4サイズのワークシートとして出力
              </p>
            </div>
          </motion.button>
        </div>

        <AnimatePresence>
          {copied && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-green-600 font-bold mt-3"
            >
              クリップボードにコピーされました
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
