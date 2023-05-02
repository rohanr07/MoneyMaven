import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBudget } from '../budget.model';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-budget-detail',
  templateUrl: './budget-detail.component.html',
})
export class BudgetDetailComponent implements OnInit {
  budget: IBudget | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ budget }) => {
      this.budget = budget;
    });
  }

  previousState(): void {
    window.history.back();
  }
  formatMonth(date: dayjs.Dayjs | null | undefined): string {
    if (!date) {
      return '';
    }
    return date.format('MMMM');
  }
}
