import type { ReactNode } from 'react';

interface Props { eyebrow?: string; title: string; text?: string; action?: ReactNode; id?: string; inverse?: boolean }

export function SectionHeading({ eyebrow, title, text, action, id, inverse = false }: Props) {
  return (
    <div className={`section-heading${inverse ? ' section-heading--inverse' : ''}`}>
      <div className="section-heading__text">
        {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
        <h2 className="t-h2" id={id}>{title}</h2>
        {text && <p className="t-body-l muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}
