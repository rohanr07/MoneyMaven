import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFinancialTransaction } from '../financial-transaction.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../financial-transaction.test-samples';

import { FinancialTransactionService, RestFinancialTransaction } from './financial-transaction.service';

const requireRestSample: RestFinancialTransaction = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('FinancialTransaction Service', () => {
  let service: FinancialTransactionService;
  let httpMock: HttpTestingController;
  let expectedResult: IFinancialTransaction | IFinancialTransaction[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FinancialTransactionService);
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

    it('should create a FinancialTransaction', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const financialTransaction = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(financialTransaction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FinancialTransaction', () => {
      const financialTransaction = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(financialTransaction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FinancialTransaction', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FinancialTransaction', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FinancialTransaction', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFinancialTransactionToCollectionIfMissing', () => {
      it('should add a FinancialTransaction to an empty array', () => {
        const financialTransaction: IFinancialTransaction = sampleWithRequiredData;
        expectedResult = service.addFinancialTransactionToCollectionIfMissing([], financialTransaction);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(financialTransaction);
      });

      it('should not add a FinancialTransaction to an array that contains it', () => {
        const financialTransaction: IFinancialTransaction = sampleWithRequiredData;
        const financialTransactionCollection: IFinancialTransaction[] = [
          {
            ...financialTransaction,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFinancialTransactionToCollectionIfMissing(financialTransactionCollection, financialTransaction);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FinancialTransaction to an array that doesn't contain it", () => {
        const financialTransaction: IFinancialTransaction = sampleWithRequiredData;
        const financialTransactionCollection: IFinancialTransaction[] = [sampleWithPartialData];
        expectedResult = service.addFinancialTransactionToCollectionIfMissing(financialTransactionCollection, financialTransaction);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(financialTransaction);
      });

      it('should add only unique FinancialTransaction to an array', () => {
        const financialTransactionArray: IFinancialTransaction[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const financialTransactionCollection: IFinancialTransaction[] = [sampleWithRequiredData];
        expectedResult = service.addFinancialTransactionToCollectionIfMissing(financialTransactionCollection, ...financialTransactionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const financialTransaction: IFinancialTransaction = sampleWithRequiredData;
        const financialTransaction2: IFinancialTransaction = sampleWithPartialData;
        expectedResult = service.addFinancialTransactionToCollectionIfMissing([], financialTransaction, financialTransaction2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(financialTransaction);
        expect(expectedResult).toContain(financialTransaction2);
      });

      it('should accept null and undefined values', () => {
        const financialTransaction: IFinancialTransaction = sampleWithRequiredData;
        expectedResult = service.addFinancialTransactionToCollectionIfMissing([], null, financialTransaction, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(financialTransaction);
      });

      it('should return initial array if no FinancialTransaction is added', () => {
        const financialTransactionCollection: IFinancialTransaction[] = [sampleWithRequiredData];
        expectedResult = service.addFinancialTransactionToCollectionIfMissing(financialTransactionCollection, undefined, null);
        expect(expectedResult).toEqual(financialTransactionCollection);
      });
    });

    describe('compareFinancialTransaction', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFinancialTransaction(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFinancialTransaction(entity1, entity2);
        const compareResult2 = service.compareFinancialTransaction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFinancialTransaction(entity1, entity2);
        const compareResult2 = service.compareFinancialTransaction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFinancialTransaction(entity1, entity2);
        const compareResult2 = service.compareFinancialTransaction(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
