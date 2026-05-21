import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@/components/common/AppIcon';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useFavoriteTouros } from '@/hooks/useFavoriteTouros';

interface CartShortcutProps {
  compact?: boolean;
}

export function CartShortcut({ compact = false }: CartShortcutProps): JSX.Element {
  const { total } = useFavoriteTouros();
  const badgeLabel = total > 99 ? '99+' : String(total);

  return (
    <Pressable
      accessibilityLabel={`Abrir favoritos com ${total} ${total === 1 ? 'touro selecionado' : 'touros selecionados'}`}
      onPress={() => router.push('/carrinho' as never)}
      style={({ pressed }) => [styles.button, compact && styles.compactButton, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <AppIcon color={total > 0 ? colors.accent : colors.primary} name="shopping-cart" size={21} />
        {total > 0 && (
          <View style={styles.badge}>
            <Text numberOfLines={1} style={styles.badgeText}>
              {badgeLabel}
            </Text>
          </View>
        )}
      </View>
      {!compact && <Text style={styles.label}>Favoritos</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 4,
    position: 'absolute',
    right: -10,
    top: -10,
  },
  badgeText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 10,
    lineHeight: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 60,
    paddingHorizontal: spacing.md,
    ...shadows.soft,
  },
  compactButton: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    minHeight: 48,
    width: 48,
  },
  iconWrap: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  label: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
