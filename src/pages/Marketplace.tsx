import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, categoryBySlug } from '../data/categories';
import { COMPANY } from '../data/company';
import { routes } from '../lib/routes';
import { normalize, whatsappUrl } from '../lib/text';
import { useAsync } from '../lib/useAsync';
import { listProducts } from '../services/api';
import type { Product } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';

const PAGE_SIZE = 12;
const SORTS = { relevancia: 'Relevância', nome: 'Nome (A–Z)', codigo: 'Código' } as const;
type SortKey = keyof typeof SORTS;
const COLLAPSED_CATEGORIES = 10;

function applyFilters(all: Product[], q: string, cats: Set<string>, sort: SortKey): Product[] {
  const nq = normalize(q);
  let list = all.filter((p) => (!cats.size || cats.has(p.category)) &&
    (!nq || normalize(`${p.name} ${p.code} ${p.summary} ${categoryBySlug(p.category)?.name ?? ''}`).includes(nq)));
  if (sort === 'nome') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  else if (sort === 'codigo') list = [...list].sort((a, b) => a.code.localeCompare(b.code, 'pt-BR', { numeric: true }));
  else list = [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  return list;
}

export default function Marketplace() {
  const { data } = useAsync(listProducts, []);
  const all = useMemo(() => data ?? [], [data]);
  const [params, setParams] = useSearchParams();

  // Estado de filtros vive na URL (compartilhável): ?q=&cat=a,b&sort=
  const q = params.get('q') ?? '';
  const cats = useMemo(() => new Set((params.get('cat') ?? '').split(',').filter(Boolean)), [params]);
  const sortParam = params.get('sort') as SortKey | null;
  const sort: SortKey = sortParam && sortParam in SORTS ? sortParam : 'relevancia';

  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showAllCats, setShowAllCats] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', filtersOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [filtersOpen]);

  const update = (next: { q?: string; cats?: Set<string>; sort?: SortKey }) => {
    const nq = next.q ?? q; // sem trim: preserva espaços enquanto o usuário digita
    const nc = next.cats ?? cats;
    const ns = next.sort ?? sort;
    const url = new URLSearchParams(routes.equipamentos({ q: nq, cat: [...nc], sort: ns === 'relevancia' ? '' : ns }).split('?')[1] ?? '');
    setParams(url, { replace: true });
    setVisible(PAGE_SIZE);
  };

  const counts = useMemo(() => all.reduce<Record<string, number>>((acc, p) => ((acc[p.category] = (acc[p.category] || 0) + 1), acc), {}), [all]);
  // categorias com itens primeiro (por quantidade), depois as demais na ordem do site
  const orderedCategories = useMemo(() => [...CATEGORIES].sort((a, b) => (counts[b.slug] || 0) - (counts[a.slug] || 0)), [counts]);
  const list = useMemo(() => applyFilters(all, q, cats, sort), [all, q, cats, sort]);
  const shown = list.slice(0, visible);
  const hasFilters = cats.size > 0 || q.trim() !== '';
  const clearAll = () => update({ q: '', cats: new Set() });
  const wa = whatsappUrl(COMPANY.whatsapp.number, 'Olá! Não encontrei o equipamento que procuro no site. Podem me ajudar?');

  // garante que categorias selecionadas apareçam mesmo com a lista recolhida
  const visibleCats = showAllCats ? orderedCategories : orderedCategories.slice(0, COLLAPSED_CATEGORIES);
  const catList = [...visibleCats];
  for (const slug of cats) { const c = categoryBySlug(slug); if (c && !catList.includes(c)) catList.push(c); }

  const toggleCat = (slug: string, on: boolean) => {
    const next = new Set(cats);
    if (on) next.add(slug); else next.delete(slug);
    update({ cats: next });
  };

  return (
    <Layout active="equipamentos">
      <section className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Início', href: routes.home() }, { label: 'Equipamentos' }]} />
          <h1 className="t-h1">Equipamentos</h1>
          <p className="t-body-l muted">Máquinas e equipamentos industriais comercializados sob consulta.</p>
          <SearchBar value={q} onChange={(v) => update({ q: v })} onSubmit={(v) => update({ q: v })} id="busca-listagem" />
          <p className="demo-note t-caption"><Icon name="info" size={14} /> Catálogo de demonstração: {all.length} itens reais do site atual (categoria Envasadoras completa e produtos em destaque).</p>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container">
          <div className="market__layout">
            <aside className={`filters${filtersOpen ? ' is-open' : ''}`} id="filtros" aria-label="Filtros">
              <div className="filters__sheet">
                <div className="filters__head">
                  <h2 className="t-h5">Filtros</h2>
                  <button className="icon-btn filters__close" type="button" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)}><Icon name="close" size={22} /></button>
                </div>
                <fieldset className="filters__group">
                  <legend className="t-label">Categoria</legend>
                  <ul>
                    {catList.map((c) => (
                      <li key={c.slug}>
                        <label className="filter-option">
                          <input type="checkbox" className="checkbox__input" checked={cats.has(c.slug)} onChange={(e) => toggleCat(c.slug, e.target.checked)} />
                          <span className="checkbox__box"><Icon name="check" size={14} /></span>
                          <span className="filter-option__name t-body-s">{c.name}</span>
                          <span className="filter-option__count t-caption">{counts[c.slug] || 0}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  {orderedCategories.length > COLLAPSED_CATEGORIES && (
                    <button className="link-btn t-label" type="button" onClick={() => setShowAllCats((s) => !s)}>{showAllCats ? 'Mostrar menos' : `Mostrar todas (${orderedCategories.length})`}</button>
                  )}
                </fieldset>
                <div className="filters__foot">
                  <Button variant="ghost" size="md" onClick={clearAll} disabled={!hasFilters}>Limpar filtros</Button>
                  <Button variant="primary" size="md" className="filters__apply" onClick={() => setFiltersOpen(false)}>{`Ver ${list.length} resultado${list.length === 1 ? '' : 's'}`}</Button>
                </div>
              </div>
              <div className="filters__backdrop" onClick={() => setFiltersOpen(false)} />
            </aside>

            <div className="results">
              <div className="results__bar">
                <p className="results__count t-body-m" aria-live="polite"><strong>{list.length}</strong>{list.length === 1 ? ' equipamento encontrado' : ' equipamentos encontrados'}</p>
                <div className="results__tools">
                  <Button variant="secondary" size="md" iconLeft="filter" className="results__filters-btn" aria-controls="filtros" onClick={() => setFiltersOpen(true)}>{cats.size ? `Filtros (${cats.size})` : 'Filtros'}</Button>
                  <label className="sort">
                    <span className="t-body-s muted">Ordenar por</span>
                    <span className="select-wrap select-wrap--sm">
                      <select className="control control--select" aria-label="Ordenar por" value={sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
                        {Object.entries(SORTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                      <Icon name="chevron-down" size={18} className="select-wrap__chevron" />
                    </span>
                  </label>
                </div>
              </div>

              {hasFilters && (
                <div className="chips">
                  {q.trim() && <button className="chip" type="button" aria-label={`Remover filtro Busca: ${q.trim()}`} onClick={() => update({ q: '' })}>{`Busca: “${q.trim()}”`}<Icon name="close" size={14} /></button>}
                  {[...cats].map((slug) => {
                    const name = categoryBySlug(slug)?.name ?? slug;
                    return <button key={slug} className="chip" type="button" aria-label={`Remover filtro ${name}`} onClick={() => toggleCat(slug, false)}>{name}<Icon name="close" size={14} /></button>;
                  })}
                  <button className="link-btn t-label" type="button" onClick={clearAll}>Limpar filtros</button>
                </div>
              )}

              {list.length === 0 ? (
                <div className="empty">
                  <Icon name="search" size={32} />
                  <h3 className="t-h4">Nenhum equipamento encontrado</h3>
                  <p className="t-body-m muted">{cats.size && !q.trim() ? 'Este protótipo carrega apenas parte do catálogo real. Limpe os filtros ou fale com um consultor.' : 'Tente outro termo ou remova filtros. Nossa equipe também pode ajudar a localizar o equipamento.'}</p>
                  <div className="empty__actions">
                    <Button variant="primary" size="md" onClick={clearAll}>Limpar filtros</Button>
                    <Button variant="whatsapp" size="md" iconLeft="chat" href={wa} target="_blank">Falar com um consultor</Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid--cards">{shown.map((product) => <ProductCard key={product.id} product={product} />)}</div>
              )}

              {list.length > shown.length && (
                <div className="load-more">
                  <p className="t-body-s muted">Exibindo {shown.length} de {list.length}</p>
                  <Button variant="secondary" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Carregar mais equipamentos</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
