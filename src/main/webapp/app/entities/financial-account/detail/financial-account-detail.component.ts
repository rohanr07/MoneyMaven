import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinancialAccount } from '../financial-account.model';

@Component({
  selector: 'jhi-financial-account-detail',
  templateUrl: './financial-account-detail.component.html',
})
export class FinancialAccountDetailComponent implements OnInit {
  financialAccount: IFinancialAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ financialAccount }) => {
      this.financialAccount = financialAccount;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
