import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterDrawer } from '@/components/catalog/FilterDrawer';
import { TouraoCard } from '@/components/catalog/TouraoCard';
import { CartShortcut } from '@/components/common/CartShortcut';
import { EmptyState } from '@/components/common/EmptyState';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { PESOS_PADRAO } from '@/constants/domain';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useCatalogStore } from '@/store/catalogStore';
import { OrdenacaoBusca, useFilterStore } from '@/store/filterStore';
import { rankearTouros } from '@/utils/catalog';

const sortingOptions: { key: OrdenacaoBusca; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'score', label: 'Score', icon: 'chart-line' },
  { key: 'pta', label: 'PTA', icon: 'water-plus' },
  { key: 'preco', label: 'Preço', icon: 'cash' },
];

export default function BuscaScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const catalogo = useCatalogStore((state) => state.catalogo);
  const filtros = useFilterStore((state) => state.filtros);
  const ordenacao = useFilterStore((state) => state.ordenacao);
  const setOrdenacao = useFilterStore((state) => state.setOrdenacao);
  const pesos = filtros.pesosPersonalizados ?? PESOS_PADRAO;

  useEffect(() => {
    setIsFiltering(true);
    const timeout = setTimeout(() => setIsFiltering(false), 320);
    return () => clearTimeout(timeout);
  }, [filtros, ordenacao, query]);

  const resultados = useMemo(() => {
    const rankeados = rankearTouros(catalogo, filtros, ordenacao, pesos);
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return rankeados;
    }

    return rankeados.filter(({ touro }) =>
      [touro.nome, touro.registro, touro.raca, touro.central.nome].some((field) =>
        field.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [catalogo, filtros, ordenacao, pesos, query]);

  const openFilters = useCallback(() => setDrawerVisible(true), []);
  const closeFilters = useCallback(() => setDrawerVisible(false), []);
  const resultColumns = responsive.isUltraWide ? 3 : responsive.isDesktop ? 2 : 1;
  const resultCardWidth =
    resultColumns > 1 ? (responsive.contentWidth - spacing.md * (resultColumns - 1)) / resultColumns : '100%';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.header,
          responsive.centered,
          { paddingHorizontal: responsive.horizontalPadding },
          responsive.isMobile && styles.headerStack,
        ]}
      >
        <View>
          <Text style={styles.eyebrow}>Busca Avançada</Text>
          <Text style={[styles.title, responsive.isDesktop && styles.titleDesktop]}>
            Seleção genética com ROI e clima
          </Text>
        </View>
        <View style={styles.headerActions}>
          <CartShortcut compact={responsive.isNarrow} />
          <OfflineIndicator />
        </View>
      </View>

      <View
        style={[
          styles.searchRow,
          responsive.centered,
          { paddingHorizontal: responsive.horizontalPadding },
          responsive.isNarrow && styles.searchRowStack,
        ]}
      >
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            accessibilityLabel="Buscar touro por nome, registro, raça ou central"
            onChangeText={setQuery}
            placeholder="Nome, registro, raça ou central"
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
            value={query}
          />
        </View>
        <Pressable accessibilityLabel="Abrir filtros avançados" onPress={openFilters} style={styles.filterButton}>
          <MaterialCommunityIcons name="tune-variant" size={22} color={colors.surface} />
        </Pressable>
      </View>

      <View style={[styles.sortRow, responsive.centered, { paddingHorizontal: responsive.horizontalPadding }]}>
        {sortingOptions.map((option) => {
          const active = ordenacao === option.key;
          return (
            <Pressable
              accessibilityLabel={`Ordenar por ${option.label}`}
              key={option.key}
              onPress={() => setOrdenacao(option.key)}
              style={[styles.sortButton, active && styles.sortButtonActive]}
            >
              <MaterialCommunityIcons name={option.icon} size={16} color={active ? colors.surface : colors.primary} />
              <Text style={[styles.sortText, active && styles.sortTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={[
          styles.summary,
          {
            alignSelf: 'center',
            maxWidth: responsive.contentWidth,
            width: '100%',
          },
        ]}
      >
        <Text style={styles.summaryText}>
          {resultados.length} {resultados.length === 1 ? 'touro encontrado' : 'touros encontrados'}
        </Text>
        <Text style={styles.summarySubtext}>Ordenação por {sortingOptions.find((item) => item.key === ordenacao)?.label}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.list,
          responsive.centered,
          { paddingHorizontal: responsive.horizontalPadding },
          responsive.isDesktop && styles.listGrid,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isFiltering ? (
          <>
            <SkeletonCard cardWidth={resultCardWidth} />
            <SkeletonCard cardWidth={resultCardWidth} />
            <SkeletonCard cardWidth={resultCardWidth} />
          </>
        ) : resultados.length ? (
          resultados.map(({ touro, score, bonusClimatico }) => (
            <TouraoCard
              key={touro.id}
              touro={touro}
              score={score}
              bonusClimatico={bonusClimatico}
              cardWidth={resultCardWidth}
            />
          ))
        ) : (
          <EmptyState
            icon="filter"
            title="Nenhum touro passou pelos filtros"
            message="Relaxe a acurácia mínima, amplie os biomas ou aumente o preço máximo para ver mais alternativas."
          />
        )}
      </ScrollView>

      <FilterDrawer visible={drawerVisible} onClose={closeFilters} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: 50,
    justifyContent: 'center',
    width: 50,
    ...shadows.soft,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  headerStack: {
    flexDirection: 'column',
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  list: {
    gap: spacing.md,
    paddingBottom: 110,
    paddingTop: spacing.lg,
  },
  listGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadows.soft,
  },
  searchInput: {
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    paddingVertical: 13,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  searchRowStack: {
    flexDirection: 'column',
  },
  sortButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  sortText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  sortTextActive: {
    color: colors.surface,
  },
  summary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  summarySubtext: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 2,
  },
  summaryText: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 15,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
    marginTop: 3,
    maxWidth: 250,
  },
  titleDesktop: {
    maxWidth: 720,
  },
});
