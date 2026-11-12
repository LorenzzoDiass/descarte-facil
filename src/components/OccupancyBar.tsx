import { StyleSheet, View } from 'react-native';
import { ESTADO_LOTACAO } from '@/constants/status';
import { colors, radius } from '@/theme';
import { EstadoLotacao } from '@/types';

interface OccupancyBarProps {
  ocupacao: number;
  estado: EstadoLotacao;
}

export function OccupancyBar({ ocupacao, estado }: OccupancyBarProps) {
  const estilo = ESTADO_LOTACAO[estado];

  return (
    <View
      style={styles.trilho}
      accessibilityRole="progressbar"
      accessibilityLabel={`Ocupação da caçamba: ${ocupacao}%, ${estilo.rotulo}`}
      accessibilityValue={{ min: 0, max: 100, now: ocupacao }}
    >
      <View style={[styles.preenchimento, { width: `${ocupacao}%`, backgroundColor: estilo.cor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: {
    height: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.neutralSoft,
    overflow: 'hidden',
  },
  preenchimento: {
    height: '100%',
  },
});
