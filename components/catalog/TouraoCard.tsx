import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { AccuracyBadge } from '@/components/catalog/AccuracyBadge';
import { SemenBadge } from '@/components/catalog/SemenBadge';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useFavoritesStore } from '@/store/favoritesStore';
import { formatCurrency, formatKg } from '@/utils/formatters';
import type { Touro } from '@/types';

interface TouraoCardProps {
  touro: Touro;
  score?: number;
  bonusClimatico?: number;
  compact?: boolean;
  horizontal?: boolean;
  showTags?: boolean;
  cardWidth?: number | `${number}%`;
}

function TraitBar({ value, label }: { value: number; label: string }): JSX.Element {
  return (
    <View style={styles.trait}>
      <Text style={styles.traitLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.min((value / 9) * 100, 100)}%` }]} />
      </View>
      <Text style={styles.traitScore}>{value}/9</Text>
    </View>
  );
}

function Tag({ icon, label, color }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; color: string }): JSX.Element {
  return (
    <View style={[styles.tag, { backgroundColor: `${color}12` }]}>
      <MaterialCommunityIcons name={icon} size={12} color={color} />
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

function getSimpleBenefits(touro: Touro): { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; color: string }[] {
  const benefits: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; color: string }[] = [
    { icon: 'water-plus', label: 'Mais leite', color: colors.primary },
  ];

  if (touro.deps.facilidadeParto >= 87) {
    benefits.push({ icon: 'baby-face-outline', label: 'Parto fácil', color: colors.success });
  }

  if (touro.tipoSemen === 'Sexado Fêmea' || touro.fenotipo.pernasEPes >= 7.5) {
    benefits.push({ icon: 'heart-plus-outline', label: 'Bezerras fortes', color: colors.warning });
  }

  if (benefits.length < 3) {
    benefits.push({ icon: 'shield-check-outline', label: 'Boa confiança', color: colors.success });
  }

  return benefits.slice(0, 3);
}

function TouraoCardComponent({
  touro,
  score,
  bonusClimatico = 0,
  compact = false,
  horizontal = false,
  showTags = true,
  cardWidth,
}: TouraoCardProps): JSX.Element {
  const { width } = useWindowDimensions();
  const shouldStack = !horizontal && width < 430;
  const isCompactHorizontal = compact && horizontal;
  const isFavorito = useFavoritesStore((state) => state.isFavorito);
  const toggleFavorito = useFavoritesStore((state) => state.toggleFavorito);
  const favorito = isFavorito(touro.id);
  const benefits = getSimpleBenefits(touro);

  const openDetails = useCallback(() => {
    router.push({ pathname: '/touro/[id]', params: { id: touro.id } });
  }, [touro.id]);

  const handleFavorite = useCallback(() => {
    toggleFavorito(touro.id);
    Toast.show({
      type: 'success',
      text1: favorito ? 'Removido dos favoritos' : 'Touro favoritado',
      text2: `${touro.nome} ${favorito ? 'saiu' : 'entrou'} do carrinho de favoritos.`,
    });
  }, [favorito, toggleFavorito, touro.id, touro.nome]);

  return (
    <Pressable
      accessibilityLabel={`Abrir detalhes do touro ${touro.nome}`}
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        shouldStack && styles.stackedCard,
        horizontal && styles.horizontalCard,
        compact && styles.compactCard,
        compact && !horizontal && !cardWidth ? styles.compactFluidCard : undefined,
        cardWidth ? { width: cardWidth } : undefined,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: touro.foto }}
        style={[styles.image, compact && styles.compactImage, shouldStack && styles.stackedImage]}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.name}>
              {touro.nome}
            </Text>
            <Text numberOfLines={1} style={styles.registry}>
              {touro.registro}
            </Text>
          </View>
          <View style={styles.raceBadge}>
            <Text style={styles.raceText}>{touro.raca}</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <AccuracyBadge nivel={touro.nivelRisco} acuracia={touro.acuracia} compact={compact} />
          <SemenBadge tipo={touro.tipoSemen} alerta={touro.qualidadeSemen.alerta} compact={compact} />
        </View>

        <View style={styles.benefits}>
          {benefits.map((benefit) => (
            <View key={benefit.label} style={[styles.benefitChip, { backgroundColor: `${benefit.color}14` }]}>
              <MaterialCommunityIcons name={benefit.icon} size={17} color={benefit.color} />
              <Text style={[styles.benefitText, { color: benefit.color }]}>{benefit.label}</Text>
            </View>
          ))}
        </View>

        {showTags && (
          <View style={styles.tags}>
            {touro.nivelRisco === 'Provado / Baixo Risco' && <Tag icon="fire" label="Provado" color={colors.success} />}
            {touro.nivelRisco === 'Jovem / Alto Risco' && <Tag icon="alert" label="Alto risco" color={colors.danger} />}
            {bonusClimatico > 0 && <Tag icon="leaf" label="Adaptado" color={colors.primary} />}
            {touro.qualidadeSemen.alerta !== 'OK' && <Tag icon="bell-alert" label="Alerta IATF" color={colors.danger} />}
          </View>
        )}

        <View style={styles.metricsGrid}>
          <View>
            <Text style={styles.metricLabel}>Ajuda a aumentar o leite</Text>
            <Text style={styles.metricValue}>{formatKg(touro.pta)}</Text>
          </View>
          <View>
            <Text style={styles.metricLabel}>Confiança da informação</Text>
            <Text style={styles.metricValue}>{touro.acuracia}%</Text>
          </View>
          {typeof score === 'number' && (
            <View>
              <Text style={styles.metricLabel}>Qualidade genética</Text>
              <Text style={styles.metricValue}>{score.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {!compact && (
          <View style={styles.traits}>
            <TraitBar label="Úbere" value={touro.fenotipo.compostoUbere} />
            <TraitBar label="Pernas" value={touro.fenotipo.pernasEPes} />
          </View>
        )}

        <View style={[styles.footer, shouldStack && styles.footerStack, isCompactHorizontal && styles.compactFooter]}>
          <View style={[styles.central, isCompactHorizontal && styles.compactCentral]}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>{touro.central.logo}</Text>
            </View>
            {!isCompactHorizontal && (
              <View style={styles.centralInfo}>
                <Text numberOfLines={1} style={styles.centralName}>{touro.central.nome}</Text>
                <Text numberOfLines={1} style={styles.price}>{formatCurrency(touro.precoPorDose)}/dose</Text>
              </View>
            )}
          </View>
          <View style={[styles.actions, shouldStack && styles.actionsStack, isCompactHorizontal && styles.compactActions]}>
            <Pressable
              accessibilityLabel={`Ver detalhes do touro ${touro.nome}`}
              onPress={openDetails}
              style={[
                styles.detailButton,
                shouldStack && styles.detailButtonStack,
                isCompactHorizontal && styles.compactDetailButton,
              ]}
            >
              <Text numberOfLines={1} style={styles.detailText}>{isCompactHorizontal ? 'Ver' : 'Ver touro'}</Text>
            </Pressable>
            <Pressable
              accessibilityLabel={favorito ? `Remover ${touro.nome} dos favoritos` : `Favoritar ${touro.nome}`}
              onPress={handleFavorite}
              style={[styles.favoriteButton, favorito && styles.favoriteActive]}
            >
              <MaterialCommunityIcons
                name={(favorito ? 'heart' : 'heart-outline') as never}
                color={favorito ? colors.danger : colors.primary}
                size={18}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export const TouraoCard = memo(TouraoCardComponent);

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionsStack: {
    alignSelf: 'stretch',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  benefitChip: {
    alignItems: 'center',
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 38,
    paddingHorizontal: spacing.sm,
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  benefitText: {
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  barFill: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 6,
  },
  barTrack: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    flex: 1,
    height: 6,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    maxWidth: '100%',
    minWidth: 0,
    padding: spacing.lg,
    ...shadows.card,
  },
  central: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  centralInfo: {
    flex: 1,
    minWidth: 0,
  },
  centralName: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  compactCard: {
    maxWidth: '100%',
  },
  compactFluidCard: {
    width: '100%',
  },
  compactActions: {
    flexShrink: 0,
  },
  compactCentral: {
    flex: 0,
  },
  compactDetailButton: {
    minWidth: 88,
    paddingHorizontal: spacing.md,
  },
  compactFooter: {
    justifyContent: 'space-between',
  },
  compactImage: {
    height: 104,
    width: 92,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  detailButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: spacing.lg,
  },
  detailButtonStack: {
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  favoriteActive: {
    backgroundColor: colors.redSoft,
    borderColor: `${colors.danger}55`,
  },
  favoriteButton: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}25`,
    borderRadius: radii.sm,
    borderWidth: 2,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  footerStack: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  horizontalCard: {
    width: 335,
  },
  image: {
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    height: 152,
    width: 126,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    height: 32,
    justifyContent: 'center',
    width: 38,
  },
  logoText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 20,
  },
  metricValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 21,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.995 }],
  },
  price: {
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: 16,
    marginTop: 2,
  },
  raceBadge: {
    backgroundColor: colors.amberSoft,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  raceText: {
    color: colors.warning,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  registry: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: 2,
  },
  tag: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  stackedCard: {
    flexDirection: 'column',
  },
  stackedImage: {
    height: 172,
    width: '100%',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  trait: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  traitLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    width: 68,
  },
  traitScore: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
    width: 42,
  },
  traits: {
    gap: 6,
  },
});
