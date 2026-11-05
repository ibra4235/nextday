import type { CareKind } from '../storage/care';

export type PerformanceMode = 'idle' | CareKind;

export const ACTION_MS: Record<CareKind, number> = {
  food: 3200,
  milk: 3200,
  sleep: 3600,
  training: 3200,
  talk: 4800,
};

export type Pose = {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  rotateDeg: number;
  mouth: number;
  lid: number;
  run: number;
  hop: number;
  eatT: number;
  showFood: boolean;
  drink: number;
  showMilk: boolean;
  sleepZ: number;
  headDip: number;
  wing: number;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function rise(phase: number, start: number, end: number): number {
  return clamp01((phase - start) / (end - start));
}

function basePose(): Pose {
  return {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    rotateDeg: 0,
    mouth: 0,
    lid: 0,
    run: 0,
    hop: 0,
    eatT: 0,
    showFood: false,
    drink: 0,
    showMilk: false,
    sleepZ: 0,
    headDip: 0,
    wing: 0,
  };
}

/** The picture stays at a fixed size. Care poses move parts around it. */
export function poseFor(mode: PerformanceMode, phase: number, _timeMs: number, alive: boolean): Pose {
  const pose = basePose();
  if (!alive || mode === 'idle') {
    return pose;
  }

  if (mode === 'food') {
    const open = rise(phase, 0.04, 0.18) * (1 - rise(phase, 0.84, 0.98));
    const chew = phase > 0.5 && phase < 0.84 ? Math.max(0, Math.sin((phase - 0.5) * Math.PI * 8)) : 0;
    pose.mouth = Math.max(open * 0.9, chew);
    pose.eatT = clamp01(phase / 0.52);
    pose.showFood = phase > 0.02 && phase < 0.64;
    pose.headDip = rise(phase, 0.06, 0.2) * (1 - rise(phase, 0.8, 0.96));
    return pose;
  }

  if (mode === 'milk') {
    pose.drink = rise(phase, 0.06, 0.72);
    pose.showMilk = phase > 0.02 && phase < 0.94;
    pose.mouth = pose.drink * 0.62 * (1 - rise(phase, 0.84, 0.98));
    pose.headDip = pose.drink * 0.55;
    return pose;
  }

  if (mode === 'sleep') {
    const asleep = rise(phase, 0.05, 0.26) * (1 - rise(phase, 0.78, 0.96));
    pose.lid = asleep;
    pose.sleepZ = asleep;
    pose.wing = -asleep;
    pose.translateY += asleep * 18;
    return pose;
  }

  if (mode === 'training') {
    const step = Math.sin(phase * Math.PI * 14);
    pose.run = step;
    pose.hop = Math.abs(step);
    pose.translateX = step * 22;
    pose.translateY += -pose.hop * 26;
    pose.rotateDeg = step * 7;
    pose.wing = step;
    return pose;
  }

  pose.mouth = Math.max(0, Math.sin(phase * Math.PI * 8));
  return pose;
}
