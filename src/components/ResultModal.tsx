import React, { useState } from 'react';
import { PlayerStats, Question, RankGrade } from '../game/types.ts';
import { calculateRank } from '../game/rules.ts';
import { Trophy, RotateCcw, Home, BookOpen, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  questions: Question[];
  onPlayAgain: () => void;
  onNextStage?: () => void;
  onTitle: () => void;
}

export default function ResultModal({ stats, questions, onPlayAgain, onNextStage, onTitle }: Props) {
  const [showReview, setShowReview] = useState(false);

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
    : 0;

  const rank = calculateRank(accuracy, stats.score);

  const getRankColor = (r: RankGrade) => {
    switch (r) {
      case 'S': return 'text-amber-300 border-amber-400 bg-amber-500/10 shadow-[0_0_30px_rgba(251,191,36,0.3)]';
      case 'A': return 'text-emerald-400 border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.3)]';
      case 'B': return 'text-cyan-400 border-cyan-400 bg-cyan-500/10';
      case 'C': return 'text-indigo-400 border-indigo-400 bg-indigo-500/10';
      default: return 'text-rose-400 border-rose-400 bg-rose-500/10';
    }
  };

  const missedQuestions = questions.filter((q) =>
    stats.history.some((h) => h.questionId === q.id && !h.isCorrect)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="挑戰結算"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 overflow-y-auto"
    >
      <div className="w-full max-w-lg p-6 md:p-8 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 text-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
        {/* Header with Rank Badge */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center mb-3 ${getRankColor(rank)}`}>
            <span className="text-3xl font-black font-mono">{rank}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase">等級評定</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white">
            {accuracy >= 80 ? '🎉 闖關成功！大獲全勝' : '💪 挑戰完成！再接再厲'}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {rank === 'S' && '榮獲常識科學特級金牌！所有關鍵知識掌握得天衣無縫！'}
            {rank === 'A' && '表現非常出色！對人體與安全知識有深刻理解！'}
            {rank === 'B' && '發揮良好，稍微鞏固錯題即可突破卓越！'}
            {(rank === 'C' || rank === 'D') && '多看幾次課本圖鑑，再挑戰一次定能拿下高分！'}
          </p>
        </div>

        {/* 3 Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">總得分</div>
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-0.5">{stats.score}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">正確率</div>
            <div className="text-2xl font-black text-cyan-400 font-mono tabular-nums mt-0.5">{accuracy}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">最高連擊</div>
            <div className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-0.5">{stats.maxCombo}x</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2.5">
          {onNextStage ? (
            <button
              data-start="true"
              onClick={onNextStage}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
            >
              <Trophy className="w-5 h-5 fill-slate-950" />
              <span>進入下一關卡</span>
            </button>
          ) : (
            <button
              data-start="true"
              onClick={onPlayAgain}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
            >
              <RotateCcw className="w-5 h-5" />
              <span>再來一次</span>
            </button>
          )}

          {missedQuestions.length > 0 && (
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-sm flex items-center justify-center space-x-2 border border-amber-500/30 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>檢視本次錯題本 ({missedQuestions.length})</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onTitle}
            className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>返回主目錄</span>
          </button>
        </div>

        {/* Missed Questions Expanded List */}
        {showReview && missedQuestions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              錯題回顧與課本考點解析：
            </div>
            {missedQuestions.map((q, idx) => (
              <div key={q.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-left">
                <div className="text-xs text-rose-400 font-semibold mb-1">
                  第 {idx + 1} 題 · {q.category}（{q.bookReference}）
                </div>
                <div className="text-sm font-medium text-slate-200 mb-1">{q.prompt}</div>
                <div className="text-xs text-emerald-400/90 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/50 mt-1">
                  💡 正確答案：{q.options.find((o) => o.isCorrect)?.text}
                </div>
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                  解析：{q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
