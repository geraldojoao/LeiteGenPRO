import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { getRiskColor, getRiskIcon } from '@/logic/accuracyClassifier';
import { fonts, radii, spacing } from '@/constants/theme';
import type { NivelRisco } from '@/types';

interface AccuracyBadgeProps {
  nivel: NivelRisco;
  acuracia?: number;
  compact?: boolean;
}

export function AccuracyBadge({ nivel, acuracia, compact = false }: AccuracyBadgeProps): JSX.Element {
  const color = getRiskColor(nivel);
  const confidenceLabel =
    typeof acuracia === 'number'
      ? `${compact ? 'Confiança' : 'Confiança da informação'} ${acuracia}%`
      : compact
        ? 'Confiança'
        : 'Confiança da informação';

  return (
    <View style={[styles.badge, { backgroundColor: `${color}18`, borderColor: `${color}55` }]}>
      <MaterialCommunityIcons name={getRiskIcon(nivel) as never} size={compact ? 13 : 15} color={color} />
      <Text style={[styles.text, { color }, compact && styles.compactText]}>{confidenceLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  text: {
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  compactText: {
    fontSize: 16,
  },
});
