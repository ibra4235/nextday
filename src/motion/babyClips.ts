import type { CareKind } from '../storage/care';
import type { BabyLook } from '../storage/look';
import type { ClipSource } from './actionClips';

/** Defne is the first baby with her own pixel and 3D action clips. */
const defne: Record<BabyLook, Record<CareKind, ClipSource>> = {
  pixel: {
    food: require('../../assets/actions/babies/03/pixel-food.mp4'),
    milk: require('../../assets/actions/babies/03/pixel-milk.mp4'),
    sleep: require('../../assets/actions/babies/03/pixel-sleep.mp4'),
    training: require('../../assets/actions/babies/03/pixel-training.mp4'),
    talk: require('../../assets/actions/babies/03/pixel-talk.mp4'),
  },
  dimensional: {
    food: require('../../assets/actions/babies/03/dimensional-food.mp4'),
    milk: require('../../assets/actions/babies/03/dimensional-milk.mp4'),
    sleep: require('../../assets/actions/babies/03/dimensional-sleep.mp4'),
    training: require('../../assets/actions/babies/03/dimensional-training.mp4'),
    talk: require('../../assets/actions/babies/03/dimensional-talk.mp4'),
  },
};

/** The selected baby's own clip, or nothing. Never the shared green dragon. */
export function babyClip(id: string, look: BabyLook, kind: CareKind): ClipSource | null {
  if (id !== '03') {
    return null;
  }
  return defne[look][kind];
}
