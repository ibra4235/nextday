import { StyleSheet, Text, View } from 'react-native';

import type { Character } from '../characters/catalog';
import { SheetFrame } from './SheetFrame';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';
import { ActionClip } from '../motion/ActionClip';
import { clipFor } from '../motion/actionClips';
import type { CareKind } from '../storage/care';
import type { BabyLook } from '../storage/look';

type Props = {
  character: Character;
  look: BabyLook;
  action: CareKind | null;
  night: boolean;
  onActionEnd: () => void;
};

export function BabyStage({ character, look, action, night, onActionEnd }: Props) {
  const language = resolveLanguage();
  const copy = stringsFor(language);
  const name = language === 'en' ? character.en : character.tr;
  const showClip = action !== null || night;
  const kind: CareKind = action ?? 'sleep';
  const loop = action === null && night;

  return (
    <View pointerEvents="none" style={styles.stage} testID="baby-stage" accessibilityLabel={name}>
      <SheetFrame source={character.image} look={look} />
      {showClip ? (
        <View style={styles.clip}>
          <ActionClip
            key={`${kind}-${loop ? 'night' : 'once'}-${language}`}
            source={clipFor(kind, language)}
            loop={loop}
            onEnd={onActionEnd}
          />
          {kind === 'sleep' ? (
            <Text style={styles.zzz} testID="baby-zzz">
              Zzz
            </Text>
          ) : null}
          {action === 'talk' && language === 'en' ? (
            <View style={styles.lineWrap} testID="speech-line">
              <Text style={styles.line}>{copy.talkReply}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1410',
  },
  clip: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  zzz: {
    position: 'absolute',
    top: 72,
    right: 28,
    color: '#F3EBE3',
    fontSize: 36,
    fontWeight: '700',
  },
  lineWrap: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 176,
    alignItems: 'center',
  },
  line: {
    overflow: 'hidden',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(28, 20, 16, 0.88)',
    color: '#F3EBE3',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
});
