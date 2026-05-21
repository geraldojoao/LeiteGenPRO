import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/common/AppIcon';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useCatalogStore } from '@/store/catalogStore';
import { useMatrizStore } from '@/store/matrizStore';
import { useFavoriteTouros } from '@/hooks/useFavoriteTouros';

export default function PerfilScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const matrizes = useMatrizStore((state) => state.matrizes);
  const catalogo = useCatalogStore((state) => state.catalogo);
  const { total } = useFavoriteTouros();

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
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <AppIcon color={colors.surface} name="user" size={34} strokeWidth={2.6} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>João da Fazenda</Text>
            <Text style={styles.subtitle}>Fazenda Boa Vista</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo da conta</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Animais" value={String(matrizes.length)} />
            <StatCard label="Touros" value={String(catalogo.length)} />
            <StatCard label="Favoritos" value={String(total)} />
          </View>
        </View>

        <View style={styles.actionList}>
          <ProfileAction
            icon="users"
            label="Ver rebanho"
            onPress={() => router.push('/plantel' as never)}
          />
          <ProfileAction
            icon="heart-pulse"
            label="Ver favoritos"
            onPress={() => router.push('/carrinho' as never)}
          />
          <ProfileAction
            icon="search"
            label="Ver touros recomendados"
            primary
            onPress={() => router.push('/busca' as never)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ProfileAction({
  icon,
  label,
  primary = false,
  onPress,
}: {
  icon: 'users' | 'heart-pulse' | 'search';
  label: string;
  primary?: boolean;
  onPress: () => void;
}): JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        primary ? styles.actionButtonPrimary : styles.actionButtonSecondary,
        pressed && styles.pressed,
      ]}
    >
      <AppIcon color={primary ? colors.surface : colors.primary} name={icon} size={24} strokeWidth={2.5} />
      <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text>
      <AppIcon color={primary ? colors.surface : colors.textPrimary} name="chevron-right" size={23} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    ...shadows.soft,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonSecondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  actionList: {
    gap: spacing.md,
  },
  actionText: {
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  actionTextPrimary: {
    color: colors.surface,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  container: {
    gap: spacing.xl,
    paddingBottom: 112,
    paddingTop: spacing.lg,
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.lg,
    minHeight: 128,
    padding: spacing.lg,
    ...shadows.card,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
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
  },
  statCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flex: 1,
    minHeight: 94,
    minWidth: 100,
    padding: spacing.lg,
  },
  statLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statValue: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 30,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 24,
    marginTop: 4,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 32,
  },
});
