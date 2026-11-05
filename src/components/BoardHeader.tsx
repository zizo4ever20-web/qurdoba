import React from 'react';
import {
  Trophy,
  Clock,
  Target,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Layers,
  TrendingUp,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { CATEGORIES } from '../data/sentences';
import { GameMode } from '../game/logic';

interface BoardHeaderProps {
  score: number;
  highScore: number;
  timeLeft: number;
  mode: GameMode;
  currentIndex: number;
  totalSentences: number;
  soundEnabled: boolean;
  selectedCategory: string | null;
  onToggleSound: () => void;
  onChangeMode: (mode: GameMode) => void;
  onSelectCategory: (cat: string | null) => void;
  onExportStandalone: () => void;
  onOpenChart: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  score,
  highScore,
  timeLeft,
  mode,
  currentIndex,
  totalSentences,
  soundEnabled,
  selectedCategory,
  onToggleSound,
  onChangeMode,
  onSelectCategory,
  onExportStandalone,
  onOpenChart,
}) => {
  const progressPercent = Math.round(((currentIndex + 1) / totalSentences) * 100);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-4 md:p-6 border-4 border-cyan-200 mb-5 transition-all">
      {/* Top Bar: Title & Global Actions */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pb-4 border-b-2 border-slate-100">
        <div className="flex items-center gap-3.5 text-right w-full lg:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0891b2] via-[#0284c7] to-[#4d7c0f] flex items-center justify-center text-white text-3xl shadow-lg ring-4 ring-cyan-100 shrink-0 transform hover:rotate-6 transition-transform">
            📖
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight flex items-center gap-2 flex-wrap">
              <span className="bg-gradient-to-r from-[#0284c7] via-[#0891b2] to-[#4d7c0f] bg-clip-text text-transparent">
                تَحَدِّي الْجُمَلِ الْقِرَائِيَّةِ
              </span>
              <span className="text-xs md:text-sm font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-[#ea580c] border border-amber-300 shadow-xs">
                مَدَارِسُ قُرْطُبَةَ 🌟
              </span>
            </h1>
            <p className="text-xs md:text-sm font-extrabold mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="text-[#0284c7]">الصُّفُوفُ الْأَوَّلِيَّةُ (٦-٩ سَنَوَات)</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#dc2626]">إِعْدَادٌ: أ. أَحْمَد الشَّرْبِينِي</span>
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center flex-wrap gap-2 justify-end w-full lg:w-auto">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            type="button"
            className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
              soundEnabled
                ? 'bg-amber-50 text-[#ea580c] border-amber-300 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
            aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Category Selector Dropdown */}
          <div className="relative inline-flex items-center">
            <Layers className="w-4 h-4 absolute right-3 text-cyan-600 pointer-events-none" />
            <select
              value={selectedCategory || 'all'}
              onChange={(e) => onSelectCategory(e.target.value === 'all' ? null : e.target.value)}
              className="appearance-none pr-9 pl-3.5 py-2 bg-gradient-to-r from-cyan-50 to-emerald-50 hover:from-cyan-100 hover:to-emerald-100 border-2 border-cyan-300 rounded-2xl text-xs md:text-sm font-black text-[#08163e] focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-xs"
              aria-label="اختيار قسم الجمل"
            >
              <option value="all">كُلُّ الْأَقْسَامِ (١٠٠ جُمْلَة)</option>
              {CATEGORIES.map((cat, idx) => (
                <option key={cat} value={cat}>
                  {idx + 1}. {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Chart Button (Recharts) */}
          <button
            onClick={onOpenChart}
            type="button"
            className="px-3.5 py-2 rounded-2xl font-black text-xs md:text-sm bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-[#0284c7] border-2 border-sky-300 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
            title="عرض رسم بياني لتطور مستوى الطالب في القراءة"
          >
            <TrendingUp className="w-4 h-4 text-[#0284c7]" />
            <span className="hidden sm:inline">مُنْحَنَى الْمُسْتَوَى</span>
            <span>📈</span>
          </button>

          {/* Export Standalone HTML file */}
          <button
            onClick={onExportStandalone}
            type="button"
            className="px-3 py-2 rounded-2xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 flex items-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95"
            title="تنزيل اللعبة كملف HTML مستقل كامل يعمل بدون خادم وبدون إنترنت"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">حِفْظُ مَلَفٍّ مُسْتَقِلٍّ</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Segmented Bar (Highlighting Open Time Challenge) */}
      <div className="mt-3.5 pt-1 pb-1">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <span className="text-xs font-black text-slate-600 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#ea580c]" />
            <span>اخْتَرْ نَمَطَ التَّحَدِّيِ:</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Mode 1: 90s Speed Challenge */}
          <button
            onClick={() => onChangeMode('challenge')}
            type="button"
            className={`p-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer select-none active:scale-95 ${
              mode === 'challenge'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-700 shadow-md ring-2 ring-red-300'
                : 'bg-white hover:bg-red-50 text-slate-700 border-slate-200 hover:border-red-300'
            }`}
          >
            <Clock className={`w-4 h-4 ${mode === 'challenge' ? 'text-white' : 'text-[#dc2626]'}`} />
            <span>تَحَدِّي السِّرْعَةِ (٩٠ ث) ⏱️</span>
          </button>

          {/* Mode 2: NEW Open Time Challenge (Focused on Grammatical Accuracy without Timer) */}
          <button
            onClick={() => onChangeMode('accuracy')}
            type="button"
            className={`p-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer select-none active:scale-95 ${
              mode === 'accuracy'
                ? 'bg-gradient-to-r from-[#0891b2] via-[#0284c7] to-[#15803d] text-white border-cyan-800 shadow-md ring-2 ring-cyan-300'
                : 'bg-cyan-50/70 hover:bg-cyan-100/90 text-cyan-900 border-cyan-300 hover:border-cyan-400'
            }`}
          >
            <Target className={`w-4 h-4 ${mode === 'accuracy' ? 'text-amber-300' : 'text-[#0891b2]'}`} />
            <span>تَحَدِّي الْوَقْتِ الْمَفْتُوحِ (دِقَّةُ التَّرْتِيبِ) 🎯</span>
          </button>

          {/* Mode 3: Practice & Free Exploration */}
          <button
            onClick={() => onChangeMode('practice')}
            type="button"
            className={`p-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer select-none active:scale-95 ${
              mode === 'practice'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-700 shadow-md ring-2 ring-amber-300'
                : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200 hover:border-amber-300'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${mode === 'practice' ? 'text-white' : 'text-[#ea580c]'}`} />
            <span>وَضْعُ التَّعَلُّمِ الْحُرِّ 🌟</span>
          </button>
        </div>
      </div>

      {/* 3 Core Stats Cards with Joyful Colors (Orange, Sky Blue, Yellow, Red) */}
      <div className="grid grid-cols-3 gap-2.5 md:gap-4 mt-4">
        {/* 1. النقاط (Joyful Orange & Golden Yellow) */}
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-3 border-amber-300 rounded-3xl p-3 md:p-3.5 text-center shadow-md relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-center gap-1.5 text-[#ea580c] text-xs md:text-sm font-black mb-0.5">
            <Trophy className="w-4 h-4 text-[#ea580c] shrink-0" />
            <span>النِّقَاطُ</span>
          </div>
          <div className="text-2xl md:text-4xl font-black text-amber-950 font-mono tracking-tight">
            {score}
          </div>
          {highScore > 0 ? (
            <div className="text-[10px] md:text-xs text-amber-800 font-extrabold mt-0.5">
              الأَعْلَى: {highScore} 🏆
            </div>
          ) : (
            <div className="text-[10px] md:text-xs text-amber-700 font-bold mt-0.5">
              +١٠ لِكُلِّ جُمْلَة
            </div>
          )}
        </div>

        {/* 2. نمط الوقت والتحدي (Sky Blue & Turquoise / Alert Red) */}
        <div
          className={`border-3 rounded-3xl p-3 md:p-3.5 text-center shadow-md relative overflow-hidden transition-all group hover:scale-[1.02] ${
            mode === 'challenge' && timeLeft <= 15
              ? 'bg-red-50 border-red-400 animate-pulse'
              : mode === 'accuracy'
              ? 'bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 border-cyan-400'
              : 'bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 border-sky-300'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-black mb-0.5 text-[#0284c7]">
            {mode === 'accuracy' ? (
              <>
                <Target className="w-4 h-4 text-[#0891b2] shrink-0" />
                <span className="text-[#0891b2]">دِقَّةُ التَّرْتِيبِ</span>
              </>
            ) : mode === 'challenge' ? (
              <>
                <Clock className="w-4 h-4 text-[#dc2626] shrink-0" />
                <span className="text-[#dc2626]">الْوَقْتُ الْمُتَبَقِّي</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span className="text-[#ea580c]">تَعَلُّمٌ مَفْتُوحٌ</span>
              </>
            )}
          </div>

          <div
            className={`text-xl md:text-3xl font-black tracking-tight my-0.5 ${
              mode === 'challenge' && timeLeft <= 15
                ? 'text-[#dc2626] font-mono'
                : mode === 'accuracy'
                ? 'text-[#0891b2]'
                : 'text-[#0284c7] font-mono'
            }`}
          >
            {mode === 'challenge' ? `${timeLeft}ث` : mode === 'accuracy' ? '١٠٠٪ دِقَّة' : '∞'}
          </div>

          <div className="text-[10px] md:text-xs font-black">
            {mode === 'challenge' ? (
              <span className="text-slate-500">مِنْ ٩٠ ثَانِيَة</span>
            ) : mode === 'accuracy' ? (
              <span className="text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full inline-block">
                وَقْتٌ مَفْتُوحٌ (بِدُونِ مُؤَقِّت)
              </span>
            ) : (
              <span className="text-[#ea580c]">تَدْرِيبٌ مَفْتُوحٌ</span>
            )}
          </div>
        </div>

        {/* 3. التقدم (Olive Green & Fresh Lime) */}
        <div className="bg-gradient-to-br from-lime-50 via-emerald-50 to-teal-50 border-3 border-emerald-300 rounded-3xl p-3 md:p-3.5 text-center shadow-md relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-center gap-1.5 text-[#15803d] text-xs md:text-sm font-black mb-0.5">
            <CheckCircle className="w-4 h-4 text-[#15803d] shrink-0" />
            <span>التَّقَدُّمُ</span>
          </div>
          <div className="text-xl md:text-3xl font-black text-emerald-950 font-mono tracking-tight">
            {currentIndex + 1} <span className="text-xs md:text-base font-bold text-emerald-700">/ {totalSentences}</span>
          </div>
          <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden mt-1.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-lime-500 via-emerald-500 to-teal-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
