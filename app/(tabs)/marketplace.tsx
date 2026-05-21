import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouraoCard } from '@/components/catalog/TouraoCard';
import { CartShortcut } from '@/components/common/CartShortcut';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useCatalogStore } from '@/store/catalogStore';
import { formatCurrency, formatKg } from '@/utils/formatters';
import type { Touro } from '@/types';

interface CentralResumo {
  nome: string;
  logo: string;
  website: string;
  touros: Touro[];
  precoMinimo: number;
  precoMaximo: number;
  especialidade: string;
}

export default function MarketplaceScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const catalogo = useCatalogStore((state) => state.catalogo);
  const centrais = useMemo(() => agruparCentrais(catalogo), [catalogo]);
  const [centralSelecionada, setCentralSelecionada] = useState<string | null>(null);
  const tourosFiltrados = useMemo(() => {
    if (!centralSelecionada) {
      return [...catalogo].sort((a, b) => b.pta - a.pta).slice(0, 5);
    }

    return catalogo.filter((touro) => touro.central.nome === centralSelecionada).sort((a, b) => b.pta - a.pta);
  }, [catalogo, centralSelecionada]);
  const comparativo = tourosFiltrados.slice(0, 3);
  const centralColumns = responsive.isUltraWide ? 4 : responsive.isDesktop ? 3 : responsive.contentWidth < 440 ? 1 : 2;
  const centralCardWidth = (responsive.contentWidth - spacing.md * (centralColumns - 1)) / centralColumns;
  const listColumns = responsive.isUltraWide ? 3 : responsive.isDesktop ? 2 : 1;
  const listCardWidth =
    listColumns > 1 ? (responsive.contentWidth - spacing.md * (listColumns - 1)) / listColumns : '100%';
  const tableWidth = Math.max(responsive.contentWidth, responsive.isMobile ? 540 : 720);

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
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Catálogo</Text>
            <Text style={styles.title}>Touros por central</Text>
            <Text style={styles.subtitle}>
              Veja preços e touros disponíveis nas principais centrais.
            </Text>
          </View>
          <CartShortcut compact={responsive.isNarrow} />
        </View>

        <View style={styles.centralGrid}>
          {centrais.map((central) => {
            const active = centralSelecionada === central.nome;
            return (
              <Pressable
                accessibilityLabel={`Ver touros da central ${central.nome}`}
                key={central.nome}
                onPress={() => setCentralSelecionada(active ? null : central.nome)}
                style={[styles.centralCard, { width: centralCardWidth }, active && styles.centralCardActive]}
              >
                <View style={styles.centralHeader}>
                  <View style={styles.logo}>
                    <Text style={styles.logoText}>{central.logo}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name={(active ? 'check-circle' : 'arrow-right-circle-outline') as never}
                    size={22}
                    color={active ? colors.success : colors.primary}
                  />
                </View>
                <Text style={styles.centralName}>{central.nome}</Text>
                <Text style={styles.centralMeta}>{central.touros.length} touros disponíveis</Text>
                <Text style={styles.centralPrice}>
                  {formatCurrency(central.precoMinimo)} a {formatCurrency(central.precoMaximo)}
                </Text>
                <Text style={styles.specialty}>Especialidade: {central.especialidade}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.sectionHeader, responsive.isMobile && styles.sectionHeaderStack]}>
          <View>
            <Text style={styles.sectionTitle}>Comparação simples</Text>
            <Text style={styles.sectionSubtitle}>O melhor de cada linha aparece em verde</Text>
          </View>
          {centralSelecionada && (
            <Pressable accessibilityLabel="Limpar filtro de central" onPress={() => setCentralSelecionada(null)} style={styles.clearPill}>
              <Text style={styles.clearText}>Todas</Text>
            </Pressable>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ComparativoTable touros={comparativo} tableWidth={tableWidth} />
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{centralSelecionada ?? 'Touros em destaque'}</Text>
            <Text style={styles.sectionSubtitle}>Toque no card para ver detalhes</Text>
          </View>
        </View>

        <View style={[styles.list, responsive.isDesktop && styles.listGrid]}>
          {tourosFiltrados.map((touro) => (
            <TouraoCard key={touro.id} touro={touro} cardWidth={listCardWidth} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function agruparCentrais(catalogo: Touro[]): CentralResumo[] {
  const map = new Map<string, Touro[]>();
  catalogo.forEach((touro) => {
    const current = map.get(touro.central.nome) ?? [];
    map.set(touro.central.nome, [...current, touro]);
  });

  return Array.from(map.entries()).map(([nome, touros]) => {
    const precos = touros.map((touro) => touro.precoPorDose);
    const contagemRacas = touros.reduce<Record<string, number>>((acc, touro) => {
      acc[touro.raca] = (acc[touro.raca] ?? 0) + 1;
      return acc;
    }, {});
    const especialidade =
      Object.entries(contagemRacas).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Catálogo misto';

    return {
      nome,
      logo: touros[0]?.central.logo ?? nome.slice(0, 2).toUpperCase(),
      website: touros[0]?.central.website ?? '',
      touros,
      precoMinimo: Math.min(...precos),
      precoMaximo: Math.max(...precos),
      especialidade,
    };
  });
}

function ComparativoTable({ touros, tableWidth }: { touros: Touro[]; tableWidth: number }): JSX.Element {
  const best = {
    pta: Math.max(...touros.map((touro) => touro.pta)),
    acuracia: Math.max(...touros.map((touro) => touro.acuracia)),
    preco: Math.min(...touros.map((touro) => touro.precoPorDose)),
    ubere: Math.max(...touros.map((touro) => touro.fenotipo.compostoUbere)),
    adaptacao: Math.max(...touros.map((touro) => touro.biomas.length)),
  };

  return (
    <View style={[styles.table, { width: tableWidth }]}>
      <View style={styles.tableHeader}>
      <Text style={[styles.tableCell, styles.rowLabel]}>Informação</Text>
        {touros.map((touro) => (
          <Text key={touro.id} numberOfLines={2} style={styles.tableHeaderCell}>
            {touro.nome}
          </Text>
        ))}
      </View>
      <TableRow label="Mais leite" values={touros.map((touro) => formatKg(touro.pta))} winners={touros.map((touro) => touro.pta === best.pta)} />
      <TableRow
        label="Confiança"
        values={touros.map((touro) => `${touro.acuracia}%`)}
        winners={touros.map((touro) => touro.acuracia === best.acuracia)}
      />
      <TableRow
        label="Preço"
        values={touros.map((touro) => formatCurrency(touro.precoPorDose))}
        winners={touros.map((touro) => touro.precoPorDose === best.preco)}
      />
      <TableRow
        label="Corpo"
        values={touros.map((touro) => `${touro.fenotipo.compostoUbere}/9`)}
        winners={touros.map((touro) => touro.fenotipo.compostoUbere === best.ubere)}
      />
      <TableRow
        label="Adaptação"
        values={touros.map((touro) => `${touro.biomas.length} biomas`)}
        winners={touros.map((touro) => touro.biomas.length === best.adaptacao)}
      />
    </View>
  );
}

function TableRow({ label, values, winners }: { label: string; values: string[]; winners: boolean[] }): JSX.Element {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.rowLabel]}>{label}</Text>
      {values.map((value, index) => (
        <Text key={`${label}-${value}-${index}`} style={[styles.tableCell, winners[index] && styles.winner]}>
          {value}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  centralCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    ...shadows.soft,
  },
  centralCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  centralGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  centralHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centralMeta: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  centralName: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  centralPrice: {
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  clearPill: {
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  clearText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  container: {
    gap: spacing.lg,
    paddingBottom: 110,
  },
  eyebrow: {
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: 12,
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
  headerText: {
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
  logo: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: 44,
    justifyContent: 'center',
    width: 50,
  },
  logoText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  rowLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.heading,
    width: 88,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeaderStack: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 20,
  },
  specialty: {
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  table: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.soft,
  },
  tableCell: {
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    textAlign: 'center',
  },
  tableHeader: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
  },
  tableHeaderCell: {
    color: colors.surface,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 11,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    textAlign: 'center',
  },
  tableRow: {
    borderColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.display,
    fontSize: 30,
    letterSpacing: 0,
  },
  winner: {
    color: colors.success,
    fontFamily: fonts.heading,
  },
});
