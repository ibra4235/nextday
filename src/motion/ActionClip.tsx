import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';

import type { ClipSource } from './actionClips';

type Props = {
  source: ClipSource;
  loop: boolean;
  onEnd?: () => void;
};

export function ActionClip({ source, loop, onEnd }: Props) {
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  const player = useVideoPlayer(source, (ready) => {
    ready.loop = loop;
    ready.play();
  });
  useEventListener(player, 'playToEnd', () => {
    if (!player.loop) {
      onEndRef.current?.();
    }
  });

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls={false}
      contentFit="contain"
      allowsPictureInPicture={false}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
