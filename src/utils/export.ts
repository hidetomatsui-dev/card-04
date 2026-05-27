import type { AppState, RIASECType } from '../types';
import { RIASEC_LABELS } from '../types';
import { ohbyCards } from '../data/ohbyCards';
import { valueCards } from '../data/valueCards';

const RIASEC_TYPES: RIASECType[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export function generatePlainText(state: AppState): string {
  const lines: string[] = [];
  const sep = '═'.repeat(60);
  const sub = '─'.repeat(40);

  lines.push(sep);
  lines.push('キャリアの軸ワークショップ　提出用ワークシート');
  lines.push(`氏名: ${state.name || '未入力'}　　作成日: ${new Date().toLocaleDateString('ja-JP')}`);
  lines.push(sep);
  lines.push('');

  // Step 1
  lines.push('【Step 1】 興味の可視化（What）');
  lines.push(sub);

  const interestedIds = Object.entries(state.cardSortResults)
    .filter(([, v]) => v === 'interested')
    .map(([k]) => Number(k));

  lines.push('■ 「興味がある」に分類したカード:');
  if (interestedIds.length > 0) {
    interestedIds.forEach(id => {
      const card = ohbyCards.find(c => c.id === id);
      if (card) lines.push(`  [${card.type}型] ${card.title} - ${card.description}`);
    });
  } else {
    lines.push('  （未実施）');
  }
  lines.push('');

  lines.push('■ 職業興味のタイプ集計:');
  const counts: Record<RIASECType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  interestedIds.forEach(id => {
    const card = ohbyCards.find(c => c.id === id);
    if (card) counts[card.type]++;
  });
  RIASEC_TYPES.forEach(t => {
    const checked = state.riasecChecked.includes(t) ? '✓' : ' ';
    lines.push(`  [${checked}] ${RIASEC_LABELS[t]}: ${counts[t]}枚`);
  });
  lines.push('');

  lines.push('■ 内省①「興味があるカードに共通していたパターン」:');
  lines.push(state.step1Reflection1 ? `  ${state.step1Reflection1}` : '  （未記入）');
  lines.push('');

  lines.push('■ 内省②「そのタイプに惹かれる背景・理由」:');
  lines.push(state.step1Reflection2 ? `  ${state.step1Reflection2}` : '  （未記入）');
  lines.push('');

  // Step 2
  lines.push('【Step 2】 動機の深掘り（Why）');
  lines.push(sub);

  const top3Ids = state.phase2Selected;
  const top1Id = state.phase3Selected;

  lines.push('■ 選択した価値観TOP3:');
  if (top3Ids.length > 0) {
    top3Ids.forEach((id, i) => {
      const card = valueCards.find(c => c.id === id);
      const mark = id === top1Id ? '★ TOP1' : `第${i + 1}位`;
      if (card) {
        lines.push(`  [${mark}] ${card.keyword}（${card.categoryName}）`);
        const ep = state.valueEpisodes[id];
        if (ep?.episode) lines.push(`    エピソード: ${ep.episode}`);
        if (ep?.feeling)  lines.push(`    感じたこと: ${ep.feeling}`);
      }
    });
  } else {
    lines.push('  （未実施）');
  }
  lines.push('');

  lines.push('■ 「興味がない」の裏返し内省:');
  lines.push(state.step2Reflection ? `  ${state.step2Reflection}` : '  （未記入）');
  lines.push('');

  // Step 3
  lines.push('【Step 3】 統合と納得（Alignment）');
  lines.push(sub);

  lines.push('■ マイ・統合マトリクス（価値観 × 職業興味のタイプ）:');
  if (top3Ids.length > 0) {
    top3Ids.forEach(vid => {
      const vCard = valueCards.find(c => c.id === vid);
      if (!vCard) return;
      lines.push(`  【${vCard.keyword}】`);
      RIASEC_TYPES.forEach(t => {
        const key = `${vid}-${t}`;
        const text = state.matrixData[key];
        if (text) lines.push(`    × ${t}型: ${text}`);
      });
    });
  } else {
    lines.push('  （未実施）');
  }
  lines.push('');

  lines.push('■ 一致していたこと（職業興味と価値観が重なった部分）:');
  lines.push(state.step3Alignment1 ? `  ${state.step3Alignment1}` : '  （未記入）');
  lines.push('');

  lines.push('■ ズレていたこと（意外だったこと）:');
  lines.push(state.step3Alignment2 ? `  ${state.step3Alignment2}` : '  （未記入）');
  lines.push('');

  lines.push('■ 交差点を一言で:');
  lines.push(state.step3Summary ? `  ${state.step3Summary}` : '  （未記入）');
  lines.push('');

  // Step 4
  lines.push('【Step 4】 行動への橋渡し（Action）');
  lines.push(sub);

  lines.push('■ キャリアの方向性:');
  lines.push(state.careerDirection ? `  ${state.careerDirection}` : '  （未記入）');
  lines.push('');

  lines.push('■ 24時間以内のスモールステップ:');
  state.actions.forEach((a, i) => {
    lines.push(`  Action ${i + 1}: ${a || '（未記入）'}`);
  });
  lines.push('');

  lines.push('■ 今日の一文まとめ:');
  lines.push(state.finalSummary ? `  ${state.finalSummary}` : '  （未記入）');
  lines.push('');
  lines.push(sep);

  return lines.join('\n');
}
