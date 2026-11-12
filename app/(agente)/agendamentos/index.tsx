import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { OptionSelector } from '@/components/OptionSelector';
import { Screen } from '@/components/Screen';
import { SolicitacaoRow } from '@/components/SolicitacaoRow';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { useDadosAoFocar } from '@/hooks/useDadosAoFocar';
import { listarSolicitacoes } from '@/services/solicitacaoService';
import { StatusSolicitacao } from '@/types';

type Filtro = 'todas' | StatusSolicitacao;

const ROTULOS: Record<Filtro, string> = {
  todas: 'Todas',
  aguardando_coleta: 'Aguardando',
  coletada: 'Coletadas',
  nao_coletada: 'Não coletadas',
  cancelada: 'Canceladas',
};

export default function AgendamentosScreen() {
  const usuario = useUsuarioLogado();
  const router = useRouter();
  const [filtro, setFiltro] = useState<Filtro>('aguardando_coleta');
  const { dados, carregando, erro, recarregar } = useDadosAoFocar(listarSolicitacoes);

  if (carregando && !dados) return <LoadingState />;
  if (erro || !dados) return <ErrorState mensagem={erro ?? 'Dados indisponíveis.'} onRetry={recarregar} />;

  const contar = (valor: Filtro) => (valor === 'todas' ? dados.length : dados.filter((item) => item.status === valor).length);
  const opcoes = (Object.keys(ROTULOS) as Filtro[]).map((valor) => ({
    valor,
    rotulo: `${ROTULOS[valor]} (${contar(valor)})`,
  }));
  const lista = filtro === 'todas' ? dados : dados.filter((item) => item.status === filtro);

  return (
    <Screen>
      <View style={styles.saudacao}>
        <AppText variant="title">Coletas</AppText>
        <AppText variant="small">
          {usuario.nome}. Registros salvos neste aparelho, incluindo os criados pelo perfil Cidadão.
        </AppText>
      </View>

      <OptionSelector label="Filtrar por situação" opcoes={opcoes} selecionado={filtro} onChange={setFiltro} />

      {lista.length === 0 ? (
        <EmptyState titulo="Nenhum agendamento nesta situação" icone="clipboard" />
      ) : (
        <Card style={styles.lista}>
          {lista.map((solicitacao, indice) => (
            <SolicitacaoRow
              key={solicitacao.id}
              solicitacao={solicitacao}
              mostrarBairro
              ultimo={indice === lista.length - 1}
              onPress={() => router.push(`/agendamentos/${solicitacao.id}`)}
            />
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  saudacao: {
    gap: 2,
  },
  lista: {
    paddingVertical: 0,
    gap: 0,
  },
});
