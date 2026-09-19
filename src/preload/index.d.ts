import type { Product, NewProduct, UpdateProduct } from '../shared/types/product'
import type { Client, NewClient, UpdateClient } from '../shared/types/client'
import type { Sale, NewSaleInput } from '../shared/types/sale'

declare global {
  interface Window {
    productAPI: {
      getAll: () => Promise<Product[]>
      getById: (id: number) => Promise<Product | null>
      create: (input: NewProduct) => Promise<Product>
      update: (id: number, input: UpdateProduct) => Promise<Product>
      delete: (id: number) => Promise<'archived' | 'deleted'>
    }
    clientAPI: {
      getAll: () => Promise<Client[]>
      getById: (id: number) => Promise<Client | null>
      create: (input: NewClient) => Promise<Client>
      update: (id: number, input: UpdateClient) => Promise<Client>
      delete: (id: number) => Promise<void>
    }
    saleAPI: {
      getAll: () => Promise<Sale[]>
      getById: (id: number) => Promise<Sale | null>
      create: (input: NewSaleInput) => Promise<Sale>
    }
  }
}
