import { forwardRef, useImperativeHandle, type ReactNode } from 'react';

import { stringsFor } from '../i18n/strings';
import { resolveLanguage } from '../i18n/locale';
import { eggVoxels } from './eggModel';
import { usePerformance, type PerformerHandle } from './usePerformance';
import { VoxelScene } from './VoxelScene';

const EGG_VIEW = '-210 -230 420 460';

type Props = {
  alive?: boolean;
  overlay?: ReactNode;
};

export const VoxelEgg = forwardRef<PerformerHandle, Props>(function VoxelEgg({ alive = true, overlay }, ref) {
  const copy = stringsFor(resolveLanguage());
  const { mode, phase, pose, play } = usePerformance(alive);
  useImperativeHandle(ref, () => ({ play }), [play]);

  return (
    <VoxelScene
      voxels={eggVoxels(pose, phase)}
      viewBox={EGG_VIEW}
      pose={pose}
      talking={mode === 'talk'}
      line={copy.talkReply}
      testID="voxel-egg"
      label={copy.eggLabel}
      overlay={overlay}
    />
  );
});
