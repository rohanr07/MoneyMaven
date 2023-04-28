import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAnalytics } from '../analytics.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../analytics.test-samples';

import { AnalyticsService, RestAnalytics } from './analytics.service';

const requireRestSample: RestAnalytics = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Analytics Service', () => {
  let service: AnalyticsService;
  let httpMock: HttpTestingController;
  let expectedResult: IAnalytics | IAnalytics[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AnalyticsService);
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

    it('should create a Analytics', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const analytics = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(analytics).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Analytics', () => {
      const analytics = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(analytics).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Analytics', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Analytics', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Analytics', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAnalyticsToCollectionIfMissing', () => {
      it('should add a Analytics to an empty array', () => {
        const analytics: IAnalytics = sampleWithRequiredData;
        expectedResult = service.addAnalyticsToCollectionIfMissing([], analytics);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(analytics);
      });

      it('should not add a Analytics to an array that contains it', () => {
        const analytics: IAnalytics = sampleWithRequiredData;
        const analyticsCollection: IAnalytics[] = [
          {
            ...analytics,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAnalyticsToCollectionIfMissing(analyticsCollection, analytics);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Analytics to an array that doesn't contain it", () => {
        const analytics: IAnalytics = sampleWithRequiredData;
        const analyticsCollection: IAnalytics[] = [sampleWithPartialData];
        expectedResult = service.addAnalyticsToCollectionIfMissing(analyticsCollection, analytics);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(analytics);
      });

      it('should add only unique Analytics to an array', () => {
        const analyticsArray: IAnalytics[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const analyticsCollection: IAnalytics[] = [sampleWithRequiredData];
        expectedResult = service.addAnalyticsToCollectionIfMissing(analyticsCollection, ...analyticsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const analytics: IAnalytics = sampleWithRequiredData;
        const analytics2: IAnalytics = sampleWithPartialData;
        expectedResult = service.addAnalyticsToCollectionIfMissing([], analytics, analytics2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(analytics);
        expect(expectedResult).toContain(analytics2);
      });

      it('should accept null and undefined values', () => {
        const analytics: IAnalytics = sampleWithRequiredData;
        expectedResult = service.addAnalyticsToCollectionIfMissing([], null, analytics, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(analytics);
      });

      it('should return initial array if no Analytics is added', () => {
        const analyticsCollection: IAnalytics[] = [sampleWithRequiredData];
        expectedResult = service.addAnalyticsToCollectionIfMissing(analyticsCollection, undefined, null);
        expect(expectedResult).toEqual(analyticsCollection);
      });
    });

    describe('compareAnalytics', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAnalytics(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAnalytics(entity1, entity2);
        const compareResult2 = service.compareAnalytics(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAnalytics(entity1, entity2);
        const compareResult2 = service.compareAnalytics(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAnalytics(entity1, entity2);
        const compareResult2 = service.compareAnalytics(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
