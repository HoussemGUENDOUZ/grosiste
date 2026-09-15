import { useState, useEffect, useCallback } from 'react';
import type { Client, NewClient, UpdateClient } from '../../../shared/types/client';

export function useClients() {
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

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createClient = async (input: NewClient) => {
    await window.clientAPI.create(input);
    await refresh();
  };

  const updateClient = async (id: number, input: UpdateClient) => {
    await window.clientAPI.update(id, input);
    await refresh();
  };

  const deleteClient = async (id: number) => {
    await window.clientAPI.delete(id);
    await refresh();
  };

  return { clients, loading, error, createClient, updateClient, deleteClient };
}