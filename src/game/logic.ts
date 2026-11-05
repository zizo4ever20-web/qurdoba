/**
 * Pure game rules, scoring, grammar role tags, and shuffling logic.
 * Decoupled from React for fast unit testing.
 */

import { SentenceItem, SENTENCES } from '../data/sentences';

export interface GrammarRole {
  role: 'verb' | 'subject' | 'phrase';
  labelAr: string;
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

export const GRAMMAR_ROLES: Record<'verb' | 'subject' | 'phrase', GrammarRole> = {
  verb: {
    role: 'verb',
    labelAr: 'الفِعْلُ',
    color: '#bd080b',
    textColor: 'text-[#bd080b]',
    borderColor: 'border-[#bd080b]',
    bgColor: 'bg-red-50 text-red-900 border-red-300',
  },
  subject: {
    role: 'subject',
    labelAr: 'الْفَاعِلُ',
    color: '#075694',
    textColor: 'text-[#075694]',
    borderColor: 'border-[#075694]',
    bgColor: 'bg-blue-50 text-blue-900 border-blue-300',
  },
  phrase: {
    role: 'phrase',
    labelAr: 'الْمَفْعُولُ / الْجَارُّ وَالْمَجْرُورُ',
    color: '#df7200',
    textColor: 'text-[#df7200]',
    borderColor: 'border-[#df7200]',
    bgColor: 'bg-amber-50 text-amber-900 border-amber-300',
  },
};

/**
 * Get grammatical role metadata for a token based on its position in the correct sentence
 */
export function getGrammarRole(indexInCorrectSentence: number): GrammarRole {
  if (indexInCorrectSentence === 0) return GRAMMAR_ROLES.verb;
  if (indexInCorrectSentence === 1) return GRAMMAR_ROLES.subject;
  return GRAMMAR_ROLES.phrase;
}

/**
 * Fisher-Yates shuffle algorithm.
 * Guarantees that tokens are scrambled (not already in solved order if length > 1).
 */
export function shuffleTokens(
  tokens: string[],
  randomFn: () => number = Math.random
): string[] {
  if (tokens.length <= 1) return [...tokens];

  let result: string[];
  let attempts = 0;

  do {
    result = [...tokens];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    attempts++;
  } while (
    attempts < 10 &&
    result.every((token, idx) => token === tokens[idx])
  );

  return result;
}

/**
 * Checks whether the placed tokens match the correct sentence tokens exactly.
 */
export function isSentenceComplete(placed: string[], correct: string[]): boolean {
  return placed.length === correct.length;
}

export function isSentenceCorrect(placed: string[], correct: string[]): boolean {
  if (placed.length !== correct.length) return false;
  return placed.every((token, idx) => token === correct[idx]);
}

/**
 * Returns the next expected correct token to highlight as a hint
 */
export function getNextCorrectToken(placed: string[], correct: string[]): string | null {
  if (placed.length >= correct.length) return null;
  return correct[placed.length] || null;
}

/**
 * Score calculation:
 * Correct sentence adds +10.
 * Incorrect complete sentence subtracts -2, clamped to 0 minimum.
 */
export function updateScore(currentScore: number, isCorrect: boolean): number {
  if (isCorrect) {
    return currentScore + 10;
  }
  return Math.max(0, currentScore - 2);
}

/**
 * Calculate stars rating based on accuracy and completed count
 */
export function calculateStars(score: number, completedCount: number): number {
  if (completedCount === 0 || score === 0) return 1;
  const maxPossible = completedCount * 10;
  const ratio = score / maxPossible;
  if (ratio >= 0.85) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

/**
 * Evaluates motivational praise in Arabic for children
 */
export function getMotivationalMessage(stars: number, score: number): string {
  if (stars === 3) {
    return 'مُمْتَازٌ جِدًّا يَا بَطَلَ الْقِرَاءَةِ! أَدَاءٌ رَائِعٌ وَدِقَّةٌ عَالِيَةٌ ⭐⭐⭐';
  }
  if (stars === 2) {
    return 'أَحْسَنْتَ صَنِيعًا! لَقَدْ قَارَبْتَ عَلَى الْعَلَامَةِ الْكَامِلَةِ ⭐⭐';
  }
  return 'بِدَايَةٌ طَيِّبَةٌ يَا بَطَلُ، وَاصِلِ التَّدْرِيبَ لِتُحَقِّقَ النُّجُومَ الثَّلَاثَ! ⭐';
}

/**
 * Local storage manager
 */
const STORAGE_KEY = 'qurtuba_reading_challenge_v1';

export type GameMode = 'challenge' | 'accuracy' | 'practice';

export interface StorageData {
  highScore: number;
  totalCorrect: number;
  soundEnabled: boolean;
  history: Array<{
    date: string;
    studentName: string;
    score: number;
    mode: GameMode;
    completed: number;
  }>;
}

export function loadSavedData(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    highScore: 0,
    totalCorrect: 0,
    soundEnabled: true,
    history: [],
  };
}

export function saveGameResult(
  studentName: string,
  score: number,
  mode: GameMode,
  completed: number
): StorageData {
  const current = loadSavedData();
  const newHighScore = Math.max(current.highScore, score);
  const newTotal = current.totalCorrect + completed;

  const newEntry = {
    date: new Date().toLocaleDateString('ar-SA'),
    studentName: studentName.trim() || 'طالب متميز',
    score,
    mode,
    completed,
  };

  const updated: StorageData = {
    ...current,
    highScore: newHighScore,
    totalCorrect: newTotal,
    history: [newEntry, ...current.history].slice(0, 10),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return updated;
}
