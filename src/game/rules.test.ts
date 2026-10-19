import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAnswerScore,
  calculateRank,
  validateSequence,
  getBlitzTimeDelta,
  formatTime,
} from './rules.ts';

test('calculateAnswerScore applies speed bonus and combo multipliers correctly', () => {
  // Base point 100 with zero combo and half time
  const res1 = calculateAnswerScore(100, 0.5, 0);
  assert.equal(res1.multiplier, 1.0);
  assert.equal(res1.points, 125); // 100 * 1.0 * (1 + 0.25) = 125

  // Combo 4 gives 1.5x multiplier
  const res2 = calculateAnswerScore(100, 1.0, 4);
  assert.equal(res2.multiplier, 1.5);
  assert.equal(res2.points, 225); // 100 * 1.5 * 1.5 = 225

  // Combo 7 gives 2.0x multiplier
  const res3 = calculateAnswerScore(100, 0, 7);
  assert.equal(res3.multiplier, 2.0);
  assert.equal(res3.points, 200);
});

test('calculateRank assigns correct grades based on accuracy and score', () => {
  assert.equal(calculateRank(95, 600), 'S');
  assert.equal(calculateRank(85, 400), 'A');
  assert.equal(calculateRank(70, 250), 'B');
  assert.equal(calculateRank(55, 150), 'C');
  assert.equal(calculateRank(40, 50), 'D');
});

test('validateSequence correctly verifies food digestion path', () => {
  const correct = ['口腔', '咽', '食道', '胃', '小腸', '大腸', '肛門'];
  const userValid = ['口腔', '咽', '食道', '胃', '小腸', '大腸', '肛門'];
  const userInvalid = ['口腔', '胃', '咽', '食道', '小腸', '大腸', '肛門'];

  assert.equal(validateSequence(userValid, correct), true);
  assert.equal(validateSequence(userInvalid, correct), false);
  assert.equal(validateSequence(['口腔'], correct), false);
});

test('getBlitzTimeDelta adds time on correct and penalizes on wrong', () => {
  assert.equal(getBlitzTimeDelta(true, 1), 3);
  assert.equal(getBlitzTimeDelta(true, 5), 5); // higher combo gives +5
  assert.equal(getBlitzTimeDelta(false, 0), -3);
});

test('formatTime formats seconds properly', () => {
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(12), '00:12');
});
