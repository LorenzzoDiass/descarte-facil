import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

interface EstadoDados<T> {
  dados: T | undefined;
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
}

/**
 * Carrega dados sempre que a tela recebe foco, para refletir alterações feitas em outras telas.
 */
export function useDadosAoFocar<T>(carregar: () => Promise<T>): EstadoDados<T> {
  const [dados, setDados] = useState<T>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const carregarRef = useRef(carregar);
  carregarRef.current = carregar;

  const executar = useCallback(() => {
    let ativo = true;
    setErro(null);

    carregarRef
      .current()
      .then((resultado) => {
        if (ativo) setDados(resultado);
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar os dados salvos no aparelho.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useFocusEffect(executar);

  const recarregar = useCallback(() => {
    setCarregando(true);
    executar();
  }, [executar]);

  return { dados, carregando, erro, recarregar };
}
