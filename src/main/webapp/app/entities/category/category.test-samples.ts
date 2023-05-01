import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 2529,
  categoryName: 'Namibia Sausages',
};

export const sampleWithPartialData: ICategory = {
  id: 87066,
  categoryName: 'one-to-one programming PCI',
  description: 'task-force Garden target',
};

export const sampleWithFullData: ICategory = {
  id: 71269,
  categoryId: 87357,
  categoryName: 'capacitor',
  description: 'Computer',
};

export const sampleWithNewData: NewCategory = {
  categoryName: 'transform Mexico pixel',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
