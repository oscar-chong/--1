import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

interface Props {
  onResume: () => void;
  onRestart: () => void;
  onTitle: () => void;
}

export default function PauseModal({ onResume, onRestart, onTitle }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="遊戲暫停"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80"
    >
      <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 text-center text-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <h2 className="text-2xl font-black tracking-wide text-white mb-2">
          遊戲暫停
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          深呼吸放鬆一下，準備好了隨時繼續！
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>繼續遊戲 [Esc]</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center space-x-2 border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新開始 [R]</span>
          </button>

          <button
            onClick={onTitle}
            className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>返回主目錄</span>
          </button>
        </div>
      </div>
    </div>
  );
}
