/**
 * Camada de acesso a dados. Hoje lê módulos estáticos; amanhã troca por fetch('/api/...').
 * Mantenha as assinaturas (todas async) — funcionam direto como queryFn (TanStack Query) ou loaders.
 */
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import type { Category, Product, QuoteRequest, SellRequest } from '../types';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export interface SubmitResult<T> {
  ok: true;
  receivedAt: string;
  data: T;
}

export async function listProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProduct(id: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function listCategories(): Promise<Category[]> {
  return CATEGORIES;
}

/** Simula envio ao backend. Troque por: fetch('/api/venda', { method: 'POST', body: JSON.stringify(data) }) */
export async function submitSellRequest(data: SellRequest): Promise<SubmitResult<SellRequest>> {
  await delay(1600);
  return { ok: true, receivedAt: new Date().toISOString(), data };
}

/** Pedido de orçamento / disponibilidade de um produto específico. */
export async function submitQuoteRequest(data: QuoteRequest): Promise<SubmitResult<QuoteRequest>> {
  await delay(1200);
  return { ok: true, receivedAt: new Date().toISOString(), data };
}
