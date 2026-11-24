import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { WhatsAppFab } from './WhatsAppFab';

/** Layout — skip link + header + <main> + footer + WhatsApp. */
export function Layout({ active, whatsappMessage, children }: { active?: string; whatsappMessage?: string; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header active={active} />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFab message={whatsappMessage} />
    </>
  );
}
