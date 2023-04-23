import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFinancialAccount, NewFinancialAccount } from '../financial-account.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFinancialAccount for edit and NewFinancialAccountFormGroupInput for create.
 */
type FinancialAccountFormGroupInput = IFinancialAccount | PartialWithRequiredKeyOf<NewFinancialAccount>;

type FinancialAccountFormDefaults = Pick<NewFinancialAccount, 'id'>;

type FinancialAccountFormGroupContent = {
  id: FormControl<IFinancialAccount['id'] | NewFinancialAccount['id']>;
  name: FormControl<IFinancialAccount['name']>;
  balance: FormControl<IFinancialAccount['balance']>;
  type: FormControl<IFinancialAccount['type']>;
  description: FormControl<IFinancialAccount['description']>;
};

export type FinancialAccountFormGroup = FormGroup<FinancialAccountFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FinancialAccountFormService {
  createFinancialAccountFormGroup(financialAccount: FinancialAccountFormGroupInput = { id: null }): FinancialAccountFormGroup {
    const financialAccountRawValue = {
      ...this.getFormDefaults(),
      ...financialAccount,
    };
    return new FormGroup<FinancialAccountFormGroupContent>({
      id: new FormControl(
        { value: financialAccountRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(financialAccountRawValue.name, {
        validators: [Validators.required],
      }),
      balance: new FormControl(financialAccountRawValue.balance, {
        validators: [Validators.required],
      }),
      type: new FormControl(financialAccountRawValue.type, {
        validators: [Validators.required],
      }),
      description: new FormControl(financialAccountRawValue.description),
    });
  }

  getFinancialAccount(form: FinancialAccountFormGroup): IFinancialAccount | NewFinancialAccount {
    return form.getRawValue() as IFinancialAccount | NewFinancialAccount;
  }

  resetForm(form: FinancialAccountFormGroup, financialAccount: FinancialAccountFormGroupInput): void {
    const financialAccountRawValue = { ...this.getFormDefaults(), ...financialAccount };
    form.reset(
      {
        ...financialAccountRawValue,
        id: { value: financialAccountRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FinancialAccountFormDefaults {
    return {
      id: null,
    };
  }
}
