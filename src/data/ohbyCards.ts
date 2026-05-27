import type { OHBYCard } from '../types';

export const ohbyCards: OHBYCard[] = [
  // R型: 現実的（Realistic）
  { id: 1,  title: '機械組立・整備士',    description: '自動車や各種機械の組立、修理、メンテナンスを行う',                   type: 'R', emoji: '⚙️' },
  { id: 2,  title: '大工・木工職人',      description: '木材を使って建物や家具を設計・製作する',                             type: 'R', emoji: '🔨' },
  { id: 3,  title: '農業従事者',          description: '作物の栽培や管理、土地改良などを行う',                               type: 'R', emoji: '🌾' },
  { id: 4,  title: '電気工事士',          description: '建物・設備の電気配線の施工・保守を行う',                             type: 'R', emoji: '⚡' },
  { id: 5,  title: '溶接・金属加工職人',  description: '金属部材を加工・接合し、構造物や製品を製作する',                     type: 'R', emoji: '🔧' },
  { id: 6,  title: '測量士・土木技術者',  description: '土地の形状を測定・記録し、建設工事に活かす',                         type: 'R', emoji: '📐' },
  { id: 7,  title: '自動車整備士',        description: '車両の点検・整備・修理を専門に行う',                                 type: 'R', emoji: '🚗' },
  { id: 8,  title: '船員・漁師',          description: '船舶の操作や航海、漁業に従事する',                                   type: 'R', emoji: '⛵' },

  // I型: 研究的（Investigative）
  { id: 9,  title: '基礎研究者',          description: '医療や科学の発展のため、未解明の現象を実験・分析する',               type: 'I', emoji: '🔬' },
  { id: 10, title: 'データサイエンティスト', description: '大量のデータを分析し、ビジネスや社会課題の解決策を導く',         type: 'I', emoji: '📊' },
  { id: 11, title: '医師（臨床・研究）',  description: '患者の診断・治療や医学の研究に従事する',                             type: 'I', emoji: '🩺' },
  { id: 12, title: '気象予報士',          description: '気象データを分析し、天気予報や防災情報を提供する',                   type: 'I', emoji: '🌤️' },
  { id: 13, title: '考古学者・歴史研究者', description: '遺跡や史料を調査・分析し、人類の歴史を解明する',                   type: 'I', emoji: '🏺' },
  { id: 14, title: '薬学研究者',          description: '新薬の開発や薬の効果・安全性を研究する',                             type: 'I', emoji: '💊' },
  { id: 15, title: '環境科学者',          description: '生態系や環境問題を調査・分析し、保全策を提案する',                   type: 'I', emoji: '🌿' },
  { id: 16, title: '心理学研究者',        description: '人の行動・思考・感情を科学的に研究する',                             type: 'I', emoji: '🧠' },

  // A型: 芸術的（Artistic）
  { id: 17, title: '舞台美術スタッフ',    description: '演劇、オペラ等のステージで用いる舞台装置や衣装をデザインする',       type: 'A', emoji: '🎭' },
  { id: 18, title: 'グラフィックデザイナー', description: 'ポスター、ロゴ、Webなどのビジュアルデザインを制作する',          type: 'A', emoji: '🎨' },
  { id: 19, title: '小説家・ライター',    description: '物語やコンテンツを文章で表現・創作する',                             type: 'A', emoji: '✍️' },
  { id: 20, title: '映像ディレクター',    description: '映画、CM、動画の演出・制作を指揮する',                               type: 'A', emoji: '🎬' },
  { id: 21, title: '音楽家・作曲家',      description: '楽曲を作り、演奏・表現する',                                         type: 'A', emoji: '🎵' },
  { id: 22, title: 'フォトグラファー',    description: '写真を通じて世界や人を切り取り、表現する',                           type: 'A', emoji: '📸' },
  { id: 23, title: 'インテリアデザイナー', description: '空間の美しさと機能性を両立させるデザインを行う',                   type: 'A', emoji: '🏠' },
  { id: 24, title: 'アニメーター・イラストレーター', description: 'キャラクターや世界観をビジュアルで創造する',             type: 'A', emoji: '🖌️' },

  // S型: 社会的（Social）
  { id: 25, title: 'キャリアカウンセラー', description: '就職やキャリアに悩む人の話を聴き、伴走支援する',                   type: 'S', emoji: '💼' },
  { id: 26, title: '学校教師・教育者',    description: '子どもや学生に知識・スキルを教え、成長を支援する',                   type: 'S', emoji: '📚' },
  { id: 27, title: '社会福祉士・ソーシャルワーカー', description: '生活に困難を抱える人を支援し、制度につなぐ',            type: 'S', emoji: '🤝' },
  { id: 28, title: '看護師',              description: '患者の療養を支援し、医療チームで協働する',                           type: 'S', emoji: '🏥' },
  { id: 29, title: '心理士・精神科相談員', description: '心の悩みを抱える人に寄り添い、カウンセリングを行う',               type: 'S', emoji: '💬' },
  { id: 30, title: 'ボランティアコーディネーター', description: '支援活動を組織し、ボランティアと受益者をつなぐ',          type: 'S', emoji: '🌟' },
  { id: 31, title: '保育士・幼稚園教諭',  description: '幼い子どもの成長を日常的にサポートする',                             type: 'S', emoji: '👶' },
  { id: 32, title: '地域コミュニティ支援者', description: '地域の課題を住民とともに解決し、つながりを育む',                type: 'S', emoji: '🏘️' },

  // E型: 企業的（Enterprising）
  { id: 33, title: '起業家・事業開発',    description: 'リスクを取って新しいビジネスやサービスを立ち上げる',                 type: 'E', emoji: '🚀' },
  { id: 34, title: '営業マネージャー',    description: 'チームを率いて顧客へのアプローチ・交渉を推進する',                   type: 'E', emoji: '📈' },
  { id: 35, title: '政治家・地方議員',    description: '有権者の声を政策に反映し、社会を変える活動をする',                   type: 'E', emoji: '🏛️' },
  { id: 36, title: '経営コンサルタント',  description: '企業の経営課題を分析し、改善策を提案・実行支援する',                 type: 'E', emoji: '💡' },
  { id: 37, title: '不動産エージェント',  description: '物件の売買・賃貸を仲介し、顧客の意思決定を支援する',                 type: 'E', emoji: '🏢' },
  { id: 38, title: 'マーケティングディレクター', description: 'ブランド戦略・販促活動を立案・指揮する',                    type: 'E', emoji: '📣' },
  { id: 39, title: '弁護士（訴訟・交渉）', description: '依頼人の権利を守るために交渉・訴訟活動を行う',                    type: 'E', emoji: '⚖️' },
  { id: 40, title: 'イベントプロデューサー', description: 'コンサートや展示会などの大型イベントを企画・運営する',          type: 'E', emoji: '🎪' },

  // C型: 慣習的（Conventional）
  { id: 41, title: '経理・財務担当',      description: '組織の資金の動きを正確に記録・管理し、ミスなく処理する',             type: 'C', emoji: '💰' },
  { id: 42, title: '公認会計士・税理士',  description: '財務諸表の監査や税務申告を専門に行う',                               type: 'C', emoji: '🧾' },
  { id: 43, title: '行政書士・事務官',    description: '書類の作成・管理を通じて行政手続きを支援する',                       type: 'C', emoji: '📝' },
  { id: 44, title: '図書館司書',          description: '資料の収集・整理・提供を通じて情報アクセスを支援する',               type: 'C', emoji: '📚' },
  { id: 45, title: '品質管理担当',        description: '製品やサービスの品質を基準通りに保つ検査・管理を行う',               type: 'C', emoji: '✅' },
  { id: 46, title: 'データベース管理者',  description: 'データベースの設計・運用・保守を担う',                               type: 'C', emoji: '💾' },
  { id: 47, title: '法務・コンプライアンス担当', description: '組織が法令・規則を遵守できるよう管理・監督する',            type: 'C', emoji: '🔏' },
  { id: 48, title: '秘書・オフィスマネージャー', description: 'スケジュール・文書・業務フロー管理で組織を支える',          type: 'C', emoji: '📋' },
];
