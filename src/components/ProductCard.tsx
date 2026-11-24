import { Link } from 'react-router-dom';
import { categoryBySlug } from '../data/categories';
import { routes } from '../lib/routes';
import type { Product } from '../types';
import { ConditionBadge } from './Badge';
import { Icon } from './Icon';
import { ProductImage } from './ProductImage';

/** Card de produto — dimensões consistentes; o link do título cobre o card inteiro. */
export function ProductCard({ product }: { product: Product }) {
  const cat = categoryBySlug(product.category)?.name ?? product.category;
  return (
    <article className="card-product">
      <div className="card-product__media">
        <ProductImage src={product.images[0]} alt={product.name} />
        {product.condition && <div className="card-product__badge"><ConditionBadge condition={product.condition} /></div>}
      </div>
      <div className="card-product__body">
        <p className="t-eyebrow">{cat}</p>
        <h3 className="card-product__title t-h5"><Link to={routes.produto(product.id)} className="card-product__link">{product.name}</Link></h3>
        <p className="card-product__code t-caption">Cód. {product.code}</p>
        <p className="card-product__summary t-body-s">{product.summary}</p>
        <span className="card-product__cta t-label">Ver detalhes<Icon name="arrow-right" size={16} /></span>
      </div>
    </article>
  );
}
