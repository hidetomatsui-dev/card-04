import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppState } from './types';
import { ohbyCards } from './data/ohbyCards';
import { valueCards } from './data/valueCards';
import ProgressBar from './components/ProgressBar';
import Intro from './components/Intro';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import ExportPanel from './components/ExportPanel';

const STORAGE_KEY = 'career-workshop-v1';

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const defaultState: AppState = {
  name: '',
  currentStep: 0,
  cardOrder: [],
  cardSortResults: {},
  sortHistory: [],
  riasecChecked: [],
  step1Reflection1: '',
  step1Reflection2: '',
  valueCardOrder: [],
  valueSortResults: {},
  valueSortHistory: [],
  phase1Selected: [],
  phase2Selected: [],
  phase3Selected: null,
  valueEpisodes: {},
  step2Reflection: '',
  matrixData: {},
  step3Alignment1: '',
  step3Alignment2: '',
  step3Summary: '',
  careerDirection: '',
  actions: ['', '', ''],
  finalSummary: '',
};

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      ...defaultState,
      ...parsed,
      cardOrder:
        Array.isArray(parsed.cardOrder) && parsed.cardOrder.length > 0
          ? parsed.cardOrder
          : shuffle(ohbyCards.map(c => c.id)),
      valueCardOrder:
        Array.isArray(parsed.valueCardOrder) && parsed.valueCardOrder.length > 0
          ? parsed.valueCardOrder
          : shuffle(valueCards.map(c => c.id)),
      sortHistory: Array.isArray(parsed.sortHistory) ? parsed.sortHistory : [],
      valueSortHistory: Array.isArray(parsed.valueSortHistory) ? parsed.valueSortHistory : [],
    };
  } catch { /* ignore */ }
  return {
    ...defaultState,
    cardOrder: shuffle(ohbyCards.map(c => c.id)),
    valueCardOrder: shuffle(valueCards.map(c => c.id)),
  };
}

const pageVariants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function App() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => update({ currentStep: step });

  const steps = [
    <Intro key={0} state={state} update={update} onNext={() => goToStep(1)} />,
    <Step1 key={1} state={state} update={update} onNext={() => goToStep(2)} onBack={() => goToStep(0)} />,
    <Step2 key={2} state={state} update={update} onNext={() => goToStep(3)} onBack={() => goToStep(1)} />,
    <Step3 key={3} state={state} update={update} onNext={() => goToStep(4)} onBack={() => goToStep(2)} />,
    <Step4 key={4} state={state} update={update} onBack={() => goToStep(3)} />,
  ];

  return (
    <div className="min-h-screen">
      <ProgressBar
        currentStep={state.currentStep}
        onStepClick={goToStep}
        className="no-print"
      />

      <main className="relative max-w-4xl mx-auto pt-28 pb-20 px-4">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={state.currentStep}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {steps[state.currentStep]}
          </motion.div>
        </AnimatePresence>
      </main>

      {state.currentStep === 4 && <ExportPanel state={state} />}

      <div className="hidden print-only fixed top-0 left-0 right-0 p-4 border-b border-gray-300">
        <h1 className="text-lg font-bold">キャリアの軸ワークショップ　提出用ワークシート</h1>
        <p className="text-sm text-gray-600">
          氏名: {state.name || '　　　　　　'} &nbsp;&nbsp;
          作成日: {new Date().toLocaleDateString('ja-JP')}
        </p>
      </div>
    </div>
  );
}
