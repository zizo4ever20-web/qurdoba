import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  X,
  Trophy,
  Award,
  Calendar,
  Sparkles,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { StorageData, saveGameResult } from '../game/logic';
import { formatHistoryForChart, calculateProgressStats } from '../game/chartUtils';

interface ProgressChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedData: StorageData;
  onUpdateSavedData: (newData: StorageData) => void;
}

export const ProgressChartModal: React.FC<ProgressChartModalProps> = ({
  isOpen,
  onClose,
  savedData,
  onUpdateSavedData,
}) => {
  const [metric, setMetric] = useState<'score' | 'completed' | 'accuracy'>('score');

  if (!isOpen) return null;

  const chartData = formatHistoryForChart(savedData.history);
  const stats = calculateProgressStats(savedData.history);

  // Add demo sessions if empty or teacher wants to see progression preview
  const handleAddDemoSessions = () => {
    let current = savedData;
    const sampleDates = ['١٠/٠٥', '١٢/٠٥', '١٥/٠٥', '١٨/٠٥', '٢٠/٠٥'];
    const sampleScores = [20, 40, 60, 80, 100];
    const sampleCompleted = [2, 4, 6, 8, 10];

    sampleDates.forEach((date, i) => {
      current = saveGameResult('طالب متميز', sampleScores[i], 'challenge', sampleCompleted[i]);
    });
    onUpdateSavedData(current);
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('qurtuba_reading_challenge_v1');
    } catch {
      // ignore
    }
    onUpdateSavedData({
      highScore: 0,
      totalCorrect: 0,
      soundEnabled: savedData.soundEnabled,
      history: [],
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chart-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-5 md:p-8 border-4 border-blue-200 animate-scale-up">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-[#075694] to-blue-500 text-white flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2
                id="chart-modal-title"
                className="text-lg md:text-2xl font-black text-[#08163e] tracking-tight leading-tight"
              >
                رَسْمٌ بَيَانِيٌّ: مُسْتَوَى تَقَدُّمِ الطَّالِبِ فِي الْقِرَاءَةِ 📈
              </h2>
              <p className="text-xs md:text-sm font-bold text-[#075694]">
                مَدَارِسُ قُرْطُبَةَ — مُتَابَعَةُ تَطَوُّرِ الْقِرَاءَةِ وَالتَّرْكِيبِ النَّحْوِيِّ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="إغلاق الرسم البياني"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 4 Summary Quick Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 mb-6">
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3 text-center">
            <span className="text-[11px] md:text-xs font-extrabold text-[#075694] block mb-0.5">
              عَدَدُ الْجَلَسَاتِ
            </span>
            <span className="text-xl md:text-2xl font-black text-[#08163e] font-mono">
              {stats.totalSessions}
            </span>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-center">
            <span className="text-[11px] md:text-xs font-extrabold text-amber-800 block mb-0.5">
              أَعْلَى دَرَجَةٍ 🏆
            </span>
            <span className="text-xl md:text-2xl font-black text-amber-950 font-mono">
              {stats.highestScore}
            </span>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 text-center">
            <span className="text-[11px] md:text-xs font-extrabold text-emerald-800 block mb-0.5">
              مُتَوَسِّطُ النِّقَاطِ
            </span>
            <span className="text-xl md:text-2xl font-black text-emerald-950 font-mono">
              {stats.averageScore}
            </span>
          </div>

          <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-3 text-center">
            <span className="text-[11px] md:text-xs font-extrabold text-purple-800 block mb-0.5">
              التَّقْيِيمُ التَّرْبَوِيُّ
            </span>
            <span className="text-xs md:text-sm font-black text-purple-950 truncate block">
              {stats.levelTitle}
            </span>
          </div>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs md:text-sm font-bold">
            <button
              onClick={() => setMetric('score')}
              type="button"
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                metric === 'score'
                  ? 'bg-[#075694] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مُنْحَنَى النِّقَاطِ 🎯
            </button>
            <button
              onClick={() => setMetric('completed')}
              type="button"
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                metric === 'completed'
                  ? 'bg-[#075694] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الْجُمَلُ الْمُنْجَزَةُ 📚
            </button>
            <button
              onClick={() => setMetric('accuracy')}
              type="button"
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                metric === 'accuracy'
                  ? 'bg-[#075694] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              نِسْبَةُ الدِّقَّةِ ٪ ⚡
            </button>
          </div>

          {/* Quick Demo Seed Button */}
          {chartData.length < 3 && (
            <button
              onClick={handleAddDemoSessions}
              type="button"
              className="text-xs font-bold text-[#075694] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#075694]" />
              <span>إِضَافَةُ جَلَسَاتٍ تَجْرِيبِيَّةٍ لِلْمُعَايَنَةِ</span>
            </button>
          )}
        </div>

        {/* Recharts Area Container */}
        <div className="w-full h-64 md:h-80 bg-slate-50/60 rounded-2xl p-2 md:p-4 border border-slate-200 shadow-inner">
          {chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="w-12 h-12 text-amber-500 mb-2" />
              <h3 className="text-base font-black text-[#08163e] mb-1">
                لَا تُوجَدُ جَلَسَاتٌ مُسَجَّلَةٌ حَتَّى الْآنَ
              </h3>
              <p className="text-xs md:text-sm text-slate-500 max-w-sm mb-4">
                سَيَبْدَأُ الْمُنْحَنَى الْبَيَانِيُّ فِي الظُّهُورِ تِلْقَائِيًّا بِمُجَرَّدِ إِكْمَالِ جَلَسَاتِ التَّحَدِّي أَوْ يُمْكِنُكَ تَجْرِبَةُ النَّمُوذَجِ الآن:
              </p>
              <button
                onClick={handleAddDemoSessions}
                type="button"
                className="px-4 py-2 bg-[#075694] text-white rounded-xl text-xs md:text-sm font-extrabold shadow-md hover:bg-[#074783] cursor-pointer transition-all"
              >
                تَوْلِيدُ بَيَانَاتٍ تَجْرِيبِيَّةٍ 🚀
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#075694" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#075694" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#df7200" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#df7200" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="sessionLabel"
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                  stroke="#cbd5e1"
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                  stroke="#cbd5e1"
                  domain={metric === 'accuracy' ? [0, 100] : [0, 'auto']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-xl border-2 border-blue-200 text-right text-xs font-bold space-y-1">
                          <div className="text-[#075694] font-black border-b pb-1">
                            {data.sessionLabel} ({data.date})
                          </div>
                          <div className="text-slate-600">
                            الطالب: <strong className="text-[#08163e]">{data.studentName}</strong>
                          </div>
                          <div className="text-amber-800">
                            النقاط: <strong className="text-amber-900 font-mono text-sm">{data.score}</strong>
                          </div>
                          <div className="text-emerald-700">
                            الجمل المنجزة: <strong className="font-mono">{data.completed}</strong>
                          </div>
                          <div className="text-purple-700">
                            نسبة الدقة: <strong className="font-mono">{data.accuracy}%</strong>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: '13px', fontWeight: 800 }}
                  formatter={(value) => {
                    if (value === 'score') return 'النقاط المحققة 🎯';
                    if (value === 'completed') return 'الجمل المنجزة 📚';
                    if (value === 'accuracy') return 'نسبة الدقة ٪ ⚡';
                    return value;
                  }}
                />

                {metric === 'score' && (
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#075694"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    dot={{ fill: '#075694', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: '#075694', strokeWidth: 2 }}
                  />
                )}

                {metric === 'completed' && (
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#completedGradient)"
                    dot={{ fill: '#16a34a', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: '#16a34a', strokeWidth: 2 }}
                  />
                )}

                {metric === 'accuracy' && (
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#df7200"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#accuracyGradient)"
                    dot={{ fill: '#df7200', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: '#df7200', strokeWidth: 2 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 flex-wrap gap-2">
          {chartData.length > 0 && (
            <button
              onClick={handleClearHistory}
              type="button"
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إِعَادَةُ ضَبْطِ سِجِلِّ الْجَلَسَاتِ</span>
            </button>
          )}

          <div className="mr-auto">
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2.5 bg-[#075694] hover:bg-[#074783] text-white rounded-xl font-black text-xs md:text-sm shadow-md cursor-pointer transition-all"
            >
              إِغْلَاقٌ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
