import { useCallback, useRef, useState } from 'react';
export interface FieldRule {
  validate?: (value: any, values: Record<string, string | boolean>) => string;
  mask?: (value: string) => string;
  /** Campos que, ao mudar, revalidam este (ex.: confirmação de e-mail). */
  dependsOn?: string[];
}

type Values = Record<string, string | boolean>;
type Errors = Record<string, string>;

/**
 * useForm — estado controlado + validação.
 * Valida no blur, revalida a cada alteração depois que o campo foi tocado/errou e valida tudo no envio.
 */
export function useForm<V extends Values>(initial: V, rules: Partial<Record<keyof V & string, FieldRule>>) {
  const [values, setValuesState] = useState<V>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const touched = useRef(new Set<string>());
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const errorsRef = useRef(errors);
  errorsRef.current = errors;

  const run = useCallback((name: string, vals: Values): string => {
    const rule = (rules as Record<string, FieldRule | undefined>)[name];
    return rule?.validate ? rule.validate(vals[name], vals) : '';
  }, [rules]);

  const setError = (name: string, msg: string) => setErrors((prev) => (prev[name] === msg ? prev : { ...prev, [name]: msg }));

  const onChange = (name: keyof V & string, raw: string | boolean) => {
    const rule = (rules as Record<string, FieldRule | undefined>)[name];
    const value = typeof raw === 'string' && rule?.mask ? rule.mask(raw) : raw;
    const next = { ...valuesRef.current, [name]: value } as V;
    valuesRef.current = next;
    setValuesState(next);
    if (touched.current.has(name) || errorsRef.current[name]) setError(name, run(name, next));
    for (const [other, r] of Object.entries(rules as Record<string, FieldRule | undefined>)) {
      if (r?.dependsOn?.includes(name) && (touched.current.has(other) || errorsRef.current[other])) setError(other, run(other, next));
    }
  };

  const onBlur = (name: keyof V & string) => {
    touched.current.add(name);
    setError(name, run(name, valuesRef.current));
  };

  /** Valida tudo; devolve os erros e o nome do primeiro campo inválido (na ordem de `initial`). */
  const validateAll = () => {
    const next: Errors = {};
    for (const name of Object.keys(initial)) {
      touched.current.add(name);
      const e = run(name, valuesRef.current);
      if (e) next[name] = e;
    }
    setErrors(next);
    return { errors: next, firstInvalid: Object.keys(next)[0] as (keyof V & string) | undefined };
  };

  const setValues = (patch: Partial<V>) => {
    const next = { ...valuesRef.current, ...patch } as V;
    valuesRef.current = next;
    setValuesState(next);
  };

  return { values, errors, onChange, onBlur, validateAll, setValues, setErrors };
}
