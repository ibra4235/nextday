import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Character } from '../characters/catalog';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';
import { VoxelDragon } from '../motion/VoxelDragon';
import type { PerformerHandle } from '../motion/usePerformance';
import type { CareKind } from '../storage/care';

const ACTIONS: readonly CareKind[] = ['food', 'milk', 'sleep', 'training', 'talk'];

type Props = {
  character: Character;
  onClose: () => void;
};

export function DragonScreen({ character, onClose }: Props) {
  const language = resolveLanguage();
  const copy = stringsFor(language);
  const name = language === 'en' ? character.en : character.tr;
  const dragon = useRef<PerformerHandle>(null);
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
        <VoxelDragon ref={dragon} color={character.color} label={name} />
      </View>
      <View style={styles.row}>
        {ACTIONS.map((kind) => (
          <Pressable
            key={kind}
            accessibilityRole="button"
            accessibilityLabel={labels[kind]}
            testID={`dragon-care-${kind}`}
            onPress={() => dragon.current?.play(kind)}
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
    justifyContent: 'center',
    paddingHorizontal: 16,
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
