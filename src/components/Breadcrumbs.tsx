import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export interface Crumb { label: string; href?: string }

/** O último item é a página atual. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Você está em">
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`}>
              {last || !item.href ? <span aria-current={last ? 'page' : undefined}>{item.label}</span> : <Link to={item.href}>{item.label}</Link>}
              {!last && <Icon name="chevron-right" size={14} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
