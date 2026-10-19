import React, { useState } from 'react';
import { ArrowLeft, BookOpen, HeartPulse, Activity, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function RevisionCodex({ onBack }: Props) {
  const [selectedSection, setSelectedSection] = useState<'resp_dig' | 'growth' | 'first_aid' | 'crisis'>('resp_dig');

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
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>課本核心精華 · 複習總結圖鑑</span>
          </h1>
          <p className="text-xs text-slate-400">緊貼課本「本課回顧」與「小總結」重點</p>
        </div>

        <div className="w-20" />
      </div>

      {/* Navigation Buttons for Sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
        <button
          onClick={() => setSelectedSection('resp_dig')}
          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
            selectedSection === 'resp_dig'
              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="text-xs font-mono font-bold text-emerald-400">UNIT 01 - A</div>
          <div className="text-sm font-bold mt-0.5">呼吸與消化系統</div>
        </button>

        <button
          onClick={() => setSelectedSection('growth')}
          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
            selectedSection === 'growth'
              ? 'bg-violet-950/80 border-violet-400 text-violet-200'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="text-xs font-mono font-bold text-violet-400">UNIT 01 - B</div>
          <div className="text-sm font-bold mt-0.5">生殖發育與青春期</div>
        </button>

        <button
          onClick={() => setSelectedSection('first_aid')}
          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
            selectedSection === 'first_aid'
              ? 'bg-rose-950/80 border-rose-400 text-rose-200'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="text-xs font-mono font-bold text-rose-400">UNIT 02 - A</div>
          <div className="text-sm font-bold mt-0.5">預防意外與簡單急救</div>
        </button>

        <button
          onClick={() => setSelectedSection('crisis')}
          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
            selectedSection === 'crisis'
              ? 'bg-amber-950/80 border-amber-400 text-amber-200'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="text-xs font-mono font-bold text-amber-400">UNIT 02 - B</div>
          <div className="text-sm font-bold mt-0.5">危機應變與逃生安全</div>
        </button>
      </div>

      {/* Main Revision Body */}
      <div className="my-auto py-2 max-w-4xl mx-auto w-full overflow-y-auto max-h-[65vh]">
        {selectedSection === 'resp_dig' && (
          <div className="space-y-4">
            {/* Respiratory Summary */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-left">
              <h3 className="text-base font-bold text-emerald-400 flex items-center space-x-2 mb-3">
                <Activity className="w-4 h-4" />
                <span>一、呼吸系統主要部分及功能（課本第5-7頁）</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-emerald-300">鼻：</span>讓空氣從外面進入，鼻毛與黏液阻隔灰塵。
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-emerald-300">喉：</span>讓空氣進入氣管。
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-emerald-300">氣管：</span>讓空氣進入支氣管。
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-emerald-300">支氣管：</span>從氣管分支的兩條管道，進入兩個肺。
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-emerald-300">肺：</span>將空氣中的氧運送到血液，並從血液帶走二氧化碳。
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-emerald-300">橫膈膜：</span>分隔胸腔和腹腔，幫助肺吸氣和呼氣。
                </div>
              </div>

              {/* Inhale vs Exhale Table */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-900/60">
                <div className="text-xs font-bold text-emerald-400 mb-2">💡 呼吸機制對照表（必考考點）</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                    <div className="font-bold text-emerald-300 mb-1">【吸氣時】</div>
                    <div>• 肋骨：<span className="text-emerald-300 font-bold">向外</span></div>
                    <div>• 橫膈膜：<span className="text-emerald-300 font-bold">向下</span></div>
                    <div>• 胸腔：<span className="text-emerald-300 font-bold">擴張</span></div>
                    <div>• 空氣：經氣管支氣管<span className="text-emerald-300 font-bold">流入</span>肺</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40">
                    <div className="font-bold text-cyan-300 mb-1">【呼氣時】</div>
                    <div>• 肋骨：<span className="text-cyan-300 font-bold">向內</span></div>
                    <div>• 橫膈膜：<span className="text-cyan-300 font-bold">向上</span></div>
                    <div>• 胸腔：<span className="text-cyan-300 font-bold">縮小</span></div>
                    <div>• 空氣：經支氣管氣管<span className="text-cyan-300 font-bold">流出</span>肺</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Digestion Summary */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-left">
              <h3 className="text-base font-bold text-cyan-400 flex items-center space-x-2 mb-3">
                <Activity className="w-4 h-4" />
                <span>二、消化系統主要部分及功能（課本第8-11頁）</span>
              </h3>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-cyan-200 mb-3 font-semibold text-center">
                食物流動管道：口腔 → 咽 → 食道 → 胃 → 小腸 → 大腸 → 肛門
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-cyan-300">口腔：</span>牙齒咬碎食物，與唾液混和
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-cyan-300">咽與食道：</span>經咽進入食道，食道肌肉蠕動送進胃
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-cyan-300">胃：</span>攪拌食物，分泌胃液把食物初步分解
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-cyan-300">小腸：</span>完全分解食物，吸收當中的養分
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-cyan-300">大腸：</span>吸收食物渣滓中的水分，形成糞便
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-cyan-300">肛門：</span>糞便經這裏排出體外
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                <div className="font-bold text-cyan-300 mb-1">🛡️ 保護消化系統的四大習慣：</div>
                <div>1. <span className="font-semibold text-white">定時進食：</span>避免空腹過久胃酸刺激胃壁導致胃痛。</div>
                <div>2. <span className="font-semibold text-white">細嚼慢嚥：</span>避免狼吞虎嚥大塊食物增加胃消化負擔。</div>
                <div>3. <span className="font-semibold text-white">均衡飲食多蔬果：</span>膳食纖維使糞便軟化順暢，防便秘。</div>
                <div>4. <span className="font-semibold text-white">不吃過熱食物：</span>避免飲品溫度過高燙傷食道。</div>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'growth' && (
          <div className="space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-violet-500/30">
              <h3 className="text-base font-bold text-violet-400 mb-3">
                一、男女生殖系統器官與功能（課本第12-13頁）
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-violet-300 mb-1.5">🚹 男性生殖系統</div>
                  <div>• <span className="font-bold">睪丸：</span>製造男性荷爾蒙及精子</div>
                  <div>• <span className="font-bold">輸精管：</span>精子由睪丸前往尿道的通道</div>
                  <div>• <span className="font-bold">陰莖：</span>排尿和射精的器官</div>
                  <div>• <span className="font-bold">尿道：</span>排尿和射精的管道</div>
                  <div>• <span className="font-bold">陰囊：</span>保護睪丸，調節適當溫度</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-pink-300 mb-1.5">🚺 女性生殖系統</div>
                  <div>• <span className="font-bold">卵巢：</span>製造女性荷爾蒙和按時排卵</div>
                  <div>• <span className="font-bold">輸卵管：</span>將卵子輸送到子宮的通道</div>
                  <div>• <span className="font-bold">子宮：</span>胚胎成長懷孕的地方</div>
                  <div>• <span className="font-bold">陰道：</span>生產時可容納胎兒通過</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-violet-500/30">
              <h3 className="text-base font-bold text-violet-400 mb-3">
                二、人類的成長階段與青春期生理心理（課本第14-22頁）
              </h3>
              <div className="space-y-2 text-xs md:text-sm text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-violet-300">成長六階段：</span>
                  嬰兒期 (0-1歲:頭大四肢短) → 幼兒期 (約2-5歲:乳齒齊) → 兒童期 (約6-10歲:長恆齒) → 青春期 (約11-17歲:生殖系統成熟) → 成年期 (約18-59歲) → 老年期 (約60歲及以後:機能下降)。
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-violet-300">月經與夢遺現象：</span>
                  女性因排出的卵子未受精，增厚子宮內膜脫落混合血液排出形成月經；男性夜間射出精液為夢遺，皆為健康發育的正常生理現象。
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-violet-300">心理變化：</span>
                  渴望獨立自主、對異性與性好奇、情緒不穩定容易衝動、注重外表。應正面看待，學習情緒管理。
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'first_aid' && (
          <div className="space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30">
              <h3 className="text-base font-bold text-rose-400 mb-3">
                🚑 意外急救四大黃金處置法則（課本第4-7頁）
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40">
                  <div className="font-bold text-rose-300 mb-1">1. 輕微燙傷與燒傷</div>
                  <div>• 用清水沖洗傷處 <span className="text-rose-400 font-bold">10分鐘以上</span> 或至減痛</div>
                  <div>• 用消毒敷料輕蓋</div>
                  <div>• <span className="text-rose-400 font-bold">切勿大力按摩或塗抹牙膏</span></div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40">
                  <div className="font-bold text-rose-300 mb-1">2. 流鼻血正確止血</div>
                  <div>• 冷靜坐下，<span className="text-rose-400 font-bold">頭微俯前傾</span>（切勿仰頭）</div>
                  <div>• 用口呼吸，捏住鼻骨下軟部 <span className="text-rose-400 font-bold">10分鐘</span></div>
                  <div>• 鬆解頸胸緊身衣物</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40">
                  <div className="font-bold text-rose-300 mb-1">3. 扭傷與撞傷 (紅腫痛熱)</div>
                  <div>• 把受傷部位 <span className="text-rose-400 font-bold">托起來</span></div>
                  <div>• 用毛巾包裹冰塊進行 <span className="text-rose-400 font-bold">冷敷</span></div>
                  <div>• 減少局部出血，減輕腫脹疼痛</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40">
                  <div className="font-bold text-rose-300 mb-1">4. 擦傷與輕微割傷</div>
                  <div>• 戴上拋棄式手套防感染</div>
                  <div>• 用清水或消毒藥水沖洗傷口</div>
                  <div>• 貼上消毒膠布包紮</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'crisis' && (
          <div className="space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30">
              <h3 className="text-base font-bold text-amber-400 mb-3">
                🔥 危機逃生與公共安全守則（課本第12-20頁）
              </h3>
              <div className="space-y-3 text-xs md:text-sm text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-300 mb-1">氣體洩漏（煤氣/石油氣）：</div>
                  <div>• 打開窗戶通風，關掉供氣總掣。</div>
                  <div>• <span className="text-amber-400 font-bold">絕對不要開關電燈、電器、按門鈴或現場打電話</span>（防電火花爆炸）。</div>
                  <div>• 拍門通知鄰居離開，到安全空曠處打999報警。</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-300 mb-1">火警逃生：</div>
                  <div>• 逃生三寶：<span className="text-amber-300 font-bold">手提電話、錢包、門匙</span>（及濕毛巾）。</div>
                  <div>• 逃生時用濕毛巾掩口鼻、<span className="text-amber-300 font-bold">伏地爬行</span>、走樓梯（<span className="text-rose-400 font-bold">絕不乘升降機</span>）。</div>
                  <div>• 若走廊濃煙密布：關大門、膠紙濕毛巾封門縫、打999求助並在窗口揮動毛巾。</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-300 mb-1">搬運重物與電梯安全：</div>
                  <div>• 搬重物：蹲下、挺直腰背、用腿力提物、貼近身體；忌彎腰拱背。</div>
                  <div>• 扶手電梯緊握扶手站黃線內；嬰兒車不推上滾梯；困梯按緊急鈴對講。</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
        香港小學常識科教材 · 人體與平安總複習庫
      </div>
    </div>
  );
}
