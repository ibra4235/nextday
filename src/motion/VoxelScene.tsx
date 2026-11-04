import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import type { ReactNode } from 'react';

import type { Pose } from './pose';
import { voxelFaces, type Voxel } from './voxels';

type Props = {
  voxels: readonly Voxel[];
  viewBox: string;
  pose: Pose;
  talking: boolean;
  line: string;
  testID: string;
  label: string;
  overlay?: ReactNode;
};

export function VoxelScene({ voxels, viewBox, pose, talking, line, testID, label, overlay }: Props) {
  const [, , width, height] = viewBox.split(' ').map(Number);
  const faces = voxelFaces(voxels);
  return (
    <View style={styles.column} testID={testID}>
      {talking ? (
        <View pointerEvents="none" style={styles.bubble} testID="speech-line">
          <Text style={styles.line}>{line}</Text>
        </View>
      ) : null}
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={label}
        style={[styles.stage, { aspectRatio: width / height }]}
      >
        <View
          pointerEvents="none"
          style={[styles.shadow, { transform: [{ scaleX: 1 - pose.hop * 0.28 }] }]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.body,
            {
              transform: [
                { translateY: pose.translateY },
                { rotate: `${pose.rotateDeg}deg` },
                { scaleX: pose.scaleX },
                { scaleY: pose.scaleY },
              ],
            },
          ]}
        >
          <Svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
            {faces.map((shape, index) => (
              <Polygon key={index} points={shape.points} fill={shape.fill} stroke="#1A120E" strokeWidth={0.7} />
            ))}
          </Svg>
          {overlay ? <View style={styles.overlay}>{overlay}</View> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%',
    alignItems: 'center',
  },
  bubble: {
    marginBottom: 6,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(243, 235, 227, 0.96)',
    maxWidth: '100%',
  },
  line: {
    color: '#1C1410',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  stage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: '8%',
    width: '42%',
    height: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
  },
  body: {
    width: '86%',
    height: '86%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
