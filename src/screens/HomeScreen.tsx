import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AdminEntry } from '../components/AdminEntry';
import { EggCracks } from '../components/EggCracks';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';
import { VoxelEgg } from '../motion/VoxelEgg';
import type { PerformerHandle } from '../motion/usePerformance';
import type { CareKind } from '../storage/care';
import { saveCare } from '../storage/care';
import { addCrack, loadCracks } from '../storage/cracks';
import type { Vitals } from '../storage/vitals';
import { applyCare, isDead, openVitals } from '../storage/vitals';

const REPLY_MS = 8000;

const ACTIONS: readonly CareKind[] = ['food', 'milk', 'sleep', 'training', 'talk'];

type Props = {
  onAdmin: () => void;
  onCharacters: () => void;
};

export function HomeScreen({ onAdmin, onCharacters }: Props) {
  const copy = stringsFor(resolveLanguage());
  const [vitals, setVitals] = useState<Vitals>(() => openVitals());
  const [cracks, setCracks] = useState(() => loadCracks());
  const [reply, setReply] = useState('');
  const [savingKind, setSavingKind] = useState<CareKind | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const egg = useRef<PerformerHandle>(null);
  const { width, height } = useWindowDimensions();
  const eggWidth = Math.max(210, Math.min(width - 148, height * 0.5, 460));
  const dead = isDead(vitals);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const labels: Record<CareKind, string> = {
    food: copy.food,
    milk: copy.milk,
    sleep: copy.sleep,
    training: copy.training,
    talk: copy.talk,
  };
  const replies: Record<CareKind, string> = {
    food: copy.foodReply,
    milk: copy.milkReply,
    sleep: copy.sleepReply,
    training: copy.trainingReply,
    talk: copy.talkReply,
  };

  async function onCare(kind: CareKind) {
    if (savingKind || dead) {
      return;
    }
    egg.current?.play(kind);
    setSavingKind(kind);
    try {
      const next = applyCare(kind);
      setVitals(next);
      if (isDead(next)) {
        setReply('');
        return;
      }
      await saveCare(kind);
      setCracks(addCrack());
      setReply(replies[kind]);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setReply(''), REPLY_MS);
    } catch {
      setReply('');
    } finally {
      setSavingKind(null);
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.stage} pointerEvents="none">
        <View style={{ width: eggWidth }}>
          <VoxelEgg ref={egg} alive={!dead} overlay={<EggCracks count={cracks} />} />
        </View>
      </View>
      <Meter label={copy.hunger} value={vitals.hunger} testID="hunger-bar" tone="hunger" side="left" />
      <Meter label={copy.sleep} value={vitals.sleep} testID="sleep-bar" tone="sleep" side="right" />
      {dead ? (
        <View pointerEvents="none" style={styles.death} testID="egg-dead" accessibilityLabel={copy.died}>
          <Text style={styles.deathText}>{copy.died}</Text>
        </View>
      ) : null}
      {reply ? (
        <View
          accessible
          pointerEvents="none"
          style={styles.reply}
          testID="egg-reply"
          accessibilityLabel={reply}
        >
          <Text style={styles.replyText}>{reply}</Text>
        </View>
      ) : null}
      <View style={styles.dock}>
        <View style={styles.tools}>
          <AdminEntry inline onPress={onAdmin} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.characters}
            testID="characters-entry"
            hitSlop={12}
            onPress={onCharacters}
            style={styles.characters}
          >
            <Text style={styles.charactersLabel}>{copy.characters}</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          {ACTIONS.map((kind) => (
            <Pressable
              key={kind}
              accessibilityRole="button"
              accessibilityLabel={labels[kind]}
              accessibilityState={{ disabled: dead }}
              testID={`care-${kind}`}
              disabled={dead || savingKind !== null}
              onPress={() => {
                void onCare(kind);
              }}
              style={[styles.action, dead && styles.actionStopped]}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={styles.actionLabel}>
                {labels[kind]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

function Meter({
  label,
  value,
  testID,
  tone,
  side,
}: {
  label: string;
  value: number;
  testID: string;
  tone: 'hunger' | 'sleep';
  side: 'left' | 'right';
}) {
  const shown = Math.round(Math.min(100, Math.max(0, value)));
  return (
    <View
      testID={testID}
      accessibilityLabel={`${label} ${shown}`}
      style={[styles.meter, side === 'left' ? styles.meterLeft : styles.meterRight]}
    >
      <Text style={styles.meterLabel}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, tone === 'hunger' ? styles.hungerFill : styles.sleepFill, { height: `${shown}%` }]} />
      </View>
      <Text style={styles.meterValue}>{shown}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1C1410',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 108,
  },
  meter: {
    position: 'absolute',
    top: '16%',
    zIndex: 2,
    alignItems: 'center',
    width: 72,
  },
  meterLeft: {
    left: 6,
  },
  meterRight: {
    right: 6,
  },
  meterLabel: {
    overflow: 'hidden',
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#1C1410',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  track: {
    width: 28,
    height: 280,
    overflow: 'hidden',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F3EBE3',
    justifyContent: 'flex-end',
    backgroundColor: '#0E0B09',
  },
  fill: {
    width: '100%',
  },
  hungerFill: {
    backgroundColor: '#F0B429',
  },
  sleepFill: {
    backgroundColor: '#3EC6E0',
  },
  meterValue: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  death: {
    position: 'absolute',
    left: 28,
    right: 28,
    top: '42%',
    zIndex: 2,
    alignItems: 'center',
  },
  deathText: {
    overflow: 'hidden',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(28, 20, 16, 0.88)',
    color: '#F3EBE3',
    fontSize: 22,
  },
  reply: {
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 168,
    zIndex: 2,
    alignItems: 'center',
  },
  replyText: {
    overflow: 'hidden',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(28, 20, 16, 0.88)',
    color: '#F3EBE3',
    fontSize: 17,
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(28, 20, 16, 0.55)',
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 22,
  },
  characters: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  charactersLabel: {
    color: '#E4D5C3',
    fontSize: 13,
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 8,
    backgroundColor: 'rgba(42, 33, 28, 0.92)',
  },
  actionStopped: {
    opacity: 0.35,
  },
  actionLabel: {
    color: '#F3EBE3',
    fontSize: 12,
    textAlign: 'center',
  },
});
