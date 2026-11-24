import { useState } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY } from '../data/company';
import { routes } from '../lib/routes';

/**
 * Logo — tenta o logotipo original do site atual; se não carregar, mostra um wordmark provisório.
 * TODO: copiar o arquivo original para /public e apontar COMPANY.logoUrl para ele.
 */
export function Logo({ inverse = false }: { inverse?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <Link className={`logo${inverse ? ' logo--inverse' : ''}`} to={routes.home()} aria-label="Nocelli — página inicial">
      {!failed && <img className="logo__img" src={COMPANY.logoUrl} alt="Nocelli" height={36} onError={() => setFailed(true)} />}
      <span className="logo__fallback" hidden={!failed}>
        <span className="logo__mark">N</span>
        <span className="logo__word">NOCELLI</span>
      </span>
    </Link>
  );
}
