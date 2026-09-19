export type UnitUsed = 'piece' | 'carton' | 'kg';

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  productName: string;
  unitUsed: UnitUsed;
  quantitySold: string;
  unitPrice: string;
  lineTotal: string;
}

export interface Sale {
  id: number;
  clientId: number | null;
  totalAmount: string;
  amountPaid: string;
  createdAt: string;
  items: SaleItem[];
}

export interface NewSaleItemInput {
  productId: number;
  unitUsed: UnitUsed;
  quantitySold: string;
}

export interface NewSaleInput {
  clientId: number | null;
  amountPaid: string;
  items: NewSaleItemInput[];
}