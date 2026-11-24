import type { ReactNode } from 'react';
import type { Condition } from '../types';

/** Badge — tone: success (novo) | warning (usado) | info | neutral | outline */
export function Badge({ tone = 'neutral', children, className = '' }: { tone?: string; children: ReactNode; className?: string }) {
  return <span className={`badge badge--${tone} ${className}`.trim()}>{children}</span>;
}

/** Indicador de condição do equipamento. Só renderiza quando o dado existe. */
export function ConditionBadge({ condition }: { condition?: Condition }) {
  if (!condition) return null;
  return condition === 'novo' ? <Badge tone="success">Novo</Badge> : <Badge tone="warning">Usado</Badge>;
}
