import { Link } from 'react-router-dom';
import { routes } from '../lib/routes';
import type { Category } from '../types';
import { Icon } from './Icon';

export function CategoryCard({ category, count }: { category: Category; count?: number }) {
  return (
    <Link className="card-category" to={routes.equipamentos({ cat: category.slug })}>
      <span className="card-category__icon"><Icon name="factory" size={24} /></span>
      <span className="card-category__name t-h5">{category.name}</span>
      <span className="card-category__link t-label">
        {count != null ? `${count} ${count === 1 ? 'equipamento' : 'equipamentos'}` : 'Ver equipamentos'}
        <Icon name="arrow-right" size={16} />
      </span>
    </Link>
  );
}
