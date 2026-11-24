/**
 * Catálogo de demonstração — itens REAIS do site atual (categoria Envasadoras completa + produtos em destaque).
 * Campos não disponíveis no site (condição, especificações) ficam ausentes — a UI trata a ausência.
 * Em produção, isto vem de uma API (ver js/services/api.js).
 */
import { slugify } from '../lib/text';
import type { Product } from '../types';

const IMG = 'https://nocelli.com.br/product_images/';

// [código, nome, resumo, arquivo de imagem | null]
type Row = [string, string, string, string | null];
const ENVASADORAS: Row[] = [
  ['3744', 'Envasadora 2 pistões para líquido', 'Envasadora de dois pistões para líquidos', 'nocelli-27994_1753968180688b6e3426500.png'],
  ['NC550', 'Envasadora de Bisnaga marca Steel Horse', 'Envasadora automática de bisnagas plásticas', 'nocelli-28638_17930395386adf9cb2cd522.png'],
  ['NC552', 'Envasadora de Bisnaga marca Nina', 'Envasadora automática de bisnagas plásticas', 'nocelli-28641_17930393956adf9c235f5fd.png'],
  ['NC566', 'Insersora Automática de Sílica (sachê)', 'Insersora automática de sachês de sílica', null],
  ['NC571', 'Envasadora 8 pistões linear produto cremoso', 'Envasadora linear de 8 pistões para cremosos', null],
  ['NC572', 'Envasadora 8 pistões automático produto cremoso', 'Envasadora automática de 8 pistões para cremosos', null],
  ['NC573', 'Envasadora 6 bicos sistema a vácuo com rosqueador', 'Envasadora de 6 bicos a vácuo com rosqueador', null],
  ['NC615/NC609', 'Envasadora 12 bicos com batocador 4 cabeçotes - sistema gravidade', 'Envasadora rotativa de 12 bicos por gravidade', 'nocelli-28663_17939880126aee15ac5c979.png'],
  ['NC614', 'Envasadora 5 bicos sistema gravidade', 'Envasadora linear de 5 bicos por gravidade', null],
  ['NC616/NC611/NC612', 'Envasadora 16 bicos com rosqueador 4 cabeçotes em PVC', 'Envasadora rotativa de 16 bicos com rosqueador', 'nocelli-28665_17939844056aee0795c7a61.png'],
  ['NC617/NC610', 'Envasadora 20 bicos automático com rosqueador 5 cabeçotes', 'Envasadora rotativa de 20 bicos com rosqueador', 'nocelli-28666_17931982286ae20894ca432.png'],
  ['3826', 'Envasadora de bisnaga metálica Tubeta marca Meteor', 'Envasadora para bisnagas metálicas', 'nocelli-1635_172503760366d1fc2380b4a.jpg'],
  ['NC376', 'Envasadora de Bisnaga laminada marca Bomben', 'Envasadora automática de bisnagas laminadas', null],
  ['NC549', 'Envasadora de Bisnaga plástica-laminada marca Steel Horse', 'Envasadora de bisnagas plástico-laminadas', 'nocelli-28637_17930394796adf9c775a9ac.png'],
  ['NC112', 'Envasadora 2 pistões com batocador', 'Envasadora rotativa semiautomática de 2 pistões com batocador', 'nocelli-28131_175008393668502960be76a.png'],
  ['NC265', 'Envasadora 1 bico marca Serac', 'Envasadora linear semiautomática de 1 bico, sistema bomba', 'nocelli-28207_17491313976841a085f0941.jpg'],
  ['NC111', 'Envasadora 2 pistões produto líquido e cremoso', 'Envasadora linear semiautomática de 2 pistões', null],
  ['NC283', 'Envasadora 2 pistões marca QML', 'Envasadora linear semiautomática de 2 pistões para líquidos', null],
  ['NC285', 'Envasadora 1 bico gravidade', 'Envasadora linear semiautomática de 1 bico por gravidade', 'nocelli-28253_175690113768b82f1194301.png'],
  ['NC286', 'Envasadora 2 pistões marca Quality Machine', 'Envasadora linear semiautomática de 2 pistões para líquidos', 'nocelli-28254_175810818568ca9a19d828a.jpg'],
  ['NC409', 'Envasadora 2 pistões linear semiautomático', 'Envasadora linear semiautomática de 2 pistões para cremosos', 'nocelli-28465_17785927886a032c1402a72.png'],
  ['NC410', 'Envasadora 1 pistão linear semiautomático', 'Envasadora linear semiautomática de 1 pistão para cremosos', 'nocelli-28466_17786062246a03609021fed.png'],
  ['NC503', 'Envasadora 2 pistões produto líquido', 'Envasadora linear semiautomática de 2 pistões para líquidos', null],
  ['NC569', 'Envasadora de balança marca JHM', 'Envasadora rotativa semiautomática por balança para grãos e sólidos', null],
  ['3427', 'Envasadora de 1 pistão 1000 ml', 'Envasadora de 1 pistão para cremes e líquidos até 1000 ml', 'nocelli-1316_172502872266d1d9725d184.jpg'],
  ['3526', 'Envasadora 9 pistões linear marca Wada', 'Envasadora linear de 9 pistões', 'nocelli-1367_172503695766d1f99d96165.jpg'],
  ['NC397', 'Contadora de comprimido marca Contmatic', 'Contadora de comprimidos', 'nocelli-28453_17787023466a04d80a559ad.png'],
  ['NEG012', 'Envasadora automática gravidade linear 12 bicos', 'Envasadora linear automática de 12 bicos por gravidade', 'nocelli-28239_17640760306925a9fe72408.png'],
  ['NEA003', 'Envasadora de aerosol semiautomática', 'Envasadora semiautomática para aerossóis', 'nocelli-1665_1751983875686d2703d134d.jpg'],
  ['2988', 'Envasadora de sachê para pó - 1 pista', 'Envasadora de sachês para pó, com uma pista', 'nocelli-1023_172546968166d893f1e224f.jpg'],
  ['3073', 'Envasadora de líquidos e cremosos para sachê 4 pistas', 'Envasadora de sachês para líquidos e cremosos, com 4 pistas', 'nocelli-1092_172503637566d1f7570b137.jpg'],
  ['3626', 'Envasadora 4 bicos rotativa com rosqueador', 'Envasadora rotativa de 4 bicos com rosqueador', 'nocelli-1505_172547000366d895331333b.jpg'],
  ['NEG006', 'Envasadora automática gravidade linear 6 bicos', 'Envasadora linear automática de 6 bicos por gravidade', 'nocelli-1606_175794548968c81e9184224.jpg'],
  ['3785', 'Envasadora de pó automática Masipack', 'Envasadora automática de pó', 'nocelli-1616_172503677466d1f8e6a991d.jpg'],
  ['3791', 'Envasadora de sachê para líquidos e cremosos JHM', 'Envasadora de sachês para líquidos e cremosos', 'nocelli-1624_172503743966d1fb7f16d08.jpg'],
  ['NC035', 'Envasadora linear 9 bicos', 'Envasadora linear de 9 bicos', 'nocelli-1710_172547056866d89768baa96.jpg'],
  ['NC258', 'Envasadora 4 pistões Quality Machine', 'Envasadora linear automática de 4 pistões para líquidos', 'nocelli-28177_175753037168c1c903981b2.jpg'],
  ['NC289', 'Envasadora de sachê 4 pistas marca São Caetano', 'Envasadora automática de sachês para líquidos, com 4 pistas', 'nocelli-28274_175735974168bf2e7d01509.jpg'],
  ['NC319', 'Envasadora 2 pistões com recrave', 'Envasadora rotativa automática de 2 pistões com rosqueador', 'nocelli-28302_175736033868bf30d2b2b0f.png'],
  ['NC008', 'Envasadora 8 pistões linear com tampador IMSB', 'Envasadora linear de 8 pistões com tampador', 'nocelli-1685_172503800366d1fdb3cf0a4.jpg'],
  ['NC399', 'Envasadora 7 pistões para produto líquido e semilíquido', 'Envasadora automática de 7 pistões para líquidos e semilíquidos', null],
  ['NC413', 'Envasadora 1 pistão linear', 'Envasadora linear automática de 1 pistão para cremosos', 'nocelli-28469_177790617569f8b1ff7cef5.png'],
  ['NC418', 'Envasadora 2 pistões com rosqueador e batocador', 'Envasadora linear automática de 2 pistões com rosqueador', 'nocelli-28474_17786101916a03700f19aca.png'],
  ['NC426', 'Envasadora 10 pistões produto líquido', 'Envasadora linear automática de 10 pistões para líquidos', null],
  ['NC432', 'Contadora de comprimido marca Ciamaquinas', 'Contadora de comprimidos', 'nocelli-28487_17939091806aece1bcda432.png'],
  ['NC495', 'Envasadora 8 pistões produto cremoso e líquido', 'Envasadora linear automática de 8 pistões para cremosos e líquidos', null],
  ['NC496', 'Envasadora 6 bicos sistema vácuo, produto líquido', 'Envasadora linear automática de 6 bicos a vácuo, por bomba', 'nocelli-28611_17827387466a426f3a2bd01.png'],
  ['NC508', 'Envasadora 4 pistões - produto líquido', 'Envasadora rotativa automática de 4 pistões com rosqueador', null],
  ['NC504', 'Envasadora 4 bicos sistema bomba, produto líquido e cremoso', 'Envasadora linear automática de 4 bicos por bomba', null],
  ['NC539', 'Envasadora 4 pistões automática marca Quality Machine', 'Envasadora rotativa automática de 4 pistões com rosqueador', 'nocelli-28625_17930393296adf9be14b6e4.png'],
  ['NC567', 'Envasadora 8 bicos para esmalte com rosqueador', 'Envasadora rotativa automática de 8 bicos para esmaltes', null],
];

