import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { AccuracyBadge } from '@/components/catalog/AccuracyBadge';
import { RoiCalculator } from '@/components/catalog/RoiCalculator';
import { SemenBadge } from '@/components/catalog/SemenBadge';
import { SpiderChart } from '@/components/catalog/SpiderChart';
import { EmptyState } from '@/components/common/EmptyState';
import { BIOMAS } from '@/constants/domain';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { analisarSemen } from '@/logic/semenViability';
import { useCatalogStore } from '@/store/catalogStore';
import { formatCurrency, formatKg, formatNumber } from '@/utils/formatters';
import type { Bioma, Touro } from '@/types';

interface DepRowData {
  label: string;
  value: string;
  accuracy: number;
  classification: string;
  meaning: string;
  favorable?: boolean;
}

export default function TouroDetailsScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const { id } = useLocalSearchParams<{ id: string }>();
  const catalogo = useCatalogStore((state) => state.catalogo);
  const touro = useMemo(() => catalogo.find((item) => item.id === id), [catalogo, id]);

  if (!touro) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <EmptyState
            icon="alert-circle-outline"
            title="Touro não encontrado"
            message="O catálogo local não possui esse touro. Atualize os dados ou volte para a busca."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          responsive.centered,
          { paddingHorizontal: responsive.horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Hero touro={touro} isNarrow={responsive.isNarrow} isDesktop={responsive.isDesktop} />
        <SimpleSummary touro={touro} />
        <SpiderChart touro={touro} />
        <DepTable touro={touro} contentWidth={responsive.contentWidth} />
        <SemenQuality touro={touro} />
        <ClimateSection touro={touro} />
        <RoiCalculator touro={touro} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Hero({ touro, isNarrow, isDesktop }: { touro: Touro; isNarrow: boolean; isDesktop: boolean }): JSX.Element {
  return (
    <ImageBackground
      source={{ uri: touro.foto }}
      resizeMode="cover"
      style={[styles.hero, isNarrow && styles.heroNarrow, isDesktop && styles.heroDesktop]}
    >
      <LinearGradient colors={['rgba(0,0,0,0.04)', 'rgba(0,0,0,0.76)']} style={StyleSheet.absoluteFill} />
      <View style={[styles.heroTop, isNarrow && styles.heroTopStack]}>
        <View style={styles.centralBadge}>
          <Text style={styles.centralLogo}>{touro.central.logo}</Text>
          <Text style={styles.centralText}>{touro.central.nome}</Text>
        </View>
        <SemenBadge tipo={touro.tipoSemen} alerta={touro.qualidadeSemen.alerta} />
      </View>
      <View style={styles.heroContent}>
        <Text style={[styles.heroName, isNarrow && styles.heroNameNarrow, isDesktop && styles.heroNameDesktop]}>
          {touro.nome}
        </Text>
        <Text style={styles.heroMeta}>
          {touro.raca} · {touro.registro} · nasc. {touro.nascimento}
        </Text>
        <AccuracyBadge nivel={touro.nivelRisco} acuracia={touro.acuracia} />
        <Text style={styles.heroDescription}>{touro.descricao}</Text>
        <View style={[styles.heroMetrics, isNarrow && styles.heroMetricsStack]}>
          <MetricPill label="Ajuda a aumentar o leite" value={formatKg(touro.pta)} />
          <MetricPill label="Dose" value={formatCurrency(touro.precoPorDose)} />
          <MetricPill label="Corpo do animal" value={`${touro.fenotipo.compostoUbere}/9`} />
        </View>
      </View>
    </ImageBackground>
  );
}

function MetricPill({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <View style={styles.metricPill}>
      <Text style={styles.metricPillLabel}>{label}</Text>
      <Text style={styles.metricPillValue}>{value}</Text>
    </View>
  );
}

function SimpleSummary({ touro }: { touro: Touro }): JSX.Element {
  const benefits = [
    {
      icon: 'water-plus' as const,
      title: 'Mais leite',
      text: `${formatKg(touro.deps.leite)} de ajuda genética para produção.`,
      tone: colors.primary,
    },
    {
      icon: 'baby-face-outline' as const,
      title: 'Parto fácil',
      text: `${touro.deps.facilidadeParto}% de facilidade esperada.`,
      tone: colors.success,
    },
    {
      icon: 'heart-plus-outline' as const,
      title: 'Bezerras fortes',
      text: touro.tipoSemen === 'Sexado Fêmea' ? 'Boa opção para gerar mais fêmeas.' : 'Boa estrutura para melhorar filhas.',
      tone: colors.warning,
    },
  ];

  return (
    <View style={styles.summaryCard}>
      <View>
        <Text style={styles.summaryEyebrow}>Resumo simples</Text>
        <Text style={styles.summaryTitle}>Por que escolher este touro?</Text>
      </View>
      <View style={styles.summaryGrid}>
        {benefits.map((benefit) => (
          <View key={benefit.title} style={styles.summaryBenefit}>
            <View style={[styles.summaryBenefitIcon, { backgroundColor: `${benefit.tone}14` }]}>
              <MaterialCommunityIcons name={benefit.icon} size={25} color={benefit.tone} />
            </View>
            <Text style={styles.summaryBenefitTitle}>{benefit.title}</Text>
            <Text style={styles.summaryBenefitText}>{benefit.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DepTable({ touro, contentWidth }: { touro: Touro; contentWidth: number }): JSX.Element {
  const [selected, setSelected] = useState<string | null>(null);
  const tableWidth = Math.max(contentWidth, contentWidth < 520 ? 560 : 680);
  const rows: DepRowData[] = [
    {
      label: 'Ajuda a aumentar o leite',
      value: formatKg(touro.deps.leite),
      accuracy: touro.acuracia,
      classification: touro.deps.leite > 1000 ? 'Topo 10%' : touro.deps.leite > 700 ? 'Acima da média' : 'Média',
      meaning: 'Mostra quanto este touro pode ajudar na produção de leite das filhas.',
      favorable: touro.deps.leite > 700,
    },
    {
      label: 'Gordura do leite',
      value: formatKg(touro.deps.gordura),
      accuracy: Math.max(touro.acuracia - 2, 40),
      classification: touro.deps.gordura > 35 ? 'Acima da média' : 'Média',
      meaning: 'Indica potencial de sólidos e melhora remuneração em programas por qualidade.',
      favorable: touro.deps.gordura > 30,
    },
    {
      label: 'Proteína do leite',
      value: formatKg(touro.deps.proteina),
      accuracy: Math.max(touro.acuracia - 4, 40),
      classification: touro.deps.proteina > 32 ? 'Acima da média' : 'Média',
      meaning: 'Importante para rendimento industrial e produção de derivados.',
      favorable: touro.deps.proteina > 28,
    },
    {
      label: 'Tempo produzindo',
      value: `${formatNumber(touro.deps.vidaProdutiva, 1)} mes`,
      accuracy: Math.max(touro.acuracia - 9, 40),
      classification: touro.deps.vidaProdutiva > 2 ? 'Acima da média' : 'Média',
      meaning: 'Quanto maior, maior a chance das filhas permanecerem produtivas no rebanho.',
      favorable: touro.deps.vidaProdutiva > 2,
    },
    {
      label: 'Saúde do úbere',
      value: formatNumber(touro.deps.celulaSomatica, 2),
      accuracy: Math.max(touro.acuracia - 13, 40),
      classification: touro.deps.celulaSomatica < 0 ? 'Favorável' : 'Atenção',
      meaning: 'Valores menores sugerem melhor saúde de úbere e menor risco de mastite.',
      favorable: touro.deps.celulaSomatica < 0,
    },
    {
      label: 'Parto fácil',
      value: `${touro.deps.facilidadeParto}%`,
      accuracy: touro.acuracia,
      classification: touro.deps.facilidadeParto >= 90 ? 'Excelente' : 'Boa',
      meaning: 'Maior percentual reduz risco de assistência ao parto, especialmente em novilhas.',
      favorable: touro.deps.facilidadeParto >= 87,
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Dados técnicos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.depTable, { minWidth: tableWidth }]}>
          <View style={styles.depHeader}>
            <Text style={[styles.depCell, styles.depTrait]}>Informação</Text>
            <Text style={styles.depCell}>Valor</Text>
            <Text style={styles.depCell}>Confiança</Text>
            <Text style={styles.depCell}>Resultado</Text>
          </View>
          {rows.map((row) => (
            <View key={row.label}>
              <Pressable
                accessibilityLabel={`Explicar ${row.label}`}
                onPress={() => setSelected(selected === row.label ? null : row.label)}
                style={styles.depRow}
              >
                <Text style={[styles.depCell, styles.depTrait]}>{row.label}</Text>
                <Text style={styles.depCell}>{row.value}</Text>
                <Text style={styles.depCell}>{row.accuracy}%</Text>
                <Text style={[styles.depCell, row.favorable ? styles.good : styles.warn]}>{row.classification}</Text>
              </Pressable>
              {selected === row.label && (
                <View style={styles.meaningBox}>
                  <Text style={styles.meaningTitle}>O que isso significa para você?</Text>
                  <Text style={styles.meaningText}>{row.meaning}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SemenQuality({ touro }: { touro: Touro }): JSX.Element {
  const semen = analisarSemen(touro.qualidadeSemen, touro.tipoSemen, touro.precoPorDose);

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Qualidade do sêmen</Text>
        <Text style={[styles.semenScore, semen.alerta !== 'OK' && styles.semenScoreAlert]}>{semen.scoreFinal}/100</Text>
      </View>
      <QualityRow label="Motilidade" value={touro.qualidadeSemen.motilidade} suffix="%" />
      <QualityRow label="Vigor" value={touro.qualidadeSemen.vigor} max={5} suffix="/5" />
      <QualityRow label="Qualidade da amostra" value={touro.qualidadeSemen.morfologia} suffix="%" />
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Concentração</Text>
        <Text style={styles.infoValue}>{touro.qualidadeSemen.concentracao}M/mL</Text>
      </View>
      {semen.alerta !== 'OK' && (
        <View style={styles.alertBox}>
          <MaterialCommunityIcons name="alert-octagon" size={18} color={colors.danger} />
          <Text style={styles.alertText}>
            Atenção: revise descongelamento, horário de inseminação e condição corporal antes do manejo.
          </Text>
        </View>
      )}
    </View>
  );
}

function QualityRow({
  label,
  value,
  max = 100,
  suffix,
}: {
  label: string;
  value: number;
  max?: number;
  suffix: string;
}): JSX.Element {
  const width = Math.min((value / max) * 100, 100);
  return (
    <View style={styles.qualityRow}>
      <Text style={styles.qualityLabel}>{label}</Text>
      <View style={styles.qualityTrack}>
        <View style={[styles.qualityFill, { width: `${width}%` }]} />
      </View>
      <Text style={styles.qualityValue}>{value}{suffix}</Text>
    </View>
  );
}

function ClimateSection({ touro }: { touro: Touro }): JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Onde ele se adapta melhor</Text>
      <View style={styles.mapWrap}>
        <Svg width="100%" height={220} viewBox="0 0 280 220" accessibilityLabel={`Mapa de biomas recomendados para ${touro.nome}`}>
          <Path d="M145 12 L210 28 L244 72 L231 122 L252 168 L206 206 L147 192 L92 210 L43 170 L58 118 L32 77 L76 34 Z" fill="#f7efdf" stroke={colors.border} strokeWidth={3} />
          <Rect x={70} y={52} width={76} height={54} rx={10} fill={biomaColor('Amazônia', touro.biomas)} />
          <Rect x={123} y={90} width={78} height={56} rx={10} fill={biomaColor('Cerrado', touro.biomas)} />
          <Rect x={176} y={130} width={48} height={45} rx={10} fill={biomaColor('Tropical Úmido', touro.biomas)} />
          <Rect x={78} y={125} width={57} height={46} rx={10} fill={biomaColor('Pantanal', touro.biomas)} />
          <Rect x={151} y={151} width={48} height={39} rx={10} fill={biomaColor('Sul/Frio', touro.biomas)} />
          <Rect x={176} y={72} width={42} height={43} rx={10} fill={biomaColor('Semiárido', touro.biomas)} />
          <SvgText x={94} y={84} fontSize="10" fontWeight="700" fill={colors.textPrimary}>Amazônia</SvgText>
          <SvgText x={148} y={122} fontSize="10" fontWeight="700" fill={colors.textPrimary}>Cerrado</SvgText>
          <SvgText x={180} y={156} fontSize="10" fontWeight="700" fill={colors.textPrimary}>Úmido</SvgText>
          <SvgText x={91} y={152} fontSize="10" fontWeight="700" fill={colors.textPrimary}>Pantanal</SvgText>
          <SvgText x={161} y={174} fontSize="10" fontWeight="700" fill={colors.textPrimary}>Sul</SvgText>
          <SvgText x={181} y={96} fontSize="10" fontWeight="700" fill={colors.textPrimary}>Semi</SvgText>
        </Svg>
      </View>
      <View style={styles.biomeList}>
        {BIOMAS.map((bioma) => {
          const active = touro.biomas.includes(bioma);
          return (
            <View key={bioma} style={[styles.biomeChip, active && styles.biomeChipActive]}>
              <MaterialCommunityIcons name={(active ? 'check-circle' : 'circle-outline') as never} size={14} color={active ? colors.surface : colors.textSecondary} />
              <Text style={[styles.biomeText, active && styles.biomeTextActive]}>{bioma}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function biomaColor(bioma: Bioma, recomendados: Bioma[]): string {
  return recomendados.includes(bioma) ? `${colors.success}80` : '#eadfca';
}

const styles = StyleSheet.create({
  alertBox: {
    alignItems: 'flex-start',
    backgroundColor: colors.redSoft,
    borderColor: `${colors.danger}40`,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  alertText: {
    color: colors.danger,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  biomeChip: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  biomeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  biomeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  biomeText: {
    color: colors.textSecondary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  biomeTextActive: {
    color: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    gap: spacing.md,
    maxWidth: '100%',
    padding: spacing.lg,
    ...shadows.soft,
  },
  centralBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  centralLogo: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  centralText: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  container: {
    gap: spacing.lg,
    paddingBottom: 40,
  },
  depCell: {
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    paddingHorizontal: 4,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
  depHeader: {
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    flexDirection: 'row',
  },
  depRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  depTable: {
    maxWidth: '100%',
  },
  depTrait: {
    flex: 1.18,
    textAlign: 'left',
  },
  good: {
    color: colors.success,
    fontFamily: fonts.heading,
  },
  hero: {
    borderRadius: radii.xl,
    height: 430,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.card,
  },
  heroContent: {
    gap: spacing.md,
  },
  heroDescription: {
    color: '#eef7ee',
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 23,
  },
  heroMeta: {
    color: '#dbe8dd',
    fontFamily: fonts.body,
    fontSize: 16,
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroMetricsStack: {
    flexDirection: 'column',
  },
  heroName: {
    color: colors.surface,
    fontFamily: fonts.display,
    fontSize: 34,
    letterSpacing: 0,
  },
  heroNameDesktop: {
    fontSize: 38,
  },
  heroNameNarrow: {
    fontSize: 28,
    lineHeight: 34,
  },
  heroNarrow: {
    height: 460,
  },
  heroDesktop: {
    height: 480,
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroTopStack: {
    gap: spacing.sm,
    flexDirection: 'column',
  },
  infoLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  mapWrap: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  meaningBox: {
    backgroundColor: colors.cream,
    borderRadius: radii.sm,
    marginTop: 4,
    padding: spacing.md,
  },
  meaningText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 3,
  },
  meaningTitle: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  metricPill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radii.sm,
    flex: 1,
    padding: spacing.sm,
  },
  metricPillLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  metricPillValue: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 17,
    marginTop: 2,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  qualityFill: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 8,
  },
  qualityLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    width: 138,
  },
  qualityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  qualityTrack: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  qualityValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
    textAlign: 'right',
    width: 70,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
  },
  semenScore: {
    color: colors.success,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  semenScoreAlert: {
    color: colors.danger,
  },
  summaryBenefit: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flex: 1,
    gap: spacing.sm,
    minHeight: 146,
    minWidth: 180,
    padding: spacing.lg,
  },
  summaryBenefitIcon: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  summaryBenefitText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  summaryBenefitTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 20,
  },
  summaryCard: {
    backgroundColor: colors.emeraldSoft,
    borderColor: colors.primary,
    borderRadius: radii.sm,
    borderWidth: 2,
    gap: spacing.lg,
    padding: spacing.lg,
    ...shadows.soft,
  },
  summaryEyebrow: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 30,
    marginTop: 4,
  },
  warn: {
    color: colors.warning,
    fontFamily: fonts.heading,
  },
});
