import { IBudget } from 'app/entities/budget/budget.model';

export interface ICategory {
  id: number;
  categoryId?: number | null;
  categoryName?: string | null;
  description?: string | null;
  budget?: Pick<IBudget, 'id'> | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
