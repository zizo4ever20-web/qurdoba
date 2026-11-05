import React from 'react';
import { Printer, X, Award, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  studentName: string;
  score: number;
  completedSentences: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  score,
  completedSentences,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const displayName = studentName.trim() || 'بَطَلُ الْقِرَاءَةِ الْمُتَمَيِّزُ';
  const currentDate = new Date().toLocaleDateString('ar-SA');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-amber-300">
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-[#075694] font-black text-lg">
            <Award className="w-6 h-6 text-amber-500" />
            <span>شَهَادَةُ التَّفَوُّقِ وَالتَّكْرِيمِ</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 bg-[#075694] hover:bg-[#074783] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>طِبَاعَةُ الشَّهَادَةِ (A4)</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer transition-all"
              aria-label="إغلاق الشهادة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div
          id="certificate-print-area"
          className="border-8 border-double border-[#075694] p-6 md:p-10 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 text-center relative overflow-hidden shadow-inner"
        >
          {/* Subtle Corner Ornaments */}
          <div className="absolute top-3 right-3 text-3xl select-none opacity-40">⭐</div>
          <div className="absolute top-3 left-3 text-3xl select-none opacity-40">⭐</div>
          <div className="absolute bottom-3 right-3 text-3xl select-none opacity-40">⭐</div>
          <div className="absolute bottom-3 left-3 text-3xl select-none opacity-40">⭐</div>

          {/* School Header */}
          <div className="text-[#075694] font-bold text-sm md:text-base mb-1">
            الْمَمْلَكَةُ الْعَرَبِيَّةُ السُّعُودِيَّةُ — وِزَارَةُ التَّعْلِيمِ
          </div>
          <div className="text-xl md:text-2xl font-black text-[#08163e] tracking-tight">
            مَدَارِسُ قُرْطُبَةَ الْأَهْلِيَّةِ (قِسْمُ الصُّفُوفِ الْأَوَّلِيَّةِ)
          </div>

          <div className="w-24 h-1 bg-[#df7200] mx-auto my-4 rounded-full" />

          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-black text-[#bd080b] mb-4 tracking-normal font-naskh">
            شَهَادَةُ شُكْرٍ وَتَقْدِيرٍ وَتَفَوُّقٍ
          </h2>

          {/* Body Text */}
          <p className="text-sm md:text-lg text-slate-700 leading-relaxed max-w-xl mx-auto mb-4">
            تَسُرُّ إِدَارَةُ قِسْمِ الصُّفُوفِ الْأَوَّلِيَّةِ أَنْ تَمْنَحَ هَذِهِ الشَّهَادَةَ لِلْبَطَلِ الْمُتَمَيِّزِ:
          </p>

          <div className="inline-block px-8 py-2.5 rounded-2xl bg-amber-100/80 border-2 border-amber-300 text-2xl md:text-3xl font-black text-[#08163e] mb-5 shadow-xs font-naskh">
            {displayName}
          </div>

          <p className="text-sm md:text-lg text-slate-700 leading-relaxed max-w-xl mx-auto mb-6">
            لِاجْتِيَازِهِ بِتَفَوُّقٍ وَجَدَارَةٍ «تَحَدِّيَ الْجُمَلِ الْقِرَائِيَّةِ» وَتَرْتِيبِ الْجُمَلِ النَّحْوِيَّةِ
            بِمَجْمُوعِ <span className="font-black text-[#075694] text-xl">{score} نُقْطَة</span> وَإِكْمَالِ{' '}
            <span className="font-black text-[#bd080b] text-xl">{completedSentences} جُمْلَة</span> بِدِقَّةٍ عَالِيَةٍ.
          </p>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t-2 border-slate-200 text-right">
            <div>
              <div className="text-xs text-slate-500 font-bold mb-1">التَّارِيخُ: {currentDate}</div>
              <div className="text-xs md:text-sm font-extrabold text-[#075694]">
                خَتْمُ الْمَدْرَسَةِ: مَدَارِسُ قُرْطُبَةَ 🏅
              </div>
            </div>

            <div className="text-left">
              <div className="text-xs text-slate-500 font-bold mb-1">مُشْرِفُ الصُّفُوفِ الْأَوَّلِيَّةِ</div>
              <div className="text-sm md:text-base font-black text-[#bd080b] font-naskh">
                أ. أَحْمَد الشَّرْبِينِي
              </div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>مُعْتَمَدٌ رَسْمِيًّا</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
