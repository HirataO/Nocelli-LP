import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { COMPANY, DIFFERENTIALS, SEGMENTS, SERVICES, formatAddress } from '../data/company';
import { routes } from '../lib/routes';
import { mapsUrl, whatsappUrl } from '../lib/text';
import { useAsync } from '../lib/useAsync';
import { listProducts } from '../services/api';
import type { Product } from '../types';
import { Button } from '../components/Button';
import { CategoryCard } from '../components/CategoryCard';
import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { SectionHeading } from '../components/SectionHeading';

function Hero() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__intro">
          <p className="hero__eyebrow">No mercado desde {COMPANY.since}</p>
          <h1 className="t-display" id="hero-title">Máquinas e equipamentos industriais, comprados e vendidos com experiência.</h1>
          <p className="hero__lead t-body-l">Compra e venda para as indústrias alimentícia, cosmética, farmacêutica e química — com desmontagem, transporte e remoção de plantas.</p>
        </div>
        <div className="hero__paths">
          <article className="path-card">
            <p className="t-eyebrow">Quero comprar</p>
            <h2 className="t-h3">Encontre o equipamento ideal para sua operação.</h2>
            <SearchBar value={q} onChange={setQ} onSubmit={(v) => navigate(routes.equipamentos({ q: v.trim() }))} size="md" id="busca-hero" placeholder="Ex.: envasadora, moinho, misturador" />
            <Button variant="primary" size="lg" icon="arrow-right" href={routes.equipamentos()}>Explorar equipamentos</Button>
          </article>
          <article className="path-card path-card--sell">
            <p className="t-eyebrow">Quero vender</p>
            <h2 className="t-h3">Transforme seus equipamentos parados em oportunidades.</h2>
            <p className="t-body-m muted">Compramos máquinas desativadas e plantas completas. A visita é gratuita e sem compromisso.</p>
            <Button variant="secondary" size="lg" icon="arrow-right" href={routes.vender()}>Vender meu equipamento</Button>
          </article>
        </div>
        <a className="hero__scroll t-label" href="#categorias">Ou continue navegando<Icon name="chevron-down" size={18} /></a>
      </div>
    </section>
  );
}

function Categories({ products }: { products: Product[] }) {
  const counts = products.reduce<Record<string, number>>((acc, p) => ((acc[p.category] = (acc[p.category] || 0) + 1), acc), {});
  return (
    <section className="section" id="categorias" aria-labelledby="cat-title">
      <div className="container">
        <SectionHeading eyebrow="Categorias" title="Equipamentos por categoria" id="cat-title" action={<Button variant="ghost" icon="arrow-right" href={routes.equipamentos()}>Ver todos os equipamentos</Button>} />
        <div className="grid grid--4">
          {CATEGORIES.filter((c) => c.home).map((c) => <CategoryCard key={c.slug} category={c} count={counts[c.slug] ?? 0} />)}
        </div>
      </div>
    </section>
  );
}

