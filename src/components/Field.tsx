import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface FieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  as?: 'input' | 'select' | 'textarea';
  type?: string;
  placeholder?: string;
  options?: string[];
  autoComplete?: string;
  inputMode?: 'tel' | 'email' | 'text';
  hint?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
}

/** Id do controle — usado para devolver o foco ao primeiro campo inválido. */
export const fieldId = (name: string) => `f-${name}`;

function ErrorText({ id, error }: { id?: string; error?: string }) {
  return (
    <p className="field__error" id={id} role="alert" hidden={!error}>
      <Icon name="alert" size={16} />
      <span className="field__error-text">{error}</span>
    </p>
  );
}

/**
 * Field — input | select | textarea com label, ajuda e erro (controlado).
 * Estados: default · focus (CSS) · filled · error (prop error) · disabled.
 */
export function Field({ name, label, value, onChange, onBlur, error, required = false, as = 'input', type = 'text', placeholder = '', options = [], autoComplete, inputMode, hint, rows = 5, maxLength, disabled }: FieldProps) {
  const id = fieldId(name);
  const errId = `${id}-erro`;
  const common = { id, name, disabled, onBlur, 'aria-describedby': errId, 'aria-invalid': error ? true : false } as const;

  let control: ReactNode;
  if (as === 'select') {
    control = (
      <select className="control control--select" {...common} required={required} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else if (as === 'textarea') {
    control = <textarea className="control control--textarea" {...common} rows={rows} placeholder={placeholder} maxLength={maxLength} value={value} onChange={(e) => onChange(e.target.value)} />;
  } else {
    control = <input className="control" {...common} type={type} placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength} value={value} onChange={(e) => onChange(e.target.value)} />;
  }

  return (
    <div className={`field${error ? ' has-error' : ''}${disabled ? ' is-disabled' : ''}`} data-field={name}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? <span className="field__req" aria-hidden="true"> *</span> : <span className="field__opt"> (opcional)</span>}
      </label>
      {as === 'select' ? (
        <div className="select-wrap">{control}<Icon name="chevron-down" size={20} className="select-wrap__chevron" /></div>
      ) : control}
      {hint && <p className="field__hint t-caption">{hint}</p>}
      <ErrorText id={errId} error={error} />
    </div>
  );
}

interface CheckboxProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  children: ReactNode;
}

/** Checkbox acessível com erro (controlado). */
export function Checkbox({ name, checked, onChange, onBlur, error, disabled, children }: CheckboxProps) {
  const id = fieldId(name);
  return (
    <div className={`checkbox${error ? ' has-error' : ''}`} data-field={name}>
      <label className="checkbox__label" htmlFor={id}>
        <input className="checkbox__input" type="checkbox" id={id} name={name} checked={checked} disabled={disabled} onBlur={onBlur} onChange={(e) => onChange(e.target.checked)} />
        <span className="checkbox__box"><Icon name="check" size={14} /></span>
        <span className="checkbox__text t-body-s">{children}</span>
      </label>
      <ErrorText error={error} />
    </div>
  );
}
