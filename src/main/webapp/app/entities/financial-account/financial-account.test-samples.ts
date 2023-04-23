import { AccountType } from 'app/entities/enumerations/account-type.model';

import { IFinancialAccount, NewFinancialAccount } from './financial-account.model';

export const sampleWithRequiredData: IFinancialAccount = {
  id: 16765,
  name: 'calculate Arabia',
  balance: 11461,
  type: AccountType['CREDIT_CARD'],
};

export const sampleWithPartialData: IFinancialAccount = {
  id: 50651,
  name: 'Account Legacy solutions',
  balance: 89408,
  type: AccountType['CASH'],
};

export const sampleWithFullData: IFinancialAccount = {
  id: 77768,
  name: 'Albania',
  balance: 82507,
  type: AccountType['CREDIT_CARD'],
  description: 'deposit',
};

export const sampleWithNewData: NewFinancialAccount = {
  name: 'Planner cyan Cotton',
  balance: 31994,
  type: AccountType['CHECKING'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
