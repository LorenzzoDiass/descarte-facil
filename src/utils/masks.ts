export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function formatarCep(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, 8);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

export function formatarTelefone(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${digitos}`;

  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const tamanhoPrefixo = digitos.length === 11 ? 5 : 4;

  if (numero.length <= tamanhoPrefixo) return `(${ddd}) ${numero}`;
  return `(${ddd}) ${numero.slice(0, tamanhoPrefixo)}-${numero.slice(tamanhoPrefixo)}`;
}
