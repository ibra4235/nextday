import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Image, StyleSheet, View, type ImageSourcePropType, type LayoutChangeEvent } from 'react-native';

import type { BabyLook } from '../storage/look';

const SHEET_ASPECT = 16 / 9;
/** Gray card border on the 1280×720 design sheets, in sheet fractions. */
const CROP_X = 24 / 1280;
const CROP_Y = 24 / 720;

type Mouth = { x: number; y: number };

type Props = {
  source: ImageSourcePropType;
  look: BabyLook;
  /** Sheet pixel where the mouth opens. The photo itself does not scale. */
  mouth?: Mouth | null;
  children?: ReactNode;
};

/** One side of a 16:9 sheet, covering the screen with the dragon centered. */
export function SheetFrame({ source, look, mouth, children }: Props) {
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

  return (
    <View style={styles.frame} onLayout={onLayout}>
      {size.width > 0 && size.height > 0 ? (
        <Image
          accessible={false}
          source={source}
          resizeMode="cover"
          style={[styles.sheet, { width: sheetW, height: sheetH, left, top }]}
        />
      ) : null}
      {mouth && size.width > 0 ? (
        <TalkingMouth left={left + (mouth.x / 1280) * sheetW} top={top + (mouth.y / 720) * sheetH} />
      ) : null}
      {children}
    </View>
  );
}

function TalkingMouth({ left, top }: { left: number; top: number }) {
  const open = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(open, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(open, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [open]);

  return (
    <Animated.View
      pointerEvents="none"
      testID="talking-mouth"
      style={[
        styles.mouth,
        {
          left: left - 22,
          top: top - 8,
          transform: [{ scaleY: open.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  mouth: {
    position: 'absolute',
    width: 44,
    height: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(92, 36, 36, 0.92)',
  },
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
