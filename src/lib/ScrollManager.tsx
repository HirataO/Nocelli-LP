import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Ao navegar: rola até a âncora (#contato…) ou volta ao topo. Mudanças só de query string (filtros) não rolam. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // espera a página montar (os dados são carregados de forma assíncrona)
      const t = setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(), 50);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
