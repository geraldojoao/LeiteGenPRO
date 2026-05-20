import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  CheckoutBuyerData,
  CheckoutBuyerErrors,
  CheckoutBuyerForm,
} from '@/components/checkout/CheckoutBuyerForm';
import {
  CheckoutPaymentMethod,
  CheckoutPaymentSelector,
} from '@/components/checkout/CheckoutPaymentSelector';
import { CheckoutTouroItem } from '@/components/checkout/CheckoutTouroItem';
import { EmptyState } from '@/components/common/EmptyState';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useFavoriteTouros } from '@/hooks/useFavoriteTouros';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useFavoritesStore } from '@/store/favoritesStore';
import { formatCurrency } from '@/utils/formatters';

const initialBuyerData: CheckoutBuyerData = {
  nome: '',
  email: '',
  telefone: '',
  documento: '',
  cidade: '',
  estado: '',
};

export default function CheckoutScreen(): JSX.Element {
  const responsive = useResponsiveLayout();
  const { touros, total } = useFavoriteTouros();
  const removerFavorito = useFavoritesStore((state) => state.removerFavorito);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [buyerData, setBuyerData] = useState<CheckoutBuyerData>(initialBuyerData);
  const [buyerErrors, setBuyerErrors] = useState<CheckoutBuyerErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('pix');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuantities((current) => {
      const next: Record<string, number> = {};
      touros.forEach((touro) => {
        next[touro.id] = Math.max(current[touro.id] ?? 1, 1);
      });
      return next;
    });
  }, [touros]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const subtotal = useMemo(
    () => touros.reduce((sum, touro) => sum + touro.precoPorDose * (quantities[touro.id] ?? 1), 0),
    [quantities, touros],
  );
  const taxaOperacional = subtotal > 0 ? subtotal * 0.02 : 0;
  const logistica = subtotal > 0 ? 45 : 0;
  const totalFinal = subtotal + taxaOperacional + logistica;
  const quantidadeTotal = useMemo(
    () => touros.reduce((sum, touro) => sum + (quantities[touro.id] ?? 1), 0),
    [quantities, touros],
  );

  function updateBuyerField(field: keyof CheckoutBuyerData, value: string): void {
    setBuyerData((current) => ({ ...current, [field]: value }));
    setBuyerErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  function decreaseQuantity(touroId: string): void {
    setQuantities((current) => ({ ...current, [touroId]: Math.max((current[touroId] ?? 1) - 1, 1) }));
  }

  function increaseQuantity(touroId: string): void {
    setQuantities((current) => ({ ...current, [touroId]: (current[touroId] ?? 1) + 1 }));
  }

  function removeItem(touroId: string, nome: string): void {
    removerFavorito(touroId);
    Toast.show({
      type: 'success',
      text1: 'Item removido',
      text2: `${nome} saiu do checkout e dos favoritos.`,
    });
  }

  function validateCheckout(): boolean {
    const nextErrors: CheckoutBuyerErrors = {};
    const digitsTelefone = buyerData.telefone.replace(/\D/g, '');
    const digitsDocumento = buyerData.documento.replace(/\D/g, '');

    if (!touros.length) {
      setFormError('Seu carrinho está vazio. Adicione ao menos um touro para finalizar.');
      return false;
    }

    if (buyerData.nome.trim().split(/\s+/).length < 2) {
      nextErrors.nome = 'Informe nome e sobrenome.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerData.email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (digitsTelefone.length < 10) {
      nextErrors.telefone = 'Informe um telefone com DDD.';
    }

    if (digitsDocumento.length < 11) {
      nextErrors.documento = 'Informe CPF ou CNPJ para identificação.';
    }

    if (buyerData.cidade.trim().length < 2) {
      nextErrors.cidade = 'Informe a cidade.';
    }

    if (buyerData.estado.trim().length !== 2) {
      nextErrors.estado = 'Use a UF com 2 letras.';
    }

    setBuyerErrors(nextErrors);
    const isValid = Object.keys(nextErrors).length === 0;

    if (!isValid) {
      setFormError('Revise os campos obrigatórios antes de finalizar.');
    }

    return isValid;
  }

  function finishCheckout(): void {
    if (!validateCheckout()) {
      Toast.show({
        type: 'error',
        text1: 'Dados incompletos',
        text2: 'Confira os campos destacados no checkout.',
      });
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    timeoutRef.current = setTimeout(() => {
      setIsSubmitting(false);
      setOrderCode(`LG-${Date.now().toString().slice(-6)}`);
      setSuccessVisible(true);
      Toast.show({
        type: 'success',
        text1: 'Solicitação enviada',
        text2: 'Nossa equipe entrará em contato.',
      });
    }, 900);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          responsive.centered,
          { paddingHorizontal: responsive.horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, responsive.isMobile && styles.headerStack]}>
          <View style={styles.headingText}>
            <Text style={styles.eyebrow}>Checkout</Text>
            <Text style={styles.title}>Finalizar compra</Text>
            <Text style={styles.subtitle}>
              Simule a solicitação comercial dos touros favoritados. Nenhum dado é enviado para gateways ou APIs externas.
            </Text>
          </View>
          <View style={styles.secureBadge}>
            <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.primary} />
            <Text style={styles.secureText}>Simulação segura</Text>
          </View>
        </View>

        {total === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="cart-outline"
              title="Seu carrinho está vazio"
              message="Marque touros como favoritos no catálogo para montar uma solicitação de compra simulada."
            />
            <Pressable
              accessibilityLabel="Voltar para a busca de touros"
              onPress={() => router.push('/busca' as never)}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="magnify" size={18} color={colors.surface} />
              <Text style={styles.primaryButtonText}>Ver touros</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.checkoutGrid, responsive.isDesktop && styles.checkoutGridDesktop]}>
            <View style={styles.mainColumn}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Itens selecionados</Text>
                  <Text style={styles.sectionSubtitle}>
                    {total} {total === 1 ? 'touro favoritado' : 'touros favoritados'} no carrinho
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Adicionar mais touros ao checkout"
                  onPress={() => router.push('/busca' as never)}
                  style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
                >
                  <MaterialCommunityIcons name="plus" size={16} color={colors.primary} />
                  <Text style={styles.linkButtonText}>Adicionar</Text>
                </Pressable>
              </View>

              <View style={styles.itemsList}>
                {touros.map((touro) => (
                  <CheckoutTouroItem
                    key={touro.id}
                    onDecrease={() => decreaseQuantity(touro.id)}
                    onIncrease={() => increaseQuantity(touro.id)}
                    onRemove={() => removeItem(touro.id, touro.nome)}
                    quantity={quantities[touro.id] ?? 1}
                    touro={touro}
                  />
                ))}
              </View>

              <CheckoutBuyerForm data={buyerData} errors={buyerErrors} onChange={updateBuyerField} />
              <CheckoutPaymentSelector onSelect={setPaymentMethod} selected={paymentMethod} total={totalFinal} />
            </View>

            <View style={[styles.summaryColumn, responsive.isDesktop && styles.summaryColumnDesktop]}>
              <PurchaseSummary
                formError={formError}
                isSubmitting={isSubmitting}
                itemCount={total}
                logistics={logistica}
                onFinish={finishCheckout}
                operationalFee={taxaOperacional}
                quantityTotal={quantidadeTotal}
                subtotal={subtotal}
                total={totalFinal}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <SuccessModal
        orderCode={orderCode}
        paymentMethod={paymentMethod}
        total={totalFinal}
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
      />
    </SafeAreaView>
  );
}

