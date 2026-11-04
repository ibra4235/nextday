import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { babiesFor } from '../characters/catalog';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';
import { loadRecords } from '../storage/records';

type Props = {
  onPick: (id: string) => void;
};

export function HatchScreen({ onPick }: Props) {
  const language = resolveLanguage();
  const copy = stringsFor(language);
  const gender = loadRecords()[0]?.gender ?? 'woman';
  const babies = babiesFor(gender);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Text style={styles.title}>{copy.chooseBaby}</Text>
      <ScrollView contentContainerStyle={styles.list} testID="baby-picker">
        {babies.map((character) => {
          const name = language === 'en' ? character.en : character.tr;
          return (
            <Pressable
              key={character.id}
              accessibilityRole="button"
              accessibilityLabel={name}
              style={styles.card}
              testID={`baby-choice-${character.id}`}
              onPress={() => onPick(character.id)}
            >
              <View style={styles.frame}>
                <Image source={character.image} resizeMode="contain" style={styles.image} />
              </View>
              <Text style={styles.name}>{name}</Text>
            </Pressable>
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
  title: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 12,
    color: '#E4D5C3',
    fontSize: 22,
    textAlign: 'center',
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
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
