import { useState, FormEvent } from 'react';
import type { Product, NewProduct } from '../../../shared/types/product';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (input: NewProduct) => Promise<void>;
  onCancel: () => void;
}

// Empty string in an optional field means "not applicable" -> null.
// Empty string in a required field is invalid and blocked before submit.
function toNullable(value: string): string | null {
  return value.trim() === '' ? null : value.trim();
}

export function ProductForm({ initialProduct, onSubmit, onCancel }: ProductFormProps) {
  const isEdit = !!initialProduct;

  const [name, setName] = useState(initialProduct?.name ?? '');
  const [quantity, setQuantity] = useState(initialProduct?.quantity ?? '');
  const [lowStockThreshold, setLowStockThreshold] = useState(initialProduct?.lowStockThreshold ?? '');
  const [pricePiece, setPricePiece] = useState(initialProduct?.pricePiece ?? '');
  const [priceCarton, setPriceCarton] = useState(initialProduct?.priceCarton ?? '');
  const [priceKg, setPriceKg] = useState(initialProduct?.priceKg ?? '');
  const [unitsPerCarton, setUnitsPerCarton] = useState(initialProduct?.unitsPerCarton ?? '');
  const [weightPerCartonKg, setWeightPerCartonKg] = useState(initialProduct?.weightPerCartonKg ?? '');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !quantity.trim() || !lowStockThreshold.trim()) {
      setError('Name, quantity, and low stock threshold are required.');
      return;
    }
    if (!pricePiece && !priceCarton && !priceKg) {
      setError('At least one price (piece, carton, or kg) must be set.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        quantity: quantity.trim(),
        lowStockThreshold: lowStockThreshold.trim(),
        pricePiece: toNullable(pricePiece),
        priceCarton: toNullable(priceCarton),
        priceKg: toNullable(priceKg),
        unitsPerCarton: toNullable(unitsPerCarton),
        weightPerCartonKg: toNullable(weightPerCartonKg),
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
      <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Quantity (in cartons/bags)
        <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 10.0000" />
      </label>

      <label>
        Low stock threshold
        <input value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} />
      </label>

      <fieldset>
        <legend>Prices (set at least one)</legend>
        <label>
          Price per piece
          <input value={pricePiece} onChange={(e) => setPricePiece(e.target.value)} />
        </label>
        <label>
          Price per carton
          <input value={priceCarton} onChange={(e) => setPriceCarton(e.target.value)} />
        </label>
        <label>
          Price per kg
          <input value={priceKg} onChange={(e) => setPriceKg(e.target.value)} />
        </label>
      </fieldset>

      <label>
        Units per carton (only if sold by piece)
        <input value={unitsPerCarton} onChange={(e) => setUnitsPerCarton(e.target.value)} />
      </label>

      <label>
        Weight per carton, kg (only if sold by kg)
        <input value={weightPerCartonKg} onChange={(e) => setWeightPerCartonKg(e.target.value)} />
      </label>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}