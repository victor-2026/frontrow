import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import { theme } from '../theme';

const ROW_HEIGHT = 96;

/**
 * Six placeholder rows that pulse while the events query is loading.
 * Loops via Animated and respects the testID so a Maestro flow with
 * a slow_network scenario can deterministically assert the skeleton
 * is visible during the network gap.
 */
export function EventListSkeleton({ testID, count = 6 }: { testID?: string; count?: number }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View testID={testID} style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View key={i} style={[styles.row, { opacity }]}>
          <View style={styles.thumb} />
          <View style={styles.lines}>
            <View style={[styles.bar, styles.barWide]} />
            <View style={[styles.bar, styles.barNarrow]} />
            <View style={[styles.bar, styles.barMid]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: theme.spacing.md, gap: theme.spacing.md },
  row: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.border,
  },
  lines: { flex: 1, gap: theme.spacing.sm },
  bar: { height: 12, borderRadius: 6, backgroundColor: theme.colors.border },
  barWide: { width: '85%' },
  barMid: { width: '60%' },
  barNarrow: { width: '40%' },
});
