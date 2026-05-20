import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { BrandLogo } from '@/components/common/BrandLogo';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

type LoginIcon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface LoginMetric {
  icon: LoginIcon;
  label: string;
  value: string;
}

const loginMetrics: LoginMetric[] = [
  { icon: 'dna', label: 'avaliacoes genomicas', value: '1.284' },
  { icon: 'cloud-check-outline', label: 'catalogo offline', value: '98%' },
  { icon: 'storefront-outline', label: 'centrais parceiras', value: '12' },
];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDesktopLayout = responsive.width >= 900;
  const logoSize = responsive.isNarrow ? 58 : 72;
  const passwordIcon = useMemo<LoginIcon>(
    () => (isPasswordVisible ? 'eye-off-outline' : 'eye-outline'),
    [isPasswordVisible],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  function submitLogin(emailValue = email, passwordValue = password): void {
    const normalizedEmail = emailValue.trim().toLowerCase();
    const normalizedPassword = passwordValue.trim();

    if (!isValidEmail(normalizedEmail)) {
      setError('Informe um e-mail valido para acessar o LeiteGen Pro.');
      return;
    }

    if (normalizedPassword.length < 6) {
      setError('Use uma senha com pelo menos 6 caracteres.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    timeoutRef.current = setTimeout(() => {
      setIsSubmitting(false);
      Toast.show({
        type: 'success',
        text1: 'Bem-vindo ao LeiteGen Pro',
        text2: 'Sessao demo iniciada com dados locais.',
      });
      router.replace('/home' as never);
    }, 650);
  }

  function submitDemoLogin(): void {
    const demoEmail = 'produtor@leitegen.pro';
    const demoPassword = 'leitegen2026';
    setEmail(demoEmail);
    setPassword(demoPassword);
    submitLogin(demoEmail, demoPassword);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#fef9ee', '#f7ead2', '#eef7ef']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.textureBand} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardArea}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            responsive.centered,
            { paddingHorizontal: responsive.horizontalPadding },
            isDesktopLayout && styles.scrollContentDesktop,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.shell, isDesktopLayout && styles.shellDesktop]}>
            <View style={[styles.formPanel, isDesktopLayout && styles.formPanelDesktop]}>
              <View style={styles.brandBlock}>
                <View style={styles.logo}>
                  <BrandLogo size={logoSize} />
                </View>
                <View style={styles.brandTextWrap}>
                  <Text style={styles.brandName}>LeiteGen Pro</Text>
                  <Text style={styles.brandSubtitle}>Mercado genetico leiteiro brasileiro</Text>
                </View>
              </View>

              <View style={styles.headingBlock}>
                <Text style={styles.eyebrow}>Acesso seguro</Text>
                <Text style={styles.title}>Entre na sua operacao genetica</Text>
                <Text style={styles.subtitle}>
                  Acompanhe touros, matrizes, ROI e recomendacoes de acasalamento em um ambiente premium.
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>E-mail</Text>
                  <View style={styles.inputWrap}>
                    <MaterialCommunityIcons name="email-outline" size={20} color={colors.textSecondary} />
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="email"
                      keyboardType="email-address"
                      onChangeText={(value) => {
                        setEmail(value);
                        setError(null);
                      }}
                      placeholder="produtor@fazendaboavista.com.br"
                      placeholderTextColor="#9ca3af"
                      returnKeyType="next"
                      style={styles.input}
                      textContentType="emailAddress"
                      value={email}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Senha</Text>
                  <View style={styles.inputWrap}>
                    <MaterialCommunityIcons name="lock-outline" size={20} color={colors.textSecondary} />
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="current-password"
                      onChangeText={(value) => {
                        setPassword(value);
                        setError(null);
                      }}
                      onSubmitEditing={() => submitLogin()}
                      placeholder="minimo 6 caracteres"
                      placeholderTextColor="#9ca3af"
                      returnKeyType="done"
                      secureTextEntry={!isPasswordVisible}
                      style={styles.input}
                      textContentType="password"
                      value={password}
                    />
                    <Pressable
                      accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                      hitSlop={10}
                      onPress={() => setIsPasswordVisible((current) => !current)}
                      style={styles.passwordToggle}
                    >
                      <MaterialCommunityIcons name={passwordIcon} size={20} color={colors.textSecondary} />
                    </Pressable>
                  </View>
                </View>

                {error ? (
                  <View style={styles.errorBox}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <Pressable
                  accessibilityLabel="Entrar no LeiteGen Pro"
                  disabled={isSubmitting}
                  onPress={() => submitLogin()}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    (pressed || isSubmitting) && styles.primaryButtonPressed,
                  ]}
                >
                  <Text style={styles.primaryButtonText}>{isSubmitting ? 'Validando acesso...' : 'Entrar'}</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color={colors.surface} />
                </Pressable>

                <Pressable
                  accessibilityLabel="Entrar com acesso de demonstracao"
                  disabled={isSubmitting}
                  onPress={submitDemoLogin}
                  style={({ pressed }) => [styles.demoButton, pressed && styles.demoButtonPressed]}
                >
                  <MaterialCommunityIcons name="shield-check-outline" size={18} color={colors.primary} />
                  <Text style={styles.demoButtonText}>Acessar demo profissional</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.insightPanel, !isDesktopLayout && styles.insightPanelCompact]}>
              <View style={styles.insightHeader}>
                <View style={styles.insightIcon}>
                  <MaterialCommunityIcons name="chart-timeline-variant" size={25} color={colors.primary} />
                </View>
                <View style={styles.insightTitleWrap}>
                  <Text style={styles.insightTitle}>Inteligencia de selecao</Text>
                  <Text style={styles.insightSubtitle}>Dados, risco e retorno em uma unica rotina.</Text>
                </View>
              </View>

              <View style={[styles.metricsGrid, !isDesktopLayout && styles.metricsGridCompact]}>
                {loginMetrics.map((metric) => (
                  <View key={metric.label} style={styles.metricCard}>
                    <MaterialCommunityIcons name={metric.icon} size={20} color={colors.secondary} />
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.signalCard}>
                <View style={styles.signalTopRow}>
                  <Text style={styles.signalLabel}>Indice genetico previsto</Text>
                  <Text style={styles.signalValue}>+14,8%</Text>
                </View>
                <View style={styles.signalTrack}>
                  <View style={styles.signalFill} />
                </View>
                <Text style={styles.signalCaption}>Sessao pronta para operar mesmo com conectividade instavel.</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandBlock: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  brandName: {
    color: colors.primary,
    fontFamily: fonts.display,
    fontSize: 32,
    letterSpacing: 0,
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  brandTextWrap: {
    flex: 1,
  },
  demoButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: `${colors.primary}24`,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  demoButtonPressed: {
    backgroundColor: colors.emeraldSoft,
  },
  demoButtonText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 13,
  },
  errorBox: {
    alignItems: 'center',
    backgroundColor: colors.redSoft,
    borderColor: '#fecaca',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  errorText: {
    color: colors.danger,
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 12,
    lineHeight: 18,
  },
  eyebrow: {
    color: colors.warning,
    fontFamily: fonts.heading,
    fontSize: 12,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  form: {
    gap: spacing.lg,
  },
  formPanel: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderColor: 'rgba(234,223,202,0.92)',
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  formPanelDesktop: {
    flex: 1,
    maxWidth: 520,
  },
  headingBlock: {
    gap: spacing.sm,
  },
  input: {
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    minHeight: 24,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 54,
    paddingHorizontal: spacing.md,
  },
  insightCaption: {
    color: '#d8eadc',
    fontFamily: fonts.body,
    fontSize: 12,
  },
  insightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  insightIcon: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  insightPanel: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    gap: spacing.xl,
    justifyContent: 'space-between',
    minHeight: 520,
    overflow: 'hidden',
    padding: spacing.xl,
    ...shadows.card,
  },
  insightPanelCompact: {
    minHeight: 0,
  },
  insightSubtitle: {
    color: '#d8eadc',
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  insightTitle: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  insightTitleWrap: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
  },
  label: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 13,
  },
  logo: {
    borderRadius: radii.pill,
    ...shadows.soft,
  },
  metricCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 112,
    padding: spacing.md,
  },
  metricLabel: {
    color: '#d8eadc',
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
  },
  metricValue: {
    color: colors.surface,
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 0,
  },
  metricsGrid: {
    gap: spacing.md,
  },
  metricsGridCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  passwordToggle: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonPressed: {
    opacity: 0.86,
  },
  primaryButtonText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 15,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
  },
  scrollContentDesktop: {
    minHeight: '100%',
  },
  shell: {
    gap: spacing.lg,
    width: '100%',
  },
  shellDesktop: {
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  signalCaption: {
    color: '#d8eadc',
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  signalCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  signalFill: {
    backgroundColor: colors.secondary,
    borderRadius: radii.pill,
    height: '100%',
    width: '78%',
  },
  signalLabel: {
    color: '#d8eadc',
    fontFamily: fonts.body,
    fontSize: 12,
  },
  signalTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  signalTrack: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.pill,
    height: 10,
    overflow: 'hidden',
  },
  signalValue: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  textureBand: {
    backgroundColor: 'rgba(138, 90, 68, 0.08)',
    height: 180,
    left: -80,
    position: 'absolute',
    top: 34,
    transform: [{ rotate: '-17deg' }],
    width: 620,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 29,
    lineHeight: 36,
  },
});
