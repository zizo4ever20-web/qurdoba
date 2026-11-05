import React from 'react';
import { Award, GraduationCap, Sparkles } from 'lucide-react';

export const BrandBar: React.FC = () => {
  return (
    <footer className="w-full mt-6 py-4 px-6 bg-white/95 backdrop-blur-md rounded-3xl border-4 border-cyan-200 shadow-xl text-center flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
      <div className="flex items-center gap-3 text-[#0284c7] font-black">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0891b2] to-[#15803d] text-white flex items-center justify-center font-black shrink-0 shadow-md">
          <GraduationCap className="w-5 h-5 text-amber-200" />
        </div>
        <span className="text-sm md:text-base text-[#0c1e4a]">
          مَدَارِسُ قُرْطُبَةَ الْأَهْلِيَّةِ — قِسْمُ الصُّفُوفِ الْأَوَّلِيَّةِ
        </span>
      </div>

      <div className="flex items-center gap-2 text-slate-700 font-extrabold flex-wrap justify-center">
        <Award className="w-5 h-5 text-[#ea580c] shrink-0" />
        <span>
          تَصْمِيمٌ وَإِعْدَادٌ: <span className="text-[#dc2626] font-black text-sm md:text-base">أ. أَحْمَد الشَّرْبِينِي</span> (مُشْرِفُ الصُّفُوفِ الْأَوَّلِيَّةِ)
        </span>
        <Sparkles className="w-4 h-4 text-amber-500" />
      </div>
    </footer>
  );
};
