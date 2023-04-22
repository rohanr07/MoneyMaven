import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIncome } from '../income.model';

@Component({
  selector: 'jhi-income-detail',
  templateUrl: './income-detail.component.html',
})
export class IncomeDetailComponent implements OnInit {
  income: IIncome | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ income }) => {
      this.income = income;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
