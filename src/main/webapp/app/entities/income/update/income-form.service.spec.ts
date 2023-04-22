import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../income.test-samples';

import { IncomeFormService } from './income-form.service';

describe('Income Form Service', () => {
  let service: IncomeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeFormService);
  });

  describe('Service methods', () => {
    describe('createIncomeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createIncomeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            companyName: expect.any(Object),
            date: expect.any(Object),
            currency: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IIncome should create a new form with FormGroup', () => {
        const formGroup = service.createIncomeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            companyName: expect.any(Object),
            date: expect.any(Object),
            currency: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getIncome', () => {
      it('should return NewIncome for default Income initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createIncomeFormGroup(sampleWithNewData);

        const income = service.getIncome(formGroup) as any;

        expect(income).toMatchObject(sampleWithNewData);
      });

      it('should return NewIncome for empty Income initial value', () => {
        const formGroup = service.createIncomeFormGroup();

        const income = service.getIncome(formGroup) as any;

        expect(income).toMatchObject({});
      });

      it('should return IIncome', () => {
        const formGroup = service.createIncomeFormGroup(sampleWithRequiredData);

        const income = service.getIncome(formGroup) as any;

        expect(income).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IIncome should not enable id FormControl', () => {
        const formGroup = service.createIncomeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewIncome should disable id FormControl', () => {
        const formGroup = service.createIncomeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
