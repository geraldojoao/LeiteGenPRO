import { Fragment, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { normalizarDEPPorRaca } from '@/logic/selectionIndex';
import type { Touro } from '@/types';

interface SpiderChartProps {
  touro: Touro;
}

interface AxisScore {
  label: string;
  score: number;
  explanation: string;
}

function pointFor(index: number, total: number, score: number, chartSize: number): { x: number; y: number } {
  const center = chartSize / 2;
  const radius = chartSize * 0.34;
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const normalizedRadius = (score / 100) * radius;

  return {
    x: center + Math.cos(angle) * normalizedRadius,
    y: center + Math.sin(angle) * normalizedRadius,
  };
}

export function SpiderChart({ touro }: SpiderChartProps): JSX.Element {
  const { width } = useWindowDimensions();
  const chartSize = Math.min(280, Math.max(width - 84, 220));
  const center = chartSize / 2;
  const axes = useMemo<AxisScore[]>(
    () => [
      {
        label: 'Leite',
        score: normalizarDEPPorRaca(touro, 'leite'),
        explanation: 'Mostra a força do touro para ajudar a aumentar o leite das filhas.',
      },
      {
        label: 'Gordura',
        score: normalizarDEPPorRaca(touro, 'gordura'),
        explanation: 'Ajuda quando o leite é pago por qualidade.',
      },
      {
        label: 'Proteína',
        score: normalizarDEPPorRaca(touro, 'proteina'),
        explanation: 'Ajuda no rendimento do leite para derivados.',
      },
      {
        label: 'Vida',
        score: normalizarDEPPorRaca(touro, 'vidaProdutiva'),
        explanation: 'Mostra chance de as filhas produzirem por mais tempo.',
      },
      {
        label: 'Úbere',
        score: (touro.fenotipo.compostoUbere / 9) * 100,
        explanation: 'Mostra qualidade do úbere para ordenha.',
      },
      {
        label: 'Pernas',
        score: (touro.fenotipo.pernasEPes / 9) * 100,
        explanation: 'Mostra força das pernas para andar bem no manejo.',
      },
      {
        label: 'Temp.',
        score: (touro.deps.temperamento / 9) * 100,
        explanation: 'Mostra se as filhas tendem a ser mais fáceis de manejar.',
      },
    ],
    [touro],
  );
  const [selected, setSelected] = useState(axes[0]);

  const polygonPoints = axes
    .map((axis, index) => {
      const point = pointFor(index, axes.length, axis.score, chartSize);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Qualidade genética</Text>
        <Text style={styles.subtitle}>Quanto maior, melhor para a fazenda</Text>
      </View>

      <Svg width={chartSize} height={chartSize} accessibilityLabel={`Qualidade genética de ${touro.nome}`}>
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const ringPoints = axes
            .map((_, index) => {
              const point = pointFor(index, axes.length, ratio * 100, chartSize);
              return `${point.x},${point.y}`;
            })
            .join(' ');
          return (
            <Polygon
              key={ratio}
              points={ringPoints}
              fill="none"
              stroke={colors.border}
              strokeWidth={1}
            />
          );
        })}

        {axes.map((axis, index) => {
          const axisEnd = pointFor(index, axes.length, 100, chartSize);

          return (
            <Line
              key={axis.label}
              x1={center}
              y1={center}
              x2={axisEnd.x}
              y2={axisEnd.y}
              stroke={colors.border}
              strokeWidth={1}
            />
          );
        })}

        <Polygon points={polygonPoints} fill={`${colors.primary}33`} stroke={colors.primary} strokeWidth={3} />
        {axes.map((axis, index) => {
          const point = pointFor(index, axes.length, axis.score, chartSize);
          const label = pointFor(index, axes.length, 118, chartSize);

          return (
            <Fragment key={axis.label}>
              <Circle cx={point.x} cy={point.y} r={4} fill={colors.secondary} />
              <SvgText
                x={label.x}
                y={label.y}
                fill={colors.textPrimary}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {axis.label}
              </SvgText>
            </Fragment>
          );
        })}
      </Svg>

      <View style={styles.axisList}>
        {axes.map((axis) => (
          <Pressable
            accessibilityLabel={`Explicar ${axis.label}`}
            key={axis.label}
            onPress={() => setSelected(axis)}
            style={[styles.axisChip, selected?.label === axis.label && styles.axisChipActive]}
          >
            <Text style={[styles.axisText, selected?.label === axis.label && styles.axisTextActive]}>
              {axis.label} {Math.round(axis.score)}
            </Text>
          </Pressable>
        ))}
      </View>

      {selected && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipTitle}>O que isso significa para você?</Text>
          <Text style={styles.tooltipText}>{selected.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  axisChip: {
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    minHeight: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  axisChipActive: {
    backgroundColor: colors.primary,
  },
  axisList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  axisText: {
    color: colors.textSecondary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  axisTextActive: {
    color: colors.surface,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  header: {
    alignSelf: 'stretch',
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
    fontSize: 22,
  },
  tooltip: {
    alignSelf: 'stretch',
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 2,
    padding: spacing.md,
  },
  tooltipText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },
  tooltipTitle: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
});