function PurchaseSummary({
  itemCount,
  quantityTotal,
  subtotal,
  operationalFee,
  logistics,
  total,
  isSubmitting,
  formError,
  onFinish,
}: {
  itemCount: number;
  quantityTotal: number;
  subtotal: number;
  operationalFee: number;
  logistics: number;
  total: number;
  isSubmitting: boolean;
  formError: string | null;
  onFinish: () => void;
}): JSX.Element {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Resumo da compra</Text>
      <View style={styles.summaryLines}>
        <SummaryLine label={`${itemCount} ${itemCount === 1 ? 'touro' : 'touros'}`} value={`${quantityTotal} doses`} />
        <SummaryLine label="Subtotal" value={formatCurrency(subtotal)} />
        <SummaryLine label="Taxa operacional simulada (2%)" value={formatCurrency(operationalFee)} />
        <SummaryLine label="Assessoria logística" value={formatCurrency(logistics)} />
      </View>
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total final</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>

      {formError ? (
        <View style={styles.errorBox}>
          <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.danger} />
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      ) : null}

      <Pressable
        accessibilityLabel="Finalizar compra simulada"
        disabled={isSubmitting}
        onPress={onFinish}
        style={({ pressed }) => [
          styles.finishButton,
          isSubmitting && styles.finishButtonDisabled,
          pressed && !isSubmitting && styles.pressed,
        ]}
      >
        {isSubmitting ? <ActivityIndicator color={colors.surface} /> : <MaterialCommunityIcons name="check-circle-outline" size={20} color={colors.surface} />}
        <Text style={styles.finishButtonText}>{isSubmitting ? 'Enviando solicitação...' : 'Finalizar compra'}</Text>
      </Pressable>
      <Text style={styles.safeNote}>Checkout visual. Nenhuma cobrança real será criada.</Text>
    </View>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <View style={styles.summaryLine}>
      <Text style={styles.summaryLineLabel}>{label}</Text>
      <Text style={styles.summaryLineValue}>{value}</Text>
    </View>
  );
}

