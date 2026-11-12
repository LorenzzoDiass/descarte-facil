import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIXO = '@descarte-facil';

export const CHAVES = {
  sessao: `${PREFIXO}:sessao`,
  solicitacoes: `${PREFIXO}:solicitacoes`,
  doacoes: `${PREFIXO}:doacoes`,
} as const;

export async function lerJson<T>(chave: string): Promise<T | null> {
  const valor = await AsyncStorage.getItem(chave);
  if (valor === null) return null;

  try {
    return JSON.parse(valor) as T;
  } catch {
    await AsyncStorage.removeItem(chave);
    return null;
  }
}

export async function salvarJson<T>(chave: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function remover(chave: string): Promise<void> {
  await AsyncStorage.removeItem(chave);
}

/**
 * Lê uma coleção. Na primeira execução, grava os registros demonstrativos para que a
 * demonstração tenha dados e, a partir daí, todas as alterações ficam persistidas.
 */
export async function lerColecao<T>(chave: string, criarDadosIniciais: () => T[]): Promise<T[]> {
  const salvos = await lerJson<T[]>(chave);
  if (salvos) return salvos;

  const iniciais = criarDadosIniciais();
  await salvarJson(chave, iniciais);
  return iniciais;
}
