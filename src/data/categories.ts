import type { Category } from '../types';

/** Categorias reais do site atual (nocelli.com.br/categoria/...). `home: true` aparece na seção de categorias da Home. */
export const CATEGORIES: Category[] = [
  { slug: 'compressoras-pastilhadeiras', name: 'Compressoras e pastilhadeiras', home: true },
  { slug: 'encapsuladoras', name: 'Encapsuladoras', home: true },
  { slug: 'encartuchadoras', name: 'Encartuchadoras', home: true },
  { slug: 'envasadoras', name: 'Envasadoras', home: true },
  { slug: 'misturadores', name: 'Misturadores e batedeiras', home: true },
  { slug: 'moinhos', name: 'Moinhos', home: true },
  { slug: 'rotuladoras', name: 'Rotuladoras (sleeve)', home: true },
  { slug: 'tanques-reatores', name: 'Tanques em inox e reatores', home: true },
  { slug: 'empacotadoras', name: 'Empacotadoras', home: true },
  { slug: 'seladoras', name: 'Seladoras (shrink)', home: true },
  { slug: 'esteiras', name: 'Esteiras industriais', home: true },
  { slug: 'outras-maquinas', name: 'Outras máquinas', home: true },
  { slug: 'encelofanadoras', name: 'Encelofanadoras' },
  { slug: 'encaixotadoras', name: 'Encaixotadoras' },
  { slug: 'alimentadores', name: 'Alimentadores, posicionamento e elevadores' },
  { slug: 'bombas', name: 'Bombas industriais' },
  { slug: 'drageadeira', name: 'Drageadeira' },
  { slug: 'emblistadeira', name: 'Emblistadeira, embaladora e envelopadora' },
  { slug: 'estufas', name: 'Estufas industriais' },
  { slug: 'filtros', name: 'Filtros industriais' },
  { slug: 'granuladores', name: 'Granuladores' },
  { slug: 'mesas-acumuladoras', name: 'Mesas acumuladoras' },
  { slug: 'recravadeiras', name: 'Recravadeiras' },
  { slug: 'tampadoras', name: 'Tampadoras, batocadoras e rosqueadoras' },
  { slug: 'trocador-calor', name: 'Trocador de calor e pasteurizador' },
];

export const categoryBySlug = (slug: string): Category | undefined => CATEGORIES.find((c) => c.slug === slug);