const FEATURED_CODES = new Set(['VP120', '3073', '3539', 'NC003', 'NMC001', 'NTR001', 'NMV001', 'NMR001']);

const toProduct = ([code, name, summary, img]: Row, category: string): Product => ({
  id: slugify(code),
  code,
  name,
  category,
  summary,
  images: img ? [IMG + img] : [],
  featured: FEATURED_CODES.has(code),
});

const OUTROS_RAW: Omit<Product, 'id'>[] = [
  { code: 'VP120', name: 'Encartuchadora vertical FABRIMA modelo VP-120', category: 'encartuchadoras', summary: 'Encartuchadora automática vertical', images: [] },
  { code: '3539', name: 'Encelofanadora marca Otto Haensen modelo V3S', category: 'encelofanadoras', summary: 'Encelofanadora Otto Haensen', images: [] },
  { code: 'NC003', name: 'Agrupadora e encelofanadora horizontal Masipack / Fabrima', category: 'encelofanadoras', summary: 'Agrupadora e encelofanadora automática horizontal', images: [] },
  {
    code: 'NMC001',
    name: 'Moinho Coloidal em aço inox',
    category: 'moinhos',
    condition: 'novo',
    summary: 'Aço inox 304 ou 316 · de 500 a 7.000 L/h',
    description:
      'Moinho coloidal em aço inox 304 ou 316, para produtos líquidos, pastosos e cremosos. Indicado para pasta de amendoim, castanhas, gergelim e outras sementes oleaginosas ou fibrosas. Possui circulação de água para refrigeração e sistema de retorno, e pode ser fornecido à prova de explosão ou com selo mecânico.',
    specs: [
      ['Material', 'Aço inox 304 ou 316'],
      ['Produtos', 'Líquidos, pastosos e cremosos'],
      ['Motor', '220 ou 380 V, 60 Hz, trifásico'],
      ['Refrigeração', 'Circulação de água com sistema de retorno'],
      ['Opcionais', 'À prova de explosão ou selo mecânico'],
    ],
    models: {
      columns: ['Modelo', 'Capacidade', 'Potência'],
      rows: [['N65', 'até 500 L/h', '3 cv'], ['N80', 'até 1.000 L/h', '4 cv'], ['N120', 'até 3.000 L/h', '10 cv'], ['N200', 'até 7.000 L/h', '20 cv']],
    },
    extra: [
      ['Funções', 'Homogeneizar, emulsionar, moer, desaglomerar, incorporar pigmentos, dispersar, misturar, umectar e moer de líquidos a produtos de alta viscosidade.'],
      ['Aplicações', 'Indústrias farmacêutica, cosmética, alimentícia, química e de tintas e vernizes.'],
    ],
    images: [
      'nocelli-28012_172435260366c7885b18e24.jpg',
      'nocelli-28012_172537362566d71cb9b9b58.jpg',
      'nocelli-28012_172537362966d71cbd70a82.jpg',
      'nocelli-28012_172537363466d71cc26dcfa.jpg',
      'nocelli-28012_172537368966d71cf9a5245.jpg',
    ].map((f) => IMG + f),
  },
  { code: 'NTR001', name: 'Reator Homogeneizador em inox', category: 'tanques-reatores', summary: 'Reator homogeneizador em aço inox', images: [] },
  { code: 'NMV001', name: 'Misturador em V em inox', category: 'misturadores', summary: 'Misturador em V em aço inox', images: [] },
  { code: 'NMR001', name: 'Misturador Ribbon em inox', category: 'misturadores', summary: 'Misturador ribbon em aço inox', images: [] },
];

const OUTROS: Product[] = OUTROS_RAW.map((p) => ({ id: slugify(p.code), featured: FEATURED_CODES.has(p.code), ...p }));

export const PRODUCTS: Product[] = [...OUTROS, ...ENVASADORAS.map((row) => toProduct(row, 'envasadoras'))];
