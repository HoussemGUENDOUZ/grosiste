import { useState, useEffect, useCallback } from 'react';
import type { Product, NewProduct, UpdateProduct } from '../../../shared/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await window.productAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProduct = async (input: NewProduct) => {
    await window.productAPI.create(input);
    await refresh();
  };

  const updateProduct = async (id: number, input: UpdateProduct) => {
    await window.productAPI.update(id, input);
    await refresh();
  };

  const deleteProduct = async (id: number) => {
    await window.productAPI.delete(id);
    await refresh();
  };

  return { products, loading, error, createProduct, updateProduct, deleteProduct };
}