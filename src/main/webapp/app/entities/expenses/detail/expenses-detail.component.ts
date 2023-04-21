import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExpenses } from '../expenses.model';

@Component({
  selector: 'jhi-expenses-detail',
  templateUrl: './expenses-detail.component.html',
})
export class ExpensesDetailComponent implements OnInit {
  expenses: IExpenses | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ expenses }) => {
      this.expenses = expenses;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
