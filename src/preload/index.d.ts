import type { Product, NewProduct, UpdateProduct } from '../shared/types/product';
import type { Client, NewClient, UpdateClient } from '../shared/types/client';

declare global {
  interface Window {
    productAPI: {
      getAll: () => Promise<Product[]>;
      getById: (id: number) => Promise<Product | null>;
      create: (input: NewProduct) => Promise<Product>;
      update: (id: number, input: UpdateProduct) => Promise<Product>;
      delete: (id: number) => Promise<void>;
    };
    clientAPI: {
      getAll: () => Promise<Client[]>;
      getById: (id: number) => Promise<Client | null>;
      create: (input: NewClient) => Promise<Client>;
      update: (id: number, input: UpdateClient) => Promise<Client>;
      delete: (id: number) => Promise<void>;
    };
  }
}