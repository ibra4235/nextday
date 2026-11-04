import { forwardRef, useImperativeHandle, type ReactNode } from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';
import { usePerformance, type PerformerHandle } from './usePerformance';

type Mouth = { x: number; y: number };

type Props = {
  source: ImageSourcePropType;
  label: string;
  testID: string;
  alive?: boolean;
  layout?: 'fill' | 'frame';
  mouth: Mouth;
  overlay?: ReactNode;
};

export const PicturePerformer = forwardRef<PerformerHandle, Props>(function PicturePerformer(
  { source, label, testID, alive = true, layout = 'frame', mouth, overlay },
  ref,
) {
  const copy = stringsFor(resolveLanguage());
  const { mode, pose, phase, play } = usePerformance(alive);
  useImperativeHandle(ref, () => ({ play }), [play]);

  const bite = mode === 'food' || mode === 'talk' ? pose.mouth : 0;
  const transform = [
    { translateX: pose.translateX },
    { translateY: pose.translateY + pose.headDip * 14 },
    { rotate: `${pose.rotateDeg}deg` },
    { scaleX: pose.scaleX + bite * 0.08 },
    { scaleY: pose.scaleY - bite * 0.1 },
  ];

  return (
    <View
      pointerEvents="none"
      style={layout === 'fill' ? styles.fill : styles.frame}
      testID={testID}
      accessibilityLabel={label}
    >
      <View style={[layout === 'fill' ? styles.photoFill : styles.photoFrame, { transform }]}>
        <Image accessible={false} source={source} resizeMode="cover" style={styles.image} />
        {overlay}
      </View>
      {pose.showFood ? <Food mouth={mouth} travel={pose.eatT} chew={pose.mouth} /> : null}
      {pose.showMilk ? <Milk mouth={mouth} tilt={pose.drink} phase={phase} /> : null}
      {pose.sleepZ > 0.08 ? <SleepMarks amount={pose.sleepZ} /> : null}
      {pose.lid > 0.04 ? <View style={[styles.dim, { opacity: pose.lid * 0.34 }]} /> : null}
      {mode === 'training' ? <Dust step={pose.run} phase={phase} /> : null}
      {mode === 'talk' ? (
        <View style={styles.bubble} testID="speech-line">
          <Text style={styles.line}>{copy.talkReply}</Text>
        </View>
      ) : null}
    </View>
  );
});

function Food({ mouth, travel, chew }: { mouth: Mouth; travel: number; chew: number }) {
  const left = `${78 - (78 - mouth.x * 100) * travel}%`;
  const top = `${24 + (mouth.y * 100 - 24) * travel + chew * 4}%`;
  const size = 58 - travel * 18;
  return (
    <View style={[styles.food, { left, top, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }]}>
      <View style={styles.leaf} />
    </View>
  );
}

function Milk({ mouth, tilt, phase }: { mouth: Mouth; tilt: number; phase: number }) {
  return (
    <>
      <View
        style={[
          styles.bottle,
          {
            transform: [{ rotate: `${-tilt * 56}deg` }],
          },
        ]}
      >
        <View style={styles.cap} />
      </View>
      {Array.from({ length: 5 }, (_, index) => {
        const travel = (phase * 1.4 + index * 0.18) % 1;
        const left = `${70 - (70 - mouth.x * 100) * travel}%`;
        const top = `${34 + (mouth.y * 100 - 34) * travel}%`;
        return <View key={index} style={[styles.drop, { left, top }]} />;
      })}
    </>
  );
}

function SleepMarks({ amount }: { amount: number }) {
  const marks = ['z', 'z', 'Z'];
  return (
    <>
      {marks.map((mark, index) => (
        <Text
          key={mark + index}
          style={[
            styles.zed,
            {
              opacity: amount,
              right: `${12 + index * 7}%`,
              top: `${18 - amount * (8 + index * 6)}%`,
              fontSize: 22 + index * 8,
            },
          ]}
        >
          {mark}
        </Text>
      ))}
    </>
  );
}

function Dust({ step, phase }: { step: number; phase: number }) {
  return (
    <View style={styles.dustRow}>
      {Array.from({ length: 6 }, (_, index) => {
        const travel = (phase * 2.4 + index / 6) % 1;
        return (
          <View
            key={index}
            style={[
              styles.puff,
              {
                position: 'absolute',
                left: `${(1 - travel) * 92}%`,
                bottom: step > 0 ? 0 : 8,
                opacity: 0.3 + (1 - travel) * 0.6,
                transform: [{ scale: 0.55 + travel * 0.8 }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: '#1C1410',
  },
  frame: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2A211C',
  },
  photoFill: {
    position: 'absolute',
    width: '130%',
    height: '130%',
    left: '-15%',
    top: '-12%',
  },
  photoFrame: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  food: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#E23D2B',
    borderWidth: 3,
    borderColor: '#F6E7C1',
  },
  leaf: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
    width: 14,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#3E9A32',
  },
  bottle: {
    position: 'absolute',
    right: '8%',
    top: '30%',
    width: 34,
    height: 78,
    borderRadius: 10,
    backgroundColor: '#F7FBFF',
    alignItems: 'center',
  },
  cap: {
    width: '100%',
    height: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#7EB6D9',
  },
  drop: {
    position: 'absolute',
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  zed: {
    position: 'absolute',
    color: '#F3EBE3',
    fontWeight: '700',
  },
  dim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#120E18',
  },
  dustRow: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    bottom: '8%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  puff: {
    width: 36,
    height: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(243, 235, 227, 0.55)',
  },
  bubble: {
    position: 'absolute',
    top: 18,
    left: 16,
    right: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(243, 235, 227, 0.96)',
  },
  line: {
    color: '#1C1410',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
  },
});
