import { motion } from 'framer-motion';

const STEPS = [
  { label: 'Intro', short: '導入' },
  { label: 'Step 1', short: '職業興味の可視化' },
  { label: 'Step 2', short: 'キャリアの価値観の可視化' },
  { label: 'Step 3', short: '統合と納得' },
  { label: 'Step 4', short: '行動へ' },
];

interface Props {
  currentStep: number;
  onStepClick: (step: number) => void;
  className?: string;
}

export default function ProgressBar({ currentStep, onStepClick, className = '' }: Props) {
  const progress = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <h1 className="text-sm font-bold text-indigo-700 tracking-tight hidden sm:block">
            キャリアの軸ワークショップ
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            {currentStep === 0 ? '開始前' : `Step ${currentStep} / 4`}
          </p>
        </div>

        {/* Step indicators */}
        <div className="relative">
          {/* Progress line background */}
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 mx-6" />
          {/* Progress fill */}
          <motion.div
            className="absolute top-3 left-0 h-0.5 bg-indigo-500 mx-6"
            initial={false}
            animate={{ width: `calc(${progress}% - 3rem)` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />

          <div className="relative flex justify-between">
            {STEPS.map((step, i) => {
              const isCompleted = i < currentStep;
              const isCurrent = i === currentStep;
              const isClickable = i <= currentStep + 1;

              return (
                <button
                  key={i}
                  onClick={() => isClickable && onStepClick(i)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center gap-1 group transition-all ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  {/* Circle */}
                  <motion.div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : isCompleted
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {isCompleted ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{i === 0 ? '▶' : i}</span>
                    )}
                  </motion.div>

                  {/* Label */}
                  <span
                    className={`text-xs font-semibold hidden sm:block transition-colors ${
                      isCurrent ? 'text-indigo-700' : isCompleted ? 'text-indigo-500' : 'text-gray-400'
                    }`}
                  >
                    {step.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
