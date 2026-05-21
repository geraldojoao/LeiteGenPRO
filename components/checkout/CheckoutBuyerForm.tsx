import { Text, TextInput, StyleSheet, View } from 'react-native';
import { colors, fonts, radii, spacing } from '@/constants/theme';

export interface CheckoutBuyerData {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  cidade: string;
  estado: string;
}

export type CheckoutBuyerErrors = Partial<Record<keyof CheckoutBuyerData, string>>;

interface CheckoutBuyerFormProps {
  data: CheckoutBuyerData;
  errors: CheckoutBuyerErrors;
  onChange: (field: keyof CheckoutBuyerData, value: string) => void;
}

export function CheckoutBuyerForm({ data, errors, onChange }: CheckoutBuyerFormProps): JSX.Element {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.sectionTitle}>Dados do comprador</Text>
        <Text style={styles.sectionSubtitle}>Informe os dados para nossa equipe entrar em contato.</Text>
      </View>

      <Field
        error={errors.nome}
        keyboardType="default"
        label="Nome completo"
        onChangeText={(value) => onChange('nome', value)}
        placeholder="Nome do responsável pela compra"
        value={data.nome}
      />
      <View style={styles.row}>
        <Field
          autoCapitalize="none"
          error={errors.email}
          keyboardType="email-address"
          label="E-mail"
          onChangeText={(value) => onChange('email', value)}
          placeholder="compras@fazenda.com.br"
          value={data.email}
        />
        <Field
          error={errors.telefone}
          keyboardType="phone-pad"
          label="Telefone"
          onChangeText={(value) => onChange('telefone', value)}
          placeholder="(00) 00000-0000"
          value={data.telefone}
        />
      </View>
      <Field
        error={errors.documento}
        keyboardType="number-pad"
        label="CPF/CNPJ"
        onChangeText={(value) => onChange('documento', value)}
        placeholder="Apenas para identificação comercial"
        value={data.documento}
      />
      <View style={styles.row}>
        <Field
          error={errors.cidade}
          keyboardType="default"
          label="Cidade"
          onChangeText={(value) => onChange('cidade', value)}
          placeholder="Cidade"
          value={data.cidade}
        />
        <Field
          autoCapitalize="characters"
          error={errors.estado}
          keyboardType="default"
          label="Estado"
          maxLength={2}
          onChangeText={(value) => onChange('estado', value.toUpperCase())}
          placeholder="UF"
          value={data.estado}
        />
      </View>
    </View>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maxLength,
}: FieldProps): JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, error ? styles.inputError : undefined]}
        value={value}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    gap: spacing.md,
    padding: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 22,
  },
  field: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 210,
  },
  input: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    fontSize: 16,
    minHeight: 60,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: colors.danger,
  },
  label: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 3,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
  },
});
