import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { theme } from '../theme';

type Props = {
  payload: string;
  size?: number;
  testID?: string;
};

const GRID = 16;

/**
 * Visual QR stand-in. We don't ship react-native-qrcode-svg because
 * react-native-svg adds a native pod for one screen. Instead we hash
 * the payload into a deterministic 16x16 grid — the bit pattern is
 * unique per payload so visual snapshots remain stable, while still
 * giving QA a paintable target with a known testID.
 */
export function QrCode({ payload, size = 200, testID }: Props) {
  const cells = useMemo(() => grid(payload), [payload]);
  const cell = size / GRID;
  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={`QR code for ${payload}`}
      style={[styles.box, { width: size, height: size, padding: cell }]}
    >
      <View style={styles.grid}>
        {cells.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((on, c) => (
              <View
                key={c}
                style={{
                  width: cell,
                  height: cell,
                  backgroundColor: on ? theme.colors.text : 'transparent',
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function grid(payload: string): boolean[][] {
  const rows: boolean[][] = [];
  let h = hash(payload);
  for (let r = 0; r < GRID; r += 1) {
    const row: boolean[] = [];
    for (let c = 0; c < GRID; c += 1) {
      h = (h * 1103515245 + 12345) & 0x7fffffff;
      row.push((h & 1) === 1);
    }
    rows.push(row);
  }
  // Three positional anchors mimic real QR finder patterns.
  for (const [ay, ax] of [
    [0, 0],
    [0, GRID - 7],
    [GRID - 7, 0],
  ] as const) {
    for (let dy = 0; dy < 7; dy += 1) {
      for (let dx = 0; dx < 7; dx += 1) {
        const ring = dy === 0 || dy === 6 || dx === 0 || dx === 6;
        const inner = dy >= 2 && dy <= 4 && dx >= 2 && dx <= 4;
        rows[ay + dy]![ax + dx] = ring || inner;
      }
    }
  }
  return rows;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  grid: { flex: 1 },
  row: { flexDirection: 'row', flex: 1 },
});
