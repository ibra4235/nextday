import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AdminEntry } from '../components/AdminEntry';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';

const logo = require('../../assets/nextday-logo.jpg');
const OPENING_MS = 3600;

type Props = {
  onFinished: () => void;
  onAdmin: () => void;
};

export function OpeningScreen({ onFinished, onAdmin }: Props) {
  const copy = stringsFor(resolveLanguage());
  const { width, height } = useWindowDimensions();
  const side = Math.round(Math.min(width, height) * 0.86);
  const rock = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [rock]);

  useEffect(() => {
    const timer = setTimeout(onFinished, OPENING_MS);
    return () => clearTimeout(timer);
  }, [onFinished]);

  const rotate = rock.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-6deg', '0deg', '6deg'],
  });
  const translateX = rock.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-12, 0, 12],
  });

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={copy.eggLabel}
        style={styles.column}
      >
        <Animated.View style={{ transform: [{ translateX }, { rotate }] }}>
          <Image accessible={false} source={logo} resizeMode="contain" style={{ width: side, height: side }} />
        </Animated.View>
        <Text accessible={false} style={styles.caption}>
          {copy.eggLabel}
        </Text>
      </View>
      <AdminEntry onPress={onAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1410',
  },
  column: {
    alignItems: 'center',
  },
  caption: {
    marginTop: 18,
    color: '#E4D5C3',
    fontSize: 15,
    letterSpacing: 0.4,
  },
});
