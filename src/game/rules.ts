import type { CareKind } from '../storage/care';

export const HATCH_AT = 50;
const FULL = 100;

/** Food and milk do nothing when hunger is already full. Sleep does nothing when sleep is already full. */
export function blockedCare(
  kind: CareKind,
  vitals: { hunger: number; sleep: number },
): 'hunger' | 'sleep' | null {
  if ((kind === 'food' || kind === 'milk') && vitals.hunger >= FULL) {
    return 'hunger';
  }
  if (kind === 'sleep' && vitals.sleep >= FULL) {
    return 'sleep';
  }
  return null;
}

/** Local night is 23:00 inclusive through 07:00 exclusive. */
export function isAsleepHour(date: Date): boolean {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= 23 * 60 || minutes < 7 * 60;
}
