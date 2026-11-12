import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useAuth, useUsuarioLogado } from '@/contexts/AuthContext';
import { restaurarDoacoesDemonstrativas } from '@/services/doacaoService';
import { restaurarSolicitacoesDemonstrativas } from '@/services/solicitacaoService';
import { spacing } from '@/theme';
import { Button } from './Button';
import { Card } from './Card';
import { ConfirmPanel } from './ConfirmPanel';
import { Notice } from './Notice';
import { InfoRow, Section } from './Section';
import { Screen } from './Screen';

const NOMES_PERFIL = { cidadao: 'Cidadão', agente: 'Agente de coleta' } as const;

export function AccountPanel() {
  const usuario = useUsuarioLogado();
  const { sair } = useAuth();
  const router = useRouter();
  const [confirmandoRestauracao, setConfirmandoRestauracao] = useState(false);
  const [restaurando, setRestaurando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function restaurarDados() {
    setRestaurando(true);
    try {
      await Promise.all([restaurarSolicitacoesDemonstrativas(), restaurarDoacoesDemonstrativas()]);
      setMensagem('Os dados de demonstração foram restaurados.');
    } catch {
      setMensagem('Não foi possível restaurar os dados. Tente novamente.');
    } finally {
      setRestaurando(false);
      setConfirmandoRestauracao(false);
    }
  }

  async function encerrar() {
    await sair();
    router.replace('/login');
  }

  return (
    <Screen>
      <Card>
        <InfoRow rotulo="Nome" valor={usuario.nome} />
        <InfoRow rotulo="E-mail" valor={usuario.email} />
        <InfoRow rotulo="Perfil" valor={NOMES_PERFIL[usuario.perfil]} />
        {usuario.bairro ? <InfoRow rotulo="Bairro" valor={usuario.bairro} /> : null}
      </Card>

      <Notice
        titulo="Acesso de demonstração"
        mensagem="O login deste app é local e serve apenas para fins acadêmicos. Ele não é adequado para uso em produção."
      />

      <Section titulo="Dados do aparelho">
        {mensagem ? <Notice tom="success" mensagem={mensagem} onDismiss={() => setMensagem(null)} /> : null}
        {confirmandoRestauracao ? (
          <ConfirmPanel
            mensagem="Restaurar os dados de demonstração? Solicitações e doações criadas neste aparelho serão apagadas."
            rotuloConfirmar="Restaurar"
            perigoso
            carregando={restaurando}
            onConfirmar={restaurarDados}
            onCancelar={() => setConfirmandoRestauracao(false)}
          />
        ) : (
          <Button
            label="Restaurar dados de demonstração"
            variant="secondary"
            icon="rotate-ccw"
            onPress={() => setConfirmandoRestauracao(true)}
          />
        )}
      </Section>

      <View style={{ marginTop: spacing.sm }}>
        <Button label="Sair da conta" variant="danger" icon="log-out" onPress={encerrar} />
      </View>
    </Screen>
  );
}
