import { StyleSheet, View } from 'react-native';

type Props = {
  count: number;
};

/** Small dark cracks on the shell. Each care tap adds one, and they stay. */
export function EggCracks({ count }: Props) {
  if (count <= 0) {
    return null;
  }
  return (
    <View pointerEvents="none" style={styles.layer}>
      {Array.from({ length: count }, (_, index) => (
        <Crack key={index} index={index} />
      ))}
    </View>
  );
}

function Crack({ index }: { index: number }) {
  const angle = -68 + ((index * 47) % 136);
  const length = 16 + (index % 4) * 6;
  const top = 40 + ((index * 11) % 20);
  const left = 34 + ((index * 19) % 30);
  const branch = 8 + (index % 3) * 3;
  return (
      <View
        style={[
          styles.crack,
          {
            top: `${top}%`,
            left: `${left}%`,
            width: length,
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
      >
        <View style={styles.highlight} />
        <View
          style={[
            styles.branch,
            {
              width: branch,
              transform: [{ rotate: index % 2 === 0 ? '38deg' : '-42deg' }],
            },
          ]}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  crack: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#120C09',
  },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1,
    height: 1,
    backgroundColor: '#E7D3A1',
  },
  branch: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#120C09',
  },
});
