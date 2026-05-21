import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { simularROI } from '@/logic/roiSimulator';
import { analisarSemen } from '@/logic/semenViability';
import { formatCurrency, formatKg, formatNumber } from '@/utils/formatters';
import type { Touro } from '@/types';

interface RoiCalculatorProps {
  touro: Touro;
}

export function RoiCalculator({ touro }: RoiCalculatorProps): JSX.Element {
  const { width } = useWindowDimensions();
  const isNarrow = width < 520;
  const [precoLitro, setPrecoLitro] = useState('2.15');
  const [qtdDoses, setQtdDoses] = useState('10');
  const [calculated, setCalculated] = useState(true);

  const roi = useMemo(
    () => simularROI(touro, Number(precoLitro.replace(',', '.')) || 0, Number(qtdDoses) || 1),
    [precoLitro, qtdDoses, touro],
  );
  const semen = useMemo(() => analisarSemen(touro.qualidadeSemen, touro.tipoSemen, touro.precoPorDose), [touro]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="cash-fast" size={23} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Simule quanto pode render</Text>
          <Text style={styles.subtitle}>Estimativa simples para as próximas filhas</Text>
        </View>
      </View>

      <View style={[styles.form, isNarrow && styles.formStack]}>
        <View style={styles.field}>
          <Text style={styles.label}>Preço do leite na sua região</Text>
          <TextInput
            accessibilityLabel="Preço do leite por litro"
            keyboardType="decimal-pad"
            onChangeText={(value) => {
              setPrecoLitro(value);
              setCalculated(false);
            }}
            style={styles.input}
            value={precoLitro}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Quantidade de doses</Text>
          <TextInput
            accessibilityLabel="Quantidade de doses"
            keyboardType="number-pad"
            onChangeText={(value) => {
              setQtdDoses(value);
              setCalculated(false);
            }}
            style={styles.input}
            value={qtdDoses}
          />
        </View>
      </View>

      <Pressable
        accessibilityLabel="Calcular ganho"
        onPress={() => setCalculated(true)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons name="calculator-variant" size={18} color={colors.surface} />
        <Text style={styles.buttonText}>Calcular ganho</Text>
      </Pressable>

      {calculated && (
        <View style={styles.result}>
          <ResultRow label="Mais leite por filha" value={formatKg(roi.ganhoEstimadoLitros)} positive />
          <ResultRow label="Valor por bezerra" value={formatCurrency(roi.valorMonetarioPorProgenie)} />
          <ResultRow label="Custo total das doses" value={formatCurrency(roi.custoTotal)} />
          <ResultRow label="Retorno estimado" value={`${roi.roiPercentual >= 0 ? '+' : ''}${formatNumber(roi.roiPercentual, 1)}%`} positive={roi.roiPercentual >= 0} />
          <ResultRow label="Ganho líquido estimado" value={formatCurrency(roi.lucroLiquidoEstimado)} positive={roi.lucroLiquidoEstimado >= 0} />
          <ResultRow label="Volta em" value={`${formatNumber(roi.paybackEmLactacoes, 1)} lactações`} />
        </View>
      )}

      {touro.tipoSemen === 'Sexado Fêmea' && (
        <View style={styles.sexadoBox}>
          <Text style={styles.sexadoTitle}>Mais chance de bezerras</Text>
          <Text style={styles.sexadoLine}>Fêmeas nascidas: perto de 92%</Text>
          <Text style={styles.sexadoLine}>Pegamento estimado: perto de 65%</Text>
          <Text style={styles.sexadoLine}>Doses para 1 fêmea: perto de 1,67</Text>
          <Text style={styles.sexadoValue}>{formatCurrency(semen.custoFemeaNascida)}</Text>
          <Text style={styles.sexadoRecommendation}>
            Bom quando a fazenda quer aumentar a reposição de fêmeas leiteiras.
          </Text>
        </View>
      )}

      <Text style={styles.disclaimer}>
        Valores estimados. Resultados reais dependem de manejo, ambiente e genética da vaca.
      </Text>
    </View>
  );
}

function ResultRow({ label, value, positive }: { label: string; value: string; positive?: boolean }): JSX.Element {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={[styles.resultValue, positive && styles.positive]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
  },
  buttonText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 17,
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
  disclaimer: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  field: {
    flex: 1,
    gap: 6,
  },
  form: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formStack: {
    flexDirection: 'column',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  input: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    minHeight: 60,
  },
  label: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  positive: {
    color: colors.success,
  },
  pressed: {
    opacity: 0.82,
  },
  result: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    gap: spacing.sm,
    padding: spacing.md,
  },
  resultLabel: {
    color: colors.textSecondary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    minWidth: 142,
  },
  resultRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  resultValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 17,
    flexShrink: 1,
    textAlign: 'right',
  },
  sexadoBox: {
    backgroundColor: colors.amberSoft,
    borderColor: `${colors.secondary}55`,
    borderRadius: radii.sm,
    borderWidth: 2,
    gap: 4,
    padding: spacing.md,
  },
  sexadoLine: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  sexadoRecommendation: {
    color: colors.brown,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },
  sexadoTitle: {
    color: colors.warning,
    fontFamily: fonts.heading,
    fontSize: 18,
    marginBottom: 3,
  },
  sexadoValue: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 20,
    marginTop: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
  },
});
