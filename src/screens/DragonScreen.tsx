import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BabyStage } from '../components/BabyStage';
import type { Character } from '../characters/catalog';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';
import type { CareKind } from '../storage/care';
import { loadLook } from '../storage/look';

const ACTIONS: readonly CareKind[] = ['food', 'milk', 'sleep', 'training', 'talk'];

type Props = {
  character: Character;
  onClose: () => void;
};

export function DragonScreen({ character, onClose }: Props) {
  const language = resolveLanguage();
  const copy = stringsFor(language);
  const name = language === 'en' ? character.en : character.tr;
  const [action, setAction] = useState<CareKind | null>(null);
  const [look] = useState(() => loadLook());
  const labels: Record<CareKind, string> = {
    food: copy.food,
    milk: copy.milk,
    sleep: copy.sleep,
    training: copy.training,
    talk: copy.talk,
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={copy.back} onPress={onClose} hitSlop={12}>
          <Text style={styles.back}>{copy.back}</Text>
        </Pressable>
        <Text style={styles.title}>{name}</Text>
      </View>
      <View style={styles.stage} testID={`dragon-${character.id}`}>
        <BabyStage character={character} look={look} action={action} night={false} onActionEnd={() => setAction(null)} />
      </View>
      <View style={styles.row}>
        {ACTIONS.map((kind) => (
          <Pressable
            key={kind}
            accessibilityRole="button"
            accessibilityLabel={labels[kind]}
            testID={`dragon-care-${kind}`}
            onPress={() => setAction(kind)}
            style={styles.action}
          >
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={styles.actionLabel}>
              {labels[kind]}
            </Text>
          </Pressable>
        ))}
      </View>
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
  stage: {
    flex: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingBottom: 28,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 8,
    backgroundColor: 'rgba(42, 33, 28, 0.92)',
  },
  actionLabel: {
    color: '#F3EBE3',
    fontSize: 12,
    textAlign: 'center',
  },
});
