import { Component, OnInit, OnDestroy } from '@angular/core';
//import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

//import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExpenses } from 'app/entities/expenses/expenses.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ExpensesService } from 'app/entities/expenses/service/expenses.service';
import { ExpensesDeleteDialogComponent } from 'app/entities/expenses/delete/expenses-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
//import { AccountService } from 'app/core/auth/account.service';

//import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
//import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIncome } from 'app/entities/income/income.model';
//import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType2, IncomeService } from 'app/entities/income/service/income.service';
import { IncomeDeleteDialogComponent } from 'app/entities/income/delete/income-delete-dialog.component';
//import { SortService } from 'app/shared/sort/sort.service';
//import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  expenses?: IExpenses[];
  searchTerm: string = '';
  currentUser: any;
  totalMonthlyExpenses: number = 0;
  isLoading = false;

  predicate = 'id';
  ascending = true;
  today: Date = new Date();

  incomes?: IIncome[];
  //isLoading = false;
  //currentUser: any;
  totalMonthlyIncome: number = 0;

  //searchTerm: string = '';

  //predicate = 'id';
  //ascending = true;
  //today: Date = new Date();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,

    private router: Router,

    protected expensesService: ExpensesService,
    protected activatedRoute: ActivatedRoute,
    //public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    //protected accountService: AccountService

    protected incomeService: IncomeService //protected activatedRoute: ActivatedRoute, //public router: Router,
  ) //protected sortService: SortService,
  //protected modalService: NgbModal,
  //protected accountService: AccountService

  {}

  //trackId = (_index: number, item: IExpenses): number => this.expensesService.getExpensesIdentifier(item);
  //trackId2 = (_index: number, item: IIncome): number => this.incomeService.getIncomeIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.load2();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.accountService.identity().subscribe(account => {
      this.currentUser = account;

      this.getTotalMonthlyExpenses();
      this.getTotalMonthlyIncome2();
    });
  }

  login(): void {
    this.router.navigate(['/login']);
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
        },
      });
  }

  delete2(income: IIncome): void {
    const modalRef = this.modalService.open(IncomeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.income = income;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations2())
      )
      .subscribe({
        next: (res: EntityArrayResponseType2) => {
          this.onResponseSuccess2(res);
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

  load2(): void {
    this.loadFromBackendWithRouteInformations2().subscribe({
      next: (res: EntityArrayResponseType2) => {
        this.onResponseSuccess2(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  navigateToWithComponentValues2(): void {
    this.handleNavigation2(this.predicate, this.ascending);
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

  filterByDescription2(searchTerm: string) {
    this.incomeService.query().subscribe(res => {
      this.incomes = res.body?.filter(income => income?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()));
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

  getTotalMonthlyIncome2(): void {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.incomeService.getIncomeBetweenDates(startOfMonth, endOfMonth, this.currentUser.login).subscribe(incomes => {
      // @ts-ignore
      this.totalMonthlyIncome = incomes.reduce((total, income) => total + income.amount, 0);
    });
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected loadFromBackendWithRouteInformations2(): Observable<EntityArrayResponseType2> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute2(params, data)),
      switchMap(() => this.queryBackend2(this.predicate, this.ascending))
    );
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.expenses = this.refineData(dataFromBody);
  }

  protected onResponseSuccess2(response: EntityArrayResponseType2): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody2(response.body);
    this.incomes = this.refineData2(dataFromBody);
  }

  protected refineData(data: IExpenses[]): IExpenses[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected refineData2(data: IIncome[]): IIncome[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IExpenses[] | null): IExpenses[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseBody2(data: IIncome[] | null): IIncome[] {
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

  protected queryBackend2(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType2> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam2(predicate, ascending),
    };
    return this.incomeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected fillComponentAttributeFromRoute2(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
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

  protected handleNavigation2(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam2(predicate, ascending),
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

  protected getSortQueryParam2(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadSettings() {
    this.router.navigate(['/account/settings']);
  }
}
