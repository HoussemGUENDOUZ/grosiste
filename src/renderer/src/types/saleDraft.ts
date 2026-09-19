import type { UnitUsed } from '../../../shared/types/sale';

export interface DraftLine {
  productId: number;
  unitUsed: UnitUsed;
  quantitySold: string; // kept as raw string while typing, same pattern as ProductForm
}

export interface SaleDraft {
  tabId: string;        // local id for this tab, unrelated to any DB id
  clientId: number | null;
  amountPaid: string;
  lines: DraftLine[];
}

export function createEmptyDraft(tabId: string): SaleDraft {
  return { tabId, clientId: null, amountPaid: '', lines: [] };
}