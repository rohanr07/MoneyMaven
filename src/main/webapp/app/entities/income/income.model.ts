import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { Currency } from 'app/entities/enumerations/currency.model';

export interface IIncome {
  id: number;
  amount?: number | null;
  companyName?: string | null;
  date?: dayjs.Dayjs | null;
  currency?: Currency | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewIncome = Omit<IIncome, 'id'> & { id: null };
