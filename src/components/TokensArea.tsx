import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

interface TokensAreaProps {
  remainingTokens: Array<{ id: string; text: string }>;
  onSelectToken: (tokenItem: { id: string; text: string }) => void;
  disabled?: boolean;
  hintToken?: string | null;
}

export const TokensArea: React.FC<TokensAreaProps> = ({
  remainingTokens,
  onSelectToken,
  disabled = false,
  hintToken = null,
}) => {
  return (
    <section
      id="tokens"
      aria-label="منطقة المقاطع المبعثرة"
      className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-cyan-200 mt-5 transition-all"
    >
      <div className="flex items-center justify-between mb-3 text-slate-700 pb-2 border-b border-slate-100 flex-wrap gap-2">
        <h2 className="text-sm md:text-base font-black flex items-center gap-2 text-[#0c1e4a]">
          <Sparkles className="w-5 h-5 text-[#ea580c] animate-spin" />
          <span>الْمَقَاطِعُ الْمُبَعْثَرَةُ (اضْغَطْ عَلَى الْكَلِمَةِ لِتَرْكِيبِ الْجُمْلَةِ):</span>
        </h2>
        <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-[#ea580c] border border-amber-300">
          المتبقي: {remainingTokens.length} كلمات
        </span>
      </div>

      {/* 15-second Inactivity Hint Banner */}
      {hintToken && (
        <div className="mb-4 p-3 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-2 border-amber-400 rounded-2xl flex items-center justify-center gap-2 text-amber-950 font-black text-xs md:text-sm shadow-md animate-bounce">
          <Lightbulb className="w-5 h-5 text-amber-600 fill-amber-500 shrink-0" />
          <span>
            تَلْمِيحٌ مُسَاعِدٌ: الْمَقْطَعُ التَّالِي الصَّحِيحُ مُضِيءٌ بِاللَّوْنِ الذَّهَبِيِّ (
            <strong className="text-[#ea580c] font-black underline text-sm md:text-base font-naskh">
              {hintToken}
            </strong>
            )! اضْغَطْ عَلَيْهِ 👇
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3.5 md:gap-5 min-h-[95px] p-2">
        {remainingTokens.length === 0 ? (
          <div className="text-center py-4 animate-scale-up">
            <span className="inline-block text-3xl mb-1">🎉</span>
            <p className="text-[#15803d] font-black text-base md:text-lg">
              تَمَّ اخْتِيَارُ جَمِيعِ الْمَقَاطِعِ! جَارٍ التَّدْقِيقُ... 🔍
            </p>
          </div>
        ) : (
          remainingTokens.map((tokenItem) => {
            const isHint = hintToken && tokenItem.text === hintToken;

            return (
              <div key={tokenItem.id} className="relative flex flex-col items-center">
                {isHint && (
                  <span className="absolute -top-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-md animate-pulse flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 fill-current" />
                    <span>الْكَلِمَةُ التَّالِيَةُ 💡</span>
                  </span>
                )}

                <button
                  onClick={() => onSelectToken(tokenItem)}
                  disabled={disabled}
                  type="button"
                  className={`px-6 py-3.5 md:px-8 md:py-4.5 rounded-3xl font-black text-2xl md:text-3xl shadow-lg transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 ${
                    isHint
                      ? 'bg-gradient-to-b from-yellow-100 via-amber-100 to-yellow-200 border-3 border-amber-400 border-b-6 border-b-amber-600 text-amber-950 ring-4 ring-amber-400 ring-offset-2 animate-pulse scale-105 shadow-amber-300'
                      : 'bg-gradient-to-b from-white via-cyan-50/30 to-sky-100/60 hover:from-white hover:to-sky-200/80 active:to-sky-300 border-3 border-sky-300 hover:border-[#0284c7] border-b-6 border-b-[#0284c7] active:border-b-2 active:translate-y-1 text-[#0c1e4a] hover:text-[#0284c7]'
                  }`}
                  aria-label={`المقطع ${tokenItem.text}${isHint ? ' تلميح الكلمة التالية' : ''}`}
                >
                  <span className="font-naskh tracking-wide leading-normal">
                    {tokenItem.text}
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
