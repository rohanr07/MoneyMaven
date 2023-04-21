import dayjs from 'dayjs/esm';

import { IExpenses, NewExpenses } from './expenses.model';

export const sampleWithRequiredData: IExpenses = {
  id: 77490,
  expenseType: 'initiative',
  amount: 35655,
};

export const sampleWithPartialData: IExpenses = {
  id: 20408,
  expenseType: 'digital',
  amount: 43946,
  description: 'payment',
  date: dayjs('2023-04-14'),
};

export const sampleWithFullData: IExpenses = {
  id: 34929,
  expenseType: 'input',
  amount: 16057,
  description: 'Cambridgeshire syndicate Licensed',
  date: dayjs('2023-04-15'),
};

export const sampleWithNewData: NewExpenses = {
  expenseType: 'EXE payment concept',
  amount: 69459,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
