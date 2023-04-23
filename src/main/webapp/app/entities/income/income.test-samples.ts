import dayjs from 'dayjs/esm';

import { Currency } from 'app/entities/enumerations/currency.model';

import { IIncome, NewIncome } from './income.model';

export const sampleWithRequiredData: IIncome = {
  id: 3631,
  amount: 50554,
  companyName: 'Designer Awesome',
};

export const sampleWithPartialData: IIncome = {
  id: 94165,
  amount: 79155,
  companyName: 'Chair',
  date: dayjs('2023-04-21'),
  currency: Currency['Euros'],
};

export const sampleWithFullData: IIncome = {
  id: 71023,
  amount: 44805,
  companyName: 'deposit olive strategy',
  date: dayjs('2023-04-22'),
  currency: Currency['Euros'],
};

export const sampleWithNewData: NewIncome = {
  amount: 9707,
  companyName: 'Unbranded quantifying Assurance',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
