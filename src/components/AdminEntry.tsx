import { Pressable, StyleSheet, Text } from 'react-native';

import { resolveLanguage } from '../i18n/locale';
import { stringsFor } from '../i18n/strings';

type Props = {
  onPress: () => void;
};

export function AdminEntry({ onPress }: Props) {
  const copy = stringsFor(resolveLanguage());

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copy.admin}
      testID="admin-entry"
      hitSlop={12}
      onPress={onPress}
      style={styles.entry}
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
  label: {
    color: '#A89888',
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
