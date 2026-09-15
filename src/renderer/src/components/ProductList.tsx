import { useState } from 'react';
import type { Product } from '../../../shared/types/product';
import { isLowStock } from '../utils/stock';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAddClick: () => void;
}

export function ProductList({ products, onEdit, onDelete, onAddClick }: ProductListProps) {
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2>Products</h2>
        <button onClick={onAddClick}>+ Add Product</button>
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
            <th>Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} style={{ background: isLowStock(p) ? '#fff3cd' : undefined }}>
              <td>{p.name}</td>
              <td>
                {p.quantity} {isLowStock(p) && <strong style={{ color: '#c0392b' }}>⚠ Low</strong>}
              </td>
              <td>
                <button onClick={() => onEdit(p)}>Edit</button>
                <button onClick={() => onDelete(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && <p>No products match "{search}".</p>}
    </div>
  );
}