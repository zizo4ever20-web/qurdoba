import React, { useState } from 'react';
import { Trophy, Star, RotateCcw, Award, CheckCircle2, Medal, TrendingUp } from 'lucide-react';
import { calculateStars, getMotivationalMessage, StorageData, GameMode } from '../game/logic';
import { triggerGrandVictoryConfetti } from '../utils/confetti';

interface OverlayModalProps {
  score: number;
  completedSentences: number;
  mode: GameMode;
  savedData: StorageData;
  isOpen: boolean;
  onRestart: () => void;
  onOpenCertificate: (studentName: string) => void;
  onOpenChart: () => void;
}

export const OverlayModal: React.FC<OverlayModalProps> = ({
  score,
  completedSentences,
  mode,
  savedData,
  isOpen,
  onRestart,
  onOpenCertificate,
  onOpenChart,
}) => {
  if (!isOpen) return null;

  const [studentName, setStudentName] = useState('');
  const stars = calculateStars(score, completedSentences);
  const motivationalMessage = getMotivationalMessage(stars, score);

  React.useEffect(() => {
    if (isOpen) {
      triggerGrandVictoryConfetti();
    }
  }, [isOpen]);

  const handleCertificateClick = () => {
    onOpenCertificate(studentName.trim() || 'بَطَلُ الْقِرَاءَةِ');
  };

  return (
    <div
      id="overlay"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden">
        {/* Confetti decoration emojis */}
        <div className="text-4xl mb-2 animate-bounce">🏆</div>

        <h2 className="text-2xl md:text-3xl font-black text-[#0c1e4a] mb-1 font-naskh">
          نِهَايَةُ التَّحَدِّي الْقِرَائِيِّ!
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-bold mb-2">
          مَدَارِسُ قُرْطُبَةَ — قِسْمُ الصُّفُوفِ الْأَوَّلِيَّةِ
        </p>

        {/* Mode Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-4 border shadow-2xs bg-cyan-50 text-cyan-900 border-cyan-200">
          {mode === 'accuracy' ? (
            <span>🎯 نَمَطُ تَحَدِّي الْوَقْتِ الْمَفْتُوحِ (دِقَّةُ التَّرْتِيبِ)</span>
          ) : mode === 'challenge' ? (
            <span>⏱️ نَمَطُ تَحَدِّي السِّرْعَةِ (٩٠ ثَانِيَة)</span>
          ) : (
            <span>🌟 نَمَطُ التَّعَلُّمِ الْحُرِّ</span>
          )}
        </div>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-9 h-9 md:w-11 md:h-11 transition-all ${
                s <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-md scale-110'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          ))}
        </div>

        {/* Motivational Message */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[#08163e] font-extrabold text-sm md:text-base mb-5 shadow-xs">
          {motivationalMessage}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
            <div className="text-xs text-slate-500 font-bold mb-0.5">مَجْمُوعُ النِّقَاطِ</div>
            <div className="text-2xl md:text-3xl font-black text-[#075694] font-mono">
              {score}
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
            <div className="text-xs text-slate-500 font-bold mb-0.5">الْجُمَلُ الْمُنْجَزَةُ</div>
            <div className="text-2xl md:text-3xl font-black text-emerald-600 font-mono">
              {completedSentences}
            </div>
          </div>
        </div>

        {/* Student Name Input for Certificate */}
        <div className="mb-5 text-right bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
          <label
            htmlFor="student-name-input"
            className="block text-xs md:text-sm font-extrabold text-[#075694] mb-1.5"
          >
            ✍️ اكْتُبِ اسْمَ الطَّالِبِ / الطَّالِبَةِ لِطِبَاعَةِ شَهَادَةِ التَّفَوُّقِ:
          </label>
          <input
            id="student-name-input"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="مِثَال: مُحَمَّد أَحْمَد عَبْدِ الرَّحْمَنِ"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-blue-200 bg-white font-bold text-sm md:text-base text-[#08163e] focus:outline-none focus:ring-2 focus:ring-[#075694] shadow-xs"
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center mb-6 flex-wrap">
          <button
            onClick={handleCertificateClick}
            type="button"
            className="w-full sm:w-auto px-5 py-3 bg-[#075694] hover:bg-[#074783] text-white rounded-2xl font-black text-xs md:text-sm shadow-lg border-b-4 border-[#072e59] flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-1"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>عَرْضُ شَهَادَةِ التَّفَوُّقِ 🎓</span>
          </button>

          <button
            onClick={onOpenChart}
            type="button"
            className="w-full sm:w-auto px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-black text-xs md:text-sm shadow-lg border-b-4 border-purple-950 flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-1"
          >
            <TrendingUp className="w-4 h-4 text-purple-200" />
            <span>مُنْحَنَى التَّقَدُّمِ 📈</span>
          </button>

          <button
            onClick={onRestart}
            type="button"
            className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs md:text-sm shadow-lg border-b-4 border-emerald-800 flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إِعَادَةُ التَّحَدِّي 🔄</span>
          </button>
        </div>

        {/* Leaderboard History (Top 3) */}
        {savedData.history.length > 0 && (
          <div className="text-right pt-4 border-t border-slate-200">
            <h3 className="text-xs font-black text-slate-500 mb-2 flex items-center gap-1.5">
              <Medal className="w-4 h-4 text-amber-500" />
              <span>سِجِلُّ أَبْطَالِ التَّحَدِّي السَّابِقِينَ (مَحْفُوظٌ مَحَلِّيًّا):</span>
            </h3>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {savedData.history.slice(0, 3).map((item, idx) => (
                <div
                  key={`${item.date}-${idx}`}
                  className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-200"
                >
                  <span className="font-extrabold text-[#08163e]">
                    {idx + 1}. {item.studentName}
                  </span>
                  <span className="font-mono font-black text-[#075694]">
                    {item.score} نُقْطَة
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