function SuccessModal({
  visible,
  orderCode,
  total,
  paymentMethod,
  onClose,
}: {
  visible: boolean;
  orderCode: string;
  total: number;
  paymentMethod: CheckoutPaymentMethod;
  onClose: () => void;
}): JSX.Element {
  const methodLabel = paymentMethod === 'pix' ? 'Pix' : paymentMethod === 'card' ? 'Cartão' : 'Boleto';

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIcon}>
            <MaterialCommunityIcons name="check" size={30} color={colors.surface} />
          </View>
          <Text style={styles.modalTitle}>Solicitação enviada</Text>
          <Text style={styles.modalText}>
            Solicitação de compra enviada com sucesso! Nossa equipe entrará em contato.
          </Text>
          <View style={styles.protocolBox}>
            <SummaryLine label="Protocolo" value={orderCode || 'LG-DEMO'} />
            <SummaryLine label="Método" value={methodLabel} />
            <SummaryLine label="Total simulado" value={formatCurrency(total)} />
          </View>
          <View style={styles.modalActions}>
            <Pressable
              accessibilityLabel="Voltar ao carrinho"
              onPress={() => {
                onClose();
                router.replace('/carrinho' as never);
              }}
              style={({ pressed }) => [styles.modalSecondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.modalSecondaryText}>Carrinho</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Explorar mais touros"
              onPress={() => {
                onClose();
                router.replace('/busca' as never);
              }}
              style={({ pressed }) => [styles.modalPrimaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.modalPrimaryText}>Explorar touros</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  checkoutGrid: {
    gap: spacing.lg,
  },
  checkoutGridDesktop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  container: {
    gap: spacing.lg,
    paddingBottom: 54,
    paddingTop: spacing.lg,
  },
  emptyWrap: {
    alignItems: 'center',
    gap: spacing.md,
  },
  errorBox: {
    alignItems: 'flex-start',
    backgroundColor: colors.redSoft,
    borderColor: `${colors.danger}35`,
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
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  finishButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.lg,
  },
  finishButtonDisabled: {
    opacity: 0.72,
  },
  finishButtonText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 14,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headerStack: {
    flexDirection: 'column',
  },
  headingText: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  itemsList: {
    gap: spacing.md,
  },
  linkButton: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}25`,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 38,
    paddingHorizontal: spacing.md,
  },
  linkButtonText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  mainColumn: {
    flex: 1,
    gap: spacing.lg,
    minWidth: 0,
  },
  modalActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%',
  },
  modalCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    gap: spacing.md,
    maxWidth: 460,
    padding: spacing.xl,
    width: '92%',
    ...shadows.card,
  },
  modalIcon: {
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: radii.pill,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: colors.blackOverlay,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalPrimaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 150,
    paddingHorizontal: spacing.md,
  },
  modalPrimaryText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 13,
  },
  modalSecondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}25`,
    borderRadius: radii.pill,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 130,
    paddingHorizontal: spacing.md,
  },
  modalSecondaryText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 13,
  },
  modalText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.84,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonText: {
    color: colors.surface,
    fontFamily: fonts.heading,
    fontSize: 13,
  },
  protocolBox: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    width: '100%',
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  safeNote: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 20,
  },
  secureBadge: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}25`,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  secureText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 760,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  summaryColumn: {
    width: '100%',
  },
  summaryColumnDesktop: {
    width: 360,
  },
  summaryLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  summaryLineLabel: {
    color: colors.textSecondary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  summaryLineValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 13,
    textAlign: 'right',
  },
  summaryLines: {
    gap: spacing.sm,
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.display,
    fontSize: 34,
    letterSpacing: 0,
  },
  totalBox: {
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}25`,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  totalLabel: {
    color: colors.primary,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  totalValue: {
    color: colors.primary,
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 0,
  },
});
