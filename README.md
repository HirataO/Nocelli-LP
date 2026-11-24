# Nocelli LP — React + TypeScript

Redesign do site da Nocelli (plataforma B2B de compra e venda de máquinas e equipamentos industriais).
Vite + React 18 + TypeScript + react-router. Valores de equipamentos são sempre "sob consulta".

## Rodar
```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # gera dist/
npm run preview
```

## Rotas
| Rota | Página |
|---|---|
| `/` | Home: hero com os dois caminhos (comprar / vender), categorias, destaques, institucional, serviços, segmentos, contato |
| `/equipamentos?q=&cat=&sort=` | Marketplace: busca, filtro por categoria, ordenação, contagem, "carregar mais", estado vazio; filtros na URL |
| `/produto/:id` | Detalhe: galeria, especificações, orçamento/disponibilidade (`<dialog>`), WhatsApp, relacionados |
| `/vender` | Formulário de venda (validação, máscara, CAPTCHA reservado, LGPD). Estados para revisão: `?state=filled\|error\|submitting\|success` |

> SPA: em produção configure o servidor para devolver `index.html` em qualquer rota (fallback).

## Estrutura
```
src/
  types.ts            tipos (Product, Category, SellRequest…)
  lib/                routes, text, validators (puros), useForm, useAsync, ScrollManager
  data/               company, categories, products (dados estáticos tipados)
  services/api.ts     ÚNICO ponto de acesso a dados (async) — trocar por fetch/TanStack Query
  components/         Button, Field/Checkbox (controlados), Header, Footer, ProductCard, QuoteDialog…
  pages/              Home, Marketplace, Product, Sell
  styles/             tokens.css (design tokens do Figma), base, components, pages
```

## Pendências (a fornecer pela Nocelli)
- **Logotipo original** (hoje tenta carregar de nocelli.com.br e cai para um wordmark provisório): colocar em `public/` e apontar `COMPANY.logoUrl`.
- **Verde institucional exato**: `#1B7240` é provisório (`--green-*` em `src/styles/tokens.css`).
- **E-mail oficial** (`[a confirmar]` em `data/company.ts`) e confirmação do telefone (11) 2378-4190.
- **Fotos, condição (novo/usado) e especificações** dos produtos: só o NMC001 tem ficha completa.
- **Política de privacidade / texto LGPD** e provedor de **CAPTCHA** (hoje, área reservada simulada).
- **Backend**: envio do formulário e do orçamento são simulados em `services/api.ts`.
- Imagens de produtos são hotlink de `nocelli.com.br`; em produção, hospedar.
