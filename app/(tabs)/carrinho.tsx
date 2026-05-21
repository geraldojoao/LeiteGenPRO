import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FavoriteTouroCartItem } from '@/components/catalog/FavoriteTouroCartItem';
import { EmptyState } from '@/components/common/EmptyState';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useFavoriteTouros } from '@/hooks/useFavoriteTouros';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { formatCurrency } from '@/utils/formatters';

export default function CarrinhoScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const { touros, total } = useFavoriteTouros();
  const totalEstimado = useMemo(
    () => touros.reduce((sum, touro) => sum + touro.precoPorDose, 0),
    [touros],
  );
  const columns = responsive.isUltraWide ? 3 : responsive.isDesktop ? 2 : 1;
  const cardWidth = columns > 1 ? (responsive.contentWidth - spacing.md * (columns - 1)) / columns : '100%';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          responsive.centered,
          { paddingHorizontal: responsive.horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, responsive.isMobile && styles.headerStack]}>
          <View style={styles.headingText}>
            <Text style={styles.eyebrow}>Favoritos</Text>
            <Text style={styles.title}>Touros escolhidos</Text>
            <Text style={styles.subtitle}>Use como um carrinho simples antes de finalizar o pedido.</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons name="cart-heart" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryValue}>{total}</Text>
              <Text style={styles.summaryLabel}>{total === 1 ? 'touro escolhido' : 'touros escolhidos'}</Text>
            </View>
          </View>
        </View>

        {total > 0 ? (
          <>
            <View style={[styles.totalPanel, responsive.isNarrow && styles.totalPanelStack]}>
              <View>
                <Text style={styles.totalLabel}>Soma das doses escolhidas</Text>
                <Text style={styles.totalValue}>{formatCurrency(totalEstimado)}</Text>
              </View>
              <View style={[styles.totalActions, responsive.isNarrow && styles.totalActionsStack]}>
                <Pressable
                  accessibilityLabel="Voltar para buscar mais touros"
                  onPress={() => router.push('/busca')}
                  style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
                >
                  <MaterialCommunityIcons name="magnify" size={18} color={colors.primary} />
                  <Text style={styles.secondaryText}>Ver mais touros</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel="Finalizar pedido"
                  onPress={() => router.push('/checkout' as never)}
                  style={({ pressed }) => [styles.checkoutButton, pressed && styles.pressed]}
                >
                  <MaterialCommunityIcons name="check-circle-outline" size={20} color={colors.surface} />
                  <Text style={styles.checkoutText}>Finalizar pedido</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.list, columns > 1 && styles.listGrid]}>
              {touros.map((touro) => (
                <FavoriteTouroCartItem key={touro.id} touro={touro} cardWidth={cardWidth} />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="cart-outline"
              title="Nenhum touro escolhido"
              message="Toque no coração de um touro para montar sua lista."
            />
            <Pressable
              accessibilityLabel="Ver touros recomendados"
              onPress={() => router.push('/busca')}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="magnify" size={18} color={colors.surface} />
              <Text style={styles.primaryText}>Ver touros recomendados</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: 110,
    paddingTop: spacing.lg,
  },
  checkoutButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: spacing.lg,
  },
  checkoutText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  emptyWrap: {
    alignItems: 'center',
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headerStack: {
    flexDirection: 'column',
  },
  headingText: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  list: {
    gap: spacing.md,
  },
  listGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pressed: {
    opacity: 0.84,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: spacing.lg,
  },
  primaryText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}25`,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: spacing.lg,
  },
  secondaryText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 680,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 166,
    padding: spacing.md,
    ...shadows.soft,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: 2,
  },
  summaryValue: {
    color: colors.primary,
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 0,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.display,
    fontSize: 32,
    letterSpacing: 0,
  },
  totalLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  totalActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  totalActionsStack: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  totalPanel: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.md,
    ...shadows.soft,
  },
  totalPanelStack: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  totalValue: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 24,
    marginTop: 2,
  },
});
