import { forwardRef, useImperativeHandle } from 'react';

import { stringsFor } from '../i18n/strings';
import { resolveLanguage } from '../i18n/locale';
import { dragonVoxels } from './dragonModel';
import { usePerformance, type PerformerHandle } from './usePerformance';
import { VoxelScene } from './VoxelScene';

const DRAGON_VIEW = '-360 -300 720 620';

type Props = {
  color: string;
  label: string;
};

export const VoxelDragon = forwardRef<PerformerHandle, Props>(function VoxelDragon({ color, label }, ref) {
  const copy = stringsFor(resolveLanguage());
  const { mode, phase, pose, play } = usePerformance(true);
  useImperativeHandle(ref, () => ({ play }), [play]);

  return (
    <VoxelScene
      voxels={dragonVoxels(color, pose, phase)}
      viewBox={DRAGON_VIEW}
      pose={pose}
      talking={mode === 'talk'}
      line={copy.talkReply}
      testID="voxel-dragon"
      label={label}
    />
  );
});
