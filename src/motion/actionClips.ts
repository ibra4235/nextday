import type { AppLanguage } from '../i18n/language';
import type { CareKind } from '../storage/care';

const clips = {
  food: require('../../assets/actions/dragon-action-food.mp4'),
  milk: require('../../assets/actions/dragon-action-milk.mp4'),
  sleep: require('../../assets/actions/dragon-action-sleep.mp4'),
  training: require('../../assets/actions/dragon-action-training.mp4'),
  talk: require('../../assets/actions/dragon-action-talk.mp4'),
  talkEn: require('../../assets/actions/dragon-mouth-sample.mp4'),
} as const;

export type ClipSource = (typeof clips)[keyof typeof clips];

/** Turkish talk is the clip that already carries its line. English talk is the mouth clip. */
export function clipFor(kind: CareKind, language: AppLanguage): ClipSource {
  if (kind === 'talk' && language === 'en') {
    return clips.talkEn;
  }
  return clips[kind];
}
