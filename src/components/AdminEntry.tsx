import { Pressable, StyleSheet, Text } from 'react-native';

import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';

type Props = {
  onPress: () => void;
  inline?: boolean;
};

export function AdminEntry({ onPress, inline = false }: Props) {
  const copy = stringsFor(resolveLanguage());

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copy.admin}
      testID="admin-entry"
      hitSlop={12}
      onPress={onPress}
      style={inline ? styles.inline : styles.entry}
    >
      <Text style={styles.label}>{copy.admin}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  entry: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
    paddingVertical: 8,
  },
  inline: {
    alignSelf: 'center',
    marginBottom: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  label: {
    color: '#E4D5C3',
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
