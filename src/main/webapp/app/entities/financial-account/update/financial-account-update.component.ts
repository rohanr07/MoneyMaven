import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FinancialAccountFormService, FinancialAccountFormGroup } from './financial-account-form.service';
import { IFinancialAccount } from '../financial-account.model';
import { FinancialAccountService } from '../service/financial-account.service';
import { AccountType } from 'app/entities/enumerations/account-type.model';

@Component({
  selector: 'jhi-financial-account-update',
  templateUrl: './financial-account-update.component.html',
})
export class FinancialAccountUpdateComponent implements OnInit {
  isSaving = false;
  financialAccount: IFinancialAccount | null = null;
  accountTypeValues = Object.keys(AccountType);

  editForm: FinancialAccountFormGroup = this.financialAccountFormService.createFinancialAccountFormGroup();

  constructor(
    protected financialAccountService: FinancialAccountService,
    protected financialAccountFormService: FinancialAccountFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ financialAccount }) => {
      this.financialAccount = financialAccount;
      if (financialAccount) {
        this.updateForm(financialAccount);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const financialAccount = this.financialAccountFormService.getFinancialAccount(this.editForm);
    if (financialAccount.id !== null) {
      this.subscribeToSaveResponse(this.financialAccountService.update(financialAccount));
    } else {
      this.subscribeToSaveResponse(this.financialAccountService.create(financialAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinancialAccount>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(financialAccount: IFinancialAccount): void {
    this.financialAccount = financialAccount;
    this.financialAccountFormService.resetForm(this.editForm, financialAccount);
  }
}
