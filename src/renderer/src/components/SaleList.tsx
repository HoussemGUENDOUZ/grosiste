import type { Sale } from '../../../shared/types/sale';
import { useClients } from '../hooks/useClients';

interface SaleListProps {
  sales: Sale[];
  onSelect: (sale: Sale) => void;
}

function formatDate(iso: string): string {
  // SQLite's datetime('now') format ("YYYY-MM-DD HH:MM:SS") needs 'T' for reliable Date parsing
  return new Date(iso.replace(' ', 'T')).toLocaleString();
}

export function SaleList({ sales, onSelect }: SaleListProps) {
  const { clients } = useClients();

  const clientName = (clientId: number | null) =>
    clientId ? clients.find((c) => c.id === clientId)?.name ?? `#${clientId}` : 'Walk-in';

  return (
    <div>
      <h2>Sales History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Date</th><th>Client</th><th>Total</th><th>Paid</th><th></th></tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{formatDate(sale.createdAt)}</td>
              <td>{clientName(sale.clientId)}</td>
              <td>{sale.totalAmount}</td>
              <td>{sale.amountPaid}</td>
              <td><button onClick={() => onSelect(sale)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {sales.length === 0 && <p>No sales yet.</p>}
    </div>
  );
}