import React, { useState } from 'react';
import { soundEngine } from '../game/audio.ts';
import { ArrowLeft, CheckCircle2, RotateCcw, Wind, Utensils, Flame, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
  onAddScore: (points: number) => void;
}

export default function InteractiveLab({ onBack, onAddScore }: Props) {
  const [activeTab, setActiveTab] = useState<'breathing' | 'digestion' | 'fire'>('breathing');

  // Breathing simulation state
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [ribChoice, setRibChoice] = useState<'out' | 'in' | null>(null);
  const [diaphragmChoice, setDiaphragmChoice] = useState<'down' | 'up' | null>(null);
  const [airFlowChoice, setAirFlowChoice] = useState<'in' | 'out' | null>(null);
  const [breathResult, setBreathResult] = useState<string | null>(null);

  // Digestion pipeline sorting
  const fullDigestiveOrgans = ['口腔', '咽', '食道', '胃', '小腸', '大腸', '肛門'];
  const [availableOrgans, setAvailableOrgans] = useState<string[]>([
    '胃', '口腔', '肛門', '咽', '大腸', '食道', '小腸'
  ]);
  const [userSorted, setUserSorted] = useState<string[]>([]);
  const [digestionResult, setDigestionResult] = useState<string | null>(null);

  // Fire Escape 3-treasures selection
  const potentialItems = [
    { id: 'phone', name: '手提電話', isTreasure: true, desc: '對外聯絡與報警求助' },
    { id: 'wallet', name: '錢包（含身份證）', isTreasure: true, desc: '確認身份與重要證件' },
    { id: 'keys', name: '門匙', isTreasure: true, desc: '防逃生通道受阻時可安全返回屋內' },
    { id: 'console', name: '遊戲機', isTreasure: false, desc: '火場切勿貪戀財物，會耽誤逃生' },
    { id: 'laptop', name: '手提電腦', isTreasure: false, desc: '笨重增加負擔' },
    { id: 'wet_towel', name: '濕毛巾', isTreasure: true, desc: '掩蓋口鼻防吸入高溫濃煙' },
  ];
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [fireResult, setFireResult] = useState<string | null>(null);

  // Breathing verification
  const checkBreathing = () => {
    let isCorrect = false;
    if (breathPhase === 'inhale') {
      isCorrect = ribChoice === 'out' && diaphragmChoice === 'down' && airFlowChoice === 'in';
    } else {
      isCorrect = ribChoice === 'in' && diaphragmChoice === 'up' && airFlowChoice === 'out';
    }

    if (isCorrect) {
      soundEngine.playCorrect(2);
      onAddScore(150);
      setBreathResult('✅ 恭喜！完美掌握呼吸系統運作原理！肋骨、橫膈膜與氣流方向完全正確！ (+150分)');
    } else {
      soundEngine.playWrong();
      setBreathResult('❌ 提示：吸氣時肋骨「向外」，橫膈膜「向下」，胸腔擴張空氣流入；呼氣時肋骨「向內」，橫膈膜「向上」，胸腔縮小空氣流出。');
    }
  };

  // Digestion verification
  const handleSelectOrgan = (organ: string) => {
    setUserSorted([...userSorted, organ]);
    setAvailableOrgans(availableOrgans.filter((o) => o !== organ));
  };

  const handleResetDigestion = () => {
    setUserSorted([]);
    setAvailableOrgans(['胃', '口腔', '肛門', '咽', '大腸', '食道', '小腸']);
    setDigestionResult(null);
  };

  const checkDigestion = () => {
    const isCorrect = userSorted.length === fullDigestiveOrgans.length &&
      userSorted.every((val, idx) => val === fullDigestiveOrgans[idx]);

    if (isCorrect) {
      soundEngine.playCorrect(3);
      onAddScore(200);
      setDigestionResult('🎉 太棒了！完美排列消化管道傳送順序：口腔 → 咽 → 食道 → 胃 → 小腸 → 大腸 → 肛門！ (+200分)');
    } else {
      soundEngine.playWrong();
      setDigestionResult('❌ 順序有誤喔！請回憶課本第8頁食物在消化系統的流動歷程！');
    }
  };

  // Fire escape check
  const toggleFireItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      if (selectedItems.length < 4) {
        setSelectedItems([...selectedItems, id]);
      }
    }
  };

  const checkFireEscape = () => {
    const hasCoreThree = selectedItems.includes('phone') && selectedItems.includes('wallet') && selectedItems.includes('keys');
    const hasBad = selectedItems.includes('console') || selectedItems.includes('laptop');

    if (hasCoreThree && !hasBad) {
      soundEngine.playCorrect(2);
      onAddScore(150);
      setFireResult('🚒 正確！掌握「逃生三寶」（電話、錢包、門匙）與濕毛巾！不貪戀大件貴重物品！ (+150分)');
    } else {
      soundEngine.playWrong();
      setFireResult('❌ 逃生三寶為：手提電話、錢包、門匙！切勿浪費寶貴時間收拾遊戲機或電腦等非緊急財物！');
    }
  };

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-4 md:p-8 select-none text-slate-100 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回主頁</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>常識實操模擬實驗室</span>
          </h1>
          <p className="text-xs text-slate-400">課本動手做 · 動態物理模擬 · 互動加分</p>
        </div>

        <div className="w-20" />
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-2 my-4">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'breathing'
              ? 'bg-emerald-500 text-slate-950 shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>1. 呼吸肺部模型模擬</span>
        </button>

        <button
          onClick={() => setActiveTab('digestion')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'digestion'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_4px_15px_rgba(6,182,212,0.3)]'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>2. 消化道排序挑戰</span>
        </button>

        <button
          onClick={() => setActiveTab('fire')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'fire'
              ? 'bg-amber-500 text-slate-950 shadow-[0_4px_15px_rgba(245,158,11,0.3)]'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>3. 火警逃生裝備清單</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="my-auto max-w-3xl mx-auto w-full py-4">
        {/* Tab 1: Breathing */}
        {activeTab === 'breathing' && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-emerald-300">
                活動冊第1冊：呼吸系統模型運作實驗
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                根據吸氣/呼氣狀態，判斷肋骨、橫膈膜與氣流的正確動態！
              </p>
            </div>

            {/* Mode switch */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => { setBreathPhase('inhale'); setBreathResult(null); }}
                className={`px-5 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                  breathPhase === 'inhale' ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                ① 吸氣時 (Inhale)
              </button>
              <button
                onClick={() => { setBreathPhase('exhale'); setBreathResult(null); }}
                className={`px-5 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${
                  breathPhase === 'exhale' ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                ② 呼氣時 (Exhale)
              </button>
            </div>

            {/* Interactive choices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Rib cage */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                <div className="text-xs text-slate-400 font-semibold mb-2">肋骨變化</div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setRibChoice('out')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      ribChoice === 'out' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    向外
                  </button>
                  <button
                    onClick={() => setRibChoice('in')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      ribChoice === 'in' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    向內
                  </button>
                </div>
              </div>

              {/* Diaphragm */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                <div className="text-xs text-slate-400 font-semibold mb-2">橫膈膜變化</div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setDiaphragmChoice('down')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      diaphragmChoice === 'down' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    向下
                  </button>
                  <button
                    onClick={() => setDiaphragmChoice('up')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      diaphragmChoice === 'up' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    向上
                  </button>
                </div>
              </div>

              {/* Air flow */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
                <div className="text-xs text-slate-400 font-semibold mb-2">空氣流向</div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setAirFlowChoice('in')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      airFlowChoice === 'in' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    流入肺部
                  </button>
                  <button
                    onClick={() => setAirFlowChoice('out')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      airFlowChoice === 'out' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    流出肺部
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={checkBreathing}
                disabled={!ribChoice || !diaphragmChoice || !airFlowChoice}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
              >
                驗證呼吸機制解答
              </button>
            </div>

            {breathResult && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950 text-xs md:text-sm text-slate-200 border border-slate-800 leading-relaxed text-center">
                {breathResult}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Digestion Sorter */}
        {activeTab === 'digestion' && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-cyan-300">
                食物奇幻旅程：消化管道順序排列
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                點擊下方器官，按食物進入身體後的消化先後順序進行排序！
              </p>
            </div>

            {/* Current sequence display */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[70px] flex flex-wrap items-center justify-center gap-2 mb-4">
              {userSorted.length === 0 ? (
                <span className="text-xs text-slate-600">請從下方點擊器官加入排序...</span>
              ) : (
                userSorted.map((org, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold">
                      {idx + 1}. {org}
                    </span>
                    {idx < userSorted.length - 1 && (
                      <span className="mx-1 text-slate-600 font-bold">→</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Available buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {availableOrgans.map((org) => (
                <button
                  key={org}
                  onClick={() => handleSelectOrgan(org)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold cursor-pointer transition-all hover:border-cyan-400"
                >
                  + {org}
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={checkDigestion}
                disabled={userSorted.length !== fullDigestiveOrgans.length}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer shadow-[0_4px_15px_rgba(6,182,212,0.3)]"
              >
                檢查排列順序
              </button>
              <button
                onClick={handleResetDigestion}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重新排</span>
              </button>
            </div>

            {digestionResult && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950 text-xs md:text-sm text-slate-200 border border-slate-800 leading-relaxed text-center">
                {digestionResult}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Fire Escape */}
        {activeTab === 'fire' && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-amber-300">
                火警逃生模擬：速選「逃生三寶」
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                大廈火警警鐘響起！你離家逃生時，應該迅速帶備哪三樣寶物與防護品？
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {potentialItems.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleFireItem(item.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-200">{item.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={checkFireEscape}
                disabled={selectedItems.length === 0}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer shadow-[0_4px_15px_rgba(245,158,11,0.3)]"
              >
                確認攜帶裝備
              </button>
            </div>

            {fireResult && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950 text-xs md:text-sm text-slate-200 border border-slate-800 leading-relaxed text-center">
                {fireResult}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
        香港小學常識科 · 人體呼吸消化 · 急救與安全演練
      </div>
    </div>
  );
}
