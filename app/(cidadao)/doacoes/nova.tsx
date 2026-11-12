
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { OptionSelector } from '@/components/OptionSelector';
import { PhotoPicker } from '@/components/PhotoPicker';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useUsuarioLogado } from '@/contexts/AuthContext';
import { CATEGORIAS_DOACAO } from '@/data/categorias';
import { criarDoacao } from '@/services/doacaoService';
import { CategoriaId } from '@/types';
import { apenasDigitos, formatarTelefone } from '@/utils/masks';
import {
  ErrosFormulario,
  possuiErros,
  validarObrigatorio,
} from '@/utils/validators';

interface Formulario {
  nomeObjeto: string;
  categoriaId?: CategoriaId;
  descricao: string;
  fotoUri?: string;
  bairro: string;
  telefone: string;
}

const OPCOES_CATEGORIA = CATEGORIAS_DOACAO.map((categoria) => ({
  valor: categoria.id,
  rotulo: categoria.nome,
}));

function validarTelefoneObrigatorio(telefone: string): string | undefined {
  const digitos = apenasDigitos(telefone);

  if (!digitos) {
    return 'Informe um telefone para contato.';
  }

  if (digitos.length !== 10 && digitos.length !== 11) {
    return 'Informe um telefone válido com DDD.';
  }

  if (digitos.slice(0, 2) === '00') {
    return 'Informe um DDD válido.';
  }

  return undefined;
}

function validar(formulario: Formulario): ErrosFormulario<Formulario> {
  return {
    nomeObjeto: validarObrigatorio(
      formulario.nomeObjeto,
      'o nome do objeto',
      3,
    ),
    categoriaId: formulario.categoriaId
      ? undefined
      : 'Escolha uma categoria.',
    descricao: validarObrigatorio(
      formulario.descricao,
      'a descrição',
      10,
    ),
    bairro: validarObrigatorio(
      formulario.bairro,
      'o bairro',
      3,
    ),
    telefone: validarTelefoneObrigatorio(formulario.telefone),
  };
}

export default function NovaDoacaoScreen() {
  const usuario = useUsuarioLogado();
  const router = useRouter();

  const [formulario, setFormulario] = useState<Formulario>({
    nomeObjeto: '',
    descricao: '',
    bairro: usuario.bairro ?? '',
    telefone: '',
  });

  const [erros, setErros] = useState<ErrosFormulario<Formulario>>({});
  const [salvando, setSalvando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  function atualizar<K extends keyof Formulario>(
    campo: K,
    valor: Formulario[K],
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));

    if (erros[campo]) {
      setErros((atuais) => ({
        ...atuais,
        [campo]: undefined,
      }));
    }
  }

  async function publicar() {
    const novosErros = validar(formulario);

    setErros(novosErros);
    setErroEnvio(null);

    if (possuiErros(novosErros) || !formulario.categoriaId) {
      return;
    }

    setSalvando(true);

    try {
      const doacao = await criarDoacao(
        {
          nomeObjeto: formulario.nomeObjeto.trim(),
          categoriaId: formulario.categoriaId,
          descricao: formulario.descricao.trim(),
          fotoUri: formulario.fotoUri,
          bairro: formulario.bairro.trim(),
          telefone: formulario.telefone,
        },
        usuario,
      );

      router.replace({
        pathname: '/doacoes/[id]',
        params: {
          id: doacao.id,
          criada: '1',
        },
      });
    } catch {
      setErroEnvio(
        'Não foi possível salvar a doação no aparelho. Tente novamente.',
      );
      setSalvando(false);
    }
  }

  return (
    <Screen>
      <TextField
        label="Nome do objeto"
        placeholder="Ex.: mesa de jantar"
        value={formulario.nomeObjeto}
        onChangeText={(valor) => atualizar('nomeObjeto', valor)}
        error={erros.nomeObjeto}
        maxLength={60}
      />

      <OptionSelector
        label="Categoria"
        opcoes={OPCOES_CATEGORIA}
        selecionado={formulario.categoriaId}
        onChange={(valor) => atualizar('categoriaId', valor)}
        error={erros.categoriaId}
      />

      <TextField
        label="Descrição"
        placeholder="Estado de conservação, medidas, se precisa de reparo"
        value={formulario.descricao}
        onChangeText={(valor) => atualizar('descricao', valor)}
        error={erros.descricao}
        multiline
        maxLength={240}
      />

      <PhotoPicker
        optional
        uri={formulario.fotoUri}
        onChange={(uri) => atualizar('fotoUri', uri)}
      />

      <TextField
        label="Bairro"
        hint="Apenas o bairro aparece na lista pública. Não informe o endereço."
        value={formulario.bairro}
        onChangeText={(valor) => atualizar('bairro', valor)}
        error={erros.bairro}
      />

      <TextField
        label="Telefone para contato"
        placeholder="(11) 90000-0000"
        hint="Obrigatório para que interessados possam ligar ou entrar em contato pelo WhatsApp. O número aparece nos detalhes da doação."
        keyboardType="phone-pad"
        value={formulario.telefone}
        onChangeText={(valor) =>
          atualizar('telefone', formatarTelefone(valor))
        }
        error={erros.telefone}
        maxLength={15}
      />

      {erroEnvio ? (
        <Notice tom="danger" mensagem={erroEnvio} />
      ) : null}

      <Button
        label="Publicar doação"
        icon="check"
        onPress={publicar}
        loading={salvando}
      />
    </Screen>
  );
}
