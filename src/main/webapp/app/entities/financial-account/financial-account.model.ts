import { AccountType } from 'app/entities/enumerations/account-type.model';

export interface IFinancialAccount {
  id: number;
  name?: string | null;
  balance?: number | null;
  type?: AccountType | null;
  description?: string | null;
}

export type NewFinancialAccount = Omit<IFinancialAccount, 'id'> & { id: null };
