import { DiaDaSemana } from '@/types';

const DIAS_DA_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function paraDataISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function deDataISO(iso: string): Date {
  const [ano, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function hojeISO(referencia: Date = new Date()): string {
  return paraDataISO(referencia);
}

export function adicionarDias(iso: string, dias: number): string {
  const data = deDataISO(iso);
  data.setDate(data.getDate() + dias);
  return paraDataISO(data);
}

export function diasAte(iso: string, referencia: Date = new Date()): number {
  const alvo = deDataISO(iso).getTime();
  const hoje = deDataISO(paraDataISO(referencia)).getTime();
  return Math.round((alvo - hoje) / 86_400_000);
}

export function nomeDiaDaSemana(dia: DiaDaSemana): string {
  return DIAS_DA_SEMANA[dia];
}

export function formatarData(iso: string): string {
  const data = deDataISO(iso);
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

export function formatarDataPorExtenso(iso: string): string {
  const data = deDataISO(iso);
  return `${DIAS_DA_SEMANA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

export function formatarDataHora(isoCompleto: string): string {
  const data = new Date(isoCompleto);
  const hora = `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
  return `${formatarData(paraDataISO(data))} às ${hora}`;
}

export function formatarHora(isoCompleto: string): string {
  const data = new Date(isoCompleto);
  return [data.getHours(), data.getMinutes(), data.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
}

export function descreverPrazo(iso: string, referencia: Date = new Date()): string {
  const dias = diasAte(iso, referencia);
  if (dias < 0) return 'Data já passou';
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Amanhã';
  return `Em ${dias} dias`;
}

/**
 * Encontra a próxima data correspondente à N-ésima ocorrência de um dia da semana no mês
 * (por exemplo, a 2ª terça-feira), a partir da data de referência, inclusive.
 */
export function proximaOcorrenciaNoMes(
  semanaDoMes: number,
  diaDaSemana: DiaDaSemana,
  referencia: Date = new Date(),
): string {
  const hoje = deDataISO(paraDataISO(referencia));

  for (let deslocamentoMes = 0; deslocamentoMes < 3; deslocamentoMes++) {
    const primeiroDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + deslocamentoMes, 1);
    const ajuste = (diaDaSemana - primeiroDoMes.getDay() + 7) % 7;
    const candidata = new Date(primeiroDoMes);
    candidata.setDate(1 + ajuste + (semanaDoMes - 1) * 7);

    if (candidata.getTime() >= hoje.getTime()) return paraDataISO(candidata);
  }

  throw new Error('Não foi possível calcular a próxima data.');
}
