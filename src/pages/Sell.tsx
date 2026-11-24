import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { COMPANY, SELL_ACTIVITIES, SELL_STEPS, WHAT_WE_BUY } from '../data/company';
import { routes } from '../lib/routes';
import { whatsappUrl } from '../lib/text';
import { useForm } from '../lib/useForm';
import { checked, compose, email, maskPhone, minLength, phoneBR, required, sameAs } from '../lib/validators';
import { submitSellRequest } from '../services/api';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { Checkbox, Field, fieldId } from '../components/Field';
import { Icon } from '../components/Icon';
import { Layout } from '../components/Layout';

const INITIAL = { nome: '', empresa: '', cargo: '', ramo: '', telefone: '', email: '', emailConfirm: '', observacoes: '', captcha: false, consent: false };
type SellValues = typeof INITIAL;

/** Dados de exemplo para a pré-visualização de estados: /vender?state=filled|error|submitting|success */
const VALID: Partial<SellValues> = { nome: 'Maria Souza', empresa: 'Cosméticos Aurora Ltda.', cargo: 'Gerente de produção', ramo: 'Cosméticos', telefone: '(11) 99149-2876', email: 'maria@aurora.com.br', emailConfirm: 'maria@aurora.com.br', observacoes: 'Envasadora de 2 pistões, ano 2012, em operação até o mês passado.', captcha: true, consent: true };

