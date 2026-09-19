import { createContext, useContext, useState, useEffect, useCallback, ReactNode, createElement } from 'react';
import type { Sale, NewSaleInput } from '../../../shared/types/sale';

interface SalesContextValue {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  createSale: (input: NewSaleInput) => Promise<Sale>;
  refresh: () => Promise<void>;
}

const SalesContext = createContext<SalesContextValue | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await window.saleAPI.getAll();
      setSales(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const createSale = async (input: NewSaleInput): Promise<Sale> => {
    const sale = await window.saleAPI.create(input);
    await refresh();
    return sale;
  };

  return createElement(
    SalesContext.Provider,
    { value: { sales, loading, error, createSale, refresh } },
    children,
  );
}

export function useSales() {
  const ctx = useContext(SalesContext);
  if (!ctx) throw new Error('useSales must be used within SalesProvider');
  return ctx;
}