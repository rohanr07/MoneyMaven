import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IExpenses } from '../expenses.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../expenses.test-samples';

import { ExpensesService, RestExpenses } from './expenses.service';

const requireRestSample: RestExpenses = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Expenses Service', () => {
  let service: ExpensesService;
  let httpMock: HttpTestingController;
  let expectedResult: IExpenses | IExpenses[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExpensesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Expenses', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const expenses = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(expenses).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Expenses', () => {
      const expenses = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(expenses).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Expenses', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Expenses', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Expenses', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExpensesToCollectionIfMissing', () => {
      it('should add a Expenses to an empty array', () => {
        const expenses: IExpenses = sampleWithRequiredData;
        expectedResult = service.addExpensesToCollectionIfMissing([], expenses);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(expenses);
      });

      it('should not add a Expenses to an array that contains it', () => {
        const expenses: IExpenses = sampleWithRequiredData;
        const expensesCollection: IExpenses[] = [
          {
            ...expenses,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExpensesToCollectionIfMissing(expensesCollection, expenses);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Expenses to an array that doesn't contain it", () => {
        const expenses: IExpenses = sampleWithRequiredData;
        const expensesCollection: IExpenses[] = [sampleWithPartialData];
        expectedResult = service.addExpensesToCollectionIfMissing(expensesCollection, expenses);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(expenses);
      });

      it('should add only unique Expenses to an array', () => {
        const expensesArray: IExpenses[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const expensesCollection: IExpenses[] = [sampleWithRequiredData];
        expectedResult = service.addExpensesToCollectionIfMissing(expensesCollection, ...expensesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const expenses: IExpenses = sampleWithRequiredData;
        const expenses2: IExpenses = sampleWithPartialData;
        expectedResult = service.addExpensesToCollectionIfMissing([], expenses, expenses2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(expenses);
        expect(expectedResult).toContain(expenses2);
      });

      it('should accept null and undefined values', () => {
        const expenses: IExpenses = sampleWithRequiredData;
        expectedResult = service.addExpensesToCollectionIfMissing([], null, expenses, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(expenses);
      });

      it('should return initial array if no Expenses is added', () => {
        const expensesCollection: IExpenses[] = [sampleWithRequiredData];
        expectedResult = service.addExpensesToCollectionIfMissing(expensesCollection, undefined, null);
        expect(expectedResult).toEqual(expensesCollection);
      });
    });

    describe('compareExpenses', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExpenses(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExpenses(entity1, entity2);
        const compareResult2 = service.compareExpenses(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExpenses(entity1, entity2);
        const compareResult2 = service.compareExpenses(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExpenses(entity1, entity2);
        const compareResult2 = service.compareExpenses(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