export default function Sell() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm(INITIAL, {
    nome: { validate: compose(required('Informe seu nome.'), minLength(2, 'Informe seu nome completo.')) },
    empresa: { validate: required('Informe o nome da empresa.') },
    cargo: { validate: required('Informe seu cargo.') },
    ramo: { validate: required('Selecione o ramo de atividade.') },
    telefone: { validate: compose(required('Informe seu telefone.'), phoneBR()), mask: maskPhone },
    email: { validate: compose(required('Informe seu e-mail.'), email()) },
    emailConfirm: { validate: (v, all) => compose(required('Confirme seu e-mail.'), sameAs(() => all.email))(v), dependsOn: ['email'] },
    captcha: { validate: checked('Confirme que você não é um robô.') },
    consent: { validate: checked('É necessário concordar para enviar a solicitação.') },
  });
  const errorCount = Object.values(form.errors).filter(Boolean).length;
  const showSummary = errorCount > 0;
  const busy = status === 'submitting';

  const showSuccess = (mail: string) => {
    setSubmittedEmail(mail);
    setStatus('success');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const { errors, firstInvalid } = form.validateAll();
    if (Object.keys(errors).length) {
      if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    setStatus('submitting');
    const { captcha: _c, consent: _k, ...payload } = form.values;
    await submitSellRequest(payload);
    showSuccess(form.values.email);
  };

  // Pré-visualização de estados (revisão de design)
  useEffect(() => {
    const preview = params.get('state');
    if (preview === 'filled' || preview === 'submitting' || preview === 'success') {
      form.setValues(VALID);
      if (preview === 'submitting') setStatus('submitting');
      if (preview === 'success') { setSubmittedEmail(VALID.email ?? ''); setStatus('success'); }
    }
    if (preview === 'error') {
      form.setValues({ nome: 'M', empresa: '', telefone: '(11) 9914', email: 'maria@aurora', emailConfirm: 'maria@outra.com.br' });
      form.validateAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const text = (name: 'nome' | 'empresa' | 'cargo' | 'ramo' | 'telefone' | 'email' | 'emailConfirm' | 'observacoes') => ({
    name, value: form.values[name], error: form.errors[name], disabled: busy,
    onChange: (v: string) => form.onChange(name, v), onBlur: () => form.onBlur(name),
  });
  const box = (name: 'captcha' | 'consent') => ({
    name, checked: form.values[name], error: form.errors[name], disabled: busy,
    onChange: (v: boolean) => form.onChange(name, v), onBlur: () => form.onBlur(name),
  });

  return (
    <Layout active="vender" whatsappMessage="Olá! Tenho um equipamento para vender.">
      <section className="page-head">
        <div className="container sell__head">
          <Breadcrumbs items={[{ label: 'Início', href: routes.home() }, { label: 'Vender equipamento' }]} />
          <h1 className="t-h1">Tem um equipamento para vender?</h1>
          <p className="t-body-l muted" id="sell-intro">Conte para a Nocelli sobre seu equipamento. Nossa equipe entrará em contato para avaliar as possibilidades de negociação.</p>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container sell">
          <div className={`form-card${busy ? ' is-submitting' : ''}`} ref={formRef}>
            {status === 'success' ? (
              <div className="success" role="status">
                <span className="success-icon"><Icon name="check" size={32} /></span>
                <h2 className="t-h3">Solicitação enviada com sucesso</h2>
                <p className="t-body-l muted">A equipe da Nocelli recebeu a sua solicitação e entrará em contato para avaliar as possibilidades de negociação.</p>
                {submittedEmail && <p className="t-body-s muted">Contato registrado: {submittedEmail}</p>}
                <div className="success__actions">
                  <Button variant="primary" size="lg" href={routes.home()}>Voltar para a página inicial</Button>
                  <Button variant="secondary" size="lg" href={routes.equipamentos()}>Explorar equipamentos</Button>
                </div>
              </div>
            ) : (
              <form className="sell-form" noValidate aria-describedby="sell-intro" onSubmit={submit}>
                <div className="form-alert" role="alert" hidden={!showSummary}>
                  <Icon name="alert" size={20} />
                  <p className="t-body-s">{`Corrija ${errorCount} ${errorCount === 1 ? 'campo' : 'campos'} para enviar a solicitação.`}</p>
                </div>
                <div className="form-grid">
                  <Field {...text('nome')} label="Nome" required autoComplete="name" placeholder="Seu nome completo" />
                  <Field {...text('empresa')} label="Empresa" required autoComplete="organization" placeholder="Nome da empresa" />
                  <Field {...text('cargo')} label="Cargo" required autoComplete="organization-title" placeholder="Seu cargo" />
                  <Field {...text('ramo')} label="Ramo de atividade" required as="select" options={SELL_ACTIVITIES} placeholder="Selecione o ramo de atividade" />
                  <Field {...text('telefone')} label="Telefone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 99999-9999" hint="Com DDD." />
                  <span className="form-grid__spacer" aria-hidden="true" />
                  <Field {...text('email')} label="E-mail" required type="email" autoComplete="email" placeholder="nome@empresa.com.br" />
                  <Field {...text('emailConfirm')} label="Confirmação de e-mail" required type="email" autoComplete="off" placeholder="Repita o e-mail" />
                  <div className="form-grid__full">
                    <Field {...text('observacoes')} label="Observações" as="textarea" rows={5} maxLength={1000} placeholder="Descreva o equipamento: tipo, marca, modelo, ano e condição." />
                  </div>
                </div>
                <div className="captcha" aria-label="Verificação de segurança">
                  <p className="t-caption muted">Verificação de segurança (área reservada para CAPTCHA — ex.: reCAPTCHA ou hCaptcha)</p>
                  <Checkbox {...box('captcha')}>Não sou um robô</Checkbox>
                </div>
                <Checkbox {...box('consent')}>Concordo com o tratamento dos meus dados pessoais para contato e avaliação comercial, conforme a Lei Geral de Proteção de Dados (LGPD).</Checkbox>
                <p className="t-caption muted">* Campos obrigatórios</p>
                <Button variant="primary" size="lg" type="submit" loading={busy} className="form__submit">{busy ? 'Enviando…' : 'Enviar solicitação'}</Button>
              </form>
            )}
          </div>

          <aside className="sell__aside">
            <div className="sell__block">
              <h2 className="t-h5">O que a Nocelli compra</h2>
              <ul className="check-list">{WHAT_WE_BUY.map((t) => <li className="t-body-s" key={t}><Icon name="check" size={16} />{t}</li>)}</ul>
            </div>
            <div className="sell__block">
              <h2 className="t-h5">Como funciona</h2>
              <ol className="steps">
                {SELL_STEPS.map((s, i) => (
                  <li className="steps__item" key={s.title}><span className="steps__n">{i + 1}</span><div><p className="t-label">{s.title}</p><p className="t-body-s muted">{s.text}</p></div></li>
                ))}
              </ol>
            </div>
            <div className="sell__block sell__block--wa">
              <p className="t-label">Prefere falar agora?</p>
              <Button variant="whatsapp" size="md" iconLeft="chat" href={whatsappUrl(COMPANY.whatsapp.number, 'Olá! Tenho um equipamento para vender.')} target="_blank">Chamar no WhatsApp</Button>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
