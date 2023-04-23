import dayjs from 'dayjs/esm';

import { IBudget, NewBudget } from './budget.model';

export const sampleWithRequiredData: IBudget = {
  id: 38215,
  name: 'Wooden mobile',
  startDate: dayjs('2023-03-14T13:38'),
  endDate: dayjs('2023-03-14T11:21'),
  limit: 73108,
};

export const sampleWithPartialData: IBudget = {
  id: 82875,
  name: 'copy quantifying Chair',
  startDate: dayjs('2023-03-13T18:35'),
  endDate: dayjs('2023-03-13T18:03'),
  limit: 23551,
};

export const sampleWithFullData: IBudget = {
  id: 1668,
  name: 'zero',
  startDate: dayjs('2023-03-14T07:51'),
  endDate: dayjs('2023-03-13T17:28'),
  limit: 85582,
};

export const sampleWithNewData: NewBudget = {
  name: 'Mauritius',
  startDate: dayjs('2023-03-14T07:29'),
  endDate: dayjs('2023-03-14T04:27'),
  limit: 98229,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
