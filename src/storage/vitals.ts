import { File, Paths } from 'expo-file-system';

import type { CareKind } from './care';

export type Vitals = {
  hunger: number;
  sleep: number;
  updatedAt: string;
};

const FILE_NAME = 'vitals.json';
const FULL = 100;
/** A full bar reaches 0 after 72 hours. */
export const DECAY_PER_MS = FULL / (72 * 60 * 60 * 1000);

const HUNGER_REFILL: Partial<Record<CareKind, number>> = {
  food: 15,
  milk: 5,
};

const SLEEP_REFILL: Partial<Record<CareKind, number>> = {
  sleep: 20,
};

function vitalsFile(): File {
  return new File(Paths.document, FILE_NAME);
}

function clamp(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(FULL, Math.max(0, value));
}

export function isDead(vitals: Vitals): boolean {
  return vitals.hunger <= 0 || vitals.sleep <= 0;
}

function decay(value: number, elapsedMs: number): number {
  if (elapsedMs <= 0) {
    return clamp(value);
  }
  return clamp(value - elapsedMs * DECAY_PER_MS);
}

function readStored(): Vitals | null {
  const file = vitalsFile();
  if (!file.exists) {
    return null;
  }
  try {
    const parsed = JSON.parse(file.textSync()) as Partial<Vitals>;
    if (typeof parsed.hunger !== 'number' || typeof parsed.sleep !== 'number' || typeof parsed.updatedAt !== 'string') {
      return null;
    }
    const updatedAt = Date.parse(parsed.updatedAt);
    if (!Number.isFinite(updatedAt)) {
      return null;
    }
    return {
      hunger: clamp(parsed.hunger),
      sleep: clamp(parsed.sleep),
      updatedAt: new Date(updatedAt).toISOString(),
    };
  } catch {
    return null;
  }
}

function write(vitals: Vitals) {
  const file = vitalsFile();
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.writeSync(JSON.stringify(vitals));
}

/** Apply time since the last save. A missing record starts full at this moment. */
export function openVitals(now = Date.now()): Vitals {
  const stored = readStored();
  const baseline: Vitals = stored ?? {
    hunger: FULL,
    sleep: FULL,
    updatedAt: new Date(now).toISOString(),
  };
  const elapsed = Math.max(0, now - Date.parse(baseline.updatedAt));
  const next: Vitals = {
    hunger: decay(baseline.hunger, elapsed),
    sleep: decay(baseline.sleep, elapsed),
    updatedAt: new Date(now).toISOString(),
  };
  write(next);
  return next;
}

/** Decay to now, then apply a care refill. Dead vitals stay unchanged. */
export function applyCare(kind: CareKind, now = Date.now()): Vitals {
  const current = openVitals(now);
  if (isDead(current)) {
    return current;
  }
  const next: Vitals = {
    hunger: clamp(current.hunger + (HUNGER_REFILL[kind] ?? 0)),
    sleep: clamp(current.sleep + (SLEEP_REFILL[kind] ?? 0)),
    updatedAt: current.updatedAt,
  };
  write(next);
  return next;
}
