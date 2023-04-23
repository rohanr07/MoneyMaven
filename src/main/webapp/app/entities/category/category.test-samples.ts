import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 2529,
  name: 'Namibia Sausages',
};

export const sampleWithPartialData: ICategory = {
  id: 554,
  name: 'USB Down-sized Principal',
  description: 'synthesizing Directives',
};

export const sampleWithFullData: ICategory = {
  id: 32315,
  name: 'target Realigned Handmade',
  description: 'Concrete Steel transform',
};

export const sampleWithNewData: NewCategory = {
  name: 'Account Utah',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
