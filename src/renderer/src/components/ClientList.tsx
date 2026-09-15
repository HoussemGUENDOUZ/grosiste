import { useState } from 'react';
import type { Client } from '../../../shared/types/client';
import { formatClientCode } from '../utils/clientCode';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onAddClick: () => void;
}

export function ClientList({ clients, onEdit, onDelete, onAddClick }: ClientListProps) {
  const [search, setSearch] = useState('');

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2>Clients</h2>
        <button onClick={onAddClick}>+ Add Client</button>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 12, padding: 6, width: '100%', maxWidth: 300 }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td>{formatClientCode(c.id)}</td>
              <td>{c.name}</td>
              <td>{c.phone ?? '-'}</td>
              <td>
                <button onClick={() => onEdit(c)}>Edit</button>
                <button onClick={() => onDelete(c)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && <p>No clients match "{search}".</p>}
    </div>
  );
}