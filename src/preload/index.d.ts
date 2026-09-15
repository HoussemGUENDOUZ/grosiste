import type { Product, NewProduct, UpdateProduct } from '../shared/types/product';

declare global {
  interface Window {
    productAPI: {
      getAll: () => Promise<Product[]>;
      getById: (id: number) => Promise<Product | null>;
      create: (input: NewProduct) => Promise<Product>;
      update: (id: number, input: UpdateProduct) => Promise<Product>;
      delete: (id: number) => Promise<void>;
    };
  }
}