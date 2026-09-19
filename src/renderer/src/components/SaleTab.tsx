import { useState } from 'react'
import type { Product } from '../../../shared/types/product'
import type { Client } from '../../../shared/types/client'
import type { SaleDraft, DraftLine } from '../types/saleDraft'
import type { NewSaleInput } from '../../../shared/types/sale'
import { availableUnits, calcLineTotal } from '../utils/saleCalc'
import Decimal from 'decimal.js'

interface SaleTabProps {
  draft: SaleDraft
  products: Product[]
  clients: Client[]
  onChange: (updated: SaleDraft) => void
  onFinalize: (input: NewSaleInput) => Promise<void>
}

export function SaleTab({ draft, products, clients, onChange, onFinalize }: SaleTabProps) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const addLine = () => {
    if (products.length === 0) return
    const firstProduct = products[0]
    const units = availableUnits(firstProduct)
    const newLine: DraftLine = {
      productId: firstProduct.id,
      unitUsed: units[0] ?? 'piece',
      quantitySold: ''
    }
    onChange({ ...draft, lines: [...draft.lines, newLine] })
  }

  const updateLine = (index: number, patch: Partial<DraftLine>) => {
    const lines = draft.lines.map((line, i) => (i === index ? { ...line, ...patch } : line))
    onChange({ ...draft, lines })
  }

  const removeLine = (index: number) => {
    onChange({ ...draft, lines: draft.lines.filter((_, i) => i !== index) })
  }

  const grandTotal = draft.lines.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId)
    if (!product) return sum
    const lineTotal = calcLineTotal(product, line.unitUsed, line.quantitySold)
    return lineTotal ? sum.plus(new Decimal(lineTotal)) : sum
  }, new Decimal(0))

  const handleFinalize = async () => {
    setError(null)

    if (draft.lines.length === 0) {
      setError('Add at least one product.')
      return
    }
    const amountPaid = draft.amountPaid.trim()
    if (!amountPaid) {
      setError('Enter the amount paid.')
      return
    }
    if (new Decimal(amountPaid).lessThan(grandTotal) && !draft.clientId) {
      setError('Select a client since amount paid is less than the total.')
      return
    }

    setSubmitting(true)
    try {
      await onFinalize({
        clientId: draft.clientId,
        amountPaid,
        items: draft.lines.map((l) => ({
          productId: l.productId,
          unitUsed: l.unitUsed,
          quantitySold: l.quantitySold
        }))
      })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label>
        Client (optional)
        <select
          value={draft.clientId ?? ''}
          onChange={(e) =>
            onChange({ ...draft, clientId: e.target.value ? Number(e.target.value) : null })
          }
        >
          <option value="">-- No client --</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>Line Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {draft.lines.map((line, i) => {
            const product = products.find((p) => p.id === line.productId)
            const units = product ? availableUnits(product) : []
            const lineTotal = product
              ? calcLineTotal(product, line.unitUsed, line.quantitySold)
              : null
            return (
              <tr key={i}>
                <td>
                  <select
                    value={line.productId}
                    onChange={(e) => {
                      const newProduct = products.find((p) => p.id === Number(e.target.value))!
                      const newUnits = availableUnits(newProduct)
                      updateLine(i, { productId: newProduct.id, unitUsed: newUnits[0] ?? 'piece' })
                    }}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={line.unitUsed}
                    onChange={(e) => updateLine(i, { unitUsed: e.target.value as any })}
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    value={line.quantitySold}
                    onChange={(e) => updateLine(i, { quantitySold: e.target.value })}
                    style={{ width: 70 }}
                  />
                </td>
                <td>{lineTotal ?? '-'}</td>
                <td>
                  <button onClick={() => removeLine(i)}>✕</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <button onClick={addLine} disabled={products.length === 0}>
        + Add product
      </button>

      <div style={{ fontWeight: 'bold' }}>Total: {grandTotal.toFixed(2)}</div>

      <label>
        Amount paid
        <input
          value={draft.amountPaid}
          onChange={(e) => onChange({ ...draft, amountPaid: e.target.value })}
        />
        <button
          type="button"
          onClick={() => onChange({ ...draft, amountPaid: grandTotal.toFixed(2) })}
        >
          Paid
        </button>
      </label>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <button onClick={handleFinalize} disabled={submitting}>
        {submitting ? 'Finalizing...' : 'Finalize Sale'}
      </button>
    </div>
  )
}
