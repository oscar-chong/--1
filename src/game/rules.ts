import type { RankGrade } from './types.ts';

/**
 * Calculates score for an answer based on speed and combo streak.
 */
export function calculateAnswerScore(
  basePoints: number,
  timeRemainingRatio: number, // 0.0 to 1.0
  currentCombo: number
): { points: number; multiplier: number } {
  // Base combo multiplier: 1x, 1.2x (combo 2), 1.5x (combo 4), 2.0x (combo 6+)
  let multiplier = 1.0;
  if (currentCombo >= 6) {
    multiplier = 2.0;
  } else if (currentCombo >= 4) {
    multiplier = 1.5;
  } else if (currentCombo >= 2) {
    multiplier = 1.2;
  }

  // Speed bonus: up to +50% extra if answered quickly (within first 30% of time)
  const speedBonusMultiplier = 1.0 + Math.max(0, timeRemainingRatio) * 0.5;
  const points = Math.round(basePoints * multiplier * speedBonusMultiplier);

  return { points, multiplier };
}

/**
 * Calculates letter rank grade from accuracy and total score.
 */
export function calculateRank(accuracyPercent: number, score: number): RankGrade {
  if (accuracyPercent >= 90 && score >= 500) {
    return 'S';
  }
  if (accuracyPercent >= 80 && score >= 350) {
    return 'A';
  }
  if (accuracyPercent >= 65 && score >= 200) {
    return 'B';
  }
  if (accuracyPercent >= 50) {
    return 'C';
  }
  return 'D';
}

/**
 * Validates whether a reordered list matches the correct sequential order.
 */
export function validateSequence(userSequence: string[], correctSequence: string[]): boolean {
  if (userSequence.length !== correctSequence.length) return false;
  return userSequence.every((val, index) => val === correctSequence[index]);
}

/**
 * Calculates blitz mode time delta: bonus for correct, penalty for incorrect.
 */
export function getBlitzTimeDelta(isCorrect: boolean, combo: number): number {
  if (isCorrect) {
    // 3 seconds bonus base, up to 5 seconds if combo is high
    return combo >= 4 ? 5 : 3;
  }
  return -3; // 3 seconds penalty
}

/**
 * Formats seconds into MM:SS format.
 */
export function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
