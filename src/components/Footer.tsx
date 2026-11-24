import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { COMPANY } from '../data/company';
import { routes } from '../lib/routes';
import { Logo } from './Logo';

const INSTITUCIONAL: [string, string][] = [
  ['A Nocelli', routes.home('#a-nocelli')],
  ['Vender equipamento', routes.vender()],
  ['Serviços', routes.home('#servicos')],
  ['Onde estamos', routes.home('#contato')],
  ['Fale conosco', routes.home('#contato')],
];

export function Footer() {
  const a = COMPANY.address;
  const cats = CATEGORIES.filter((c) => c.home).slice(0, 9);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo inverse />
            <p className="t-body-s footer__about">Compra e venda de máquinas e equipamentos industriais, desmontagem, transporte e remoção de plantas e reciclagem. No mercado desde {COMPANY.since}.</p>
            <ul className="footer__social">
              {COMPANY.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h3 className="footer__title">Equipamentos</h3>
            <ul className="footer__list">
              {cats.map((c) => <li key={c.slug}><Link to={routes.equipamentos({ cat: c.slug })}>{c.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3 className="footer__title">Institucional</h3>
            <ul className="footer__list">
              {INSTITUCIONAL.map(([label, href]) => <li key={label}><Link to={href}>{label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3 className="footer__title">Contato</h3>
            <address className="footer__list footer__address">
              <p>{a.street}</p>
              <p>{`${a.district}, ${a.city} – ${a.state}`}</p>
              <p>CEP {a.zip}</p>
              <p>{COMPANY.phones.map((p, i) => <span key={p.href}>{i ? ' · ' : ''}<a href={p.href}>{p.display}</a></span>)}</p>
              <p>WhatsApp <a href={`https://wa.me/${COMPANY.whatsapp.number}`} target="_blank" rel="noopener noreferrer">{COMPANY.whatsapp.display}</a></p>
              <p>{COMPANY.email ? <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> : 'E-mail: [a confirmar]'}</p>
            </address>
          </div>
        </div>
        <div className="footer__legal">
          <p className="t-caption">© {new Date().getFullYear()} Nocelli — Máquinas e equipamentos industriais</p>
          <a className="t-caption" href="#">Política de privacidade (LGPD) — texto a fornecer</a>
        </div>
      </div>
    </footer>
  );
}
