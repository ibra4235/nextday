import type { CareKind } from '../storage/care';

export const HATCH_AT = 50;
const FULL = 100;

/** Food and milk add no hunger when it is already full. Sleep adds no sleep when it is already full. The tap still counts. */
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
