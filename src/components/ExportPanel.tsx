import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppState, RIASECType } from '../types';
import { generatePlainText } from '../utils/export';
import { valueCards } from '../data/valueCards';
import { ohbyCards } from '../data/ohbyCards';

interface Props {
  state: AppState;
}

const SENT_SESSION_KEY = 'ws-anon-report-sent';

async function sendAnonymousReport(state: AppState) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
  if (!accessKey) return;

  // セッション中に1回だけ送信
  if (sessionStorage.getItem(SENT_SESSION_KEY)) return;

  // RIASEC カウント → 上位3タイプ
  const counts: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  ohbyCards.forEach(c => {
    if (state.cardSortResults[c.id] === 'interested') counts[c.type]++;
  });
  const sortedTypes = [...state.riasecChecked].sort((a, b) => counts[b] - counts[a]);
  const riasecTop3 = sortedTypes.slice(0, 3);

  // 価値観 TOP3 / TOP1
  const valueTop3 = state.phase2Selected
    .map(id => valueCards.find(c => c.id === id)?.keyword)
    .filter(Boolean) as string[];
  const valueTop1 = valueCards.find(c => c.id === state.phase3Selected)?.keyword ?? '未選択';

  // メール本文
  const message = [
    `送信日時: ${new Date().toLocaleString('ja-JP')}`,
    '',
    `■ 職業興味 TOP3タイプ: ${riasecTop3.length > 0 ? riasecTop3.join(' / ') : '未実施'}`,
    `■ 価値観 TOP3キーワード: ${valueTop3.length > 0 ? valueTop3.join(' / ') : '未実施'}`,
    `■ 価値観 TOP1: ${valueTop1}`,
    `■ 交差点（一言）: ${state.step3Summary || '未記入'}`,
  ].join('\n');

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: 'キャリアの軸ワークショップ 匿名レポート',
        from_name: 'Career Workshop',
        message,
      }),
    });
    if (res.ok) {
      sessionStorage.setItem(SENT_SESSION_KEY, '1');
    }
  } catch {
    // Silent fail — best-effort anonymous analytics
  }
}

export default function ExportPanel({ state }: Props) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleCopy = async () => {
    const text = generatePlainText(state);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    sendAnonymousReport(state);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const addr = email.trim();
    if (!addr) return;
    const text = generatePlainText(state);
    const subject = encodeURIComponent('キャリアの軸ワークショップ 結果レポート');
    const body = encodeURIComponent(text);
    window.open(`mailto:${addr}?subject=${subject}&body=${body}`, '_blank');
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
    sendAnonymousReport(state);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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

        {/* Email section */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-bold text-gray-700 mb-3">メールで送信</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="送信先メールアドレスを入力"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmail()}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"
            />
            <motion.button
              onClick={handleEmail}
              disabled={!email.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                email.trim()
                  ? emailSent
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              whileTap={email.trim() ? { scale: 0.97 } : {}}
            >
              <span>{emailSent ? '✅' : '✉️'}</span>
              <span>{emailSent ? '完了！' : '送信'}</span>
            </motion.button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            入力したアドレスにレポートを送信します（メールアプリが開きます）
          </p>
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
