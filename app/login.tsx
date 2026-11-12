
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { USUARIOS_DEMONSTRACAO } from '@/data/usuarios';
import { CredenciaisInvalidasError } from '@/services/authService';
import { colors, spacing } from '@/theme';
import { Perfil } from '@/types';
import { validarEmail, validarObrigatorio } from '@/utils/validators';

export default function LoginScreen() {
  const { usuario, entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Redirect href="/" />;

  function preencherDemonstracao(perfil: Perfil) {
    const conta = USUARIOS_DEMONSTRACAO.find((item) => item.perfil === perfil);
    if (!conta) return;
    setEmail(conta.email);
    setSenha(conta.senha);
    setErros({});
    setErroGeral(null);
  }

  async function enviar() {
    const novosErros = { email: validarEmail(email), senha: validarObrigatorio(senha, 'a senha') };
    setErros(novosErros);
    setErroGeral(null);
    if (novosErros.email || novosErros.senha) return;

    setEnviando(true);
    try {
      await entrar(email, senha);
    } catch (erro) {
      setErroGeral(erro instanceof CredenciaisInvalidasError ? erro.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Screen semCabecalho>
      <View style={styles.marca}>
        <View style={styles.selo} />
        <AppText variant="title">Descarte Fácil</AppText>
        <AppText variant="body" color={colors.textMuted}>
          Descarte correto de móveis e objetos grandes em São Paulo.
        </AppText>
      </View>

      <View style={styles.formulario}>
        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          error={erros.email}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextField
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          error={erros.senha}
          secureTextEntry
          textContentType="password"
          onSubmitEditing={enviar}
        />
        {erroGeral ? <Notice tom="danger" mensagem={erroGeral} /> : null}
        <Button label="Entrar" onPress={enviar} loading={enviando} />
      </View>

      <View style={styles.demonstracao}>
        <AppText variant="label">Contas de demonstração</AppText>
        <AppText variant="small">Preenche o e-mail e a senha de uma conta fictícia.</AppText>
        <View style={styles.botoesDemo}>
          <View style={styles.botaoDemo}>
            <Button label="Cidadão" variant="secondary" onPress={() => preencherDemonstracao('cidadao')} />
          </View>
          <View style={styles.botaoDemo}>
            <Button label="Agente" variant="secondary" onPress={() => preencherDemonstracao('agente')} />
          </View>
        </View>
        <AppText variant="caption">
          Autenticação local, criada apenas para fins acadêmicos. Não é adequada para produção.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  marca: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  selo: {
    width: 40,
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  formulario: {
    gap: spacing.lg,
  },
  demonstracao: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  botoesDemo: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  botaoDemo: {
    flex: 1,
  },
});
