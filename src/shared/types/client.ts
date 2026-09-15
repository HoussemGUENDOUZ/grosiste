export interface Client {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NewClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClient = Partial<NewClient>;