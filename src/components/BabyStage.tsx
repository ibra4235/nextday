import { StyleSheet, Text, View } from 'react-native';

import type { Character } from '../characters/catalog';
import { SheetFrame } from './SheetFrame';
import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';
import { ActionClip } from '../motion/ActionClip';
import { babyClip } from '../motion/babyClips';
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
  const kind: CareKind = action ?? 'sleep';
  const loop = action === null && night;
  const playing = action !== null || night;
  const clip = playing ? babyClip(character.id, look, kind) : null;

  return (
    <View pointerEvents="none" style={styles.stage} testID="baby-stage" accessibilityLabel={name}>
      <SheetFrame source={character.image} look={look}>
        {clip ? (
          <ActionClip
            key={`${character.id}-${look}-${kind}-${loop ? 'night' : 'once'}`}
            source={clip}
            loop={loop}
            onEnd={onActionEnd}
          />
        ) : null}
        {playing && kind === 'sleep' ? (
          <Text style={styles.zzz} testID="baby-zzz">
            Zzz
          </Text>
        ) : null}
        {action === 'talk' ? (
          <View style={styles.lineWrap} testID="speech-line">
            <Text style={styles.line}>{copy.talkReply}</Text>
          </View>
        ) : null}
      </SheetFrame>
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
  },
  zzz: {
    position: 'absolute',
    top: 16,
    right: 20,
    color: '#F3EBE3',
    fontSize: 36,
    fontWeight: '700',
  },
  lineWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
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
