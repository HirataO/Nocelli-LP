import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categoryBySlug } from '../data/categories';
import { COMPANY } from '../data/company';
import { routes } from '../lib/routes';
import { whatsappUrl } from '../lib/text';
import { useAsync } from '../lib/useAsync';
import { getProduct, listProducts } from '../services/api';
import type { Product as ProductT } from '../types';
import { Badge, ConditionBadge } from '../components/Badge';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { QuoteDialog } from '../components/QuoteDialog';
import type { QuoteIntent } from '../components/QuoteDialog';
import { SectionHeading } from '../components/SectionHeading';

function NotFound() {
  return (
    <section className="section">
      <div className="container empty">
        <Icon name="search" size={32} />
        <h1 className="t-h3">Equipamento não encontrado</h1>
        <p className="t-body-m muted">O equipamento pode ter sido vendido ou o endereço está incorreto.</p>
        <Button variant="primary" size="lg" href={routes.equipamentos()}>Ver todos os equipamentos</Button>
      </div>
    </section>
  );
}

function Gallery({ p }: { p: ProductT }) {
  const imgs: (string | null)[] = p.images.length ? p.images : [null];
  const [index, setIndex] = useState(0);
  return (
    <div className="gallery">
      <div className="gallery__stage"><ProductImage key={index} src={imgs[index]} alt={`${p.name} — foto ${index + 1}`} eager /></div>
      {imgs.length > 1 && (
        <ul className="gallery__thumbs" aria-label="Miniaturas">
          {imgs.map((src, i) => (
            <li key={i}>
              <button className="gallery__thumb" type="button" aria-label={`Ver foto ${i + 1}`} aria-current={i === index} onClick={() => setIndex(i)}>
                <ProductImage src={src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SpecList({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="spec-list">
      {rows.map(([k, v]) => (
        <div className="spec-list__row" key={k}><dt className="t-label">{k}</dt><dd className="t-body-m">{v}</dd></div>
      ))}
    </dl>
  );
}

function Specs({ p }: { p: ProductT }) {
  const rows = p.specs ?? [];
  return (
    <section className="spec-block" aria-labelledby="specs-title">
      <h2 className="t-h4" id="specs-title">Especificações técnicas</h2>
      {rows.length ? <SpecList rows={rows} /> : (
        <div className="notice"><Icon name="info" size={20} /><p className="t-body-m">As especificações técnicas detalhadas deste equipamento são informadas sob consulta. Fale com um consultor para receber a ficha técnica.</p></div>
      )}
      {p.models && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr>{p.models.columns.map((c) => <th scope="col" key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {p.models.rows.map((r) => (
                <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <th scope="row" key={i}>{c}</th> : <td key={i}>{c}</td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Extra({ p }: { p: ProductT }) {
  const extra: [string, string][] = [...(p.extra ?? []), ['Serviços', 'A Nocelli também realiza desmontagem, transporte e remoção de plantas industriais. Consulte condições.']];
  return (
    <section className="spec-block" aria-labelledby="extra-title">
      <h2 className="t-h4" id="extra-title">Informações complementares</h2>
      <SpecList rows={extra} />
    </section>
  );
}

function Detail({ p, all }: { p: ProductT; all: ProductT[] }) {
  const [dialog, setDialog] = useState<QuoteIntent | null>(null);
  const cat = categoryBySlug(p.category);
  const wa = whatsappUrl(COMPANY.whatsapp.number, `Olá! Tenho interesse no equipamento ${p.name} (cód. ${p.code}).`);
  const related = [...all.filter((x) => x.category === p.category && x.id !== p.id), ...all.filter((x) => x.featured && x.category !== p.category)].slice(0, 4);
  return (
    <>
      <section className="page-head page-head--tight">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Início', href: routes.home() }, { label: 'Equipamentos', href: routes.equipamentos() }, { label: cat?.name ?? 'Categoria', href: routes.equipamentos({ cat: p.category }) }, { label: p.name }]} />
        </div>
      </section>
      <section className="section section--flush">
        <div className="container product">
          <Gallery key={p.id} p={p} />
          <div className="product__info">
            <div className="product__badges"><Badge tone="neutral">{cat?.name ?? p.category}</Badge><ConditionBadge condition={p.condition} /></div>
            <h1 className="t-h2">{p.name}</h1>
            <p className="t-body-m muted">Código {p.code}</p>
            <p className="t-body-l">{p.description ?? p.summary}</p>
            <div className="quote-box">
              <p className="t-label">Valor sob consulta</p>
              <p className="t-body-s muted">Este equipamento é comercializado sob consulta. Fale com a equipe comercial.</p>
              <div className="quote-box__actions">
                <Button variant="primary" size="lg" icon="arrow-right" onClick={() => setDialog('orcamento')}>Solicitar orçamento</Button>
                <Button variant="secondary" size="lg" onClick={() => setDialog('disponibilidade')}>Consultar disponibilidade</Button>
                <Button variant="whatsapp" size="lg" iconLeft="chat" href={wa} target="_blank">Falar com um consultor</Button>
              </div>
            </div>
            <ul className="assurances">
              {['Visita gratuita e sem compromisso', 'Desmontagem, transporte e remoção sob consulta', `No mercado desde ${COMPANY.since}`].map((t) => <li className="t-body-s" key={t}><Icon name="check" size={16} />{t}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="section section--subtle">
        <div className="container details"><Specs p={p} /><Extra p={p} /></div>
      </section>
      {related.length > 0 && (
        <section className="section" aria-labelledby="rel-title">
          <div className="container">
            <SectionHeading title="Equipamentos relacionados" id="rel-title" action={<Button variant="ghost" icon="arrow-right" href={routes.equipamentos({ cat: p.category })}>Ver categoria</Button>} />
            <div className="grid grid--4">{related.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          </div>
        </section>
      )}
      {dialog && <QuoteDialog product={p} intent={dialog} onClose={() => setDialog(null)} />}
    </>
  );
}

export default function Product() {
  const { id = '' } = useParams();
  const { data: product, loading } = useAsync(() => getProduct(id), [id]);
  const { data: all } = useAsync(listProducts, []);

  useEffect(() => {
    document.title = product ? `${product.name} — Nocelli` : 'Nocelli — Máquinas e equipamentos industriais desde 1984';
    return () => { document.title = 'Nocelli — Máquinas e equipamentos industriais desde 1984'; };
  }, [product]);

  const message = product ? `Olá! Tenho interesse no equipamento ${product.name} (cód. ${product.code}).` : undefined;
  return (
    <Layout active="equipamentos" whatsappMessage={message}>
      {loading ? null : product ? <Detail p={product} all={all ?? []} /> : <NotFound />}
    </Layout>
  );
}
