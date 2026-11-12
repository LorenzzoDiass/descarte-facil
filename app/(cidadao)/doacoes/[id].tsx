
import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Notice } from '@/components/Notice';
import { Screen } from '@/components/Screen';
import { InfoRow } from '@/components/Section';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { StatusBadge } from '@/components/StatusBadge';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { buscarCategoria } from '@/data/categorias';
import { useDadosAoFocar } from '@/hooks/useDadosAoFocar';
import { alterarDisponibilidade, buscarDoacao } from '@/services/doacaoService';
import { colors, radius, spacing } from '@/theme';
import { formatarDataHora } from '@/utils/dates';
import { apenasDigitos } from '@/utils/masks';

export default function DetalheDoacaoScreen() {
  const { id, criada } = useLocalSearchParams<{ id: string; criada?: string }>();
  const usuario = useUsuarioLogado();
  const { dados, carregando, erro, recarregar } = useDadosAoFocar(() => buscarDoacao(id));

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tom: 'success' | 'danger';
    texto: string;
  } | null>(
    criada
      ? { tom: 'success', texto: 'Doação publicada. Ela aparece na lista de disponíveis.' }
      : null,
  );

  if (carregando && !dados) return <LoadingState />;
  if (erro) return <ErrorState mensagem={erro} onRetry={recarregar} />;
  if (!dados) return <EmptyState titulo="Doação não encontrada" icone="search" />;

  const doacao = dados;
  const ehDono = doacao.usuarioId === usuario.id;

  async function abrirWhatsApp() {
    const telefone = apenasDigitos(doacao.telefone ?? '');

    if (!telefone) {
      setMensagem({
        tom: 'danger',
        texto: 'Telefone não informado.',
      });
      return;
    }

    const numero = telefone.startsWith('55')
      ? telefone
      : `55${telefone}`;

    const texto = `Olá! Vi sua doação de ${doacao.nomeObjeto} no Descarte Fácil e gostaria de saber se ainda está disponível.`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

    try {
      await Linking.openURL(url);
    } catch {
      setMensagem({
        tom: 'danger',
        texto: 'Não foi possível abrir o WhatsApp.',
      });
    }
  }

  async function ligarParaDoador() {
    const telefone = apenasDigitos(doacao.telefone ?? '');

    try {
      await Linking.openURL(`tel:${telefone}`);
    } catch {
      setMensagem({
        tom: 'danger',
        texto: 'Não foi possível iniciar a ligação.',
      });
    }
  }

  async function alternarDisponibilidade() {
    setSalvando(true);

    try {
      await alterarDisponibilidade(
        doacao.id,
        !doacao.disponivel,
        usuario.id,
      );

      setMensagem({
        tom: 'success',
        texto: doacao.disponivel
          ? 'Doação marcada como indisponível.'
          : 'Doação disponível novamente.',
      });

      recarregar();
    } catch {
      setMensagem({
        tom: 'danger',
        texto: 'Não foi possível atualizar a doação.',
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Screen>
      {mensagem ? (
        <Notice
          tom={mensagem.tom}
          mensagem={mensagem.texto}
          onDismiss={() => setMensagem(null)}
        />
      ) : null}

      <View style={styles.titulo}>
        <AppText variant="title">
          {doacao.nomeObjeto}
        </AppText>

        <StatusBadge
          rotulo={doacao.disponivel ? 'Disponível' : 'Indisponível'}
          cor={doacao.disponivel ? colors.success : colors.textMuted}
          fundo={doacao.disponivel ? colors.successSoft : colors.neutralSoft}
        />
      </View>

      {doacao.fotoUri ? (
        <Image
          source={{ uri: doacao.fotoUri }}
          style={styles.foto}
          accessibilityLabel={`Foto de ${doacao.nomeObjeto}`}
        />
      ) : null}

      <Card>
        <InfoRow
          rotulo="Categoria"
          valor={buscarCategoria(doacao.categoriaId).nome}
        />

        <InfoRow
          rotulo="Descrição"
          valor={doacao.descricao}
        />

        <InfoRow
          rotulo="Bairro"
          valor={doacao.bairro}
        />

        <InfoRow
          rotulo="Publicada em"
          valor={formatarDataHora(doacao.criadaEm)}
        />
      </Card>

      {doacao.telefone ? (
        <>
          <Button
            label="Conversar pelo WhatsApp"
            variant="primary"
            icon="message-circle"
            onPress={abrirWhatsApp}
          />

          <Button
            label={`Ligar para ${doacao.telefone}`}
            variant="secondary"
            icon="phone"
            onPress={ligarParaDoador}
          />
        </>
      ) : (
        <AppText variant="small">
          Quem cadastrou não informou telefone.
        </AppText>
      )}

      {ehDono ? (
        <Button
          label={
            doacao.disponivel
              ? 'Marcar como indisponível'
              : 'Marcar como disponível'
          }
          variant={doacao.disponivel ? 'danger' : 'primary'}
          onPress={alternarDisponibilidade}
          loading={salvando}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  titulo: {
    gap: spacing.sm,
  },

  foto: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.neutralSoft,
  },
});
