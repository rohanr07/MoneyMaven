import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExpenses, NewExpenses } from '../expenses.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExpenses for edit and NewExpensesFormGroupInput for create.
 */
type ExpensesFormGroupInput = IExpenses | PartialWithRequiredKeyOf<NewExpenses>;

type ExpensesFormDefaults = Pick<NewExpenses, 'id'>;

type ExpensesFormGroupContent = {
  id: FormControl<IExpenses['id'] | NewExpenses['id']>;
  expenseType: FormControl<IExpenses['expenseType']>;
  amount: FormControl<IExpenses['amount']>;
  description: FormControl<IExpenses['description']>;
  date: FormControl<IExpenses['date']>;
  user: FormControl<IExpenses['user']>;
};

export type ExpensesFormGroup = FormGroup<ExpensesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExpensesFormService {
  createExpensesFormGroup(expenses: ExpensesFormGroupInput = { id: null }): ExpensesFormGroup {
    const expensesRawValue = {
      ...this.getFormDefaults(),
      ...expenses,
    };
    return new FormGroup<ExpensesFormGroupContent>({
      id: new FormControl(
        { value: expensesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      expenseType: new FormControl(expensesRawValue.expenseType, {
        validators: [Validators.required],
      }),
      amount: new FormControl(expensesRawValue.amount, {
        validators: [Validators.required, Validators.min(0)],
      }),
      description: new FormControl(expensesRawValue.description, {
        validators: [Validators.maxLength(100)],
      }),
      date: new FormControl(expensesRawValue.date),
      user: new FormControl(expensesRawValue.user),
    });
  }

  getExpenses(form: ExpensesFormGroup): IExpenses | NewExpenses {
    return form.getRawValue() as IExpenses | NewExpenses;
  }

  resetForm(form: ExpensesFormGroup, expenses: ExpensesFormGroupInput): void {
    const expensesRawValue = { ...this.getFormDefaults(), ...expenses };
    form.reset(
      {
        ...expensesRawValue,
        id: { value: expensesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExpensesFormDefaults {
    return {
      id: null,
    };
  }
}
