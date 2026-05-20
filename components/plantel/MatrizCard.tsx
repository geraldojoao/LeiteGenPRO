import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { AppIcon } from '@/components/common/AppIcon';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { formatNumber } from '@/utils/formatters';
import type { Matriz, StatusMatriz } from '@/types';

interface MatrizCardProps {
  matriz: Matriz;
  onPress?: (matriz: Matriz) => void;
  cardWidth?: number | `${number}%`;
}

const statusConfig: Record<
  StatusMatriz,
  {
    color: string;
    background: string;
    helper: string;
  }
> = {
  Ativa: {
    color: colors.success,
    background: colors.emeraldSoft,
    helper: 'Pronta para manejo',
  },
  Seca: {
    color: colors.warning,
    background: colors.amberSoft,
    helper: 'Monitorar retorno',
  },
  Descarte: {
    color: colors.danger,
    background: colors.redSoft,
    helper: 'Revisar decisão',
  },
};

function getAgeInYears(birthDate: string): string {
  const parsedDate = new Date(birthDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  const today = new Date();
  const years = today.getFullYear() - parsedDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > parsedDate.getMonth() ||
    (today.getMonth() === parsedDate.getMonth() && today.getDate() >= parsedDate.getDate());

  return `${hasBirthdayPassed ? years : years - 1} anos`;
}

export function MatrizCard({ matriz, onPress, cardWidth }: MatrizCardProps): JSX.Element {
  const { width } = useWindowDimensions();
  const shouldStack = width < 420;
  const status = statusConfig[matriz.status];

  return (
    <Pressable
      accessibilityLabel={`Abrir detalhes da matriz ${matriz.nome}`}
      onPress={() => onPress?.(matriz)}
      style={({ pressed }) => [
        styles.card,
        shouldStack && styles.cardStack,
        cardWidth ? { width: cardWidth } : undefined,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.avatarWrap}>
        {matriz.fotoUrl ? (
          <Image resizeMode="cover" source={{ uri: matriz.fotoUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <AppIcon color={colors.primary} name="users" size={24} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={[styles.header, shouldStack && styles.headerStack]}>
          <View style={styles.titleBlock}>
            <Text numberOfLines={1} style={styles.name}>
              {matriz.nome}
            </Text>
            <Text numberOfLines={1} style={styles.meta}>
              Brinco {matriz.brinco} · {matriz.raca}
            </Text>
          </View>

          <View style={[styles.status, { backgroundColor: status.background, borderColor: `${status.color}33` }]}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>{matriz.status}</Text>
          </View>
        </View>

        <View style={[styles.metrics, shouldStack && styles.metricsStack]}>
          <Metric label="Produção média" value={`${formatNumber(matriz.producaoMediaLitros)} L`} icon="droplets" />
          <Metric label="Lactações" value={String(matriz.numeroLactacoes)} icon="activity" />
          <Metric label="Idade" value={getAgeInYears(matriz.nascimento)} icon="calendar-clock" />
        </View>

        <View style={[styles.footer, shouldStack && styles.footerStack]}>
          <View style={styles.helper}>
            <AppIcon color={status.color} name={matriz.status === 'Ativa' ? 'check-circle-2' : 'alert-triangle'} size={15} />
            <Text numberOfLines={1} style={[styles.helperText, { color: status.color }]}>
              {status.helper}
            </Text>
          </View>

          <View style={styles.detailsHint}>
            <Text style={styles.detailsText}>Ver detalhes</Text>
            <AppIcon color={colors.accent} name="chevron-right" size={16} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: 'activity' | 'calendar-clock' | 'droplets';
}): JSX.Element {
  return (
    <View style={styles.metric}>
      <View style={styles.metricIcon}>
        <AppIcon color={colors.primary} name={icon} size={14} />
      </View>
      <View style={styles.metricTextWrap}>
        <Text numberOfLines={1} style={styles.metricLabel}>
          {label}
        </Text>
        <Text numberOfLines={1} style={styles.metricValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  avatarWrap: {
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 76,
    overflow: 'hidden',
    width: 76,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    maxWidth: '100%',
    minWidth: 0,
    padding: spacing.lg,
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
  detailsHint: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  detailsText: {
    color: colors.accent,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  footerStack: {
    alignItems: 'flex-start',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  headerStack: {
    flexDirection: 'column',
  },
  helper: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 6,
    maxWidth: '100%',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  helperText: {
    fontFamily: fonts.heading,
    fontSize: 11,
  },
  meta: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 3,
  },
  metric: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 112,
    padding: spacing.sm,
  },
  metricIcon: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 11,
  },
  metricTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  metricValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 14,
    marginTop: 1,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricsStack: {
    flexDirection: 'column',
  },
  name: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.995 }],
  },
  status: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  statusDot: {
    borderRadius: radii.pill,
    height: 7,
    width: 7,
  },
  statusText: {
    fontFamily: fonts.heading,
    fontSize: 11,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
});
