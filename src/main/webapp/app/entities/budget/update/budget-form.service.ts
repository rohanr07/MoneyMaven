import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBudget, NewBudget } from '../budget.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBudget for edit and NewBudgetFormGroupInput for create.
 */
type BudgetFormGroupInput = IBudget | PartialWithRequiredKeyOf<NewBudget>;

type BudgetFormDefaults = Pick<NewBudget, 'id'>;

type BudgetFormGroupContent = {
  id: FormControl<IBudget['id'] | NewBudget['id']>;
  budgetId: FormControl<IBudget['budgetId']>;
  monthOfTheTime: FormControl<IBudget['monthOfTheTime']>;
  totalBudget: FormControl<IBudget['totalBudget']>;
  totalSpent: FormControl<IBudget['totalSpent']>;
  amountRemaining: FormControl<IBudget['amountRemaining']>;
};

export type BudgetFormGroup = FormGroup<BudgetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BudgetFormService {
  createBudgetFormGroup(budget: BudgetFormGroupInput = { id: null }): BudgetFormGroup {
    const budgetRawValue = {
      ...this.getFormDefaults(),
      ...budget,
    };
    return new FormGroup<BudgetFormGroupContent>({
      id: new FormControl(
        { value: budgetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      budgetId: new FormControl(budgetRawValue.budgetId),
      monthOfTheTime: new FormControl(budgetRawValue.monthOfTheTime, {
        validators: [Validators.required],
      }),
      totalBudget: new FormControl(budgetRawValue.totalBudget, {
        validators: [Validators.required],
      }),
      totalSpent: new FormControl(budgetRawValue.totalSpent, {
        validators: [Validators.required],
      }),
      amountRemaining: new FormControl(budgetRawValue.amountRemaining, { validators: [Validators.min(0)] }),
    });
  }

  getBudget(form: BudgetFormGroup): IBudget | NewBudget {
    return form.getRawValue() as IBudget | NewBudget;
  }

  resetForm(form: BudgetFormGroup, budget: BudgetFormGroupInput): void {
    const budgetRawValue = { ...this.getFormDefaults(), ...budget };
    form.reset(
      {
        ...budgetRawValue,
        id: { value: budgetRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BudgetFormDefaults {
    return {
      id: null,
    };
  }
}
