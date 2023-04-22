import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IIncome } from '../income.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../income.test-samples';

import { IncomeService, RestIncome } from './income.service';

const requireRestSample: RestIncome = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Income Service', () => {
  let service: IncomeService;
  let httpMock: HttpTestingController;
  let expectedResult: IIncome | IIncome[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IncomeService);
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

    it('should create a Income', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const income = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(income).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Income', () => {
      const income = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(income).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Income', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Income', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Income', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIncomeToCollectionIfMissing', () => {
      it('should add a Income to an empty array', () => {
        const income: IIncome = sampleWithRequiredData;
        expectedResult = service.addIncomeToCollectionIfMissing([], income);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(income);
      });

      it('should not add a Income to an array that contains it', () => {
        const income: IIncome = sampleWithRequiredData;
        const incomeCollection: IIncome[] = [
          {
            ...income,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIncomeToCollectionIfMissing(incomeCollection, income);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Income to an array that doesn't contain it", () => {
        const income: IIncome = sampleWithRequiredData;
        const incomeCollection: IIncome[] = [sampleWithPartialData];
        expectedResult = service.addIncomeToCollectionIfMissing(incomeCollection, income);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(income);
      });

      it('should add only unique Income to an array', () => {
        const incomeArray: IIncome[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const incomeCollection: IIncome[] = [sampleWithRequiredData];
        expectedResult = service.addIncomeToCollectionIfMissing(incomeCollection, ...incomeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const income: IIncome = sampleWithRequiredData;
        const income2: IIncome = sampleWithPartialData;
        expectedResult = service.addIncomeToCollectionIfMissing([], income, income2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(income);
        expect(expectedResult).toContain(income2);
      });

      it('should accept null and undefined values', () => {
        const income: IIncome = sampleWithRequiredData;
        expectedResult = service.addIncomeToCollectionIfMissing([], null, income, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(income);
      });

      it('should return initial array if no Income is added', () => {
        const incomeCollection: IIncome[] = [sampleWithRequiredData];
        expectedResult = service.addIncomeToCollectionIfMissing(incomeCollection, undefined, null);
        expect(expectedResult).toEqual(incomeCollection);
      });
    });

    describe('compareIncome', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIncome(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareIncome(entity1, entity2);
        const compareResult2 = service.compareIncome(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareIncome(entity1, entity2);
        const compareResult2 = service.compareIncome(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareIncome(entity1, entity2);
        const compareResult2 = service.compareIncome(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
