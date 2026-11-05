import type { ImageSourcePropType } from 'react-native';

import type { BabyLook } from '../storage/look';

/** One open-and-close of Defne's jaw. Every other pixel of the sheet stays put. */
const pixel = [
  require('../../assets/actions/babies/03/talk-pixel/00.png'),
  require('../../assets/actions/babies/03/talk-pixel/01.png'),
  require('../../assets/actions/babies/03/talk-pixel/02.png'),
  require('../../assets/actions/babies/03/talk-pixel/03.png'),
  require('../../assets/actions/babies/03/talk-pixel/04.png'),
  require('../../assets/actions/babies/03/talk-pixel/05.png'),
  require('../../assets/actions/babies/03/talk-pixel/06.png'),
  require('../../assets/actions/babies/03/talk-pixel/07.png'),
  require('../../assets/actions/babies/03/talk-pixel/08.png'),
  require('../../assets/actions/babies/03/talk-pixel/09.png'),
  require('../../assets/actions/babies/03/talk-pixel/10.png'),
  require('../../assets/actions/babies/03/talk-pixel/11.png'),
  require('../../assets/actions/babies/03/talk-pixel/12.png'),
  require('../../assets/actions/babies/03/talk-pixel/13.png'),
  require('../../assets/actions/babies/03/talk-pixel/14.png'),
  require('../../assets/actions/babies/03/talk-pixel/15.png'),
] as const;

const dimensional = [
  require('../../assets/actions/babies/03/talk-dimensional/00.png'),
  require('../../assets/actions/babies/03/talk-dimensional/01.png'),
  require('../../assets/actions/babies/03/talk-dimensional/02.png'),
  require('../../assets/actions/babies/03/talk-dimensional/03.png'),
  require('../../assets/actions/babies/03/talk-dimensional/04.png'),
  require('../../assets/actions/babies/03/talk-dimensional/05.png'),
  require('../../assets/actions/babies/03/talk-dimensional/06.png'),
  require('../../assets/actions/babies/03/talk-dimensional/07.png'),
  require('../../assets/actions/babies/03/talk-dimensional/08.png'),
  require('../../assets/actions/babies/03/talk-dimensional/09.png'),
  require('../../assets/actions/babies/03/talk-dimensional/10.png'),
  require('../../assets/actions/babies/03/talk-dimensional/11.png'),
  require('../../assets/actions/babies/03/talk-dimensional/12.png'),
  require('../../assets/actions/babies/03/talk-dimensional/13.png'),
  require('../../assets/actions/babies/03/talk-dimensional/14.png'),
  require('../../assets/actions/babies/03/talk-dimensional/15.png'),
] as const;

/** Defne's jaw frames, or nothing for any other baby. */
export function talkFrames(id: string, look: BabyLook): readonly ImageSourcePropType[] | null {
  if (id !== '03') {
    return null;
  }
  return look === 'pixel' ? pixel : dimensional;
}
