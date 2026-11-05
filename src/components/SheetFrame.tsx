import { useEffect, useState, type ReactNode } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type LayoutChangeEvent,
  type StyleProp,
} from 'react-native';

import type { BabyLook } from '../storage/look';

const SHEET_ASPECT = 16 / 9;
/** Gray card border on the 1280×720 design sheets, in sheet fractions. */
const CROP_X = 24 / 1280;
const CROP_Y = 24 / 720;

type Props = {
  source: ImageSourcePropType;
  look: BabyLook;
  /** Transparent frames of the same sheet. Only the jaw pixels differ. */
  talkFrames?: readonly ImageSourcePropType[] | null;
  children?: ReactNode;
};

/** One side of a 16:9 sheet, covering the screen with the dragon centered. */
export function SheetFrame({ source, look, talkFrames, children }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  function onLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
  }

  const contentW = 0.5 - 2 * CROP_X;
  const contentH = 1 - 2 * CROP_Y;
  const sheetH = Math.max(size.height / contentH, size.width / (contentW * SHEET_ASPECT));
  const sheetW = sheetH * SHEET_ASPECT;
  const center = look === 'pixel' ? 0.25 : 0.75;
  const left = size.width / 2 - center * sheetW;
  const top = size.height / 2 - sheetH / 2;
  const sheetStyle = [styles.sheet, { width: sheetW, height: sheetH, left, top }];

  return (
    <View style={styles.frame} onLayout={onLayout}>
      {size.width > 0 && size.height > 0 ? (
        <Image accessible={false} source={source} resizeMode="cover" style={sheetStyle} />
      ) : null}
      {talkFrames && talkFrames.length > 0 && size.width > 0 ? (
        <TalkFrames frames={talkFrames} style={sheetStyle} />
      ) : null}
      {children}
    </View>
  );
}

function TalkFrames({
  frames,
  style,
}: {
  frames: readonly ImageSourcePropType[];
  style: StyleProp<ImageStyle>;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % frames.length);
    }, 125);
    return () => clearInterval(timer);
  }, [frames]);

  return (
    <Image
      accessible={false}
      source={frames[index]}
      resizeMode="cover"
      style={style}
      testID="talking-mouth"
    />
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#1C1410',
  },
  sheet: {
    position: 'absolute',
  },
});
