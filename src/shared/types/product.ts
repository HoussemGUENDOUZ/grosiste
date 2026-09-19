export interface Product {
  id: number
  name: string
  quantity: string // Decimal as string
  lowStockThreshold: string
  pricePiece: string | null
  priceCarton: string | null
  priceKg: string | null
  unitsPerCarton: string | null
  weightPerCartonKg: string | null
  createdAt: string
  updatedAt: string
  archived: boolean
}

export type NewProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateProduct = Partial<NewProduct>
