import { COMPANY } from '../data/company';
import { whatsappUrl } from '../lib/text';
import { Icon } from './Icon';

/** Botão flutuante de WhatsApp — acesso rápido em todas as páginas. */
export function WhatsAppFab({ message = 'Olá! Gostaria de falar com a Nocelli.' }: { message?: string }) {
  return (
    <a className="wa-fab" href={whatsappUrl(COMPANY.whatsapp.number, message)} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
      <Icon name="chat" size={24} />
      <span className="wa-fab__label">WhatsApp</span>
    </a>
  );
}
