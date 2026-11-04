import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CHARACTERS } from '../characters/catalog';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';

type Props = {
  onClose: () => void;
};

export function CharactersScreen({ onClose }: Props) {
  const language = resolveLanguage();
  const copy = stringsFor(language);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={copy.back} onPress={onClose} hitSlop={12}>
          <Text style={styles.back}>{copy.back}</Text>
        </Pressable>
        <Text style={styles.title}>{copy.characters}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} testID="character-list">
        {CHARACTERS.map((character) => {
          const name = language === 'en' ? character.en : character.tr;
          return (
            <View key={character.id} style={styles.card} testID={`character-${character.id}`}>
              <View style={styles.frame}>
                <Image source={character.image} resizeMode="contain" style={styles.image} />
              </View>
              <Text style={styles.name}>{name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1C1410',
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    color: '#A89888',
    fontSize: 15,
  },
  title: {
    color: '#E4D5C3',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  frame: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2A211C',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 6,
    color: '#F3EBE3',
    fontSize: 15,
    textAlign: 'center',
  },
});
