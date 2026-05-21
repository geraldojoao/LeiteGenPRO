import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatters';
import type { Touro } from '@/types';

interface CheckoutTouroItemProps {
  touro: Touro;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

export function CheckoutTouroItem({
  touro,
  quantity,
  onDecrease,
  onIncrease,
  onRemove,
}: CheckoutTouroItemProps): JSX.Element {
  const { width } = useWindowDimensions();
  const shouldStack = width < 520;
  const itemTotal = touro.precoPorDose * quantity;

  return (
    <View style={[styles.card, shouldStack && styles.cardStack]}>
      <Image source={{ uri: touro.foto }} resizeMode="cover" style={[styles.image, shouldStack && styles.imageStack]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.name}>
              {touro.nome}
            </Text>
            <Text numberOfLines={1} style={styles.registry}>
              Touro selecionado
            </Text>
          </View>
          <View style={styles.raceBadge}>
            <Text numberOfLines={1} style={styles.raceText}>
              {touro.raca}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Valor da dose</Text>
            <Text style={styles.price}>{formatCurrency(touro.precoPorDose)}/dose</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Total deste touro</Text>
            <Text style={styles.itemTotal}>{formatCurrency(itemTotal)}</Text>
          </View>
        </View>

        <View style={[styles.footer, shouldStack && styles.footerStack]}>
          <View style={styles.quantityWrap}>
            <Text style={styles.quantityLabel}>Doses</Text>
            <View style={styles.stepper}>
              <Pressable
                accessibilityLabel={`Diminuir quantidade de ${touro.nome}`}
                disabled={quantity <= 1}
                onPress={onDecrease}
                style={({ pressed }) => [
                  styles.stepperButton,
                  quantity <= 1 && styles.stepperButtonDisabled,
                  pressed && quantity > 1 && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons name="minus" size={16} color={quantity <= 1 ? colors.textSecondary : colors.primary} />
              </Pressable>
              <Text accessibilityLabel={`Quantidade ${quantity}`} style={styles.quantityValue}>
                {quantity}
              </Text>
              <Pressable
                accessibilityLabel={`Aumentar quantidade de ${touro.nome}`}
                onPress={onIncrease}
                style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}
              >
                <MaterialCommunityIcons name="plus" size={16} color={colors.primary} />
              </Pressable>
            </View>
          </View>

          <Pressable
            accessibilityLabel={`Remover ${touro.nome} do pedido`}
            onPress={onRemove}
            style={({ pressed }) => [styles.removeButton, shouldStack && styles.fullButton, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.danger} />
            <Text style={styles.removeText}>Tirar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  cardStack: {
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    gap: spacing.md,
    minWidth: 0,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  footerStack: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  fullButton: {
    width: '100%',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  image: {
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    height: 132,
    width: 122,
  },
  imageStack: {
    height: 180,
    width: '100%',
  },
  itemTotal: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 18,
    marginTop: 3,
  },
  metaLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 21,
  },
  pressed: {
    opacity: 0.78,
  },
  price: {
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: 18,
    marginTop: 3,
  },
  quantityLabel: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  quantityValue: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 18,
    minWidth: 26,
    textAlign: 'center',
  },
  quantityWrap: {
    gap: spacing.xs,
  },
  raceBadge: {
    backgroundColor: colors.amberSoft,
    borderRadius: radii.sm,
    maxWidth: 132,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  raceText: {
    color: colors.warning,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  registry: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: 3,
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: colors.redSoft,
    borderColor: `${colors.danger}30`,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 60,
    paddingHorizontal: spacing.lg,
  },
  removeText: {
    color: colors.danger,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stepperButton: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}24`,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  stepperButtonDisabled: {
    backgroundColor: colors.muted,
    borderColor: colors.border,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
});
