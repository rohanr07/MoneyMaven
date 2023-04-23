import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../financial-transaction.test-samples';

import { FinancialTransactionFormService } from './financial-transaction-form.service';

describe('FinancialTransaction Form Service', () => {
  let service: FinancialTransactionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialTransactionFormService);
  });

  describe('Service methods', () => {
    describe('createFinancialTransactionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFinancialTransactionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            amount: expect.any(Object),
            date: expect.any(Object),
            account: expect.any(Object),
            category: expect.any(Object),
            budget: expect.any(Object),
          })
        );
      });

      it('passing IFinancialTransaction should create a new form with FormGroup', () => {
        const formGroup = service.createFinancialTransactionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            amount: expect.any(Object),
            date: expect.any(Object),
            account: expect.any(Object),
            category: expect.any(Object),
            budget: expect.any(Object),
          })
        );
      });
    });

    describe('getFinancialTransaction', () => {
      it('should return NewFinancialTransaction for default FinancialTransaction initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFinancialTransactionFormGroup(sampleWithNewData);

        const financialTransaction = service.getFinancialTransaction(formGroup) as any;

        expect(financialTransaction).toMatchObject(sampleWithNewData);
      });

      it('should return NewFinancialTransaction for empty FinancialTransaction initial value', () => {
        const formGroup = service.createFinancialTransactionFormGroup();

        const financialTransaction = service.getFinancialTransaction(formGroup) as any;

        expect(financialTransaction).toMatchObject({});
      });

      it('should return IFinancialTransaction', () => {
        const formGroup = service.createFinancialTransactionFormGroup(sampleWithRequiredData);

        const financialTransaction = service.getFinancialTransaction(formGroup) as any;

        expect(financialTransaction).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFinancialTransaction should not enable id FormControl', () => {
        const formGroup = service.createFinancialTransactionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFinancialTransaction should disable id FormControl', () => {
        const formGroup = service.createFinancialTransactionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
