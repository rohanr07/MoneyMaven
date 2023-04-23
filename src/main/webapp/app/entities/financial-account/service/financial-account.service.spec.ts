import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFinancialAccount } from '../financial-account.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../financial-account.test-samples';

import { FinancialAccountService } from './financial-account.service';

const requireRestSample: IFinancialAccount = {
  ...sampleWithRequiredData,
};

describe('FinancialAccount Service', () => {
  let service: FinancialAccountService;
  let httpMock: HttpTestingController;
  let expectedResult: IFinancialAccount | IFinancialAccount[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FinancialAccountService);
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

    it('should create a FinancialAccount', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const financialAccount = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(financialAccount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FinancialAccount', () => {
      const financialAccount = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(financialAccount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FinancialAccount', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FinancialAccount', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FinancialAccount', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFinancialAccountToCollectionIfMissing', () => {
      it('should add a FinancialAccount to an empty array', () => {
        const financialAccount: IFinancialAccount = sampleWithRequiredData;
        expectedResult = service.addFinancialAccountToCollectionIfMissing([], financialAccount);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(financialAccount);
      });

      it('should not add a FinancialAccount to an array that contains it', () => {
        const financialAccount: IFinancialAccount = sampleWithRequiredData;
        const financialAccountCollection: IFinancialAccount[] = [
          {
            ...financialAccount,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFinancialAccountToCollectionIfMissing(financialAccountCollection, financialAccount);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FinancialAccount to an array that doesn't contain it", () => {
        const financialAccount: IFinancialAccount = sampleWithRequiredData;
        const financialAccountCollection: IFinancialAccount[] = [sampleWithPartialData];
        expectedResult = service.addFinancialAccountToCollectionIfMissing(financialAccountCollection, financialAccount);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(financialAccount);
      });

      it('should add only unique FinancialAccount to an array', () => {
        const financialAccountArray: IFinancialAccount[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const financialAccountCollection: IFinancialAccount[] = [sampleWithRequiredData];
        expectedResult = service.addFinancialAccountToCollectionIfMissing(financialAccountCollection, ...financialAccountArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const financialAccount: IFinancialAccount = sampleWithRequiredData;
        const financialAccount2: IFinancialAccount = sampleWithPartialData;
        expectedResult = service.addFinancialAccountToCollectionIfMissing([], financialAccount, financialAccount2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(financialAccount);
        expect(expectedResult).toContain(financialAccount2);
      });

      it('should accept null and undefined values', () => {
        const financialAccount: IFinancialAccount = sampleWithRequiredData;
        expectedResult = service.addFinancialAccountToCollectionIfMissing([], null, financialAccount, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(financialAccount);
      });

      it('should return initial array if no FinancialAccount is added', () => {
        const financialAccountCollection: IFinancialAccount[] = [sampleWithRequiredData];
        expectedResult = service.addFinancialAccountToCollectionIfMissing(financialAccountCollection, undefined, null);
        expect(expectedResult).toEqual(financialAccountCollection);
      });
    });

    describe('compareFinancialAccount', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFinancialAccount(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFinancialAccount(entity1, entity2);
        const compareResult2 = service.compareFinancialAccount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFinancialAccount(entity1, entity2);
        const compareResult2 = service.compareFinancialAccount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFinancialAccount(entity1, entity2);
        const compareResult2 = service.compareFinancialAccount(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
