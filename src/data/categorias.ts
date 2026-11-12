import { Categoria, CategoriaId, Destino } from '@/types';

export const CATEGORIAS: Categoria[] = [
  {
    id: 'moveis',
    nome: 'Móveis',
    exemplos: 'Sofá, armário, mesa, cadeira, estante',
    destino: 'cata_bagulho',
    orientacao: 'Desmonte móveis grandes quando possível e deixe-os na calçada na data programada para o Cata-Bagulho.',
    podeSerDoado: true,
  },
  {
    id: 'colchoes',
    nome: 'Colchões',
    exemplos: 'Colchão, box, colchonete',
    destino: 'cata_bagulho',
    orientacao: 'Deixe o colchão na calçada apenas no dia da coleta, para não obstruir a passagem nem tomar chuva.',
    podeSerDoado: true,
  },
  {
    id: 'eletrodomesticos',
    nome: 'Eletrodomésticos grandes',
    exemplos: 'Geladeira, fogão, máquina de lavar, micro-ondas',
    destino: 'cata_bagulho',
    orientacao: 'Eletrodomésticos sem uso são recolhidos pelo Cata-Bagulho. Feche portas e prenda cabos antes de colocar na calçada.',
    podeSerDoado: true,
  },
  {
    id: 'eletronicos',
    nome: 'Eletrônicos pequenos, pilhas e baterias',
    exemplos: 'Celular, carregador, notebook, pilhas',
    destino: 'logistica_reversa',
    orientacao: 'Não coloque na calçada. Leve a um ponto de recebimento de logística reversa, como lojas e redes que fazem esse recolhimento.',
    podeSerDoado: true,
  },
  {
    id: 'entulho',
    nome: 'Entulho de pequenas reformas',
    exemplos: 'Restos de tijolo, azulejo, cimento',
    destino: 'ecoponto',
    orientacao: 'Leve a um ecoponto. A entrega é gratuita para volumes de até 1 m³ ou 20 sacos por vez.',
    podeSerDoado: false,
  },
  {
    id: 'madeira_poda',
    nome: 'Madeira e restos de poda',
    exemplos: 'Galhos, tábuas, restos de poda',
    destino: 'ecoponto',
    orientacao: 'Leve a um ecoponto. Amarre galhos em feixes para facilitar o transporte e a entrega.',
    podeSerDoado: false,
  },
  {
    id: 'outros_volumosos',
    nome: 'Outros objetos volumosos',
    exemplos: 'Bicicleta quebrada, carrinho, tapete grande',
    destino: 'cata_bagulho',
    orientacao: 'Objetos volumosos sem possibilidade de reaproveitamento podem ser deixados na calçada na data do Cata-Bagulho.',
    podeSerDoado: false,
  },
];

export const NOMES_DESTINO: Record<Destino, string> = {
  cata_bagulho: 'Cata-Bagulho',
  ecoponto: 'Ecoponto',
  logistica_reversa: 'Ponto de logística reversa',
};

export function buscarCategoria(id: CategoriaId): Categoria {
  const categoria = CATEGORIAS.find((item) => item.id === id);
  if (!categoria) throw new Error(`Categoria desconhecida: ${id}`);
  return categoria;
}

export const CATEGORIAS_DOACAO = CATEGORIAS.filter((categoria) => categoria.podeSerDoado);
