import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { submitQuoteRequest } from '../services/api';
import { useForm } from '../lib/useForm';
import { compose, email, maskPhone, phoneBR, required } from '../lib/validators';
import type { Product } from '../types';
import { Button } from './Button';
import { Field, fieldId } from './Field';
import { Icon } from './Icon';

export type QuoteIntent = 'orcamento' | 'disponibilidade';

const COPY = {
  orcamento: {
    title: 'Solicitar orçamento',
    text: (p: Product) => `Equipamento sob consulta. Informe seus dados e a equipe da Nocelli retornará com a proposta para ${p.name}.`,
    msg: (p: Product) => `Olá, gostaria de solicitar orçamento do equipamento ${p.name} (cód. ${p.code}).`,
  },
  disponibilidade: {
    title: 'Consultar disponibilidade',
    text: (p: Product) => `Confirme com a equipe da Nocelli se ${p.name} está disponível.`,
    msg: (p: Product) => `Olá, gostaria de consultar a disponibilidade do equipamento ${p.name} (cód. ${p.code}).`,
  },
};

const RULES = {
  nome: { validate: required('Informe seu nome.') },
  telefone: { validate: compose(required('Informe seu telefone.'), phoneBR()), mask: maskPhone },
  email: { validate: compose(required('Informe seu e-mail.'), email()) },
  mensagem: { validate: required('Escreva uma mensagem.') },
};

/** Diálogo modal (<dialog>) de contato comercial sobre um produto. Estados: formulário → enviando → sucesso. */
export function QuoteDialog({ product, intent, onClose }: { product: Product; intent: QuoteIntent; onClose: () => void }) {
  const copy = COPY[intent];
  const ref = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<'form' | 'submitting' | 'success'>('form');
  const form = useForm({ nome: '', telefone: '', email: '', mensagem: copy.msg(product) }, RULES);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.getElementById(fieldId('q-nome'))?.focus();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const { firstInvalid } = form.validateAll();
    if (firstInvalid) return document.getElementById(fieldId(`q-${firstInvalid}`))?.focus();
    setStatus('submitting');
    await submitQuoteRequest({ product: product.code, ...form.values });
    setStatus('success');
  };

  const busy = status === 'submitting';
  const f = (name: keyof typeof form.values) => ({
    name: `q-${name}`, value: form.values[name], error: form.errors[name], disabled: busy,
    onChange: (v: string) => form.onChange(name, v), onBlur: () => form.onBlur(name),
  });

  return (
    <dialog ref={ref} className="dialog" aria-labelledby="dlg-title" onCancel={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      <div className="dialog__head">
        <h2 className="t-h4" id="dlg-title">{copy.title}</h2>
        <button className="icon-btn" type="button" aria-label="Fechar" onClick={onClose}><Icon name="close" size={22} /></button>
      </div>
      <div className="dialog__body">
        {status === 'success' ? (
          <div className="dialog__success">
            <span className="success-icon"><Icon name="check" size={28} /></span>
            <h3 className="t-h4">Solicitação enviada</h3>
            <p className="t-body-m muted">A equipe da Nocelli recebeu sua solicitação e entrará em contato em breve.</p>
            <Button variant="primary" size="lg" onClick={onClose}>Fechar</Button>
          </div>
        ) : (
          <>
            <p className="t-body-m muted">{copy.text(product)}</p>
            <form className="dialog__form" noValidate onSubmit={submit}>
              <Field {...f('nome')} label="Nome" required autoComplete="name" />
              <Field {...f('telefone')} label="Telefone" required type="tel" inputMode="tel" placeholder="(11) 99999-9999" autoComplete="tel" />
              <Field {...f('email')} label="E-mail" required type="email" autoComplete="email" placeholder="nome@empresa.com.br" />
              <Field {...f('mensagem')} label="Mensagem" as="textarea" rows={4} required />
              <div className="dialog__actions">
                <Button variant="secondary" size="lg" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" size="lg" type="submit" loading={busy}>{busy ? 'Enviando…' : 'Enviar solicitação'}</Button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
