import { useState, FormEvent } from 'react';
import type { Client, NewClient } from '../../../shared/types/client';

interface ClientFormProps {
  initialClient?: Client;
  onSubmit: (input: NewClient) => Promise<void>;
  onCancel: () => void;
}

function toNullable(value: string): string | null {
  return value.trim() === '' ? null : value.trim();
}

export function ClientForm({ initialClient, onSubmit, onCancel }: ClientFormProps) {
  const isEdit = !!initialClient;

  const [name, setName] = useState(initialClient?.name ?? '');
  const [address, setAddress] = useState(initialClient?.address ?? '');
  const [phone, setPhone] = useState(initialClient?.phone ?? '');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        address: toNullable(address),
        phone: toNullable(phone),
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
      <h2>{isEdit ? 'Edit Client' : 'Add Client'}</h2>

      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Address
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>

      <label>
        Phone
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}