import dayjs from 'dayjs/esm';

import { IFinancialTransaction, NewFinancialTransaction } from './financial-transaction.model';

export const sampleWithRequiredData: IFinancialTransaction = {
  id: 31041,
  description: 'Loan',
  amount: 14804,
  date: dayjs('2023-03-14T02:03'),
};

export const sampleWithPartialData: IFinancialTransaction = {
  id: 87363,
  description: 'unleash Passage Metrics',
  amount: 25150,
  date: dayjs('2023-03-14T14:02'),
};

export const sampleWithFullData: IFinancialTransaction = {
  id: 83945,
  description: 'Investment Dinar',
  amount: 40675,
  date: dayjs('2023-03-14T12:42'),
};

export const sampleWithNewData: NewFinancialTransaction = {
  description: 'withdrawal Malawi',
  amount: 83313,
  date: dayjs('2023-03-14T11:21'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
