import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BIOMAS, PESOS_PADRAO, RACAS, TIPOS_SEMEN } from '@/constants/domain';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { filtrosPadrao, useFilterStore } from '@/store/filterStore';
import type { PesosSelecao } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
}

type PesoKey = keyof PesosSelecao;

const pesoLabels: { key: PesoKey; label: string }[] = [
  { key: 'leite', label: 'Mais leite' },
  { key: 'gordura', label: 'Gordura do leite' },
  { key: 'proteina', label: 'Proteína do leite' },
  { key: 'vidaProdutiva', label: 'Tempo produzindo' },
  { key: 'celulaSomatica', label: 'Saúde do úbere' },
  { key: 'facilidadeParto', label: 'Parto fácil' },
  { key: 'fenotipo', label: 'Corpo do animal' },
];

export function FilterDrawer({ visible, onClose }: FilterDrawerProps): JSX.Element {
  const responsive = useResponsiveLayout();
  const translateY = useRef(new Animated.Value(420)).current;
  const filtros = useFilterStore((state) => state.filtros);
  const setFiltro = useFilterStore((state) => state.setFiltro);
  const toggleRaca = useFilterStore((state) => state.toggleRaca);
  const toggleTipoSemen = useFilterStore((state) => state.toggleTipoSemen);
  const toggleBioma = useFilterStore((state) => state.toggleBioma);
  const setPesosPersonalizados = useFilterStore((state) => state.setPesosPersonalizados);
  const resetFiltros = useFilterStore((state) => state.resetFiltros);
  const pesos: PesosSelecao = filtros.pesosPersonalizados ?? filtrosPadrao.pesosPersonalizados ?? PESOS_PADRAO;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 420,
      damping: 22,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  }, [translateY, visible]);

  const pesoTotal = useMemo(() => Math.round(Object.values(pesos).reduce((total, value) => total + value, 0)), [pesos]);

  const updatePeso = (key: PesoKey, value: number): void => {
    const arredondado = Math.round(value);
    const demaisKeys = pesoLabels.map((item) => item.key).filter((item) => item !== key);
    const demaisSoma = demaisKeys.reduce((total, item) => total + pesos[item], 0);
    const restante = Math.max(100 - arredondado, 0);
    const proximo = { ...pesos, [key]: arredondado } as PesosSelecao;

    demaisKeys.forEach((item, index) => {
      const bruto = demaisSoma === 0 ? restante / demaisKeys.length : (pesos[item] / demaisSoma) * restante;
      proximo[item] = index === demaisKeys.length - 1 ? restante - demaisKeys.slice(0, -1).reduce((sum, k) => sum + proximo[k], 0) : Math.round(bruto);
    });

    setPesosPersonalizados(proximo);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, (responsive.isTablet || responsive.isDesktop) && styles.overlayDesktop]}>
        <Pressable accessibilityLabel="Fechar filtros" onPress={onClose} style={styles.backdrop} />
        <Animated.View
          style={[
            styles.sheet,
            (responsive.isTablet || responsive.isDesktop) && styles.sheetDesktop,
            responsive.isNarrow && styles.sheetNarrow,
            { transform: [{ translateY }] },
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Filtros</Text>
              <Text style={styles.subtitle}>Escolha o que mais importa para sua fazenda</Text>
            </View>
            <Pressable accessibilityLabel="Fechar filtros" onPress={onClose} style={styles.iconButton}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Section title="Qualidade genética" icon="dna">
              <SliderRow
                label="Confiança mínima"
                value={filtros.acuraciaMinima ?? 0}
                minimumValue={0}
                maximumValue={100}
                step={1}
                suffix="%"
                onValueChange={(value) => setFiltro('acuraciaMinima', value)}
              />
              <SliderRow
                label="Ajuda a aumentar o leite"
                value={filtros.ptaLeiteMínimo ?? 0}
                minimumValue={0}
                maximumValue={1450}
                step={25}
                suffix=" kg"
                onValueChange={(value) => setFiltro('ptaLeiteMínimo', value)}
              />
              <ChipGroup
                label="Raça"
                items={RACAS}
                selected={filtros.raca ?? []}
                onToggle={(value) => toggleRaca(value)}
              />
            </Section>

            <Section title="Sêmen" icon="test-tube">
              <View style={styles.chipHeader}>
                <Text style={styles.groupLabel}>Tipo</Text>
                <Pressable
                  accessibilityLabel="Mostrar todos os tipos de sêmen"
                  onPress={() => setFiltro('tipoSemen', [])}
                  style={[styles.chip, !(filtros.tipoSemen?.length) && styles.chipActive]}
                >
                  <Text style={[styles.chipText, !(filtros.tipoSemen?.length) && styles.chipTextActive]}>Todos</Text>
                </Pressable>
              </View>
              <ChipGroup
                items={TIPOS_SEMEN}
                selected={filtros.tipoSemen ?? []}
                onToggle={(value) => toggleTipoSemen(value)}
              />
              <SliderRow
                label="Preço máximo por dose"
                value={filtros.precoMaximo ?? 450}
                minimumValue={35}
                maximumValue={450}
                step={5}
                formatter={formatCurrency}
                onValueChange={(value) => setFiltro('precoMaximo', value)}
              />
            </Section>

            <Section title="Região da fazenda" icon="weather-sunny">
              <ChipGroup
                label="Clima ou região"
                items={BIOMAS}
                selected={filtros.bioma ?? []}
                onToggle={(value) => toggleBioma(value)}
              />
            </Section>

            <Section title="Corpo do animal" icon="cow">
              <SliderRow
                label="Estatura mínima"
                value={filtros.estaturaMinima ?? 1}
                minimumValue={1}
                maximumValue={9}
                step={1}
                suffix="/9"
                onValueChange={(value) => setFiltro('estaturaMinima', value)}
              />
              <SliderRow
                label="Úbere mínimo"
                value={filtros.compostoUbereMinimo ?? 1}
                minimumValue={1}
                maximumValue={9}
                step={1}
                suffix="/9"
                onValueChange={(value) => setFiltro('compostoUbereMinimo', value)}
              />
              <SliderRow
                label="Pernas e pés mínimo"
                value={filtros.pernasEPesMinimo ?? 1}
                minimumValue={1}
                maximumValue={9}
                step={1}
                suffix="/9"
                onValueChange={(value) => setFiltro('pernasEPesMinimo', value)}
              />
            </Section>

            <Section title="Prioridade da fazenda" icon="tune-variant">
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Soma automática</Text>
                <Text style={[styles.totalValue, pesoTotal === 100 ? styles.totalOk : styles.totalWarning]}>{pesoTotal}%</Text>
              </View>
              {pesoLabels.map((peso) => (
                <SliderRow
                  key={peso.key}
                  label={peso.label}
                  value={pesos[peso.key]}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  suffix="%"
                  onValueChange={(value) => updatePeso(peso.key, value)}
                />
              ))}
            </Section>
          </ScrollView>

          <View style={[styles.footer, responsive.isNarrow && styles.footerStack]}>
            <Pressable accessibilityLabel="Limpar filtros" onPress={resetFiltros} style={styles.secondaryButton}>
              <MaterialCommunityIcons name="filter-remove" size={18} color={colors.primary} />
              <Text style={styles.secondaryText}>Limpar</Text>
            </Pressable>
            <Pressable accessibilityLabel="Calcular ranking personalizado" onPress={onClose} style={styles.primaryButton}>
              <MaterialCommunityIcons name="chart-line" size={18} color={colors.surface} />
              <Text style={styles.primaryText}>Ver touros</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  children: ReactNode;
}): JSX.Element {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function SliderRow({
  label,
  value,
  minimumValue,
  maximumValue,
  step,
  suffix = '',
  formatter,
  onValueChange,
}: {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  suffix?: string;
  formatter?: (value: number) => string;
  onValueChange: (value: number) => void;
}): JSX.Element {
  return (
    <View style={styles.sliderRow}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{formatter ? formatter(value) : `${Math.round(value)}${suffix}`}</Text>
      </View>
      <Slider
        accessibilityLabel={label}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.secondary}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

function ChipGroup<T extends string>({
  label,
  items,
  selected,
  onToggle,
}: {
  label?: string;
  items: readonly T[];
  selected: T[];
  onToggle: (item: T) => void;
}): JSX.Element {
  return (
    <View style={styles.group}>
      {label ? <Text style={styles.groupLabel}>{label}</Text> : null}
      <View style={styles.chipWrap}>
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <Pressable
              accessibilityLabel={`${active ? 'Remover' : 'Adicionar'} filtro ${item}`}
              key={item}
              onPress={() => onToggle(item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  chip: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chipText: {
    color: colors.textSecondary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  chipTextActive: {
    color: colors.surface,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  footer: {
    borderColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  footerStack: {
    flexDirection: 'column',
  },
  group: {
    gap: spacing.sm,
  },
  groupLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    height: 5,
    marginBottom: spacing.md,
    width: 46,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  overlay: {
    backgroundColor: colors.blackOverlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayDesktop: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
  },
  primaryText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    minHeight: 60,
  },
  secondaryText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    gap: spacing.md,
    padding: spacing.md,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    ...shadows.card,
  },
  sheetDesktop: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 0,
    height: '100%',
    maxHeight: '100%',
    maxWidth: 560,
    width: '92%',
  },
  sheetNarrow: {
    paddingHorizontal: spacing.md,
  },
  sliderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  sliderRow: {
    gap: 4,
  },
  sliderValue: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: 2,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  totalBox: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  totalLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  totalOk: {
    color: colors.success,
  },
  totalValue: {
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  totalWarning: {
    color: colors.warning,
  },
});
