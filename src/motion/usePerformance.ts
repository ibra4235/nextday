import { useCallback, useEffect, useRef, useState } from 'react';

import type { CareKind } from '../storage/care';
import { ACTION_MS, poseFor, type PerformanceMode, type Pose } from './pose';

export type PerformerHandle = {
  play: (kind: CareKind) => void;
};

export function usePerformance(alive: boolean): {
  mode: PerformanceMode;
  phase: number;
  pose: Pose;
  play: (kind: CareKind) => void;
} {
  const action = useRef<{ kind: CareKind; startedAt: number } | null>(null);
  const now = useRef(Date.now());
  const [, setFrame] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (time: number) => {
      if (time - last >= 16) {
        last = time;
        now.current = Date.now();
        setFrame((frame) => (frame + 1) % 1000000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const play = useCallback((kind: CareKind) => {
    action.current = { kind, startedAt: Date.now() };
    now.current = Date.now();
    setFrame((frame) => frame + 1);
  }, []);

  const current = action.current;
  const elapsed = current ? now.current - current.startedAt : 0;
  const running = current !== null && elapsed < ACTION_MS[current.kind];
  const mode: PerformanceMode = alive && running && current ? current.kind : 'idle';
  const phase = running && current ? elapsed / ACTION_MS[current.kind] : 0;
  return { mode, phase, pose: poseFor(mode, phase, now.current, alive), play };
}
