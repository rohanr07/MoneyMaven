import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExpenses } from '../expenses.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ExpensesService } from '../service/expenses.service';
import { ExpensesDeleteDialogComponent } from '../delete/expenses-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-expenses',
  templateUrl: './expenses.component.html',
})
export class ExpensesComponent implements OnInit {
  expenses?: IExpenses[];
  searchTerm: string = '';
  currentUser: any;
  totalMonthlyExpenses: number = 0;
  isLoading = false;

  predicate = 'id';
  ascending = true;
  today: Date = new Date();

  constructor(
    protected expensesService: ExpensesService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected accountService: AccountService
  ) {}

  trackId = (_index: number, item: IExpenses): number => this.expensesService.getExpensesIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.accountService.identity().subscribe(account => {
      this.currentUser = account;
    });
    this.getTotalMonthlyExpenses();
  }

  delete(expenses: IExpenses): void {
    const modalRef = this.modalService.open(ExpensesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.expenses = expenses;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
          this.reloadPage();
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  filterByExpenseType(expenseType: string) {
    this.expensesService.query().subscribe(res => {
      this.expenses = res.body?.filter(expense => expense.expenseType === expenseType);
    });
  }

  filterByDescription(searchTerm: string) {
    this.expensesService.query().subscribe(res => {
      this.expenses = res.body?.filter(expense => expense?.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }

  getTotalMonthlyExpenses(): void {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.expensesService.getExpensesBetweenDates(startOfMonth, endOfMonth, this.currentUser.login).subscribe(expenses => {
      // @ts-ignore
      this.totalMonthlyExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    });
  }

  reloadPage() {
    window.location.href = window.location.href;
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
    this.expenses = this.refineData(dataFromBody);
  }

  protected refineData(data: IExpenses[]): IExpenses[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IExpenses[] | null): IExpenses[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.expensesService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
}
