import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radii, shadows, spacing } from '@/constants/theme';

interface SkeletonCardProps {
  cardWidth?: number | `${number}%`;
}

export function SkeletonCard({ cardWidth }: SkeletonCardProps): JSX.Element {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.85, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, cardWidth ? { width: cardWidth } : undefined, { opacity }]}>
      <View style={styles.image} />
      <View style={styles.content}>
        <View style={styles.lineLarge} />
        <View style={styles.line} />
        <View style={styles.row}>
          <View style={styles.pill} />
          <View style={styles.pill} />
        </View>
        <View style={styles.lineShort} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.md,
    maxWidth: '100%',
    minWidth: 0,
    padding: spacing.md,
    ...shadows.soft,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  image: {
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    height: 92,
    width: 92,
  },
  line: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    height: 12,
    width: '70%',
  },
  lineLarge: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    height: 18,
    width: '92%',
  },
  lineShort: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    height: 12,
    width: '45%',
  },
  pill: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    height: 24,
    width: 82,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
