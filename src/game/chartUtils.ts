import { StorageData } from './logic';

export interface ChartSessionPoint {
  id: string;
  sessionLabel: string;
  date: string;
  studentName: string;
  score: number;
  completed: number;
  accuracy: number;
}

/**
 * Transforms stored session history into an ascending chronological timeline for charts.
 */
export function formatHistoryForChart(history: StorageData['history']): ChartSessionPoint[] {
  if (!history || history.length === 0) {
    return [];
  }

  // Reverse so older sessions come first (left to right progression timeline)
  const chronological = [...history].reverse();

  return chronological.map((item, index) => {
    const accuracy = item.completed > 0 ? Math.min(100, Math.round((item.score / (item.completed * 10)) * 100)) : 0;
    return {
      id: `${item.date}-${index}`,
      sessionLabel: `جلسة ${index + 1}`,
      date: item.date,
      studentName: item.studentName || 'طالب متميز',
      score: item.score,
      completed: item.completed,
      accuracy,
    };
  });
}

/**
 * Calculates progress statistics from history
 */
export function calculateProgressStats(history: StorageData['history']) {
  if (!history || history.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      highestScore: 0,
      improvementRate: 0,
      levelTitle: 'مبتدئ واعد 🌟',
    };
  }

  const scores = history.map((h) => h.score);
  const highestScore = Math.max(...scores);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  // Improvement between first recorded session and latest
  const oldestScore = history[history.length - 1].score;
  const latestScore = history[0].score;
  const improvementRate = oldestScore > 0 ? Math.round(((latestScore - oldestScore) / oldestScore) * 100) : 0;

  let levelTitle = 'مبتدئ واعد 🌟';
  if (latestScore >= 80) {
    levelTitle = 'بطل القراءة الخارق 🏆⭐⭐⭐';
  } else if (latestScore >= 50) {
    levelTitle = 'قارئ متقدم ومتميز ⭐⭐';
  } else if (latestScore >= 20) {
    levelTitle = 'قارئ نشيط متطور ⭐';
  }

  return {
    totalSessions: history.length,
    averageScore,
    highestScore,
    improvementRate,
    levelTitle,
  };
}
