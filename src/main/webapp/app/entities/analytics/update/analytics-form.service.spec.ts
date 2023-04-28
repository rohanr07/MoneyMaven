import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../analytics.test-samples';

import { AnalyticsFormService } from './analytics-form.service';

describe('Analytics Form Service', () => {
  let service: AnalyticsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsFormService);
  });

  describe('Service methods', () => {
    describe('createAnalyticsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAnalyticsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            transaction: expect.any(Object),
            amount: expect.any(Object),
            date: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IAnalytics should create a new form with FormGroup', () => {
        const formGroup = service.createAnalyticsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            transaction: expect.any(Object),
            amount: expect.any(Object),
            date: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getAnalytics', () => {
      it('should return NewAnalytics for default Analytics initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAnalyticsFormGroup(sampleWithNewData);

        const analytics = service.getAnalytics(formGroup) as any;

        expect(analytics).toMatchObject(sampleWithNewData);
      });

      it('should return NewAnalytics for empty Analytics initial value', () => {
        const formGroup = service.createAnalyticsFormGroup();

        const analytics = service.getAnalytics(formGroup) as any;

        expect(analytics).toMatchObject({});
      });

      it('should return IAnalytics', () => {
        const formGroup = service.createAnalyticsFormGroup(sampleWithRequiredData);

        const analytics = service.getAnalytics(formGroup) as any;

        expect(analytics).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAnalytics should not enable id FormControl', () => {
        const formGroup = service.createAnalyticsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAnalytics should disable id FormControl', () => {
        const formGroup = service.createAnalyticsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
