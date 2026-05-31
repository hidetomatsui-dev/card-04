import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppState } from '../types';
import { generatePlainText } from '../utils/export';

interface Props {
  state: AppState;
}

async function sendReport(state: AppState): Promise<'sent' | 'skipped' | 'error'> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
  if (!accessKey) return 'skipped';

  const message = generatePlainText(state);
  const subject = state.name
    ? `キャリアの軸ワークショップ レポート - ${state.name}`
    : 'キャリアの軸ワークショップ レポート';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject,
        from_name: 'Career Workshop',
        message,
      }),
    });
    return res.ok ? 'sent' : 'error';
  } catch {
    return 'error';
  }
}

export default function ExportPanel({ state }: Props) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [reportStatus, setReportStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const triggerSend = async () => {
    setReportStatus('sending');
    const result = await sendReport(state);
    if (result === 'sent') {
      setReportStatus('sent');
      setTimeout(() => setReportStatus('idle'), 4000);
    } else if (result === 'error') {
      setReportStatus('error');
      setTimeout(() => setReportStatus('idle'), 5000);
    } else {
      // 'skipped' = env var 未設定
      setReportStatus('idle');
    }
  };

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
    triggerSend();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = async () => {
    const addr = email.trim();
    if (!addr || emailStatus === 'sending') return;

    setEmailStatus('sending');
    const text = generatePlainText(state);
    const subject = state.name
      ? `キャリアの軸ワークショップ 結果レポート - ${state.name}`
      : 'キャリアの軸ワークショップ 結果レポート';

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: addr, subject, message: text }),
      });
      setEmailStatus(res.ok ? 'sent' : 'error');
    } catch {
      setEmailStatus('error');
    }
    setTimeout(() => setEmailStatus('idle'), 4000);
    triggerSend();
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
              disabled={!email.trim() || emailStatus === 'sending'}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                !email.trim() || emailStatus === 'sending'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : emailStatus === 'sent'
                  ? 'bg-green-500 text-white'
                  : emailStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              whileTap={email.trim() && emailStatus === 'idle' ? { scale: 0.97 } : {}}
            >
              <span>
                {emailStatus === 'sending' ? '⏳'
                  : emailStatus === 'sent' ? '✅'
                  : emailStatus === 'error' ? '❌'
                  : '✉️'}
              </span>
              <span>
                {emailStatus === 'sending' ? '送信中...'
                  : emailStatus === 'sent' ? '送信完了！'
                  : emailStatus === 'error' ? '送信失敗'
                  : '送信'}
              </span>
            </motion.button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            入力したアドレスにレポートを送信します（メールアプリが開きます）
          </p>
        </div>

        {/* Report send status */}
        <AnimatePresence>
          {reportStatus === 'sending' && (
            <motion.p
              key="sending"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-gray-400 mt-3"
            >
              集計データを送信中...
            </motion.p>
          )}
          {reportStatus === 'sent' && (
            <motion.p
              key="sent"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-green-600 font-semibold mt-3"
            >
              ✓ 集計データを運営者に送信しました
            </motion.p>
          )}
          {reportStatus === 'error' && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-red-500 mt-3"
            >
              集計データの送信に失敗しました（通信エラー）
            </motion.p>
          )}
          {copied && (
            <motion.p
              key="copied"
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
