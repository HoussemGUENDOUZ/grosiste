import { createContext, useContext, useState, useEffect, useCallback, ReactNode, createElement } from 'react';
import type { Client, NewClient, UpdateClient } from '../../../shared/types/client';

interface ClientsContextValue {
  clients: Client[];
  loading: boolean;
  error: string | null;
  createClient: (input: NewClient) => Promise<void>;
  updateClient: (id: number, input: UpdateClient) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const ClientsContext = createContext<ClientsContextValue | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await window.clientAPI.getAll();
      setClients(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const createClient = async (input: NewClient) => { await window.clientAPI.create(input); await refresh(); };
  const updateClient = async (id: number, input: UpdateClient) => { await window.clientAPI.update(id, input); await refresh(); };
  const deleteClient = async (id: number) => { await window.clientAPI.delete(id); await refresh(); };

  return createElement(
    ClientsContext.Provider,
    { value: { clients, loading, error, createClient, updateClient, deleteClient, refresh } },
    children,
  );
}

export function useClients() {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error('useClients must be used within ClientsProvider');
  return ctx;
}