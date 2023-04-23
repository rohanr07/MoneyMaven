import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinancialTransaction } from '../financial-transaction.model';

@Component({
  selector: 'jhi-financial-transaction-detail',
  templateUrl: './financial-transaction-detail.component.html',
})
export class FinancialTransactionDetailComponent implements OnInit {
  financialTransaction: IFinancialTransaction | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ financialTransaction }) => {
      this.financialTransaction = financialTransaction;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
