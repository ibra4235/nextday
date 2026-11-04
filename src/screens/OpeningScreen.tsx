import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';

const logo = require('../../assets/nextday-logo.jpg');

export function OpeningScreen() {
  const copy = stringsFor(resolveLanguage());
  const { width, height } = useWindowDimensions();
  const side = Math.round(Math.min(width, height) * 0.86);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={copy.eggLabel}
        style={styles.column}
      >
        <Image accessible={false} source={logo} resizeMode="contain" style={{ width: side, height: side }} />
        <Text accessible={false} style={styles.caption}>
          {copy.eggLabel}
        </Text>
      </View>
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
