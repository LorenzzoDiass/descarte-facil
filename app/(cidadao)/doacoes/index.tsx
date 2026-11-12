import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Notice } from '@/components/Notice';
import { OptionSelector } from '@/components/OptionSelector';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { StatusBadge } from '@/components/StatusBadge';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { buscarCategoria } from '@/data/categorias';
import { useDadosAoFocar } from '@/hooks/useDadosAoFocar';
import { listarDoacoes } from '@/services/doacaoService';
import { colors } from '@/theme';

type Filtro = 'disponiveis' | 'minhas';

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: 'disponiveis', rotulo: 'Disponíveis' },
  { valor: 'minhas', rotulo: 'Minhas doações' },
];

export default function DoacoesScreen() {
  const usuario = useUsuarioLogado();
  const router = useRouter();
  const [filtro, setFiltro] = useState<Filtro>('disponiveis');
  const { dados, carregando, erro, recarregar } = useDadosAoFocar(listarDoacoes);

  if (carregando && !dados) return <LoadingState />;
  if (erro || !dados) return <ErrorState mensagem={erro ?? 'Dados indisponíveis.'} onRetry={recarregar} />;

  const lista =
    filtro === 'disponiveis'
      ? dados.filter((doacao) => doacao.disponivel)
      : dados.filter((doacao) => doacao.usuarioId === usuario.id);

  return (
    <Screen>
      <Notice mensagem="As doações ficam salvas apenas neste aparelho e não são sincronizadas com outros usuários. A lista mostra só o bairro, nunca o endereço." />

      <Button label="Cadastrar doação" icon="plus" onPress={() => router.push('/doacoes/nova')} />

      <OptionSelector opcoes={FILTROS} selecionado={filtro} onChange={setFiltro} label="Mostrar" />

      {lista.length === 0 ? (
        <EmptyState
          titulo={filtro === 'disponiveis' ? 'Nenhuma doação disponível' : 'Você ainda não cadastrou doações'}
          descricao="Antes de descartar um objeto em bom estado, ofereça para quem mora perto."
          icone="repeat"
        />
      ) : (
        <Card style={{ paddingVertical: 0, gap: 0 }}>
          {lista.map((doacao, indice) => (
            <ListRow
              key={doacao.id}
              titulo={doacao.nomeObjeto}
              subtitulo={`${buscarCategoria(doacao.categoriaId).nome} · ${doacao.bairro}`}
              detalhe={
                doacao.disponivel ? null : (
                  <StatusBadge rotulo="Indisponível" cor={colors.textMuted} fundo={colors.neutralSoft} />
                )
              }
              accessibilityHint="Abre os detalhes da doação"
              onPress={() => router.push(`/doacoes/${doacao.id}`)}
              ultimo={indice === lista.length - 1}
            />
          ))}
        </Card>
      )}
    </Screen>
  );
}
