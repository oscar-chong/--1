import React from 'react';
import { GameMode, StageId } from '../game/types.ts';
import { STAGE_CONFIGS } from '../game/questions.ts';
import { Play, Zap, FlaskConical, BookOpen, Volume2, VolumeX, Shield, Award } from 'lucide-react';

interface Props {
  onStartQuest: (stageId: StageId) => void;
  onStartBlitz: () => void;
  onOpenLab: () => void;
  onOpenCodex: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  highScore: number;
}

export default function TitleScreen({
  onStartQuest,
  onStartBlitz,
  onOpenLab,
  onOpenCodex,
  isMuted,
  onToggleMute,
  highScore,
}: Props) {
  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-6 md:p-10 select-none text-slate-100 max-w-6xl mx-auto">
      {/* Top Bar Cluster */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              香港小學常識科 · 互動學習專區
            </div>
            <div className="text-sm font-medium text-slate-300">
              人體的奧祕 × 平安是福
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {highScore > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
              <Award className="w-4 h-4 text-amber-400" />
              <span>最高紀錄:</span>
              <span className="font-mono font-bold">{highScore}</span>
            </div>
          )}

          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label={isMuted ? '開啟音效' : '靜音'}
            title={isMuted ? '開啟音效 [M]' : '靜音 [M]'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Hero Showcase Centerpiece with bespoke inline SVG Title Lockup */}
      <div className="my-auto py-8 text-center flex flex-col items-center">
        {/* Animated Emblem SVG */}
        <div className="relative mb-6">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-tr from-emerald-600/30 via-cyan-500/20 to-teal-400/20 border-2 border-emerald-400/50 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-pulse">
            <svg
              viewBox="0 0 100 100"
              className="w-16 h-16 md:w-20 md:h-20 text-emerald-400 drop-shadow-[0_2px_10px_rgba(52,211,153,0.5)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Anatomical Heart & Shield Emblem */}
              <path d="M50 15 C30 15 15 28 15 45 C15 70 50 90 50 90 C50 90 85 70 85 45 C85 28 70 15 50 15 Z" fill="rgba(16, 185, 129, 0.15)" />
              <path d="M30 45 L42 45 L48 30 L54 60 L60 45 L72 45" stroke="#38bdf8" strokeWidth="4" />
              <circle cx="50" cy="50" r="3" fill="#34d399" />
            </svg>
          </div>
        </div>

        {/* Bespoke Title Lockup */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3">
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
            常識科學大挑戰
          </span>
        </h1>
        <p className="text-base md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
          人體奧祕 × 應急急救 × 危機逃生 · 限時闖關複習系統
        </p>

        {/* Primary Start CTA Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {/* Main Quest Play button */}
          <button
            data-start="true"
            onClick={() => onStartQuest('stage-respiratory-digestive')}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 border-2 border-emerald-400/60 shadow-[0_8px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.5)] transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
            <div className="text-lg font-bold text-white tracking-wide">闖關冒險</div>
            <div className="text-xs text-emerald-100/80 mt-1">4大章節進階挑戰</div>
          </button>

          {/* Timed Blitz */}
          <button
            onClick={onStartBlitz}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 border-2 border-amber-400/60 shadow-[0_8px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.45)] transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white fill-amber-300" />
            </div>
            <div className="text-lg font-bold text-white tracking-wide">60秒極速狂飆</div>
            <div className="text-xs text-amber-100/80 mt-1">連擊加時 · 奪分挑戰</div>
          </button>

          {/* Mini-Game Lab */}
          <button
            onClick={onOpenLab}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-cyan-700 to-cyan-900 hover:from-cyan-600 hover:to-cyan-800 border-2 border-cyan-400/60 shadow-[0_8px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_12px_40px_rgba(6,182,212,0.45)] transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div className="text-lg font-bold text-white tracking-wide">實操模擬室</div>
            <div className="text-xs text-cyan-100/80 mt-1">呼吸機制 × 逃生決策</div>
          </button>

          {/* Revision Codex */}
          <button
            onClick={onOpenCodex}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-indigo-700 to-indigo-900 hover:from-indigo-600 hover:to-indigo-800 border-2 border-indigo-400/60 shadow-[0_8px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.45)] transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-lg font-bold text-white tracking-wide">課本複習圖鑑</div>
            <div className="text-xs text-indigo-100/80 mt-1">思維導圖 · 考點精華</div>
          </button>
        </div>

        {/* Stages Quick Preview */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl text-left">
          {STAGE_CONFIGS.map((st, idx) => (
            <div
              key={st.id}
              onClick={() => onStartQuest(st.id)}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 cursor-pointer transition-all"
            >
              <div className="text-xs text-slate-400 font-mono">STAGE 0{idx + 1}</div>
              <div className="text-sm font-semibold text-slate-200 truncate">{st.title.replace(/關卡.：/, '')}</div>
              <div className="text-xs text-emerald-400/80 mt-0.5 truncate">{st.tags.join(' · ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Flat borderless control hint line in bottom safe margin */}
      <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 tracking-wider">
        <span>Enter / Space 開始冒險</span>
        <span className="mx-2.5 text-slate-600">·</span>
        <span>1-4 數字鍵快速選擇</span>
        <span className="mx-2.5 text-slate-600">·</span>
        <span>Esc 暫停</span>
        <span className="mx-2.5 text-slate-600">·</span>
        <span>M 靜音切換</span>
      </div>
    </div>
  );
}
