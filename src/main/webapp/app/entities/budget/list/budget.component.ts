import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBudget } from '../budget.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, BudgetService } from '../service/budget.service';
import { BudgetDeleteDialogComponent } from '../delete/budget-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-budget',
  templateUrl: './budget.component.html',
})
export class BudgetComponent implements OnInit {
  budgets?: IBudget[];
  isLoading = false;
  predicate = 'id';
  ascending = true;
  totalBudgetForMonth: number = 0;
  totalSpendingForMonth: number = 0;
  amountRemainingForMonth: number = 0;

  constructor(
    protected budgetService: BudgetService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IBudget): number => this.budgetService.getBudgetIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(budget: IBudget): void {
    const modalRef = this.modalService.open(BudgetDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.budget = budget;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        this.calculateCurrentMonthTotals();
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.budgets = this.refineData(dataFromBody);
  }

  protected refineData(data: IBudget[]): IBudget[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1)).map(budget => {
      budget.amountRemaining = (budget.totalBudget || 0) - (budget.totalSpent || 0);
      return budget;
    });
  }

  protected fillComponentAttributesFromResponseBody(data: IBudget[] | null): IBudget[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.budgetService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  formatMonth(date: dayjs.Dayjs | null | undefined): string {
    if (!date) {
      return '';
    }
    return date.format('MMMM');
  }

  private calculateCurrentMonthTotals(): void {
    this.totalBudgetForMonth = 0;
    this.totalSpendingForMonth = 0;
    this.amountRemainingForMonth = 0;

    // Check if this.budgets is defined and not null
    if (this.budgets) {
      const currentMonth = dayjs().month();
      const currentYear = dayjs().year();

      const currentMonthBudgets = this.budgets.filter(budget => {
        const budgetMonth = dayjs(budget.monthOfTheTime).month();
        const budgetYear = dayjs(budget.monthOfTheTime).year();
        return budgetMonth === currentMonth && budgetYear === currentYear;
      });

      currentMonthBudgets.forEach(budget => {
        this.totalBudgetForMonth += budget.totalBudget ?? 0;
        this.totalSpendingForMonth += budget.totalSpent ?? 0;
      });

      this.amountRemainingForMonth = this.totalBudgetForMonth - this.totalSpendingForMonth;
    }
  }
}
