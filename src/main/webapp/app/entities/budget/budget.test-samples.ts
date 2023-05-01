import dayjs from 'dayjs/esm';

import { IBudget, NewBudget } from './budget.model';

export const sampleWithRequiredData: IBudget = {
  id: 38215,
  monthOfTheTime: dayjs('2023-04-30'),
  totalBudget: 11840,
  totalSpent: 11488,
  amountRemaining: 17928,
};

export const sampleWithPartialData: IBudget = {
  id: 99728,
  budgetId: 30809,
  monthOfTheTime: dayjs('2023-05-01'),
  totalBudget: 14884,
  totalSpent: 73108,
  amountRemaining: 82875,
};

export const sampleWithFullData: IBudget = {
  id: 80659,
  budgetId: 77495,
  monthOfTheTime: dayjs('2023-04-30'),
  totalBudget: 99394,
  totalSpent: 82527,
  amountRemaining: 64073,
};

export const sampleWithNewData: NewBudget = {
  monthOfTheTime: dayjs('2023-04-30'),
  totalBudget: 16602,
  totalSpent: 2921,
  amountRemaining: 48752,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
