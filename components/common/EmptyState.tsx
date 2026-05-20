import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';

interface EmptyStateProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={34} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.xl,
    ...shadows.soft,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.pill,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  message: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
    textAlign: 'center',
  },
});
