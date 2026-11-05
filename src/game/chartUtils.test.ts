import test from 'node:test';
import assert from 'node:assert/strict';
import { formatHistoryForChart, calculateProgressStats } from './chartUtils';

test('formatHistoryForChart converts history in chronological order', () => {
  const history = [
    { date: '1447/05/03', studentName: 'أحمد', score: 40, mode: 'challenge' as const, completed: 4 },
    { date: '1447/05/02', studentName: 'أحمد', score: 20, mode: 'challenge' as const, completed: 2 },
  ];

  const chartPoints = formatHistoryForChart(history);
  assert.equal(chartPoints.length, 2);
  assert.equal(chartPoints[0].sessionLabel, 'جلسة 1');
  assert.equal(chartPoints[0].score, 20); // older session first
  assert.equal(chartPoints[1].sessionLabel, 'جلسة 2');
  assert.equal(chartPoints[1].score, 40); // newer session second
  assert.equal(chartPoints[0].accuracy, 100);
});

test('calculateProgressStats handles empty and populated history', () => {
  const emptyStats = calculateProgressStats([]);
  assert.equal(emptyStats.totalSessions, 0);
  assert.equal(emptyStats.averageScore, 0);

  const populated = [
    { date: '1447/05/03', studentName: 'سارة', score: 90, mode: 'challenge' as const, completed: 9 },
    { date: '1447/05/02', studentName: 'سارة', score: 60, mode: 'challenge' as const, completed: 6 },
    { date: '1447/05/01', studentName: 'سارة', score: 30, mode: 'challenge' as const, completed: 3 },
  ];

  const stats = calculateProgressStats(populated);
  assert.equal(stats.totalSessions, 3);
  assert.equal(stats.highestScore, 90);
  assert.equal(stats.averageScore, 60);
  assert.equal(stats.levelTitle.includes('بطل القراءة الخارق'), true);
});
