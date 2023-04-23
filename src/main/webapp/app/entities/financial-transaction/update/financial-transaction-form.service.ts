import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFinancialTransaction, NewFinancialTransaction } from '../financial-transaction.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFinancialTransaction for edit and NewFinancialTransactionFormGroupInput for create.
 */
type FinancialTransactionFormGroupInput = IFinancialTransaction | PartialWithRequiredKeyOf<NewFinancialTransaction>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFinancialTransaction | NewFinancialTransaction> = Omit<T, 'date'> & {
  date?: string | null;
};

type FinancialTransactionFormRawValue = FormValueOf<IFinancialTransaction>;

type NewFinancialTransactionFormRawValue = FormValueOf<NewFinancialTransaction>;

type FinancialTransactionFormDefaults = Pick<NewFinancialTransaction, 'id' | 'date'>;

type FinancialTransactionFormGroupContent = {
  id: FormControl<FinancialTransactionFormRawValue['id'] | NewFinancialTransaction['id']>;
  description: FormControl<FinancialTransactionFormRawValue['description']>;
  amount: FormControl<FinancialTransactionFormRawValue['amount']>;
  date: FormControl<FinancialTransactionFormRawValue['date']>;
  account: FormControl<FinancialTransactionFormRawValue['account']>;
  category: FormControl<FinancialTransactionFormRawValue['category']>;
  budget: FormControl<FinancialTransactionFormRawValue['budget']>;
};

export type FinancialTransactionFormGroup = FormGroup<FinancialTransactionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FinancialTransactionFormService {
  createFinancialTransactionFormGroup(
    financialTransaction: FinancialTransactionFormGroupInput = { id: null }
  ): FinancialTransactionFormGroup {
    const financialTransactionRawValue = this.convertFinancialTransactionToFinancialTransactionRawValue({
      ...this.getFormDefaults(),
      ...financialTransaction,
    });
    return new FormGroup<FinancialTransactionFormGroupContent>({
      id: new FormControl(
        { value: financialTransactionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(financialTransactionRawValue.description, {
        validators: [Validators.required],
      }),
      amount: new FormControl(financialTransactionRawValue.amount, {
        validators: [Validators.required],
      }),
      date: new FormControl(financialTransactionRawValue.date, {
        validators: [Validators.required],
      }),
      account: new FormControl(financialTransactionRawValue.account),
      category: new FormControl(financialTransactionRawValue.category),
      budget: new FormControl(financialTransactionRawValue.budget),
    });
  }

  getFinancialTransaction(form: FinancialTransactionFormGroup): IFinancialTransaction | NewFinancialTransaction {
    return this.convertFinancialTransactionRawValueToFinancialTransaction(
      form.getRawValue() as FinancialTransactionFormRawValue | NewFinancialTransactionFormRawValue
    );
  }

  resetForm(form: FinancialTransactionFormGroup, financialTransaction: FinancialTransactionFormGroupInput): void {
    const financialTransactionRawValue = this.convertFinancialTransactionToFinancialTransactionRawValue({
      ...this.getFormDefaults(),
      ...financialTransaction,
    });
    form.reset(
      {
        ...financialTransactionRawValue,
        id: { value: financialTransactionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FinancialTransactionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertFinancialTransactionRawValueToFinancialTransaction(
    rawFinancialTransaction: FinancialTransactionFormRawValue | NewFinancialTransactionFormRawValue
  ): IFinancialTransaction | NewFinancialTransaction {
    return {
      ...rawFinancialTransaction,
      date: dayjs(rawFinancialTransaction.date, DATE_TIME_FORMAT),
    };
  }

  private convertFinancialTransactionToFinancialTransactionRawValue(
    financialTransaction: IFinancialTransaction | (Partial<NewFinancialTransaction> & FinancialTransactionFormDefaults)
  ): FinancialTransactionFormRawValue | PartialWithRequiredKeyOf<NewFinancialTransactionFormRawValue> {
    return {
      ...financialTransaction,
      date: financialTransaction.date ? financialTransaction.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
