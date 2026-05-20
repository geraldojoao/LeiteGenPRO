import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import type { Matriz } from '@/types';

interface GenealogyInputProps {
  value: Matriz['genealogia'];
  onChange: (value: Matriz['genealogia']) => void;
}

export function GenealogyInput({ value, onChange }: GenealogyInputProps): JSX.Element {
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  const update = (field: keyof Matriz['genealogia'], fieldValue: string | boolean): void => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const toggleUnknown = (): void => {
    const next = !value.genealogiaDesconhecida;

    onChange({
      pai: next ? '' : value.pai,
      mae: next ? '' : value.mae,
      avoPaterno: next ? '' : value.avoPaterno,
      avoMaterno: next ? '' : value.avoMaterno,
      genealogiaDesconhecida: next,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Genealogia</Text>
        <Pressable
          accessibilityLabel="Alternar genealogia desconhecida"
          onPress={toggleUnknown}
          style={[styles.toggle, value.genealogiaDesconhecida && styles.toggleActive]}
        >
          <MaterialCommunityIcons
            name={(value.genealogiaDesconhecida ? 'checkbox-marked' : 'checkbox-blank-outline') as never}
            size={18}
            color={value.genealogiaDesconhecida ? colors.surface : colors.primary}
          />
          <Text style={[styles.toggleText, value.genealogiaDesconhecida && styles.toggleTextActive]}>
            Genealogia Desconhecida
          </Text>
        </Pressable>
      </View>

      {value.genealogiaDesconhecida && (
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
          <Text style={styles.infoText}>
            Sem genealogia definida. A IA usará apenas os dados fenotípicos para sugerir touros complementares.
          </Text>
        </View>
      )}

      <View style={[styles.grid, isWide && styles.gridWide]}>
        <GenealogyField
          label="Pai (Nome/Registro)"
          value={value.pai}
          disabled={value.genealogiaDesconhecida}
          wide={isWide}
          onChangeText={(text) => update('pai', text)}
        />
        <GenealogyField
          label="Mãe (Nome/Registro)"
          value={value.mae}
          disabled={value.genealogiaDesconhecida}
          wide={isWide}
          onChangeText={(text) => update('mae', text)}
        />
        <GenealogyField
          label="Avô Paterno"
          value={value.avoPaterno}
          disabled={value.genealogiaDesconhecida}
          wide={isWide}
          onChangeText={(text) => update('avoPaterno', text)}
        />
        <GenealogyField
          label="Avô Materno"
          value={value.avoMaterno}
          disabled={value.genealogiaDesconhecida}
          wide={isWide}
          onChangeText={(text) => update('avoMaterno', text)}
        />
      </View>
    </View>
  );
}

function GenealogyField({
  label,
  value,
  disabled,
  wide,
  onChangeText,
}: {
  label: string;
  value: string;
  disabled: boolean;
  wide?: boolean;
  onChangeText: (text: string) => void;
}): JSX.Element {
  return (
    <View style={[styles.field, wide && styles.fieldWide]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        editable={!disabled}
        onChangeText={onChangeText}
        placeholder="Nome ou registro"
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, disabled && styles.inputDisabled]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  field: {
    gap: 6,
  },
  fieldWide: {
    width: '48%',
  },
  grid: {
    gap: spacing.md,
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  infoBox: {
    alignItems: 'flex-start',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}30`,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  infoText: {
    color: colors.primary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  inputDisabled: {
    backgroundColor: '#f1eadb',
    color: colors.textSecondary,
  },
  label: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  toggle: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderColor: `${colors.primary}30`,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  toggleTextActive: {
    color: colors.surface,
  },
});
