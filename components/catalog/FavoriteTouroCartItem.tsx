import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useFavoritesStore } from '@/store/favoritesStore';
import { formatCurrency } from '@/utils/formatters';
import type { Touro } from '@/types';

interface FavoriteTouroCartItemProps {
  touro: Touro;
  cardWidth?: number | `${number}%`;
}

export function FavoriteTouroCartItem({ touro, cardWidth }: FavoriteTouroCartItemProps): JSX.Element {
  const { width } = useWindowDimensions();
  const removerFavorito = useFavoritesStore((state) => state.removerFavorito);
  const shouldStack = width < 460;

  const openDetails = useCallback(() => {
    router.push({ pathname: '/touro/[id]', params: { id: touro.id } });
  }, [touro.id]);

  const removeFromCart = useCallback(() => {
    removerFavorito(touro.id);
    Toast.show({
      type: 'success',
      text1: 'Removido do carrinho',
      text2: `${touro.nome} saiu dos seus favoritos.`,
    });
  }, [removerFavorito, touro.id, touro.nome]);

  return (
    <View style={[styles.card, shouldStack && styles.cardStack, cardWidth ? { width: cardWidth } : undefined]}>
      <Image
        source={{ uri: touro.foto }}
        resizeMode="cover"
        style={[styles.image, shouldStack && styles.imageStack]}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.name}>
              {touro.nome}
            </Text>
            <Text numberOfLines={1} style={styles.registry}>
              Código {touro.registro}
            </Text>
          </View>
          <View style={styles.raceBadge}>
            <Text numberOfLines={1} style={styles.raceText}>
              {touro.raca}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Central</Text>
            <Text numberOfLines={1} style={styles.infoValue}>
              {touro.central.nome}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Valor</Text>
            <Text style={styles.price}>{formatCurrency(touro.precoPorDose)}/dose</Text>
          </View>
        </View>

        <View style={[styles.actions, shouldStack && styles.actionsStack]}>
          <Pressable
            accessibilityLabel={`Ver detalhes do touro ${touro.nome}`}
            onPress={openDetails}
            style={({ pressed }) => [styles.detailButton, shouldStack && styles.fullButton, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="eye-outline" size={18} color={colors.surface} />
            <Text style={styles.detailText}>Ver detalhes</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={`Remover ${touro.nome} do carrinho`}
            onPress={removeFromCart}
            style={({ pressed }) => [styles.removeButton, shouldStack && styles.fullButton, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="heart-remove-outline" size={18} color={colors.danger} />
            <Text style={styles.removeText}>Remover</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionsStack: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    maxWidth: '100%',
    padding: spacing.md,
    ...shadows.card,
  },
  cardStack: {
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    gap: spacing.md,
    minWidth: 0,
  },
  detailButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  detailText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  fullButton: {
    width: '100%',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  image: {
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    height: 132,
    width: 122,
  },
  imageStack: {
    height: 184,
    width: '100%',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  infoItem: {
    flex: 1,
    minWidth: 118,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 11,
  },
  infoValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 13,
    marginTop: 3,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  pressed: {
    opacity: 0.84,
  },
  price: {
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: 14,
    marginTop: 3,
  },
  raceBadge: {
    backgroundColor: colors.amberSoft,
    borderRadius: radii.pill,
    maxWidth: 136,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  raceText: {
    color: colors.warning,
    fontFamily: fonts.heading,
    fontSize: 10,
  },
  registry: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 3,
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: colors.redSoft,
    borderColor: `${colors.danger}30`,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  removeText: {
    color: colors.danger,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
});
