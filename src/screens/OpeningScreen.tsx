import { useEffect } from 'react';

import { AdminEntry } from '../components/AdminEntry';
import { EggStage } from '../components/EggStage';

const OPENING_MS = 3600;

type Props = {
  onFinished: () => void;
  onAdmin: () => void;
};

export function OpeningScreen({ onFinished, onAdmin }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinished, OPENING_MS);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <EggStage>
      <AdminEntry onPress={onAdmin} />
    </EggStage>
  );
}
