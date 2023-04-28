import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAnalytics, NewAnalytics } from '../analytics.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAnalytics for edit and NewAnalyticsFormGroupInput for create.
 */
type AnalyticsFormGroupInput = IAnalytics | PartialWithRequiredKeyOf<NewAnalytics>;

type AnalyticsFormDefaults = Pick<NewAnalytics, 'id'>;

type AnalyticsFormGroupContent = {
  id: FormControl<IAnalytics['id'] | NewAnalytics['id']>;
  transaction: FormControl<IAnalytics['transaction']>;
  amount: FormControl<IAnalytics['amount']>;
  date: FormControl<IAnalytics['date']>;
  user: FormControl<IAnalytics['user']>;
};

export type AnalyticsFormGroup = FormGroup<AnalyticsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AnalyticsFormService {
  createAnalyticsFormGroup(analytics: AnalyticsFormGroupInput = { id: null }): AnalyticsFormGroup {
    const analyticsRawValue = {
      ...this.getFormDefaults(),
      ...analytics,
    };
    return new FormGroup<AnalyticsFormGroupContent>({
      id: new FormControl(
        { value: analyticsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      transaction: new FormControl(analyticsRawValue.transaction),
      amount: new FormControl(analyticsRawValue.amount),
      date: new FormControl(analyticsRawValue.date),
      user: new FormControl(analyticsRawValue.user),
    });
  }

  getAnalytics(form: AnalyticsFormGroup): IAnalytics | NewAnalytics {
    return form.getRawValue() as IAnalytics | NewAnalytics;
  }

  resetForm(form: AnalyticsFormGroup, analytics: AnalyticsFormGroupInput): void {
    const analyticsRawValue = { ...this.getFormDefaults(), ...analytics };
    form.reset(
      {
        ...analyticsRawValue,
        id: { value: analyticsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AnalyticsFormDefaults {
    return {
      id: null,
    };
  }
}
