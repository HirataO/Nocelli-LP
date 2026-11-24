import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COMPANY, NAV } from '../data/company';
import { routes } from '../lib/routes';
import { whatsappUrl } from '../lib/text';
import { Button } from './Button';
import { Icon } from './Icon';
import { Logo } from './Logo';

/** Header — desktop: nav + ações; tablet/mobile: botão de menu que abre o painel #mobile-menu. */
export function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const wa = whatsappUrl(COMPANY.whatsapp.number, 'Olá! Gostaria de falar com a Nocelli.');

  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 1101px)');
    const onMq = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => { window.removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); };
  }, []);

  return (
    <header className="header">
      <div className="container header__inner">
        <Logo />
        <nav className="header__nav" aria-label="Principal">
          {NAV.map((item) => (
            <Link key={item.key} className={`nav-link${active === item.key ? ' is-active' : ''}`} to={item.href} aria-current={active === item.key ? 'page' : undefined}>{item.label}</Link>
          ))}
        </nav>
        <div className="header__actions">
          <Button variant="whatsapp" size="md" iconLeft="chat" href={wa} target="_blank" className="header__wa">WhatsApp</Button>
          <Button variant="primary" size="md" href={routes.home('#contato')} className="header__contact">Fale conosco</Button>
          <button className="header__toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
      <div className="mobile-menu" id="mobile-menu" hidden={!open}>
        <nav aria-label="Menu móvel">
          {NAV.map((item) => (
            <Link key={item.key} className="mobile-menu__link" to={item.href}><span>{item.label}</span><Icon name="arrow-right" size={18} /></Link>
          ))}
        </nav>
        <div className="mobile-menu__actions">
          <Button variant="primary" size="lg" href={routes.home('#contato')}>Fale conosco</Button>
          <Button variant="whatsapp" size="lg" iconLeft="chat" href={wa} target="_blank">Falar no WhatsApp</Button>
        </div>
      </div>
    </header>
  );
}
