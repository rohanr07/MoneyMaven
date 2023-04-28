import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { Transaction } from 'app/entities/enumerations/transaction.model';

export interface IAnalytics {
  id: number;
  transaction?: Transaction | null;
  amount?: number | null;
  date?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewAnalytics = Omit<IAnalytics, 'id'> & { id: null };
