import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage } from '../i18n/language';

type Props = {
  onChoose: (language: AppLanguage) => void;
};

export function LanguageScreen({ onChoose }: Props) {
  return (
    <View style={styles.screen}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Türkçe"
        testID="language-tr"
        onPress={() => onChoose('tr')}
        style={styles.choice}
      >
        <Text style={styles.label}>Türkçe</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="English"
        testID="language-en"
        onPress={() => onChoose('en')}
        style={styles.choice}
      >
        <Text style={styles.label}>English</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
    backgroundColor: '#1C1410',
  },
  choice: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    backgroundColor: '#E4D5C3',
  },
  label: {
    color: '#1C1410',
    fontSize: 20,
    fontWeight: '600',
  },
});
