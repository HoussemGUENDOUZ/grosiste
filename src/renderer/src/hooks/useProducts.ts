import { createContext, createElement, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Product, NewProduct, UpdateProduct } from '../../../shared/types/product'

interface ProductsContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  createProduct: (input: NewProduct) => Promise<void>
  updateProduct: (id: number, input: UpdateProduct) => Promise<void>
  deleteProduct: (id: number) => Promise<'archived' | 'deleted'>
  refresh: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await window.productAPI.getAll()
      setProducts(data)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createProduct = async (input: NewProduct) => {
    await window.productAPI.create(input)
    await refresh()
  }
  const updateProduct = async (id: number, input: UpdateProduct) => {
    await window.productAPI.update(id, input)
    await refresh()
  }
  const deleteProduct = async (id: number) => {
    const r = await window.productAPI.delete(id)
    await refresh()
    return r
  }

  return createElement(
    ProductsContext.Provider,
    { value: { products, loading, error, createProduct, updateProduct, deleteProduct, refresh } },
    children
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
