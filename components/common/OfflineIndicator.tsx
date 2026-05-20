import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useConnectivity } from '@/hooks/useConnectivity';

export function OfflineIndicator(): JSX.Element {
  const { isOnline, isChecking } = useConnectivity();
  const color = isOnline ? colors.success : colors.danger;
  const label = isChecking ? 'Verificando' : isOnline ? 'Online' : 'Offline · dados salvos';

  return (
    <View style={[styles.container, { borderColor: `${color}44`, backgroundColor: `${color}12` }]}>
      <MaterialCommunityIcons name={(isOnline ? 'wifi' : 'wifi-off') as never} size={14} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  label: {
    fontFamily: fonts.heading,
    fontSize: 11,
  },
});
