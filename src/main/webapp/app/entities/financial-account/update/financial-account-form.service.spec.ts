import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../financial-account.test-samples';

import { FinancialAccountFormService } from './financial-account-form.service';

describe('FinancialAccount Form Service', () => {
  let service: FinancialAccountFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialAccountFormService);
  });

  describe('Service methods', () => {
    describe('createFinancialAccountFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFinancialAccountFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            balance: expect.any(Object),
            type: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing IFinancialAccount should create a new form with FormGroup', () => {
        const formGroup = service.createFinancialAccountFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            balance: expect.any(Object),
            type: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getFinancialAccount', () => {
      it('should return NewFinancialAccount for default FinancialAccount initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFinancialAccountFormGroup(sampleWithNewData);

        const financialAccount = service.getFinancialAccount(formGroup) as any;

        expect(financialAccount).toMatchObject(sampleWithNewData);
      });

      it('should return NewFinancialAccount for empty FinancialAccount initial value', () => {
        const formGroup = service.createFinancialAccountFormGroup();

        const financialAccount = service.getFinancialAccount(formGroup) as any;

        expect(financialAccount).toMatchObject({});
      });

      it('should return IFinancialAccount', () => {
        const formGroup = service.createFinancialAccountFormGroup(sampleWithRequiredData);

        const financialAccount = service.getFinancialAccount(formGroup) as any;

        expect(financialAccount).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFinancialAccount should not enable id FormControl', () => {
        const formGroup = service.createFinancialAccountFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFinancialAccount should disable id FormControl', () => {
        const formGroup = service.createFinancialAccountFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
