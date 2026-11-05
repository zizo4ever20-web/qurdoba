import React from 'react';
import { Play, Pause, RotateCcw, FastForward, ArrowRight, ArrowLeft, Target, Sparkles } from 'lucide-react';
import { GameMode } from '../game/logic';

interface ControlsBarProps {
  isRunning: boolean;
  mode: GameMode;
  onTogglePlay: () => void;
  onResetSentence: () => void;
  onSkipSentence: () => void;
  onPrevSentence?: () => void;
  onNextSentence?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isRunning,
  mode,
  onTogglePlay,
  onResetSentence,
  onSkipSentence,
  onPrevSentence,
  onNextSentence,
  hasPrev = false,
  hasNext = true,
}) => {
  return (
    <div className="w-full flex items-center justify-center flex-wrap gap-3 md:gap-4 my-5">
      {/* 1. ابدأ / إيقاف مؤقت (خاص بنمط تحدي السرعة ٩٠ث) */}
      {mode === 'challenge' && (
        <button
          onClick={onTogglePlay}
          type="button"
          className={`px-6 py-3.5 rounded-2xl font-black text-sm md:text-base flex items-center gap-2 shadow-xl border-2 transition-all cursor-pointer select-none active:scale-95 ${
            isRunning
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-amber-600 border-b-5'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-800 border-b-5'
          }`}
          title={isRunning ? 'إيقاف التحدي مؤقتاً' : 'بدء التحدي'}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>إِيقَافٌ مُؤَقَّتٌ ⏸️</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>ابْدَأِ التَّحَدِّيَ 🚀</span>
            </>
          )}
        </button>
      )}

      {/* For Open Time Challenge Badge */}
      {mode === 'accuracy' && (
        <div className="px-5 py-3 rounded-2xl bg-cyan-100/90 border-2 border-cyan-400 text-cyan-950 font-black text-xs md:text-sm flex items-center gap-2 shadow-sm">
          <Target className="w-5 h-5 text-[#0891b2]" />
          <span>تَحَدِّي الْوَقْتِ الْمَفْتُوحِ نَشِطٌ (رَكِّزْ عَلَى الدِّقَّةِ) ✨</span>
        </div>
      )}

      {/* 2. إعادة (تفريغ المقاطع وإعادة خلطها) */}
      <button
        onClick={onResetSentence}
        type="button"
        className="px-5 py-3.5 rounded-2xl font-black text-sm md:text-base bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 border-b-5 border-b-slate-400 active:border-b-2 shadow-md flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95"
        title="إعادة تفريغ المقاطع للبدء من جديد"
      >
        <RotateCcw className="w-4 h-4 text-slate-600" />
        <span>إِعَادَةُ التَّرْتِيبِ 🔄</span>
      </button>

      {/* 3. تخطّي الجملة */}
      <button
        onClick={onSkipSentence}
        type="button"
        className="px-5 py-3.5 rounded-2xl font-black text-sm md:text-base bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-[#0284c7] border-2 border-sky-300 border-b-5 border-b-sky-400 active:border-b-2 shadow-md flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95"
        title="تخطي هذه الجملة والانتقال للتالية"
      >
        <FastForward className="w-4 h-4 text-[#0284c7]" />
        <span>تَخَطٍّ ⏭️</span>
      </button>

      {/* Navigation for Practice or Open Time mode */}
      {(mode === 'practice' || mode === 'accuracy') && (
        <div className="flex items-center gap-2 mr-auto md:mr-0">
          <button
            onClick={onPrevSentence}
            disabled={!hasPrev}
            type="button"
            className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer"
            title="الجملة السابقة"
          >
            <ArrowRight className="w-5 h-5 text-[#0284c7]" />
          </button>
          <button
            onClick={onNextSentence}
            disabled={!hasNext}
            type="button"
            className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer"
            title="الجملة التالية"
          >
            <ArrowLeft className="w-5 h-5 text-[#0284c7]" />
          </button>
        </div>
      )}
    </div>
  );
};
