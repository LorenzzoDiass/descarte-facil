import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Notice } from '@/components/Notice';
import { OccupancyBar } from '@/components/OccupancyBar';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { ESTADO_LOTACAO } from '@/constants/status';
import { ECOPONTOS } from '@/data/ecopontos';
import { useSensoresEcopontos } from '@/hooks/useSensoresEcopontos';
import { INTERVALO_LEITURA_MS, LIMITE_LOTADO } from '@/services/iotSimulator';
import { spacing } from '@/theme';
import { formatarHora } from '@/utils/dates';

export default function EcopontosScreen() {
  const { leituras, alertasLotacao, simularLotacao, dispensarAlerta } = useSensoresEcopontos(ECOPONTOS);

  return (
    <Screen>
      {alertasLotacao.map((ecopontoId) => {
        const ecoponto = ECOPONTOS.find((item) => item.id === ecopontoId);
        const leitura = leituras[ecopontoId];
        if (!ecoponto || !leitura) return null;
        return (
          <Notice
            key={ecopontoId}
            tom="danger"
            titulo={`${ecoponto.nome} lotado`}
            mensagem={`A caçamba está com ${leitura.ocupacao}% de ocupação. Prefira outro ecoponto até a troca da caçamba.`}
            onDismiss={() => dispensarAlerta(ecopontoId)}
          />
        );
      })}

      <Notice
        titulo="Lotação simulada"
        mensagem={`Os percentuais representam o comportamento esperado de sensores IoT nas caçambas e são gerados pelo próprio app a cada ${INTERVALO_LEITURA_MS / 1000} segundos. Não há sensor físico conectado. Acima de ${LIMITE_LOTADO}% o ecoponto é considerado lotado.`}
      />

      <AppText variant="caption">
        Endereços conforme a página da Subprefeitura Vila Prudente. Confirme horários no site da prefeitura antes de ir.
      </AppText>

      {ECOPONTOS.map((ecoponto) => {
        const leitura = leituras[ecoponto.id];
        const estilo = ESTADO_LOTACAO[leitura.estado];

        return (
          <Card key={ecoponto.id}>
            <View style={styles.cabecalho}>
              <View style={styles.nome}>
                <AppText variant="bodyStrong">{ecoponto.nome}</AppText>
                <AppText variant="small">
                  {ecoponto.endereco} · {ecoponto.bairro}
                </AppText>
              </View>
              <StatusBadge {...estilo} />
            </View>

            <View style={styles.ocupacao}>
              <View style={styles.linhaOcupacao}>
                <AppText variant="label">Ocupação da caçamba</AppText>
                <AppText variant="bodyStrong" color={estilo.cor}>
                  {leitura.ocupacao}%
                </AppText>
              </View>
              <OccupancyBar ocupacao={leitura.ocupacao} estado={leitura.estado} />
              <AppText variant="caption">Leitura simulada às {formatarHora(leitura.lidaEm)}</AppText>
            </View>

            <AppText variant="caption">
              Subprefeitura {ecoponto.subprefeitura}. {ecoponto.horario}
            </AppText>

            <Button
              label="Simular lotação"
              variant="ghost"
              compact
              accessibilityHint={`Leva a ocupação de ${ecoponto.nome} acima de ${LIMITE_LOTADO}% para demonstrar o alerta`}
              onPress={() => simularLotacao(ecoponto.id)}
            />
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  nome: {
    flex: 1,
    gap: 2,
  },
  ocupacao: {
    gap: spacing.xs,
  },
  linhaOcupacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
