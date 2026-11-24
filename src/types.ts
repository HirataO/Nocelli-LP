export type Condition = 'novo' | 'usado';
export type IconName = string;

export interface Category {
  slug: string;
  name: string;
  home?: boolean;
}

export interface ProductModels {
  columns: string[];
  rows: string[][];
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  summary: string;
  description?: string;
  condition?: Condition;
  featured?: boolean;
  images: string[];
  specs?: [string, string][];
  models?: ProductModels;
  extra?: [string, string][];
}

export interface SellRequest {
  nome: string;
  empresa: string;
  cargo: string;
  ramo: string;
  telefone: string;
  email: string;
  emailConfirm: string;
  observacoes: string;
}

export interface QuoteRequest {
  product: string;
  nome: string;
  telefone: string;
  email: string;
  mensagem: string;
}
