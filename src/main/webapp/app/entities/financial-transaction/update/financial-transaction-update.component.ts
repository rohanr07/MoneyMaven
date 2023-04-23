import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FinancialTransactionFormService, FinancialTransactionFormGroup } from './financial-transaction-form.service';
import { IFinancialTransaction } from '../financial-transaction.model';
import { FinancialTransactionService } from '../service/financial-transaction.service';
import { IFinancialAccount } from 'app/entities/financial-account/financial-account.model';
import { FinancialAccountService } from 'app/entities/financial-account/service/financial-account.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IBudget } from 'app/entities/budget/budget.model';
import { BudgetService } from 'app/entities/budget/service/budget.service';

@Component({
  selector: 'jhi-financial-transaction-update',
  templateUrl: './financial-transaction-update.component.html',
})
export class FinancialTransactionUpdateComponent implements OnInit {
  isSaving = false;
  financialTransaction: IFinancialTransaction | null = null;

  financialAccountsSharedCollection: IFinancialAccount[] = [];
  categoriesSharedCollection: ICategory[] = [];
  budgetsSharedCollection: IBudget[] = [];

  editForm: FinancialTransactionFormGroup = this.financialTransactionFormService.createFinancialTransactionFormGroup();

  constructor(
    protected financialTransactionService: FinancialTransactionService,
    protected financialTransactionFormService: FinancialTransactionFormService,
    protected financialAccountService: FinancialAccountService,
    protected categoryService: CategoryService,
    protected budgetService: BudgetService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFinancialAccount = (o1: IFinancialAccount | null, o2: IFinancialAccount | null): boolean =>
    this.financialAccountService.compareFinancialAccount(o1, o2);

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  compareBudget = (o1: IBudget | null, o2: IBudget | null): boolean => this.budgetService.compareBudget(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ financialTransaction }) => {
      this.financialTransaction = financialTransaction;
      if (financialTransaction) {
        this.updateForm(financialTransaction);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const financialTransaction = this.financialTransactionFormService.getFinancialTransaction(this.editForm);
    if (financialTransaction.id !== null) {
      this.subscribeToSaveResponse(this.financialTransactionService.update(financialTransaction));
    } else {
      this.subscribeToSaveResponse(this.financialTransactionService.create(financialTransaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinancialTransaction>>): void {
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

  protected updateForm(financialTransaction: IFinancialTransaction): void {
    this.financialTransaction = financialTransaction;
    this.financialTransactionFormService.resetForm(this.editForm, financialTransaction);

    this.financialAccountsSharedCollection = this.financialAccountService.addFinancialAccountToCollectionIfMissing<IFinancialAccount>(
      this.financialAccountsSharedCollection,
      financialTransaction.account
    );
    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
      this.categoriesSharedCollection,
      financialTransaction.category
    );
    this.budgetsSharedCollection = this.budgetService.addBudgetToCollectionIfMissing<IBudget>(
      this.budgetsSharedCollection,
      financialTransaction.budget
    );
  }

  protected loadRelationshipsOptions(): void {
    this.financialAccountService
      .query()
      .pipe(map((res: HttpResponse<IFinancialAccount[]>) => res.body ?? []))
      .pipe(
        map((financialAccounts: IFinancialAccount[]) =>
          this.financialAccountService.addFinancialAccountToCollectionIfMissing<IFinancialAccount>(
            financialAccounts,
            this.financialTransaction?.account
          )
        )
      )
      .subscribe((financialAccounts: IFinancialAccount[]) => (this.financialAccountsSharedCollection = financialAccounts));

    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, this.financialTransaction?.category)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));

    this.budgetService
      .query()
      .pipe(map((res: HttpResponse<IBudget[]>) => res.body ?? []))
      .pipe(
        map((budgets: IBudget[]) => this.budgetService.addBudgetToCollectionIfMissing<IBudget>(budgets, this.financialTransaction?.budget))
      )
      .subscribe((budgets: IBudget[]) => (this.budgetsSharedCollection = budgets));
  }
}
