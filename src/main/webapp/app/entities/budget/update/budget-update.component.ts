import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BudgetFormService, BudgetFormGroup } from './budget-form.service';
import { IBudget } from '../budget.model';
import { BudgetService } from '../service/budget.service';

@Component({
  selector: 'jhi-budget-update',
  templateUrl: './budget-update.component.html',
})
export class BudgetUpdateComponent implements OnInit {
  isSaving = false;
  budget: IBudget | null = null;

  editForm: BudgetFormGroup = this.budgetFormService.createBudgetFormGroup();

  /*months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];*/

  constructor(
    protected budgetService: BudgetService,
    protected budgetFormService: BudgetFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ budget }) => {
      this.budget = budget;
      if (budget) {
        this.updateForm(budget);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    console.log('Save button clicked');
    this.isSaving = true;
    const budget = this.budgetFormService.getBudget(this.editForm);
    if (budget.id !== null) {
      console.log('Updating budget');
      this.subscribeToSaveResponse(this.budgetService.update(budget));
    } else {
      console.log('Creating budget');
      console.log(budget);
      this.subscribeToSaveResponse(this.budgetService.create(budget));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBudget>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(budget: IBudget): void {
    this.budget = budget;
    this.budgetFormService.resetForm(this.editForm, budget);
    this.editForm.get('amountRemaining')?.setValue(this.amountRemaining);
  }

  /*getAmountRemaining(): number {
    const totalBudget = this.editForm.get('totalBudget')?.value;
    const totalSpent = this.editForm.get('totalSpent')?.value;
    // @ts-ignore
    const amountRemaining = totalBudget - totalSpent;

    console.log('Total Budget:', totalBudget);
    console.log('Total Spent:', totalSpent);
    console.log('Amount Remaining:', amountRemaining);

    return amountRemaining;
  }*/

  get amountRemaining(): number {
    const totalBudget = this.editForm.get('totalBudget')?.value ?? 0;
    const totalSpent = this.editForm.get('totalSpent')?.value ?? 0;
    return totalBudget - totalSpent;
  }
}
