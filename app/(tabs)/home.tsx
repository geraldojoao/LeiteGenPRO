import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon, AppIconName } from '@/components/common/AppIcon';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useCatalogStore } from '@/store/catalogStore';
import { useMatrizStore } from '@/store/matrizStore';
import { formatNumber } from '@/utils/formatters';
import type { Matriz } from '@/types';

type QuickAction = {
  title: string;
  subtitle: string;
  icon: AppIconName;
  route: string;
};

type FieldAlert = {
  title: string;
  message: string;
  count: number;
  tone: 'danger' | 'warning' | 'success';
};

const quickActions: QuickAction[] = [
  {
    title: 'Ver rebanho',
    subtitle: 'Lista simples dos animais',
    icon: 'users',
    route: '/plantel?filtro=todos',
  },
  {
    title: 'Ver touros',
    subtitle: 'Touros bons para leite',
    icon: 'check-circle-2',
    route: '/busca',
  },
];

export default function HomeScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const matrizes = useMatrizStore((state) => state.matrizes);
  const catalogo = useCatalogStore((state) => state.catalogo);

  const vacasEmLeite = useMemo(() => matrizes.filter((matriz) => matriz.status === 'Ativa'), [matrizes]);
  const vacasSecas = useMemo(() => matrizes.filter((matriz) => matriz.status === 'Seca'), [matrizes]);
  const precisamOlhar = useMemo(() => matrizes.filter(precisaDeAtencao), [matrizes]);
  const producaoHoje = useMemo(
    () => vacasEmLeite.reduce((total, matriz) => total + matriz.producaoMediaLitros / 305, 0),
    [vacasEmLeite],
  );
  const alerta = useMemo(() => montarAlerta(matrizes, precisamOlhar.length), [matrizes, precisamOlhar.length]);

  const contentWidth = Math.min(responsive.contentWidth, 820);
  const useTwoColumns = contentWidth >= 560;
  const quickCardWidth = useTwoColumns ? (contentWidth - spacing.md) / 2 : '100%';
  const summaryCardWidth = contentWidth >= 680 ? (contentWidth - spacing.md * 2) / 3 : '100%';
  const primaryLabel = 'Ver touros recomendados';
  const alertCardStyle =
    alerta.tone === 'danger' ? styles.dangerAlert : alerta.tone === 'warning' ? styles.warningAlert : styles.successAlert;
  const alertIconStyle =
    alerta.tone === 'danger' ? styles.dangerIcon : alerta.tone === 'warning' ? styles.warningIcon : styles.successIcon;
  const alertColor = alerta.tone === 'danger' ? colors.danger : alerta.tone === 'warning' ? colors.warning : colors.success;
  const mainRebanhoRoute = alerta.count > 0 ? '/plantel?filtro=alertas' : '/plantel?filtro=todos';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          responsive.centered,
          { maxWidth: 860, paddingHorizontal: responsive.horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIcon}>
              <AppIcon name="droplets" size={30} color={colors.surface} strokeWidth={2.4} />
            </View>
            <View style={styles.signalPill}>
              <Text style={styles.signalPillText}>Simples e rápido</Text>
            </View>
          </View>

          <Text style={styles.greeting}>Bom dia, João</Text>
          <Text style={styles.heroTitle}>Fazenda Boa Vista</Text>
          <Text style={styles.heroSubtitle}>Escolha touros que ajudam a aumentar o leite e melhorar o rebanho.</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
          onPress={() => router.push('/busca' as never)}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <AppIcon name="search" size={26} color={colors.surface} strokeWidth={2.6} />
          <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${alerta.title}. ${alerta.message}`}
          onPress={() => router.push(mainRebanhoRoute as never)}
          style={({ pressed }) => [styles.alertCard, alertCardStyle, pressed && styles.pressed]}
        >
          <View style={[styles.alertIcon, alertIconStyle]}>
            <AppIcon
              name={alerta.tone === 'success' ? 'check-circle-2' : 'alert-triangle'}
              size={28}
              color={alertColor}
              strokeWidth={2.5}
            />
          </View>
          <View style={styles.alertText}>
            <Text style={styles.alertTitle}>{alerta.title}</Text>
            <Text style={styles.alertMessage}>{alerta.message}</Text>
          </View>
          <AppIcon name="chevron-right" size={24} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso rápido</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${action.title}. ${action.subtitle}`}
                key={action.title}
                onPress={() => router.push(action.route as never)}
                style={({ pressed }) => [styles.quickCard, { width: quickCardWidth }, pressed && styles.pressed]}
              >
                <View style={styles.quickIcon}>
                  <AppIcon name={action.icon} size={26} color={colors.primary} strokeWidth={2.5} />
                </View>
                <View style={styles.quickText}>
                  <Text style={styles.quickTitle}>{action.title}</Text>
                  <Text style={styles.quickSubtitle}>{action.subtitle}</Text>
                </View>
                <AppIcon name="chevron-right" size={22} color={colors.textPrimary} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meu rebanho hoje</Text>
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="users"
              label="Animais"
              onPress={() => router.push('/plantel?filtro=todos' as never)}
              value={String(matrizes.length)}
              width={summaryCardWidth}
            />
            <SummaryCard
              icon="droplets"
              label="Vacas em leite"
              onPress={() => router.push('/plantel?filtro=em-leite' as never)}
              value={String(vacasEmLeite.length)}
              width={summaryCardWidth}
            />
            <SummaryCard
              icon={precisamOlhar.length ? 'alert-triangle' : 'check-circle-2'}
              label="Precisam olhar"
              onPress={() => router.push('/plantel?filtro=alertas' as never)}
              tone={precisamOlhar.length ? 'danger' : 'success'}
              value={String(precisamOlhar.length)}
              width={summaryCardWidth}
            />
          </View>
        </View>

        <View style={styles.simpleInfoCard}>
          <View style={styles.simpleInfoTextBlock}>
            <Text style={styles.simpleInfoTitle}>{formatNumber(producaoHoje, 1)} litros hoje</Text>
            <Text style={styles.simpleInfoText}>
              {vacasEmLeite.length} em leite, {vacasSecas.length} seca{vacasSecas.length === 1 ? '' : 's'} e {catalogo.length} touros no catálogo.
            </Text>
          </View>
          <AppIcon name="bar-chart-3" size={30} color={colors.primary} strokeWidth={2.4} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({
  icon,
  label,
  onPress,
  value,
  width,
  tone = 'primary',
}: {
  icon: AppIconName;
  label: string;
  onPress: () => void;
  value: string;
  width: number | '100%';
  tone?: 'primary' | 'danger' | 'success';
}): JSX.Element {
  const toneColor = tone === 'danger' ? colors.danger : tone === 'success' ? colors.success : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${label} no rebanho`}
      onPress={onPress}
      style={({ pressed }) => [styles.summaryCard, { width }, pressed && styles.pressed]}
    >
      <View style={[styles.summaryIcon, { backgroundColor: `${toneColor}14` }]}>
        <AppIcon name={icon} size={26} color={toneColor} strokeWidth={2.5} />
      </View>
      <View style={styles.summaryText}>
        <Text style={[styles.summaryValue, { color: toneColor }]}>{value}</Text>
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

function precisaDeAtencao(matriz: Matriz): boolean {
  return matriz.intervaloEntrePartosDias > 420 || (matriz.fenotipo.pernasEPes ?? 9) <= 5 || matriz.status === 'Descarte';
}

function montarAlerta(matrizes: Matriz[], totalAlertas: number): FieldAlert {
  if (!matrizes.length) {
    return {
      title: 'Comece pelo rebanho',
      message: 'Cadastre o primeiro animal para receber avisos simples.',
      count: 0,
      tone: 'warning',
    };
  }

  if (totalAlertas > 0) {
    const animalLabel = totalAlertas === 1 ? 'animal' : 'animais';
    const verbLabel = totalAlertas === 1 ? 'precisa' : 'precisam';

    return {
      title: `${totalAlertas} ${animalLabel} ${verbLabel} de atencao`,
      message: 'Veja agora antes de seguir o trabalho do dia.',
      count: totalAlertas,
      tone: 'danger',
    };
  }

  return {
    title: 'Tudo certo por enquanto',
    message: 'Nenhum alerta importante no rebanho hoje.',
    count: 0,
    tone: 'success',
  };
}

const styles = StyleSheet.create({
  alertCard: {
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 92,
    padding: spacing.lg,
    ...shadows.soft,
  },
  alertIcon: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  alertMessage: {
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },
  alertText: {
    flex: 1,
    minWidth: 0,
  },
  alertTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 25,
  },
  container: {
    gap: spacing.xl,
    paddingBottom: 112,
    paddingTop: spacing.lg,
    width: '100%',
  },
  dangerAlert: {
    backgroundColor: colors.redSoft,
    borderColor: colors.danger,
  },
  dangerIcon: {
    backgroundColor: colors.surface,
  },
  greeting: {
    color: '#D9F99D',
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 24,
    marginTop: spacing.lg,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    overflow: 'hidden',
    padding: spacing.xl,
    ...shadows.card,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.sm,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  heroSubtitle: {
    color: colors.surface,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
    maxWidth: 620,
  },
  heroTitle: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 36,
    marginTop: spacing.xs,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  primaryButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 66,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonPressed: {
    backgroundColor: '#14532D',
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 19,
    lineHeight: 24,
  },
  quickCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 86,
    padding: spacing.lg,
    ...shadows.soft,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickIcon: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.sm,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  quickSubtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 2,
  },
  quickText: {
    flex: 1,
    minWidth: 0,
  },
  quickTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 23,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  signalPill: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  signalPillText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  simpleInfoCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minHeight: 92,
    padding: spacing.lg,
  },
  simpleInfoText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 4,
  },
  simpleInfoTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  simpleInfoTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  successAlert: {
    backgroundColor: colors.emeraldSoft,
    borderColor: colors.success,
  },
  successIcon: {
    backgroundColor: colors.surface,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 88,
    padding: spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
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
  summaryText: {
    flex: 1,
  },
  summaryValue: {
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 35,
  },
  warningAlert: {
    backgroundColor: colors.amberSoft,
    borderColor: colors.warning,
  },
  warningIcon: {
    backgroundColor: colors.surface,
  },
});
