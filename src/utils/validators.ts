import { apenasDigitos } from './masks';

export type ErrosFormulario<T> = Partial<Record<keyof T, string>>;

export function validarObrigatorio(valor: string | undefined, nomeCampo: string, minimo = 1): string | undefined {
  const texto = (valor ?? '').trim();
  if (texto.length === 0) return `Informe ${nomeCampo}.`;
  if (texto.length < minimo) return `${capitalizar(nomeCampo)} deve ter pelo menos ${minimo} caracteres.`;
  return undefined;
}

export function validarCep(valor: string): string | undefined {
  const digitos = apenasDigitos(valor);
  if (digitos.length === 0) return 'Informe o CEP.';
  if (digitos.length !== 8) return 'O CEP deve ter 8 dígitos.';
  return undefined;
}

export function validarTelefoneOpcional(valor: string | undefined): string | undefined {
  const digitos = apenasDigitos(valor ?? '');
  if (digitos.length === 0) return undefined;
  if (digitos.length !== 10 && digitos.length !== 11) {
    return 'Informe o telefone com DDD, com 10 ou 11 dígitos.';
  }
  if (digitos.length === 11 && digitos[2] !== '9') {
    return 'Celulares com 11 dígitos começam com 9 depois do DDD.';
  }
  return undefined;
}

export function validarEmail(valor: string): string | undefined {
  const texto = valor.trim();
  if (texto.length === 0) return 'Informe o e-mail.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) return 'Informe um e-mail válido.';
  return undefined;
}

export function possuiErros<T>(erros: ErrosFormulario<T>): boolean {
  return Object.values(erros).some(Boolean);
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
