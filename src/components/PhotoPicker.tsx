import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Notice } from './Notice';

interface PhotoPickerProps {
  uri?: string;
  onChange: (uri: string | undefined) => void;
  optional?: boolean;
}

const OPCOES: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.6,
};

export function PhotoPicker({ uri, onChange, optional = false }: PhotoPickerProps) {
  const [erroPermissao, setErroPermissao] = useState<string | null>(null);

  async function usarCamera() {
    setErroPermissao(null);
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      setErroPermissao('Sem acesso à câmera. Você pode liberar a permissão nas configurações do aparelho ou escolher uma foto da galeria.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync(OPCOES);
    if (!resultado.canceled) onChange(resultado.assets[0].uri);
  }

  async function usarGaleria() {
    setErroPermissao(null);
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setErroPermissao('Sem acesso à galeria. Você pode liberar a permissão nas configurações do aparelho ou usar a câmera.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync(OPCOES);
    if (!resultado.canceled) onChange(resultado.assets[0].uri);
  }

  return (
    <View style={styles.container}>
      <AppText variant="label">
        Foto do objeto
        {optional ? <AppText variant="caption"> (opcional)</AppText> : null}
      </AppText>

      {uri ? (
        <Image source={{ uri }} style={styles.preview} accessibilityLabel="Foto selecionada do objeto" />
      ) : null}

      <View style={styles.acoes}>
        <Button label="Câmera" icon="camera" variant="secondary" compact onPress={usarCamera} />
        <Button label="Galeria" icon="image" variant="secondary" compact onPress={usarGaleria} />
        {uri ? <Button label="Remover foto" variant="ghost" compact onPress={() => onChange(undefined)} /> : null}
      </View>

      {erroPermissao ? <Notice tom="warning" mensagem={erroPermissao} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.neutralSoft,
  },
  acoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
