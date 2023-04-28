import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild, ElementRef } from '@angular/core';

import { IAnalytics } from '../analytics.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, AnalyticsService } from '../service/analytics.service';
import { AnalyticsDeleteDialogComponent } from '../delete/analytics-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { Chart, ChartType, registerables } from 'chart.js';
import { ExpensesService } from '../../expenses/service/expenses.service';
import { IncomeService } from '../../income/service/income.service';
import { IncomeComponent } from '../../income/list/income.component';
import { INFINITY } from 'chart.js/helpers';
import { AccountService } from '../../../core/auth/account.service';
import _default from 'chart.js/dist/core/core.interaction';
import dataset = _default.modes.dataset;

@Component({
  selector: 'jhi-analytics',
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  analytics?: IAnalytics[];
  // chartCanvas: any;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('opera', { static: true }) opera!: ElementRef;
  @ViewChild('line', { static: true }) line!: ElementRef;
  @ViewChild('bar', { static: true }) bar!: ElementRef;
  @ViewChild('chartdiv', { static: true }) chartDiv!: ElementRef;
  @ViewChild('focusdiv', { static: true }) focusDiv!: ElementRef;
  @ViewChild('pieChart', { static: true }) pieChartDiv!: ElementRef;

  public lineChartType: ChartType = 'line';
  isLoading = false;
  no_of_points = 10000000;
  totalMonthlyIncome: number = 0;
  totalMonthlyExpenses: number = 0;
  profit_loss_statement: String = '';

  currentUser: any;

  predicate = 'id';
  ascending = true;

  constructor(
    protected expensesService: ExpensesService,
    protected incomeService: IncomeService,
    private renderer: Renderer2,
    protected accountService: AccountService,

    protected analyticsService: AnalyticsService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {
    Chart.register(...registerables);
  }

  trackId = (_index: number, item: IAnalytics): number => this.analyticsService.getAnalyticsIdentifier(item);

  drawpieChart() {
    const data = {
      labels: ['Expenses', 'Income'],
      datasets: [
        {
          label: 'Doughnut',
          data: [this.totalMonthlyExpenses, this.totalMonthlyIncome],
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgb(35,255,0)'],
          hoverOffset: 4,
        },
      ],
    };

    const canvas = document.createElement('canvas');
    canvas.style.height = '100%';
    canvas.style.width = '100%';

    // this.chartDiv.nativeElement.remove();
    if (this.pieChartDiv.nativeElement.children.length == 1) {
      this.pieChartDiv.nativeElement.children[0].remove();
    }
    this.pieChartDiv.nativeElement.appendChild(canvas);
    canvas.getContext('2d');
    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: data,
    });
  }
  drawChart() {
    // Retrieve data from the database, for example:
    this.expensesService.getExpenses().subscribe(data => {
      data.slice(0, 5);
      // Format the data for the charting library, for example:
      this.incomeService.getIncome().subscribe(dataa => {
        dataa.slice(0, 5);

        var x = data.map(item => item.amount);
        var a = dataa.map(item => item.amount);
        var y = x.slice(0, this.no_of_points);
        var b = a.slice(0, this.no_of_points);

        var d = data.map(item => item.date);
        var e = d.slice(0, this.no_of_points);

        const chartData = {
          labels: e,
          datasets: [
            {
              label: 'Expenses',
              tension: 0.4,
              data: y,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              hoverBorderWidth: 7,

              borderWidth: 5,
              maxBarThickness: 20,
              hoverBorderColor: 'rgb(255,0,0)',

              animations: {
                tension: {
                  duration: 2000,
                  easing: 'easeInElastic',
                  from: 0.5,
                  to: 1,
                  loop: true,
                },
              },
            },
            {
              label: 'Incomes',
              data: b,
              maxBarThickness: 20,

              animations: {
                tension: {
                  duration: 2000,
                  easing: 'easeInElastic',
                  from: 0.5,
                  to: 1,
                  loop: true,
                },
              },

              backgroundColor: 'rgba(156,255,99,0.2)',
              borderColor: 'rgb(35,255,0)',
              hoverBorderColor: 'rgb(0,159,0)',
              hoverBorderWidth: 7,
              borderWidth: 5,
            },
          ],
        };

        // Create the chart using the formatted data
        const canvas = document.createElement('canvas');
        canvas.style.height = '100%';
        canvas.style.width = '100%';

        // this.chartDiv.nativeElement.remove();
        if (this.chartDiv.nativeElement.children.length == 1) {
          this.chartDiv.nativeElement.children[0].remove();
        }
        this.chartDiv.nativeElement.appendChild(canvas);
        canvas.getContext('2d');

        const chart = new Chart(canvas, {
          type: this.lineChartType,
          data: chartData,
          options: {
            backgroundColor: 'black',
            responsive: true,

            scales: {},
          },
        });
      });
    });
  }

  ngOnInit(): void {
    this.load();
    this.getTotalMonthlyIncome();
    this.getTotalMonthlyExpenses();
    this.profit_loss_statement_fn();

    this.drawChart();

    setTimeout(() => this.drawpieChart(), 100);
    this.drawpieChart();
  }

  profit_loss_statement_fn() {
    if (this.totalMonthlyIncome > this.totalMonthlyExpenses) {
      let saved = this.totalMonthlyIncome - this.totalMonthlyExpenses;
      this.profit_loss_statement = `Cheers you have saved $${saved} this Month`;
    }
    if (this.totalMonthlyIncome < this.totalMonthlyExpenses) {
      let debt = this.totalMonthlyExpenses - this.totalMonthlyIncome;
      this.profit_loss_statement = `you have lost $${debt} this Month`;
    }
  }

  line_fn() {
    this.lineChartType = 'line';
    this.drawChart();
  }
  bar_fn() {
    this.lineChartType = 'bar';
    this.drawChart();
  }

  delete(analytics: IAnalytics): void {
    const modalRef = this.modalService.open(AnalyticsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.analytics = analytics;
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
    this.analytics = this.refineData(dataFromBody);
  }

  protected refineData(data: IAnalytics[]): IAnalytics[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IAnalytics[] | null): IAnalytics[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.analyticsService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  getTotalMonthlyIncome() {
    this.accountService.identity().subscribe(account => {
      this.currentUser = account;
    });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.incomeService.getIncomeBetweenDates(startOfMonth, endOfMonth, this.currentUser.login).subscribe(incomes => {
      // @ts-ignore
      this.totalMonthlyIncome = incomes.reduce((total, income) => total + income.amount, 0);
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

  five_points_fn() {
    this.no_of_points = 5;
    this.drawChart();
  }

  ten_points_fn() {
    this.no_of_points = 10;
    this.drawChart();
  }

  twenty_points_fn() {
    this.no_of_points = 20;
    this.drawChart();
  }

  thirty_points_fn() {
    this.no_of_points = 30;
    this.drawChart();
  }

  fifty_points_fn() {
    this.no_of_points = 50;
    this.drawChart();
  }

  max_points_fn() {
    this.no_of_points = INFINITY;
  }

  protected readonly Math = Math;
}
