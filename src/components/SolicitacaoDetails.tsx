import { Image, StyleSheet, View } from 'react-native';
import { buscarCategoria, NOMES_DESTINO } from '@/data/categorias';
import { STATUS_SOLICITACAO } from '@/constants/status';
import { colors, radius, spacing } from '@/theme';
import { Solicitacao } from '@/types';
import { formatarDataHora, formatarDataPorExtenso } from '@/utils/dates';
import { AppText } from './AppText';
import { Card } from './Card';
import { InfoRow, Section } from './Section';
import { StatusBadge } from './StatusBadge';

export function SolicitacaoDetails({ solicitacao }: { solicitacao: Solicitacao }) {
  const categoria = buscarCategoria(solicitacao.categoriaId);

  return (
    <>
      <View style={styles.titulo}>
        <AppText variant="title">{solicitacao.nomeObjeto}</AppText>
        <StatusBadge {...STATUS_SOLICITACAO[solicitacao.status]} />
      </View>

      {solicitacao.fotoUri ? (
        <Image source={{ uri: solicitacao.fotoUri }} style={styles.foto} accessibilityLabel={`Foto de ${solicitacao.nomeObjeto}`} />
      ) : null}

      <Card>
        <InfoRow
          rotulo="Data de coleta"
          valor={solicitacao.dataColeta ? `${formatarDataPorExtenso(solicitacao.dataColeta)} (demonstrativa)` : 'Sem data definida'}
        />
        <InfoRow rotulo="Categoria" valor={`${categoria.nome} · ${NOMES_DESTINO[categoria.destino]}`} />
        <InfoRow rotulo="Endereço" valor={`${solicitacao.endereco}, ${solicitacao.bairro} · CEP ${solicitacao.cep}`} />
        {solicitacao.descricao ? <InfoRow rotulo="Descrição" valor={solicitacao.descricao} /> : null}
        <InfoRow rotulo="Solicitante" valor={solicitacao.solicitante} />
      </Card>

      <Section titulo="Histórico">
        <Card>
          {solicitacao.historico.map((evento, indice) => (
            <View key={`${evento.em}-${indice}`} style={styles.evento}>
              <View style={[styles.marcador, { backgroundColor: STATUS_SOLICITACAO[evento.status].cor }]} />
              <View style={styles.textoEvento}>
                <AppText variant="bodyStrong">{STATUS_SOLICITACAO[evento.status].rotulo}</AppText>
                <AppText variant="caption">
                  {formatarDataHora(evento.em)} · {evento.responsavel}
                </AppText>
              </View>
            </View>
          ))}
        </Card>
      </Section>
    </>
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
  evento: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  marcador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
  },
  textoEvento: {
    flex: 1,
    gap: 2,
  },
});
