import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IncomeFormService, IncomeFormGroup } from './income-form.service';
import { IIncome } from '../income.model';
import { IncomeService } from '../service/income.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Currency } from 'app/entities/enumerations/currency.model';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-income-update',
  templateUrl: './income-update.component.html',
})
export class IncomeUpdateComponent implements OnInit {
  isSaving = false;
  income: IIncome | null = null;
  currencyValues = Object.keys(Currency);
  currentUser: any;

  usersSharedCollection: IUser[] = [];

  editForm: IncomeFormGroup = this.incomeFormService.createIncomeFormGroup();

  constructor(
    protected incomeService: IncomeService,
    protected incomeFormService: IncomeFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ income }) => {
      this.income = income;
      if (income) {
        this.updateForm(income);
      }

      this.loadRelationshipsOptions();
      this.accountService.identity().subscribe(account => {
        this.currentUser = account;
        this.usersSharedCollection = [this.currentUser];
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const income = this.incomeFormService.getIncome(this.editForm);
    if (income.id !== null) {
      this.subscribeToSaveResponse(this.incomeService.update(income));
    } else {
      this.subscribeToSaveResponse(this.incomeService.create(income));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIncome>>): void {
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

  protected updateForm(income: IIncome): void {
    this.income = income;
    this.incomeFormService.resetForm(this.editForm, income);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, income.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.income?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
