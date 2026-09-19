import type { Sale } from '../../../shared/types/sale';
import { useClients } from '../hooks/useClients';
import Decimal from 'decimal.js';

interface SaleDetailProps {
  sale: Sale;
  onBack: () => void;
}

export function SaleDetail({ sale, onBack }: SaleDetailProps) {
  const { clients } = useClients();
  const client = sale.clientId ? clients.find((c) => c.id === sale.clientId) : null;
  const balanceDue = new Decimal(sale.totalAmount).minus(new Decimal(sale.amountPaid));

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2>Sale #{sale.id}</h2>
      <p>Client: {client?.name ?? 'Walk-in'}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Product</th><th>Unit</th><th>Qty</th><th>Unit Price</th><th>Line Total</th></tr>
        </thead>
        <tbody>
          {sale.items.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>{item.unitUsed}</td>
              <td>{item.quantitySold}</td>
              <td>{item.unitPrice}</td>
              <td>{item.lineTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>Total:</strong> {sale.totalAmount}</p>
      <p><strong>Paid:</strong> {sale.amountPaid}</p>
      {balanceDue.greaterThan(0) && (
        <p style={{ color: '#c0392b' }}><strong>Balance due:</strong> {balanceDue.toFixed(2)}</p>
      )}
    </div>
  );
}