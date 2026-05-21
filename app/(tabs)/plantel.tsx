import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouraoCard } from '@/components/catalog/TouraoCard';
import { AppIcon, type AppIconName } from '@/components/common/AppIcon';
import { CartShortcut } from '@/components/common/CartShortcut';
import { EmptyState } from '@/components/common/EmptyState';
import { MatrizCard } from '@/components/plantel/MatrizCard';
import { MatrizForm } from '@/components/plantel/MatrizForm';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { sugerirTourosComplementares } from '@/logic/matingRecommendation';
import { useCatalogStore } from '@/store/catalogStore';
import { useMatrizStore } from '@/store/matrizStore';
import { formatDate, formatNumber } from '@/utils/formatters';
import type { Matriz, StatusMatriz } from '@/types';

const statusTheme: Record<StatusMatriz, { color: string; background: string }> = {
  Ativa: { color: colors.success, background: colors.emeraldSoft },
  Seca: { color: colors.warning, background: colors.amberSoft },
  Descarte: { color: colors.danger, background: colors.redSoft },
};

type SummaryFilter = 'todos' | 'em-leite' | 'producao' | 'alertas';

const summaryFilterLabels: Record<SummaryFilter, string> = {
  todos: 'todos',
  'em-leite': 'em leite',
  producao: 'maior producao',
  alertas: 'precisam olhar',
};

