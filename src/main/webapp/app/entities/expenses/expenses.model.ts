import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IExpenses {
  id: number;
  expenseType?: string | null;
  amount?: number | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewExpenses = Omit<IExpenses, 'id'> & { id: null };
