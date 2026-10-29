/**
 * Formats seconds into MM:SS string
 */
export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Splits seconds into 4 individual digit characters for segmented display: [M1, M2, S1, S2]
 */
export function getSegmentedDigits(seconds: number): {
  minTens: string;
  minOnes: string;
  secTens: string;
  secOnes: string;
} {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;

  const minStr = mins.toString().padStart(2, '0');
  const secStr = secs.toString().padStart(2, '0');

  return {
    minTens: minStr[0] || '0',
    minOnes: minStr[1] || '0',
    secTens: secStr[0] || '0',
    secOnes: secStr[1] || '0',
  };
}

/**
 * Formats duration into a readable format e.g. "25 min", "1 hr 15 min"
 */
export function formatDurationHuman(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) {
    return `${mins} min`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMins} min`;
}

/**
 * Calculates accurate remaining seconds from target deadline timestamp
 */
export function calculateRemainingFromDeadline(targetEndTimeMs: number): number {
  const diffMs = targetEndTimeMs - Date.now();
  return Math.max(0, Math.ceil(diffMs / 1000));
}

/**
 * Calculates session progress (0 to 100%)
 */
export function calculateProgress(remainingSeconds: number, totalDurationSeconds: number): number {
  if (totalDurationSeconds <= 0) return 0;
  const elapsed = totalDurationSeconds - remainingSeconds;
  const percentage = (elapsed / totalDurationSeconds) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}

/**
 * Determines recommended break duration in seconds.
 * 4 focus cycles = 15 minute break (900s), otherwise 5 minute break (300s).
 */
export function getRecommendedBreakDuration(completedCycles: number): number {
  return (completedCycles > 0 && completedCycles % 4 === 0) ? 900 : 300;
}

/**
 * Curated list of calm, supportive break suggestions
 */
export const RESTORATIVE_SUGGESTIONS = [
  { id: 'water', text: 'Drink a glass of cool water and hydrate', icon: 'droplet' },
  { id: 'stretch', text: 'Roll your shoulders and stretch your neck gently', icon: 'stretch' },
  { id: 'eyes', text: 'Look away from your screen at something 20 feet away (20-20-20 rule)', icon: 'eye' },
  { id: 'breathe', text: 'Take 4 slow, deep diaphragmatic breaths', icon: 'wind' },
  { id: 'walk', text: 'Stand up and walk around the room for two minutes', icon: 'footprints' },
  { id: 'tea', text: 'Make a warm cup of herbal tea', icon: 'cup' },
];

export function getRandomSuggestion(currentId?: string) {
  const pool = RESTORATIVE_SUGGESTIONS.filter(s => s.id !== currentId);
  return pool[Math.floor(Math.random() * pool.length)] || RESTORATIVE_SUGGESTIONS[0];
}
