import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';

const opening = require('../../assets/nextday-opening-9x16.jpg');
/** Extra scale so a 6° rock stays edge to edge and the egg stays centered. */
const ROCK_BLEED = 1.3;

type Props = {
  children?: ReactNode;
  /** The opening egg rocks. The home egg stays still. */
  animate?: boolean;
};

export function EggStage({ children, animate = true }: Props) {
  const copy = stringsFor(resolveLanguage());
  const { width, height } = useWindowDimensions();
  const rock = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) {
      rock.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(rock, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rock, {
          toValue: -1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rock, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, rock]);

  const rotate = rock.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-6deg', '0deg', '6deg'],
  });
  const translateX = rock.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-12, 0, 12],
  });
  const bleed = animate ? ROCK_BLEED : 1;
  const photoWidth = width * bleed;
  const photoHeight = height * bleed;
  const transform = animate ? [{ translateX }, { rotate }] : [];

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Animated.View
        accessible
        accessibilityRole="image"
        accessibilityLabel={copy.eggLabel}
        style={[
          styles.photo,
          {
            width: photoWidth,
            height: photoHeight,
            left: (width - photoWidth) / 2,
            top: (height - photoHeight) / 2,
            transform,
          },
        ]}
      >
        <Image accessible={false} source={opening} resizeMode="cover" style={styles.fill} />
      </Animated.View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#1C1410',
  },
  photo: {
    position: 'absolute',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
});
