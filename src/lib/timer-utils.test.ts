import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatTime,
  getSegmentedDigits,
  formatDurationHuman,
  calculateProgress,
  getRecommendedBreakDuration,
  calculateRemainingFromDeadline,
} from './timer-utils';

describe('timer-utils (Native Node Runner)', () => {
  describe('formatTime', () => {
    it('formats seconds into MM:SS correctly', () => {
      assert.strictEqual(formatTime(0), '00:00');
      assert.strictEqual(formatTime(5), '00:05');
      assert.strictEqual(formatTime(65), '01:05');
      assert.strictEqual(formatTime(1500), '25:00');
      assert.strictEqual(formatTime(3600), '60:00');
    });

    it('handles negative or decimal values gracefully', () => {
      assert.strictEqual(formatTime(-10), '00:00');
      assert.strictEqual(formatTime(59.9), '00:59');
    });
  });

  describe('getSegmentedDigits', () => {
    it('splits into individual digits for segmented boxes', () => {
      assert.deepStrictEqual(getSegmentedDigits(1500), {
        minTens: '2',
        minOnes: '5',
        secTens: '0',
        secOnes: '0',
      });
      assert.deepStrictEqual(getSegmentedDigits(45), {
        minTens: '0',
        minOnes: '0',
        secTens: '4',
        secOnes: '5',
      });
    });
  });

  describe('formatDurationHuman', () => {
    it('formats minutes and hours properly', () => {
      assert.strictEqual(formatDurationHuman(900), '15 min');
      assert.strictEqual(formatDurationHuman(3600), '1 hr');
      assert.strictEqual(formatDurationHuman(5400), '1 hr 30 min');
      assert.strictEqual(formatDurationHuman(7200), '2 hrs');
    });
  });

  describe('calculateProgress', () => {
    it('calculates completion percentage correctly', () => {
      assert.strictEqual(calculateProgress(1500, 1500), 0);
      assert.strictEqual(calculateProgress(750, 1500), 50);
      assert.strictEqual(calculateProgress(0, 1500), 100);
      assert.strictEqual(calculateProgress(0, 0), 0);
    });
  });

  describe('getRecommendedBreakDuration', () => {
    it('recommends 5 minutes for cycles 1-3, and 15 minutes after 4 cycles', () => {
      assert.strictEqual(getRecommendedBreakDuration(1), 300);
      assert.strictEqual(getRecommendedBreakDuration(2), 300);
      assert.strictEqual(getRecommendedBreakDuration(3), 300);
      assert.strictEqual(getRecommendedBreakDuration(4), 900);
      assert.strictEqual(getRecommendedBreakDuration(8), 900);
    });
  });

  describe('calculateRemainingFromDeadline', () => {
    it('calculates remaining seconds relative to current time', () => {
      const now = Date.now();
      const target = now + 10000;
      const remaining = calculateRemainingFromDeadline(target);
      assert.ok(remaining >= 9 && remaining <= 10);
    });
  });
});
