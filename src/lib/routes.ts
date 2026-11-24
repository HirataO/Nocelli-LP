/** Todas as URLs do site passam por aqui (react-router). */
type QueryValue = string | string[] | null | undefined;

function qs(obj: Record<string, QueryValue> = {}): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    p.set(k, Array.isArray(v) ? v.join(',') : v);
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const routes = {
  home: (hash = '') => `/${hash}`,
  equipamentos: (params?: Record<string, QueryValue>) => `/equipamentos${qs(params)}`,
  produto: (id: string) => `/produto/${encodeURIComponent(id)}`,
  vender: (params?: Record<string, QueryValue>) => `/vender${qs(params)}`,
};
