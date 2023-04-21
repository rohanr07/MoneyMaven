import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../expenses.test-samples';

import { ExpensesFormService } from './expenses-form.service';

describe('Expenses Form Service', () => {
  let service: ExpensesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensesFormService);
  });

  describe('Service methods', () => {
    describe('createExpensesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExpensesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            expenseType: expect.any(Object),
            amount: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IExpenses should create a new form with FormGroup', () => {
        const formGroup = service.createExpensesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            expenseType: expect.any(Object),
            amount: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getExpenses', () => {
      it('should return NewExpenses for default Expenses initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createExpensesFormGroup(sampleWithNewData);

        const expenses = service.getExpenses(formGroup) as any;

        expect(expenses).toMatchObject(sampleWithNewData);
      });

      it('should return NewExpenses for empty Expenses initial value', () => {
        const formGroup = service.createExpensesFormGroup();

        const expenses = service.getExpenses(formGroup) as any;

        expect(expenses).toMatchObject({});
      });

      it('should return IExpenses', () => {
        const formGroup = service.createExpensesFormGroup(sampleWithRequiredData);

        const expenses = service.getExpenses(formGroup) as any;

        expect(expenses).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExpenses should not enable id FormControl', () => {
        const formGroup = service.createExpensesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExpenses should disable id FormControl', () => {
        const formGroup = service.createExpensesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
