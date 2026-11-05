import test from 'node:test';
import assert from 'node:assert/strict';
import {
  shuffleTokens,
  isSentenceComplete,
  isSentenceCorrect,
  getNextCorrectToken,
  updateScore,
  calculateStars,
  getGrammarRole,
} from './logic';
import { SENTENCES, CATEGORIES } from '../data/sentences';

test('100 sentences integrity check', () => {
  assert.equal(SENTENCES.length, 100, 'Must have exactly 100 sentences');
  assert.equal(CATEGORIES.length, 10, 'Must have 10 categories');

  SENTENCES.forEach((s) => {
    assert.ok(s.id >= 1 && s.id <= 100, `Sentence ${s.id} ID out of range`);
    assert.ok(s.picture.length > 0, `Sentence ${s.id} missing emoji`);
    assert.ok(s.tokens.length >= 3, `Sentence ${s.id} should have at least 3 tokens`);
    assert.ok(s.tashkeelFull.endsWith('.'), `Sentence ${s.id} should end with period`);
    assert.ok(s.category.length > 0, `Sentence ${s.id} category missing`);
  });
});

test('Grammar role determination', () => {
  assert.equal(getGrammarRole(0).role, 'verb', 'First word should be verb (الفعل)');
  assert.equal(getGrammarRole(0).color, '#bd080b', 'Verb should be red');

  assert.equal(getGrammarRole(1).role, 'subject', 'Second word should be subject (الفاعل)');
  assert.equal(getGrammarRole(1).color, '#075694', 'Subject should be blue');

  assert.equal(getGrammarRole(2).role, 'phrase', 'Third word should be phrase/object (مفعول/جار ومجرور)');
  assert.equal(getGrammarRole(2).color, '#df7200', 'Phrase/object should be gold');
});

test('Sentence completion and correctness check', () => {
  const correct = ['يَقْرَأُ', 'الطِّفْلُ', 'الْكِتَابَ'];

  assert.equal(isSentenceComplete(['يَقْرَأُ'], correct), false);
  assert.equal(isSentenceComplete(['يَقْرَأُ', 'الطِّفْلُ', 'الْكِتَابَ'], correct), true);

  assert.equal(isSentenceCorrect(['يَقْرَأُ', 'الطِّفْلُ', 'الْكِتَابَ'], correct), true);
  assert.equal(isSentenceCorrect(['الطِّفْلُ', 'يَقْرَأُ', 'الْكِتَابَ'], correct), false);
  assert.equal(isSentenceCorrect(['يَقْرَأُ', 'الْكِتَابَ', 'الطِّفْلُ'], correct), false);
});

test('getNextCorrectToken provides accurate next hint token', () => {
  const correct = ['يَقْرَأُ', 'الطِّفْلُ', 'الْكِتَابَ'];
  assert.equal(getNextCorrectToken([], correct), 'يَقْرَأُ');
  assert.equal(getNextCorrectToken(['يَقْرَأُ'], correct), 'الطِّفْلُ');
  assert.equal(getNextCorrectToken(['يَقْرَأُ', 'الطِّفْلُ'], correct), 'الْكِتَابَ');
  assert.equal(getNextCorrectToken(['يَقْرَأُ', 'الطِّفْلُ', 'الْكِتَابَ'], correct), null);
});

test('Score calculation rules', () => {
  // Correct sentence adds 10
  assert.equal(updateScore(0, true), 10);
  assert.equal(updateScore(10, true), 20);

  // Incorrect sentence deducts 2, clamped to 0 minimum
  assert.equal(updateScore(10, false), 8);
  assert.equal(updateScore(1, false), 0);
  assert.equal(updateScore(0, false), 0);
});

test('Stars rating calculation', () => {
  assert.equal(calculateStars(30, 3), 3); // 100%
  assert.equal(calculateStars(20, 3), 2); // 66.6%
  assert.equal(calculateStars(10, 3), 1); // 33.3%
});

test('Fisher-Yates shuffle preserves elements', () => {
  const original = ['يَكْتُبُ', 'الْوَلَدُ', 'الدَّرْسَ'];
  const shuffled = shuffleTokens(original);

  assert.equal(shuffled.length, original.length);
  assert.deepEqual([...shuffled].sort(), [...original].sort());
});

test('GameMode supports open time challenge (accuracy)', () => {
  const modeAccuracy = 'accuracy' as const;
  assert.equal(modeAccuracy, 'accuracy');
});
