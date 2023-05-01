import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 2529,
  categoryName: 'Namibia Sausages',
  budgetTarget: 77300,
};

export const sampleWithPartialData: ICategory = {
  id: 87066,
  categoryName: 'one-to-one programming PCI',
  description: 'task-force Garden target',
  budgetTarget: 25578,
};

export const sampleWithFullData: ICategory = {
  id: 71269,
  categoryId: 87357,
  categoryName: 'capacitor',
  description: 'Computer',
  budgetTarget: 7459,
};

export const sampleWithNewData: NewCategory = {
  categoryName: 'transform Mexico pixel',
  budgetTarget: 38430,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
