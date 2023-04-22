import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IIncome, NewIncome } from '../income.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIncome for edit and NewIncomeFormGroupInput for create.
 */
type IncomeFormGroupInput = IIncome | PartialWithRequiredKeyOf<NewIncome>;

type IncomeFormDefaults = Pick<NewIncome, 'id'>;

type IncomeFormGroupContent = {
  id: FormControl<IIncome['id'] | NewIncome['id']>;
  amount: FormControl<IIncome['amount']>;
  companyName: FormControl<IIncome['companyName']>;
  date: FormControl<IIncome['date']>;
  currency: FormControl<IIncome['currency']>;
  user: FormControl<IIncome['user']>;
};

export type IncomeFormGroup = FormGroup<IncomeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IncomeFormService {
  createIncomeFormGroup(income: IncomeFormGroupInput = { id: null }): IncomeFormGroup {
    const incomeRawValue = {
      ...this.getFormDefaults(),
      ...income,
    };
    return new FormGroup<IncomeFormGroupContent>({
      id: new FormControl(
        { value: incomeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      amount: new FormControl(incomeRawValue.amount, {
        validators: [Validators.required],
      }),
      companyName: new FormControl(incomeRawValue.companyName, {
        validators: [Validators.required],
      }),
      date: new FormControl(incomeRawValue.date),
      currency: new FormControl(incomeRawValue.currency),
      user: new FormControl(incomeRawValue.user),
    });
  }

  getIncome(form: IncomeFormGroup): IIncome | NewIncome {
    return form.getRawValue() as IIncome | NewIncome;
  }

  resetForm(form: IncomeFormGroup, income: IncomeFormGroupInput): void {
    const incomeRawValue = { ...this.getFormDefaults(), ...income };
    form.reset(
      {
        ...incomeRawValue,
        id: { value: incomeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): IncomeFormDefaults {
    return {
      id: null,
    };
  }
}
