/** Validadores puros (valor -> mensagem de erro | ''). */
export type Validator<T = unknown> = (value: T) => string;

export const required = (msg = 'Campo obrigatório.'): Validator => (v) => (String(v ?? '').trim() ? '' : msg);
export const minLength = (n: number, msg?: string): Validator => (v) => (String(v ?? '').trim().length >= n ? '' : msg || `Informe ao menos ${n} caracteres.`);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const email = (msg = 'Informe um e-mail válido.'): Validator => (v) => (EMAIL_RE.test(String(v ?? '').trim()) ? '' : msg);

export const sameAs = (getOther: () => unknown, msg = 'Os e-mails não coincidem.'): Validator => (v) =>
  String(v ?? '').trim().toLowerCase() === String(getOther() ?? '').trim().toLowerCase() ? '' : msg;

export const phoneBR = (msg = 'Informe um telefone com DDD.'): Validator => (v) => {
  const d = String(v ?? '').replace(/\D/g, '');
  return d.length === 10 || d.length === 11 ? '' : msg;
};

export const checked = (msg = 'É necessário confirmar para continuar.'): Validator => (v) => (v ? '' : msg);

/** Executa validadores em ordem e devolve o primeiro erro. */
export const compose = (...fns: Validator[]): Validator => (v) => {
  for (const fn of fns) {
    const err = fn(v);
    if (err) return err;
  }
  return '';
};

/** Máscara visual de telefone: (11) 99999-9999 ou (11) 9999-9999 */
export function maskPhone(value: string): string {
  const d = String(value ?? '').replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