function Featured({ products }: { products: Product[] }) {
  return (
    <section className="section section--subtle" id="destaques" aria-labelledby="dest-title">
      <div className="container">
        <SectionHeading eyebrow="Em destaque" title="Equipamentos em destaque" text="Itens do catálogo da Nocelli. Valores sob consulta." id="dest-title" action={<Button variant="secondary" icon="arrow-right" href={routes.equipamentos()}>Ver catálogo completo</Button>} />
        <div className="grid grid--4">
          {products.filter((p) => p.featured).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}

function About() {
  const years = new Date().getFullYear() - COMPANY.since;
  return (
    <section className="section" id="a-nocelli" aria-labelledby="about-title">
      <div className="container about">
        <div className="about__text">
          <p className="t-eyebrow">A Nocelli</p>
          <h2 className="t-h2" id="about-title">Desde {COMPANY.since}, comprando e vendendo máquinas e equipamentos industriais.</h2>
          <p className="t-body-l muted">A Nocelli é especializada na comercialização de máquinas e equipamentos industriais, com soluções personalizadas, compra e venda de plantas industriais, desmontagem, transporte, remoção e reciclagem.</p>
          <p className="t-body-l muted">Nossa missão é ouvir e respeitar clientes, fornecedores e colaboradores, para entendê-los e oferecer as melhores opções para cada necessidade.</p>
          <Button variant="secondary" icon="arrow-right" href="#contato">Falar com a Nocelli</Button>
        </div>
        <aside className="about__stat" aria-label="Tempo de mercado">
          <p className="about__year">{COMPANY.since}</p>
          <p className="t-h4">{years} anos de mercado</p>
          <p className="t-body-s">Experiência em máquinas e equipamentos industriais para diferentes segmentos.</p>
        </aside>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section section--subtle" id="servicos" aria-labelledby="serv-title">
      <div className="container">
        <SectionHeading eyebrow="Serviços" title="Do equipamento à remoção da planta" id="serv-title" />
        <div className="grid grid--4">
          {SERVICES.map((s) => (
            <article className="feature" key={s.title}>
              <span className="feature__icon"><Icon name={s.icon} size={24} /></span>
              <h3 className="t-h5">{s.title}</h3>
              <p className="t-body-s muted">{s.text}</p>
            </article>
          ))}
        </div>
        <div className="differentials">
          <h3 className="t-h4">Por que negociar com a Nocelli</h3>
          <div className="grid grid--3">
            {DIFFERENTIALS.map((d) => (
              <article className="diff" key={d.title}>
                <Icon name={d.icon} size={24} className="diff__icon" />
                <div><h4 className="t-h5">{d.title}</h4><p className="t-body-s muted">{d.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Segments() {
  return (
    <section className="section" id="segmentos" aria-labelledby="seg-title">
      <div className="container">
        <SectionHeading eyebrow="Segmentos" title="Segmentos industriais atendidos" id="seg-title" />
        <div className="grid grid--4">
          {SEGMENTS.map((s) => (
            <article className="segment" key={s.title}>
              <Icon name={s.icon} size={28} className="segment__icon" />
              <h3 className="t-h5">{s.title}</h3>
              <p className="t-body-s muted">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallsToAction() {
  return (
    <section className="section section--tight" aria-label="Comprar ou vender">
      <div className="container cta-split">
        <article className="cta cta--buy">
          <h2 className="t-h3">Procurando uma máquina?</h2>
          <p className="t-body-m muted">Pesquise pelo nome, código ou tipo de equipamento e fale com um consultor para consultar disponibilidade.</p>
          <Button variant="primary" size="lg" icon="arrow-right" href={routes.equipamentos()}>Explorar equipamentos</Button>
        </article>
        <article className="cta cta--sell">
          <h2 className="t-h3">Tem um equipamento para vender?</h2>
          <p className="t-body-m">Conte para a Nocelli sobre seu equipamento. Nossa equipe entrará em contato para avaliar as possibilidades de negociação.</p>
          <Button variant="inverse" size="lg" icon="arrow-right" href={routes.vender()}>Vender meu equipamento</Button>
        </article>
      </div>
    </section>
  );
}

function Contact() {
  const wa = whatsappUrl(COMPANY.whatsapp.number, 'Olá! Gostaria de falar com a Nocelli.');
  const a = COMPANY.address;
  return (
    <section className="section section--subtle" id="contato" aria-labelledby="contato-title">
      <div className="container contact">
        <div className="contact__intro">
          <p className="t-eyebrow">Contato</p>
          <h2 className="t-h2" id="contato-title">Fale com a Nocelli</h2>
          <p className="t-body-l muted">Tire dúvidas, consulte disponibilidade ou peça orçamento. Atendemos por telefone e WhatsApp.</p>
          <div className="contact__actions">
            <Button variant="whatsapp" size="lg" iconLeft="chat" href={wa} target="_blank">Chamar no WhatsApp</Button>
            <Button variant="secondary" size="lg" iconLeft="map-pin" href={mapsUrl(formatAddress())} target="_blank">Como chegar</Button>
          </div>
        </div>
        <div className="contact__list">
          <ContactItem icon="map-pin" title="Onde estamos">{a.street}<br />{`${a.district}, ${a.city} – ${a.state}`}<br />CEP {a.zip}</ContactItem>
          <ContactItem icon="phone" title="Telefones">
            {COMPANY.phones.map((p, i) => <span key={p.href}>{i > 0 && <br />}<a href={p.href}>{p.display}</a></span>)}
          </ContactItem>
          <ContactItem icon="chat" title="WhatsApp"><a href={wa} target="_blank" rel="noopener noreferrer">{COMPANY.whatsapp.display}</a></ContactItem>
          <ContactItem icon="mail" title="E-mail">{COMPANY.email ? <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> : '[a confirmar com a Nocelli]'}</ContactItem>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="contact__item">
      <span className="feature__icon"><Icon name={icon} size={22} /></span>
      <div><p className="t-label">{title}</p><div className="t-body-m muted">{children}</div></div>
    </div>
  );
}

export default function Home() {
  const { data } = useAsync(listProducts, []);
  const products = data ?? [];
  return (
    <Layout>
      <Hero />
      <Categories products={products} />
      <Featured products={products} />
      <About />
      <Services />
      <Segments />
      <CallsToAction />
      <Contact />
    </Layout>
  );
}
