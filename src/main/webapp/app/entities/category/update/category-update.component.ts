import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CategoryFormService, CategoryFormGroup } from './category-form.service';
import { ICategory } from '../category.model';
import { CategoryService } from '../service/category.service';
import { IBudget } from 'app/entities/budget/budget.model';
import { BudgetService } from 'app/entities/budget/service/budget.service';

@Component({
  selector: 'jhi-category-update',
  templateUrl: './category-update.component.html',
})
export class CategoryUpdateComponent implements OnInit {
  isSaving = false;
  category: ICategory | null = null;

  budgetsSharedCollection: IBudget[] = [];

  editForm: CategoryFormGroup = this.categoryFormService.createCategoryFormGroup();

  constructor(
    protected categoryService: CategoryService,
    protected categoryFormService: CategoryFormService,
    protected budgetService: BudgetService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBudget = (o1: IBudget | null, o2: IBudget | null): boolean => this.budgetService.compareBudget(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ category }) => {
      this.category = category;
      if (category) {
        this.updateForm(category);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const category = this.categoryFormService.getCategory(this.editForm);
    if (category.id !== null) {
      this.subscribeToSaveResponse(this.categoryService.update(category));
    } else {
      this.subscribeToSaveResponse(this.categoryService.create(category));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategory>>): void {
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

  protected updateForm(category: ICategory): void {
    this.category = category;
    this.categoryFormService.resetForm(this.editForm, category);

    this.budgetsSharedCollection = this.budgetService.addBudgetToCollectionIfMissing<IBudget>(
      this.budgetsSharedCollection,
      category.budget,
      category.budget
    );
  }

  protected loadRelationshipsOptions(): void {
    this.budgetService
      .query()
      .pipe(map((res: HttpResponse<IBudget[]>) => res.body ?? []))
      .pipe(
        map((budgets: IBudget[]) =>
          this.budgetService.addBudgetToCollectionIfMissing<IBudget>(budgets, this.category?.budget, this.category?.budget)
        )
      )
      .subscribe((budgets: IBudget[]) => (this.budgetsSharedCollection = budgets));
  }
}
