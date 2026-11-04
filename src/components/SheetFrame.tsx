import { useState, type ReactNode } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type LayoutChangeEvent } from 'react-native';

import type { BabyLook } from '../storage/look';

const SHEET_ASPECT = 16 / 9;

type Props = {
  source: ImageSourcePropType;
  look: BabyLook;
  children?: ReactNode;
};

/** One side of a 16:9 design sheet, cropped into a 9:11 frame with the dragon centered. */
export function SheetFrame({ source, look, children }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  function onLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
  }

  const imageHeight = size.height;
  const imageWidth = imageHeight * SHEET_ASPECT;
  const center = look === 'pixel' ? 0.25 : 0.75;
  const left = size.width / 2 - center * imageWidth;

  return (
    <View style={styles.frame} onLayout={onLayout}>
      {imageHeight > 0 ? (
        <Image
          accessible={false}
          source={source}
          resizeMode="contain"
          style={[styles.sheet, { width: imageWidth, height: imageHeight, left }]}
        />
      ) : null}
      {children}
    </View>
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
    top: 0,
  },
});
