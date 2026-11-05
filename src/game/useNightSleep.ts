import { useEffect, useState } from 'react';

import { isAsleepHour } from './rules';

function msUntilBoundary(now: Date): number {
  const next = new Date(now);
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes >= 23 * 60 || minutes < 7 * 60) {
    next.setHours(7, 0, 0, 0);
  } else {
    next.setHours(23, 0, 0, 0);
  }
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return Math.max(1000, next.getTime() - now.getTime());
}

export function useNightSleep(): boolean {
  const [asleep, setAsleep] = useState(() => isAsleepHour(new Date()));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const now = new Date();
      setAsleep(isAsleepHour(now));
      timer = setTimeout(tick, Math.min(msUntilBoundary(now), 30000));
    };
    tick();
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return asleep;
}