export default function PlantelScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const params = useLocalSearchParams<{ acao?: string; filtro?: string }>();
  const matrizes = useMatrizStore((state) => state.matrizes);
  const catalogo = useCatalogStore((state) => state.catalogo);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SummaryFilter>(() => parseSummaryFilter(params.filtro));
  const [formVisible, setFormVisible] = useState(false);
  const [selectedMatriz, setSelectedMatriz] = useState<Matriz | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    setActiveFilter(parseSummaryFilter(params.filtro));

    if (params.acao === 'registrar') {
      setFormVisible(true);
    }
  }, [params.acao, params.filtro]);

  const filteredMatrizes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let nextMatrizes = matrizes;

    if (activeFilter === 'em-leite') {
      nextMatrizes = nextMatrizes.filter((matriz) => matriz.status === 'Ativa');
    }

    if (activeFilter === 'alertas') {
      nextMatrizes = nextMatrizes.filter(precisaOlharMatriz);
    }

    if (normalized) {
      nextMatrizes = nextMatrizes.filter((matriz) =>
        [matriz.nome, matriz.brinco, matriz.raca].some((field) => field.toLowerCase().includes(normalized)),
      );
    }

    if (activeFilter === 'producao') {
      nextMatrizes = [...nextMatrizes].sort((a, b) => b.producaoMediaLitros - a.producaoMediaLitros);
    }

    return nextMatrizes;
  }, [activeFilter, matrizes, query]);

  const recommendations = useMemo(() => {
    if (!selectedMatriz || !showRecommendations) {
      return [];
    }

    return sugerirTourosComplementares(selectedMatriz, catalogo);
  }, [catalogo, selectedMatriz, showRecommendations]);

  const ativas = matrizes.filter((matriz) => matriz.status === 'Ativa').length;
  const secas = matrizes.filter((matriz) => matriz.status === 'Seca').length;
  const mediaPlantel =
    matrizes.reduce((sum, matriz) => sum + matriz.producaoMediaLitros, 0) / Math.max(matrizes.length, 1);
  const precisamOlhar = matrizes.filter(precisaOlharMatriz).length;
  const summaryColumns = responsive.contentWidth >= 1040 ? 4 : responsive.contentWidth >= 560 ? 2 : 1;
  const summaryCardWidth =
    summaryColumns > 1 ? (responsive.contentWidth - spacing.md * (summaryColumns - 1)) / summaryColumns : '100%';
  const matrizColumns = responsive.isUltraWide ? 3 : responsive.isDesktop ? 2 : 1;
  const recommendationColumns = responsive.isUltraWide ? 3 : responsive.isDesktop ? 2 : 1;
  const matrizCardWidth =
    matrizColumns > 1 ? (responsive.contentWidth - spacing.md * (matrizColumns - 1)) / matrizColumns : '100%';
  const recommendationCardWidth =
    recommendationColumns > 1
      ? (responsive.contentWidth - spacing.md * (recommendationColumns - 1)) / recommendationColumns
      : '100%';
  const resultLabel =
    activeFilter === 'todos'
      ? `${filteredMatrizes.length} de ${matrizes.length}`
      : `${filteredMatrizes.length} ${summaryFilterLabels[activeFilter]}`;

  function selectSummaryFilter(filter: SummaryFilter): void {
    setActiveFilter(filter);
    setQuery('');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.pageScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.pageScroller}
      >
        <View
          style={[
            styles.header,
            responsive.centered,
            { paddingHorizontal: responsive.horizontalPadding },
            responsive.isMobile && styles.headerStack,
          ]}
        >
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Animais</Text>
            <Text style={styles.title}>Rebanho</Text>
            <Text style={styles.subtitle}>Animais e alertas em poucos toques.</Text>
          </View>

          <View style={[styles.headerActions, responsive.isMobile && styles.headerActionsStack]}>
            {!responsive.isMobile && <CartShortcut />}
            <Pressable
              accessibilityLabel="Cadastrar nova matriz"
              onPress={() => setFormVisible(true)}
              style={({ pressed }) => [styles.addButton, responsive.isMobile && styles.addButtonWide, pressed && styles.pressed]}
            >
              <AppIcon color={colors.surface} name="plus" size={20} />
              <Text style={styles.addButtonText}>Registrar animal</Text>
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.summaryGrid,
            responsive.centered,
            { paddingHorizontal: responsive.horizontalPadding },
          ]}
        >
          <SummaryCard
            active={activeFilter === 'todos'}
            icon="users"
            label="Animais"
            onPress={() => selectSummaryFilter('todos')}
            supporting="Total cadastrado"
            value={String(matrizes.length)}
            width={summaryCardWidth}
          />
          <SummaryCard
            active={activeFilter === 'em-leite'}
            icon="check-circle-2"
            label="Em leite"
            onPress={() => selectSummaryFilter('em-leite')}
            supporting={`${secas} secas no momento`}
            value={String(ativas)}
            width={summaryCardWidth}
          />
          <SummaryCard
            active={activeFilter === 'producao'}
            icon="droplets"
            label="Média produtiva"
            onPress={() => selectSummaryFilter('producao')}
            supporting="Por lactação"
            value={`${formatNumber(mediaPlantel)} L`}
            width={summaryCardWidth}
          />
          <SummaryCard
            active={activeFilter === 'alertas'}
            icon="alert-triangle"
            label="Precisam olhar"
            onPress={() => selectSummaryFilter('alertas')}
            supporting="Verificar hoje"
            tone={precisamOlhar > 0 ? 'warning' : 'success'}
            value={String(precisamOlhar)}
            width={summaryCardWidth}
          />
        </View>

        <View
          style={[
            styles.toolbar,
            responsive.centered,
            { paddingHorizontal: responsive.horizontalPadding },
            responsive.isMobile && styles.toolbarStack,
          ]}
        >
          <View style={styles.searchBox}>
            <AppIcon color={colors.textSecondary} name="search" size={19} />
            <TextInput
              accessibilityLabel="Buscar matriz por brinco, nome ou raça"
              onChangeText={setQuery}
              placeholder="Buscar por nome, brinco ou raça"
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
              value={query}
            />
          </View>
          <View style={styles.resultPill}>
            <AppIcon color={colors.accent} name="filter" size={15} />
            <Text style={styles.resultText}>{resultLabel}</Text>
          </View>
        </View>

        <View
          style={[
            styles.list,
            responsive.centered,
            { paddingHorizontal: responsive.horizontalPadding },
            responsive.isDesktop && styles.listGrid,
          ]}
        >
          {filteredMatrizes.length ? (
            filteredMatrizes.map((matriz) => (
              <MatrizCard
                key={matriz.id}
                matriz={matriz}
                cardWidth={matrizCardWidth}
                onPress={(item) => {
                  setSelectedMatriz(item);
                  setShowRecommendations(false);
                }}
              />
            ))
          ) : (
            <EmptyState
              icon="cow"
              title="Nenhuma matriz encontrada"
              message="Cadastre sua primeira matriz ou ajuste a busca para continuar o acasalamento dirigido."
            />
          )}
        </View>
      </ScrollView>

      <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <SafeAreaView style={styles.modalScreen}>
          <View style={[styles.modalHeader, responsive.centered, { paddingHorizontal: responsive.horizontalPadding }]}>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalEyebrow}>Cadastro</Text>
              <Text style={styles.modalTitle}>Nova matriz</Text>
                  <Text style={styles.modalSubtitle}>Dados simples do animal e produção de leite.</Text>
            </View>
            <Pressable
              accessibilityLabel="Fechar cadastro"
              onPress={() => setFormVisible(false)}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <AppIcon color={colors.textPrimary} name="x" size={20} />
            </Pressable>
          </View>
          <View style={[styles.formWrap, responsive.centered, { paddingHorizontal: responsive.horizontalPadding }]}>
            <MatrizForm
              onCancel={() => setFormVisible(false)}
              onSaved={(matriz) => {
                setFormVisible(false);
                setSelectedMatriz(matriz);
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={Boolean(selectedMatriz)} animationType="slide" onRequestClose={() => setSelectedMatriz(null)}>
        <SafeAreaView style={styles.modalScreen}>
          {selectedMatriz && (
            <>
              <View style={[styles.modalHeader, responsive.centered, { paddingHorizontal: responsive.horizontalPadding }]}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalEyebrow}>Ficha animal</Text>
                  <Text numberOfLines={1} style={styles.modalTitle}>
                    {selectedMatriz.nome}
                  </Text>
                  <Text numberOfLines={1} style={styles.modalSubtitle}>
                    Brinco {selectedMatriz.brinco} · {selectedMatriz.raca}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Fechar detalhes da matriz"
                  onPress={() => setSelectedMatriz(null)}
                  style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
                >
                  <AppIcon color={colors.textPrimary} name="x" size={20} />
                </Pressable>
              </View>

              <ScrollView
                contentContainerStyle={[
                  styles.detailContent,
                  responsive.centered,
                  { paddingHorizontal: responsive.horizontalPadding },
                ]}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.detailHero, responsive.isNarrow && styles.detailHeroStack]}>
                  <View style={styles.detailHeroIcon}>
                    <AppIcon color={colors.primary} name="users" size={28} />
                  </View>
                  <View style={styles.detailHeroCopy}>
                    <View style={styles.detailHeroTopline}>
                      <StatusPill status={selectedMatriz.status} />
                      <Text style={styles.detailHeroMeta}>Atualizada em {formatDate(selectedMatriz.atualizadaEm)}</Text>
                    </View>
                    <Text style={styles.detailHeroTitle}>Resumo do animal</Text>
                    <Text style={styles.detailHeroText}>
                      Confira os pontos principais antes de escolher touros.
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailGrid, responsive.isDesktop && styles.detailGridDesktop]}>
                  <DetailSection icon="droplets" title="Produção">
                    <InfoRow label="Produção média" value={`${formatNumber(selectedMatriz.producaoMediaLitros)} L/lactação`} />
                    <InfoRow label="Lactações" value={String(selectedMatriz.numeroLactacoes)} />
                    <InfoRow label="Intervalo entre partos" value={`${selectedMatriz.intervaloEntrePartosDias} dias`} />
                  </DetailSection>

                  <DetailSection icon="calendar-clock" title="Cadastro">
                    <InfoRow label="Nascimento" value={formatDate(selectedMatriz.nascimento)} />
                    <InfoRow label="Situação" value={selectedMatriz.status === 'Ativa' ? 'Em leite' : selectedMatriz.status === 'Seca' ? 'Seca' : 'Separar'} />
                    <InfoRow label="Raça" value={selectedMatriz.raca} />
                  </DetailSection>

                  <DetailSection icon="activity" title="Corpo do animal">
                    <InfoRow label="Estatura" value={`${selectedMatriz.fenotipo.estatura ?? '-'} / 9`} />
                    <InfoRow label="Profundidade corporal" value={`${selectedMatriz.fenotipo.profundidadeCorporal ?? '-'} / 9`} />
                    <InfoRow label="Úbere" value={`${selectedMatriz.fenotipo.compostoUbere ?? '-'} / 9`} />
                    <InfoRow label="Pernas e pés" value={`${selectedMatriz.fenotipo.pernasEPes ?? '-'} / 9`} />
                  </DetailSection>

                  <DetailSection icon="dna" title="Genealogia">
                    {selectedMatriz.genealogia.genealogiaDesconhecida ? (
                      <Text style={styles.bodyText}>
                        Genealogia desconhecida. As sugestões usam fenótipo e desempenho observado.
                      </Text>
                    ) : (
                      <>
                        <InfoRow label="Pai" value={selectedMatriz.genealogia.pai || '-'} />
                        <InfoRow label="Mãe" value={selectedMatriz.genealogia.mae || '-'} />
                        <InfoRow label="Avô paterno" value={selectedMatriz.genealogia.avoPaterno || '-'} />
                        <InfoRow label="Avô materno" value={selectedMatriz.genealogia.avoMaterno || '-'} />
                      </>
                    )}
                  </DetailSection>
                </View>

                {selectedMatriz.observacoes ? (
                  <DetailSection icon="clipboard-list" title="Observações">
                    <Text style={styles.bodyText}>{selectedMatriz.observacoes}</Text>
                  </DetailSection>
                ) : null}

                <Pressable
                  accessibilityLabel="Sugerir touros complementares"
                  onPress={() => setShowRecommendations(true)}
                  style={({ pressed }) => [styles.recommendButton, pressed && styles.pressed]}
                >
                  <AppIcon color={colors.surface} name="dna" size={18} />
                  <Text style={styles.recommendText}>Ver touros recomendados</Text>
                </Pressable>

                {showRecommendations && (
                  <View style={[styles.recommendations, responsive.isDesktop && styles.recommendationsGrid]}>
                    <View style={styles.recommendationsHeader}>
                      <Text style={styles.sectionTitle}>Touros recomendados</Text>
                      <Text style={styles.sectionSubtitle}>Boas opções para leite, corpo do animal e parto fácil.</Text>
                    </View>

                    {recommendations.length ? (
                      recommendations.map((recommendation) => (
                        <View
                          key={recommendation.touro.id}
                          style={[styles.recommendationCard, { width: recommendationCardWidth }]}
                        >
                          <View style={styles.recommendationHeader}>
                            <View style={styles.scoreBadge}>
                              <AppIcon color={colors.accent} name="sparkles" size={14} />
                              <Text style={styles.recommendationScore}>Score {formatNumber(recommendation.score)}</Text>
                            </View>
                            <Text style={styles.recommendationReason}>{recommendation.justificativas.join(' · ')}</Text>
                          </View>
                          <TouraoCard touro={recommendation.touro} compact showTags={false} />
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyRecommendations}>
                        <AppIcon color={colors.primary} name="search" size={22} />
                        <Text style={styles.emptyRecommendationsTitle}>Nenhuma recomendação disponível</Text>
                        <Text style={styles.emptyRecommendationsText}>
                          Verifique se o catálogo possui touros compatíveis com os dados desta matriz.
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function parseSummaryFilter(value: string | string[] | undefined): SummaryFilter {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (normalized === 'em-leite' || normalized === 'producao' || normalized === 'alertas') {
    return normalized;
  }

  return 'todos';
}

function precisaOlharMatriz(matriz: Matriz): boolean {
  return matriz.intervaloEntrePartosDias > 420 || (matriz.fenotipo.pernasEPes ?? 9) <= 5 || matriz.status === 'Descarte';
}

function SummaryCard({
  active,
  label,
  value,
  supporting,
  icon,
  onPress,
  width,
  tone = 'primary',
}: {
  active: boolean;
  label: string;
  value: string;
  supporting: string;
  icon: AppIconName;
  onPress: () => void;
  width: number | '100%';
  tone?: 'primary' | 'success' | 'warning';
}): JSX.Element {
  const toneColor = tone === 'warning' ? colors.warning : tone === 'success' ? colors.success : colors.primary;
  const toneBackground = tone === 'warning' ? colors.amberSoft : colors.emeraldSoft;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Mostrar ${label}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.summaryCard,
        { width },
        active && styles.summaryCardActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.summaryIcon, { backgroundColor: toneBackground }]}>
        <AppIcon color={toneColor} name={icon} size={26} strokeWidth={2.5} />
      </View>
      <View style={styles.summaryCopy}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summarySupporting}>{supporting}</Text>
      </View>
    </Pressable>
  );
}

function StatusPill({ status }: { status: StatusMatriz }): JSX.Element {
  const theme = statusTheme[status];
  const label = status === 'Ativa' ? 'Em leite' : status === 'Seca' ? 'Seca' : 'Separar';

  return (
    <View style={[styles.statusPill, { backgroundColor: theme.background, borderColor: `${theme.color}33` }]}>
      <View style={[styles.statusDot, { backgroundColor: theme.color }]} />
      <Text style={[styles.statusPillText, { color: theme.color }]}>{label}</Text>
    </View>
  );
}

function DetailSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: AppIconName;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <View style={styles.detailCard}>
      <View style={styles.detailSectionHeader}>
        <View style={styles.detailSectionIcon}>
          <AppIcon color={colors.primary} name={icon} size={17} />
        </View>
        <Text style={styles.detailTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text numberOfLines={2} style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: spacing.lg,
    ...shadows.soft,
  },
  addButtonText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  addButtonWide: {
    width: '100%',
  },
  bodyText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  detailContent: {
    gap: spacing.md,
    paddingBottom: 64,
    paddingTop: spacing.lg,
  },
  detailGrid: {
    gap: spacing.md,
  },
  detailGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailHero: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  detailHeroCopy: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
  detailHeroIcon: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.lg,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  detailHeroMeta: {
    color: colors.textSecondary,
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  detailHeroStack: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  detailHeroText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  detailHeroTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  detailHeroTopline: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detailSectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailSectionIcon: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.pill,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  detailTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  emptyRecommendations: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.xl,
    width: '100%',
  },
  emptyRecommendationsText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 420,
    textAlign: 'center',
  },
  emptyRecommendationsTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
    textAlign: 'center',
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  formWrap: {
    flex: 1,
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  headerActionsStack: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  headerStack: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  infoLabel: {
    color: colors.textSecondary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  infoRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  infoValue: {
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
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
  modalEyebrow: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  modalHeader: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  modalHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  modalScreen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  modalSubtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  pageScroll: {
    paddingBottom: spacing.sm,
  },
  pageScroller: {
    flex: 1,
  },
  recommendationCard: {
    gap: spacing.sm,
  },
  recommendationHeader: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    ...shadows.soft,
  },
  recommendationReason: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  recommendationScore: {
    color: colors.accent,
    fontFamily: fonts.heading,
    fontSize: 13,
  },
  recommendations: {
    gap: spacing.md,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recommendationsHeader: {
    width: '100%',
  },
  recommendButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    ...shadows.soft,
  },
  recommendText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 14,
  },
  resultPill: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: spacing.md,
  },
  resultText: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scoreBadge: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: `${colors.accent}26`,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 60,
    paddingHorizontal: spacing.md,
    ...shadows.soft,
  },
  searchInput: {
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    paddingVertical: 13,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  statusDot: {
    borderRadius: radii.pill,
    height: 7,
    width: 7,
  },
  statusPill: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  statusPillText: {
    fontFamily: fonts.heading,
    fontSize: 11,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 6,
    maxWidth: 520,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 94,
    minWidth: 0,
    padding: spacing.lg,
    ...shadows.soft,
  },
  summaryCardActive: {
    backgroundColor: colors.emeraldSoft,
    borderColor: colors.primary,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  summaryIcon: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  summaryLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  summarySupporting: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 2,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 35,
    marginTop: 2,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 26,
    marginTop: 3,
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  toolbarStack: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
});
