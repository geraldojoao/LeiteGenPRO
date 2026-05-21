import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import type { AlertaIATF, TipoSemen } from '@/types';

interface SemenBadgeProps {
  tipo: TipoSemen;
  alerta?: AlertaIATF;
  compact?: boolean;
}

const semenColors: Record<TipoSemen, string> = {
  'Sexado Fêmea': '#b45309',
  'Sexado Macho': '#2563eb',
  Convencional: colors.primary,
};

export function SemenBadge({ tipo, alerta = 'OK', compact = false }: SemenBadgeProps): JSX.Element {
  const isAlert = alerta !== 'OK';
  const color = isAlert ? colors.danger : semenColors[tipo];
  const label = tipo === 'Sexado Fêmea' ? 'Mais bezerras' : tipo === 'Sexado Macho' ? 'Mais bezerros' : 'Sêmen comum';

  return (
    <View style={[styles.badge, { backgroundColor: `${color}14`, borderColor: `${color}50` }]}>
      <MaterialCommunityIcons
        name={
          (isAlert
            ? 'alert-octagon'
            : tipo === 'Convencional'
              ? 'test-tube'
              : tipo === 'Sexado Macho'
                ? 'gender-male'
                : 'gender-female') as never
        }
        size={compact ? 13 : 15}
        color={color}
      />
      <Text style={[styles.text, { color }, compact && styles.compactText]}>{isAlert ? 'Atenção no manejo' : label}</Text>
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
