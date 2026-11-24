import { useEffect, useState } from 'react';
import { Icon } from './Icon';

/** Imagem do equipamento com placeholder padronizado (sem foto ou falha de carregamento). */
export function ProductImage({ src, alt = '', eager = false }: { src?: string | null; alt?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) {
    return (
      <div className="media-placeholder" role="img" aria-label="Foto do equipamento indisponível">
        <Icon name="image" size={32} />
        <span className="t-caption">Foto do equipamento</span>
      </div>
    );
  }
  return (
    <div className="media-frame">
      <img className="media-img" src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
    </div>
  );
}
