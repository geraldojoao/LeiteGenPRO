import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { GenealogyInput } from '@/components/plantel/GenealogyInput';
import { RACAS } from '@/constants/domain';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useMatrizStore } from '@/store/matrizStore';
import type { Matriz, StatusMatriz } from '@/types';
import { formatDate } from '@/utils/formatters';

interface MatrizFormProps {
  onSaved?: (matriz: Matriz) => void;
  onCancel?: () => void;
}

type FormErrors = Partial<Record<'nome' | 'brinco' | 'raca' | 'nascimento' | 'producaoMediaLitros', string>>;

const statusOptions: StatusMatriz[] = ['Ativa', 'Seca', 'Descarte'];
const statusOptionLabels: Record<StatusMatriz, string> = {
  Ativa: 'Em leite',
  Seca: 'Seca',
  Descarte: 'Separar',
};

export function MatrizForm({ onSaved, onCancel }: MatrizFormProps): JSX.Element {
  const { width } = useWindowDimensions();
  const isNarrow = width < 430;
  const adicionarMatriz = useMatrizStore((state) => state.adicionarMatriz);
  const [nome, setNome] = useState('');
  const [brinco, setBrinco] = useState('');
  const [raca, setRaca] = useState('Girolando');
  const [status, setStatus] = useState<StatusMatriz>('Ativa');
  const [nascimento, setNascimento] = useState(new Date(2020, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [producaoMediaLitros, setProducaoMediaLitros] = useState('');
  const [numeroLactacoes, setNumeroLactacoes] = useState('1');
  const [intervaloEntrePartosDias, setIntervaloEntrePartosDias] = useState('395');
  const [fenotipo, setFenotipo] = useState({
    estatura: 6,
    profundidadeCorporal: 6,
    compostoUbere: 6,
    pernasEPes: 6,
  });
  const [genealogia, setGenealogia] = useState<Matriz['genealogia']>({
    pai: '',
    mae: '',
    avoPaterno: '',
    avoMaterno: '',
    genealogiaDesconhecida: false,
  });
  const [observacoes, setObservacoes] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [showPhotoField, setShowPhotoField] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const nascimentoIso = useMemo(() => nascimento.toISOString().slice(0, 10), [nascimento]);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!nome.trim()) {
      nextErrors.nome = 'Informe o nome ou apelido da matriz.';
    }

    if (!brinco.trim()) {
      nextErrors.brinco = 'Informe o número do brinco.';
    }

    if (!raca.trim()) {
      nextErrors.raca = 'Selecione a raça da matriz.';
    }

    if (!nascimentoIso) {
      nextErrors.nascimento = 'Informe a data de nascimento.';
    }

    if (!Number(producaoMediaLitros) || Number(producaoMediaLitros) <= 0) {
      nextErrors.producaoMediaLitros = 'Informe uma produção média válida.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const save = (): void => {
    if (!validate()) {
      Toast.show({
        type: 'error',
        text1: 'Revise os campos obrigatórios',
        text2: 'Há informações importantes faltando no cadastro da matriz.',
      });
      return;
    }

    const matriz = adicionarMatriz({
      nome: nome.trim(),
      brinco: brinco.trim(),
      raca,
      nascimento: nascimentoIso,
      producaoMediaLitros: Number(producaoMediaLitros),
      deps: {},
      fenotipo,
      genealogia,
      observacoes: observacoes.trim(),
      fotoUrl: fotoUrl.trim() || undefined,
      status,
      numeroLactacoes: Number(numeroLactacoes) || 1,
      intervaloEntrePartosDias: Number(intervaloEntrePartosDias) || 395,
    });

    Toast.show({
      type: 'success',
      text1: 'Matriz salva',
      text2: `${matriz.nome} entrou no plantel local com sucesso.`,
    });
    onSaved?.(matriz);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Section title="Identificação" icon="tag-multiple">
        <TextField label="Nome/Apelido" value={nome} onChangeText={setNome} error={errors.nome} />
        <TextField label="Nº do Brinco" value={brinco} onChangeText={setBrinco} error={errors.brinco} />
        <Text style={styles.label}>Raça</Text>
        <View style={styles.chipWrap}>
          {Array.from(new Set(['Girolando', ...RACAS])).map((item) => {
            const active = raca === item;
            return (
              <Pressable
                accessibilityLabel={`Selecionar raça ${item}`}
                key={item}
                onPress={() => setRaca(item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
        {errors.raca ? <Text style={styles.error}>{errors.raca}</Text> : null}

        <Text style={styles.label}>Situação</Text>
        <View style={styles.chipWrap}>
          {statusOptions.map((item) => {
            const active = status === item;
            return (
              <Pressable
                accessibilityLabel={`Selecionar situação ${statusOptionLabels[item]}`}
                key={item}
                onPress={() => setStatus(item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{statusOptionLabels[item]}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data de nascimento</Text>
          <Pressable
            accessibilityLabel="Selecionar data de nascimento"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <MaterialCommunityIcons name="calendar" size={18} color={colors.primary} />
            <Text style={styles.dateText}>{formatDate(nascimentoIso)}</Text>
          </Pressable>
          {errors.nascimento ? <Text style={styles.error}>{errors.nascimento}</Text> : null}
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={nascimento}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) {
                setNascimento(date);
              }
            }}
          />
        )}
      </Section>

      <Section title="Leite" icon="chart-line">
        <TextField
          label="Produção média"
          value={producaoMediaLitros}
          onChangeText={setProducaoMediaLitros}
          keyboardType="number-pad"
          suffix="litros/lactação"
          error={errors.producaoMediaLitros}
        />
        <TextField
          label="Número de lactações"
          value={numeroLactacoes}
          onChangeText={setNumeroLactacoes}
          keyboardType="number-pad"
        />
        <TextField
          label="Dias entre partos"
          value={intervaloEntrePartosDias}
          onChangeText={setIntervaloEntrePartosDias}
          keyboardType="number-pad"
          suffix="dias"
        />
      </Section>

      <Section title="Corpo do animal" icon="cow">
        <FenotipoSlider
          label="Estatura"
          value={fenotipo.estatura}
          onChange={(value) => setFenotipo((state) => ({ ...state, estatura: value }))}
        />
        <FenotipoSlider
          label="Profundidade corporal"
          value={fenotipo.profundidadeCorporal}
          onChange={(value) => setFenotipo((state) => ({ ...state, profundidadeCorporal: value }))}
        />
        <FenotipoSlider
          label="Úbere"
          value={fenotipo.compostoUbere}
          onChange={(value) => setFenotipo((state) => ({ ...state, compostoUbere: value }))}
        />
        <FenotipoSlider
          label="Pernas e pés"
          value={fenotipo.pernasEPes}
          onChange={(value) => setFenotipo((state) => ({ ...state, pernasEPes: value }))}
        />
      </Section>

      <Section title="Genealogia" icon="family-tree">
        <GenealogyInput value={genealogia} onChange={setGenealogia} />
      </Section>

      <Section title="Observações" icon="note-text-outline">
        <TextInput
          accessibilityLabel="Observações da matriz"
          multiline
          onChangeText={setObservacoes}
          placeholder="Histórico de saúde, manejo, reprodução, casco, mastite..."
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, styles.textArea]}
          value={observacoes}
        />
        {showPhotoField && (
          <TextField label="URL da foto (opcional)" value={fotoUrl} onChangeText={setFotoUrl} keyboardType="url" />
        )}
      </Section>

      <View style={[styles.actions, isNarrow && styles.actionsStack]}>
        <Pressable
          accessibilityLabel="Adicionar foto da matriz"
          onPress={() => setShowPhotoField((current) => !current)}
          style={styles.photoButton}
        >
          <MaterialCommunityIcons name="camera-plus" size={18} color={colors.primary} />
        <Text style={styles.photoText}>Adicionar foto</Text>
        </Pressable>
        <Pressable accessibilityLabel="Salvar matriz" onPress={save} style={styles.saveButton}>
          <MaterialCommunityIcons name="content-save" size={18} color={colors.surface} />
          <Text style={styles.saveText}>Salvar animal</Text>
        </Pressable>
      </View>

      {onCancel && (
        <Pressable accessibilityLabel="Cancelar cadastro de matriz" onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      )}
    </ScrollView>
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

function TextField({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  suffix,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'url';
  suffix?: string;
  error?: string;
}): JSX.Element {
  const { width } = useWindowDimensions();
  const compactSuffix = Boolean(suffix && width < 420);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, compactSuffix && styles.inputWrapStack]}>
        <TextInput
          accessibilityLabel={label}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, suffix && !compactSuffix ? styles.inputWithSuffix : undefined]}
          value={value}
        />
        {suffix ? <Text style={[styles.suffix, compactSuffix && styles.suffixInline]}>{suffix}</Text> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function FenotipoSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}): JSX.Element {
  return (
    <View style={styles.sliderRow}>
      <View style={styles.sliderHeader}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sliderValue}>{value}/9</Text>
      </View>
      <Slider
        accessibilityLabel={label}
        minimumValue={1}
        maximumValue={9}
        step={1}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.secondary}
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionsStack: {
    flexDirection: 'column',
  },
  cancelButton: {
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  cancelText: {
    color: colors.textSecondary,
    fontFamily: fonts.heading,
    fontSize: 17,
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
  container: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  dateButton: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 60,
  },
  dateText: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  field: {
    gap: 6,
  },
  input: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    color: colors.textPrimary,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    minHeight: 60,
    paddingHorizontal: spacing.md,
  },
  inputWithSuffix: {
    paddingRight: 122,
  },
  inputWrap: {
    position: 'relative',
  },
  inputWrapStack: {
    gap: 4,
  },
  label: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  photoButton: {
    alignItems: 'center',
    backgroundColor: colors.emeraldSoft,
    borderRadius: radii.sm,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
  },
  photoText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 60,
  },
  saveText: {
    color: colors.surface,
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
    ...shadows.soft,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.heading,
    fontSize: 22,
  },
  sliderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderRow: {
    gap: 4,
  },
  sliderValue: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  suffix: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    position: 'absolute',
    right: spacing.md,
    top: 14,
  },
  suffixInline: {
    alignSelf: 'flex-end',
    position: 'relative',
    right: 0,
    top: 0,
  },
  textArea: {
    minHeight: 108,
    textAlignVertical: 'top',
  },
});
