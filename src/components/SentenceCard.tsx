import React from 'react';
import { Volume2, Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { SentenceItem } from '../data/sentences';
import { getGrammarRole } from '../game/logic';

interface SentenceCardProps {
  sentence: SentenceItem;
  placedTokens: string[];
  feedbackStatus: 'idle' | 'correct' | 'wrong';
  onRemoveToken: (index: number) => void;
  onSpeakSentence: () => void;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  placedTokens,
  feedbackStatus,
  onRemoveToken,
  onSpeakSentence,
}) => {
  return (
    <section
      aria-live="polite"
      className={`relative w-full bg-white/98 rounded-3xl p-5 md:p-8 shadow-2xl border-4 transition-all duration-300 ${
        feedbackStatus === 'correct'
          ? 'border-emerald-500 shadow-emerald-200 ring-4 ring-emerald-200'
          : feedbackStatus === 'wrong'
          ? 'border-red-500 shadow-red-200 animate-shake ring-4 ring-red-200'
          : 'border-cyan-300/90 shadow-cyan-900/10'
      }`}
    >
      {/* Category Pill & ID with Joyful Styling */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-black bg-gradient-to-r from-cyan-50 to-sky-100 text-[#0284c7] border-2 border-sky-300 flex items-center gap-2 shadow-xs">
          <span>🏷️</span>
          <span>{sentence.category}</span>
          <span className="text-sky-300">|</span>
          <span className="text-[#ea580c]">الجملة رقم {sentence.id}</span>
        </span>

        {/* Speak sentence audio button in joyful golden orange */}
        <button
          onClick={onSpeakSentence}
          type="button"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs md:text-sm font-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-b-3 border-orange-700 shadow-md transition-all cursor-pointer active:scale-95"
          title="استمع لنطق الجملة باللغة العربية المشكولة"
        >
          <Volume2 className="w-4 h-4 text-white" />
          <span>اسْتَمِعْ لِلنُّطْقِ 🔊</span>
        </button>
      </div>

      {/* Main Content: Cheerful Picture Frame + Placed Words Bar */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
        {/* Emoji Picture Inside Dashed Frame with Joyful Warm Glow */}
        <div className="shrink-0 flex flex-col items-center">
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-dashed border-amber-400 bg-gradient-to-tr from-amber-100/80 via-yellow-50 to-orange-100/90 flex items-center justify-center text-5xl md:text-6xl shadow-md ring-4 ring-yellow-200/60 transition-transform hover:scale-105 select-none"
            title={`صورة الجملة: ${sentence.tashkeelFull}`}
          >
            {sentence.picture}
          </div>
          <span className="text-xs font-black text-[#ea580c] mt-2 tracking-tight bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-200">
            صُورَةُ الْجُمْلَةِ 🎨
          </span>
        </div>

        {/* Placed Tokens Area & Period */}
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <div className="w-full min-h-[95px] md:min-h-[115px] rounded-3xl bg-gradient-to-b from-slate-50 to-cyan-50/40 border-3 border-dashed border-cyan-300 p-3.5 md:p-5 flex items-center justify-center flex-wrap gap-3 shadow-inner">
            {placedTokens.length === 0 ? (
              <p className="text-slate-400 text-sm md:text-base font-extrabold text-center py-4 select-none flex items-center gap-2">
                <span>👇</span>
                <span>اضْغَطْ عَلَى الْمَقَاطِعِ أَدْنَاهُ بِالتَّرْتِيبِ النَّحْوِيِّ الصَّحِيحِ</span>
              </p>
            ) : (
              <>
                {placedTokens.map((token, index) => {
                  const roleMeta = getGrammarRole(index);
                  // Joyful border colors:
                  // 0 (verb): red
                  // 1 (subject): sky blue
                  // 2+ (phrase): orange
                  const tagClass =
                    index === 0
                      ? 'bg-red-50 text-[#dc2626] border-[#dc2626] border-b-4'
                      : index === 1
                      ? 'bg-sky-50 text-[#0284c7] border-[#0284c7] border-b-4'
                      : 'bg-orange-50 text-[#ea580c] border-[#ea580c] border-b-4';

                  return (
                    <div
                      key={`${token}-${index}`}
                      className="group relative flex flex-col items-center animate-scale-up"
                    >
                      {/* Word button with tap-to-remove */}
                      <button
                        onClick={() => onRemoveToken(index)}
                        type="button"
                        className={`relative px-4 py-2.5 md:px-5 md:py-3 rounded-2xl font-black text-xl md:text-2xl shadow-md border-2 transition-all duration-150 cursor-pointer flex items-center gap-2 select-none hover:-translate-y-0.5 active:translate-y-1 ${tagClass}`}
                        title="اضغط لإلغاء هذا المقطع وإعادته للمجموعة"
                      >
                        <span className="font-naskh leading-normal">{token}</span>
                        <X className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity hover:text-red-600" />
                      </button>

                      {/* Grammar Role Tag Indicator */}
                      <span
                        className="text-[11px] md:text-xs font-black px-2.5 py-0.5 rounded-full mt-1.5 shadow-2xs border"
                        style={{
                          backgroundColor: `${roleMeta.color}15`,
                          color: roleMeta.color,
                          borderColor: `${roleMeta.color}40`,
                        }}
                      >
                        {roleMeta.labelAr}
                      </span>
                    </div>
                  );
                })}

                {/* Period at the end of the sentence */}
                <span className="text-4xl md:text-5xl font-black text-[#0284c7] select-none self-center leading-none">
                  .
                </span>
              </>
            )}
          </div>

          {/* Grammar Role Legend Bar in Joyful Colors */}
          <div className="flex items-center justify-center gap-3 md:gap-6 mt-3.5 text-xs font-black flex-wrap">
            <span className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200">
              <span className="w-3 h-3 rounded-full bg-[#dc2626]" />
              <strong className="text-[#dc2626]">الفِعْلُ</strong> (أَحْمَرُ)
            </span>
            <span className="flex items-center gap-1.5 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
              <span className="w-3 h-3 rounded-full bg-[#0284c7]" />
              <strong className="text-[#0284c7]">الْفَاعِلُ</strong> (أَزْرَقُ سَمَاوِيٌّ)
            </span>
            <span className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200">
              <span className="w-3 h-3 rounded-full bg-[#ea580c]" />
              <strong className="text-[#ea580c]">مَفْعُولٌ / جَارٌّ</strong> (بُرْتُقَالِيٌّ)
            </span>
          </div>
        </div>
      </div>

      {/* Immediate Interactive Feedback Banner */}
      {feedbackStatus === 'correct' && (
        <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center gap-2.5 font-black text-sm md:text-base shadow-lg animate-bounce border-2 border-emerald-300">
          <CheckCircle2 className="w-6 h-6 text-yellow-300 shrink-0" />
          <span>مُمْتَازٌ يَا بَطَلُ! جُمْلَةٌ صَحِيحَةٌ بِنَجَاحٍ (+١٠ نِقَاط) 🌟</span>
        </div>
      )}

      {feedbackStatus === 'wrong' && (
        <div className="mt-4 p-3.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl flex items-center justify-center gap-2.5 font-black text-sm md:text-base shadow-lg border-2 border-red-300">
          <AlertCircle className="w-6 h-6 text-yellow-300 shrink-0" />
          <span>حَاوِلْ مَرَّةً أُخْرَى يَا بَطَلُ! التَّرْتِيبُ غَيْرُ صَحِيحٍ (-٢ نُقْطَة) 🔄</span>
        </div>
      )}
    </section>
  );
};
