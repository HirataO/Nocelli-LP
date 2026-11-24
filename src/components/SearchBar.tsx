import type { FormEvent } from 'react';
import { Icon } from './Icon';
import { Button } from './Button';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  size?: 'lg' | 'md';
  id?: string;
}

/** Barra de busca em destaque (controlada). */
export function SearchBar({ value, onChange, onSubmit, placeholder = 'Busque por equipamento, código ou tipo de máquina', size = 'lg', id = 'busca' }: Props) {
  const submit = (e: FormEvent) => { e.preventDefault(); onSubmit?.(value); };
  return (
    <form className={`searchbar searchbar--${size}`} role="search" onSubmit={submit}>
      <Icon name="search" size={22} className="searchbar__icon" />
      <input className="searchbar__input" id={id} name="q" type="search" value={value} placeholder={placeholder} autoComplete="off" enterKeyHint="search" aria-label="Buscar equipamentos" onChange={(e) => onChange(e.target.value)} />
      <Button variant="primary" size="lg" type="submit" className="searchbar__btn">Buscar</Button>
    </form>
  );
}
