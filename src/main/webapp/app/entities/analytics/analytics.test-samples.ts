import dayjs from 'dayjs/esm';

import { Transaction } from 'app/entities/enumerations/transaction.model';

import { IAnalytics, NewAnalytics } from './analytics.model';

export const sampleWithRequiredData: IAnalytics = {
  id: 9410,
};

export const sampleWithPartialData: IAnalytics = {
  id: 81435,
};

export const sampleWithFullData: IAnalytics = {
  id: 73292,
  transaction: Transaction['Earned'],
  amount: 91279,
  date: dayjs('2023-04-27'),
};

export const sampleWithNewData: NewAnalytics = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
