import React, { useState, useEffect, useRef } from 'react';
import { Question, PlayerStats, GameMode, StageConfig } from '../game/types.ts';
import { soundEngine } from '../game/audio.ts';
import { calculateAnswerScore, formatTime, getBlitzTimeDelta } from '../game/rules.ts';
import { Pause, RotateCcw, Volume2, VolumeX, Flame, Heart, Clock, Award, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface Props {
  mode: GameMode;
  stageConfig?: StageConfig;
  questions: Question[];
  onPause: () => void;
  onFinish: (finalStats: PlayerStats) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
}

export default function PlayScreen({
  mode,
  stageConfig,
  questions,
  onPause,
  onFinish,
  isMuted,
  onToggleMute,
  onRestart,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; pointsEarned: number } | null>(null);

  // Stats
  const [stats, setStats] = useState<PlayerStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    totalAnswered: 0,
    lives: mode === 'blitz' ? 1 : 3,
    maxLives: mode === 'blitz' ? 1 : 3,
    timeLeft: mode === 'blitz' ? 60 : (stageConfig?.timeLimit || 60),
    history: [],
  });

  // Per-question elapsed time for speed bonus
  const [questionElapsedSec, setQuestionElapsedSec] = useState<number>(0);

  const currentQ = questions[currentIndex % questions.length];

  // Global Blitz or stage countdown - pauses while reviewing answer!
  useEffect(() => {
    if (isAnswered) return; // Freeze clock during answer explanation so student can read!

    const timer = setInterval(() => {
      setStats((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          setTimeout(() => onFinish(prev), 50);
          return { ...prev, timeLeft: 0 };
        }
        if (prev.timeLeft <= 10 && prev.timeLeft > 0) {
          soundEngine.playTick();
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
      setQuestionElapsedSec((sec) => sec + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, onFinish]);

  const handleAnswer = (optionId: string | null, isTimeout: boolean = false) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOptionId(optionId);

    const isCorrect = !isTimeout && optionId !== null && currentQ.options.find(o => o.id === optionId)?.isCorrect === true;

    if (isCorrect) {
      const timeRatio = Math.max(0, 1 - questionElapsedSec / 15);
      const { points } = calculateAnswerScore(100, timeRatio, stats.combo);
      soundEngine.playCorrect(stats.combo);

      setFeedback({ isCorrect: true, pointsEarned: points });

      setStats((prev) => {
        const newCombo = prev.combo + 1;
        const timeBonus = mode === 'blitz' ? getBlitzTimeDelta(true, prev.combo) : 0;
        return {
          ...prev,
          score: prev.score + points,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          correctCount: prev.correctCount + 1,
          totalAnswered: prev.totalAnswered + 1,
          timeLeft: Math.min(prev.timeLeft + timeBonus, 99),
          history: [...prev.history, { questionId: currentQ.id, isCorrect: true, selectedOption: optionId || '' }],
        };
      });
    } else {
      soundEngine.playWrong();
      setFeedback({ isCorrect: false, pointsEarned: 0 });

      setStats((prev) => {
        const newLives = Math.max(0, prev.lives - 1);
        const timePenalty = mode === 'blitz' ? getBlitzTimeDelta(false, 0) : 0;
        const newTime = Math.max(1, prev.timeLeft + timePenalty);

        return {
          ...prev,
          combo: 0,
          lives: newLives,
          totalAnswered: prev.totalAnswered + 1,
          timeLeft: newTime,
          history: [...prev.history, { questionId: currentQ.id, isCorrect: false, selectedOption: optionId || 'timeout' }],
        };
      });
    }
  };

  const handleNextQuestion = () => {
    // Check if run should end (lives out or last question in quest mode)
    if (stats.lives <= 0 && mode !== 'blitz') {
      onFinish(stats);
      return;
    }

    if (currentIndex + 1 >= questions.length && mode === 'quest') {
      onFinish(stats);
      return;
    }

    setIsAnswered(false);
    setSelectedOptionId(null);
    setFeedback(null);
    setQuestionElapsedSec(0);
    setCurrentIndex((prev) => prev + 1);
  };

  // Keyboard navigation: 1-4 for options, Space for next, Esc/P for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        onPause();
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onToggleMute();
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onRestart();
        return;
      }

      if (!isAnswered) {
        if (e.key === '1' && currentQ.options[0]) handleAnswer(currentQ.options[0].id);
        if (e.key === '2' && currentQ.options[1]) handleAnswer(currentQ.options[1].id);
        if (e.key === '3' && currentQ.options[2]) handleAnswer(currentQ.options[2].id);
        if (e.key === '4' && currentQ.options[3]) handleAnswer(currentQ.options[3].id);
      } else {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQ, stats]);

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-4 md:p-8 select-none text-slate-100 max-w-5xl mx-auto">
      {/* Perimeter Top HUD Cluster (<15% occlusion) */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        {/* Left Cluster: Stage / Mode info + Hearts */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              {mode === 'blitz' ? '⚡ 60秒極速狂飆' : (stageConfig?.title || '複習挑戰')}
            </span>
            <span className="text-xs text-slate-400">
              第 <span className="font-mono text-slate-200 font-bold">{currentIndex + 1}</span> / {questions.length} 題
            </span>
          </div>

          {/* Health Vitality Sockets (full, cracked, empty) */}
          {mode === 'quest' && (
            <div className="flex items-center space-x-1 ml-2" aria-label={`剩餘生命: ${stats.lives}`}>
              {Array.from({ length: stats.maxLives }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    i < stats.lives
                      ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-800/40 border border-slate-800 text-slate-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${i < stats.lives ? 'fill-rose-500 text-rose-400' : 'text-slate-600'}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Cluster: Main Numeric Score & Combo */}
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SCORE</span>
            <span className="text-2xl md:text-3xl font-black font-mono tracking-tight text-white tabular-nums drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
              {stats.score}
            </span>
          </div>

          {stats.combo > 1 && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 animate-bounce">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-mono font-bold tabular-nums">{stats.combo}x 連擊!</span>
            </div>
          )}

          {/* Time Remaining Bar/Readout */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center">
              <Clock className="w-3 h-3 mr-1 text-cyan-400" /> TIME
            </span>
            <span className={`text-2xl md:text-3xl font-black font-mono tracking-tight tabular-nums ${stats.timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
              {formatTime(stats.timeLeft)}
            </span>
          </div>
        </div>

        {/* Right Utility Cluster: Mute [M], Pause [Esc/P], Restart [R] */}
        <div className="flex items-center space-x-2">
          <button
            tabIndex={-1}
            onClick={(e) => { e.currentTarget.blur(); onToggleMute(); }}
            className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label={isMuted ? '開啟音效 [M]' : '靜音 [M]'}
            title="靜音切換 [M]"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            tabIndex={-1}
            onClick={(e) => { e.currentTarget.blur(); onRestart(); }}
            className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="重新挑戰 [R]"
            title="重設 [R]"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
          </button>

          <button
            tabIndex={-1}
            onClick={(e) => { e.currentTarget.blur(); onPause(); }}
            className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="暫停遊戲 [Esc]"
            title="暫停 [Esc / P]"
          >
            <Pause className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Stage Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full my-4 overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Playfield: Question Card */}
      <main className="my-auto py-2 flex flex-col items-center max-w-3xl mx-auto w-full">
        {/* Category & Book Citation Tags */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {currentQ.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
            {currentQ.bookReference}
          </span>
        </div>

        {/* Prompt */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-slate-100 leading-snug mb-6">
          {currentQ.prompt}
        </h2>

        {/* Answer Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-900/80 border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-800/80 text-slate-200';
            let keyBadgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-950/70 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.3)] ring-2 ring-emerald-400';
                keyBadgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold';
              } else if (selectedOptionId === opt.id) {
                btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)] ring-2 ring-rose-500';
                keyBadgeStyle = 'bg-rose-500 text-white border-rose-400 font-bold';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                disabled={isAnswered}
                className={`flex items-start text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${btnStyle}`}
              >
                <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-bold mr-3 shrink-0 ${keyBadgeStyle}`}>
                  {idx + 1}
                </span>
                <span className="text-sm md:text-base font-medium leading-relaxed my-auto">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Feedback Modal Card */}
        {isAnswered && (
          <div className={`mt-6 w-full p-4 md:p-5 rounded-2xl border ${
            feedback?.isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 font-bold text-base md:text-lg mb-1">
                {feedback?.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300">回答正確！ +{feedback.pointsEarned} 分</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span className="text-rose-300">答錯了，請複習考點：</span>
                  </>
                )}
              </div>

              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <span>下一題 [Space]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </main>

      {/* Flat borderless control hint line in bottom safe margin */}
      <footer className="pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
        <span>按鍵 1-4 選擇答案</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>Space 進入下一題</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>Esc 暫停</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>M 靜音</span>
      </footer>
    </div>
  );
}
