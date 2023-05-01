import dayjs from 'dayjs/esm';

export interface IBudget {
  id: number;
  budgetId?: number | null;
  monthOfTheTime?: dayjs.Dayjs | null;
  totalBudget?: number | null;
  totalSpent?: number | null;
  amountRemaining?: number | null;
}

export type NewBudget = Omit<IBudget, 'id'> & { id: null };
