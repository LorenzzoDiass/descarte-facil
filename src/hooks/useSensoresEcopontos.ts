import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  criarLeitura,
  cruzouLimiteDeLotacao,
  gerarProximaOcupacao,
  INTERVALO_LEITURA_MS,
  OCUPACAO_DEMONSTRACAO_LOTADO,
} from '@/services/iotSimulator';
import { Ecoponto, LeituraSensor } from '@/types';

type MapaLeituras = Record<string, LeituraSensor>;

function leiturasIniciais(ecopontos: Ecoponto[]): MapaLeituras {
  return Object.fromEntries(
    ecopontos.map((ecoponto) => [ecoponto.id, criarLeitura(ecoponto.id, ecoponto.ocupacaoInicial)]),
  );
}

/**
 * Mantém as leituras simuladas dos sensores enquanto a tela estiver em foco.
 * Quando um ecoponto passa a ficar lotado, registra um alerta para a interface exibir.
 */
export function useSensoresEcopontos(ecopontos: Ecoponto[]) {
  const leiturasRef = useRef<MapaLeituras>(leiturasIniciais(ecopontos));
  const [leituras, setLeituras] = useState<MapaLeituras>(leiturasRef.current);
  const [alertasLotacao, setAlertasLotacao] = useState<string[]>([]);

  const registrarLeituras = useCallback((calcular: (anterior: LeituraSensor) => number) => {
    const proximas: MapaLeituras = {};
    const novosAlertas: string[] = [];

    for (const [id, anterior] of Object.entries(leiturasRef.current)) {
      const leitura = criarLeitura(id, calcular(anterior));
      if (cruzouLimiteDeLotacao(anterior, leitura)) novosAlertas.push(id);
      proximas[id] = leitura;
    }

    leiturasRef.current = proximas;
    setLeituras(proximas);

    if (novosAlertas.length > 0) {
      setAlertasLotacao((atuais) => [...atuais.filter((id) => !novosAlertas.includes(id)), ...novosAlertas]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const intervalo = setInterval(() => {
        registrarLeituras((anterior) => gerarProximaOcupacao(anterior.ocupacao));
      }, INTERVALO_LEITURA_MS);
      return () => clearInterval(intervalo);
    }, [registrarLeituras]),
  );

  const simularLotacao = useCallback(
    (ecopontoId: string) => {
      registrarLeituras((anterior) =>
        anterior.ecopontoId === ecopontoId ? OCUPACAO_DEMONSTRACAO_LOTADO : anterior.ocupacao,
      );
    },
    [registrarLeituras],
  );

  const dispensarAlerta = useCallback((ecopontoId: string) => {
    setAlertasLotacao((atuais) => atuais.filter((id) => id !== ecopontoId));
  }, []);

  return { leituras, alertasLotacao, simularLotacao, dispensarAlerta };
}
