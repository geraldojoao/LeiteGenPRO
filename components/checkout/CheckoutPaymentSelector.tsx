import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatters';

export type CheckoutPaymentMethod = 'pix' | 'card' | 'boleto';

interface CheckoutPaymentSelectorProps {
  selected: CheckoutPaymentMethod;
  total: number;
  onSelect: (method: CheckoutPaymentMethod) => void;
}

const methods: {
  key: CheckoutPaymentMethod;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { key: 'pix', label: 'Pix', icon: 'qrcode' },
  { key: 'card', label: 'Cartão', icon: 'credit-card-outline' },
  { key: 'boleto', label: 'Boleto', icon: 'file-document-outline' },
];

export function CheckoutPaymentSelector({
  selected,
  total,
  onSelect,
}: CheckoutPaymentSelectorProps): JSX.Element {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.sectionTitle}>Método de pagamento</Text>
        <Text style={styles.sectionSubtitle}>Ambiente demonstrativo. Nenhum pagamento será processado.</Text>
      </View>

      <View style={styles.methodRow}>
        {methods.map((method) => {
          const active = selected === method.key;
          return (
            <Pressable
              accessibilityLabel={`Selecionar pagamento por ${method.label}`}
              key={method.key}
              onPress={() => onSelect(method.key)}
              style={({ pressed }) => [styles.methodButton, active && styles.methodButtonActive, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name={method.icon} size={20} color={active ? colors.surface : colors.primary} />
              <Text style={[styles.methodText, active && styles.methodTextActive]}>{method.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {selected === 'pix' && <PixPanel total={total} />}
      {selected === 'card' && <CardPanel total={total} />}
      {selected === 'boleto' && <BoletoPanel total={total} />}
    </View>
  );
}

function PixPanel({ total }: { total: number }): JSX.Element {
  return (
    <View style={styles.panel}>
      <View style={styles.qrMock}>
        <MaterialCommunityIcons name="qrcode" size={72} color={colors.primary} />
      </View>
      <View style={styles.panelContent}>
        <Text style={styles.panelTitle}>Pix simulado</Text>
        <Text style={styles.panelText}>
          Valor de demonstração: {formatCurrency(total)}. A chave abaixo é fictícia e não gera cobrança.
        </Text>
        <View style={styles.codeBox}>
          <Text numberOfLines={1} style={styles.codeText}>LEITEGEN-PRO-PIX-DEMO</Text>
        </View>
      </View>
    </View>
  );
}

function CardPanel({ total }: { total: number }): JSX.Element {
  return (
    <View style={styles.panel}>
      <View style={styles.cardMock}>
        <Text style={styles.cardMockLabel}>Cartão simulado</Text>
        <Text style={styles.cardMockNumber}>•••• •••• •••• 0000</Text>
        <Text style={styles.cardMockValue}>{formatCurrency(total)}</Text>
      </View>
      <View style={styles.panelContent}>
        <Text style={styles.panelTitle}>Cartão de crédito</Text>
        <Text style={styles.panelText}>
          Interface apenas visual. Não informe número, validade ou CVV de cartão real nesta simulação.
        </Text>
      </View>
    </View>
  );
}

function BoletoPanel({ total }: { total: number }): JSX.Element {
  return (
    <View style={styles.panel}>
      <View style={styles.boletoMock}>
        <MaterialCommunityIcons name="barcode" size={72} color={colors.primary} />
      </View>
      <View style={styles.panelContent}>
        <Text style={styles.panelTitle}>Boleto demonstrativo</Text>
        <Text style={styles.panelText}>
          Um boleto fictício de {formatCurrency(total)} seria enviado por e-mail após a solicitação.
        </Text>
        <Text style={styles.panelHint}>Vencimento simulado em 3 dias úteis.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boletoMock: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    width: 132,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  cardMock: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    gap: spacing.sm,
    height: 112,
    justifyContent: 'space-between',
    padding: spacing.md,
    width: 172,
  },
  cardMockLabel: {
    color: '#dcecdf',
    fontFamily: fonts.body,
    fontSize: 11,
  },
  cardMockNumber: {
    color: colors.surface,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  cardMockValue: {
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: 15,
  },
  codeBox: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  codeText: {
    color: colors.primary,
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  methodButton: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 118,
    paddingHorizontal: spacing.md,
  },
  methodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  methodText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  methodTextActive: {
    color: colors.surface,
  },
  panel: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}24`,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.md,
  },
  panelContent: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 220,
  },
  panelHint: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  panelText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  panelTitle: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.82,
  },
  qrMock: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: `${colors.primary}25`,
    borderRadius: radii.md,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
});
