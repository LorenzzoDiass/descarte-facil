export function gerarId(prefixo: string): string {
  const aleatorio = Math.random().toString(36).slice(2, 8);
  return `${prefixo}-${Date.now().toString(36)}-${aleatorio}`;
}
