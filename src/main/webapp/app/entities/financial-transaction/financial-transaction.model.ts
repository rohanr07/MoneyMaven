import dayjs from 'dayjs/esm';
import { IFinancialAccount } from 'app/entities/financial-account/financial-account.model';
import { ICategory } from 'app/entities/category/category.model';
import { IBudget } from 'app/entities/budget/budget.model';

export interface IFinancialTransaction {
  id: number;
  description?: string | null;
  amount?: number | null;
  date?: dayjs.Dayjs | null;
  account?: Pick<IFinancialAccount, 'id'> | null;
  category?: Pick<ICategory, 'id'> | null;
  budget?: Pick<IBudget, 'id'> | null;
}

export type NewFinancialTransaction = Omit<IFinancialTransaction, 'id'> & { id: null };
