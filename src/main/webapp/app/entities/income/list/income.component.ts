import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIncome } from '../income.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType2, IncomeService } from '../service/income.service';
import { IncomeDeleteDialogComponent } from '../delete/income-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-income',
  templateUrl: './income.component.html',
})
export class IncomeComponent implements OnInit {
  incomes?: IIncome[];
  isLoading = false;
  currentUser: any;
  totalMonthlyIncome: number = 0;

  searchTerm: string = '';

  predicate = 'id';
  ascending = true;
  today: Date = new Date();

  constructor(
    protected incomeService: IncomeService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected accountService: AccountService
  ) {}

  trackId = (_index: number, item: IIncome): number => this.incomeService.getIncomeIdentifier(item);

  ngOnInit(): void {
    this.load2();
    this.accountService.identity().subscribe(account => {
      this.currentUser = account;
    });
    this.getTotalMonthlyIncome2();
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

  load2(): void {
    this.loadFromBackendWithRouteInformations2().subscribe({
      next: (res: EntityArrayResponseType2) => {
        this.onResponseSuccess2(res);
      },
    });
  }

  navigateToWithComponentValues2(): void {
    this.handleNavigation2(this.predicate, this.ascending);
  }

  filterByDescription2(searchTerm: string) {
    this.incomeService.query().subscribe(res => {
      this.incomes = res.body?.filter(income => income?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()));
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

  protected loadFromBackendWithRouteInformations2(): Observable<EntityArrayResponseType2> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute2(params, data)),
      switchMap(() => this.queryBackend2(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute2(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess2(response: EntityArrayResponseType2): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody2(response.body);
    this.incomes = this.refineData2(dataFromBody);
  }

  protected refineData2(data: IIncome[]): IIncome[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody2(data: IIncome[] | null): IIncome[] {
    return data ?? [];
  }

  protected queryBackend2(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType2> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam2(predicate, ascending),
    };
    return this.incomeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  protected getSortQueryParam2(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
