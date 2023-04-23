import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExpensesFormService, ExpensesFormGroup } from './expenses-form.service';
import { IExpenses } from '../expenses.model';
import { ExpensesService } from '../service/expenses.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-expenses-update',
  templateUrl: './expenses-update.component.html',
})
export class ExpensesUpdateComponent implements OnInit {
  isSaving = false;
  expenses: IExpenses | null = null;
  currentUser: any;

  usersSharedCollection: IUser[] = [];

  editForm: ExpensesFormGroup = this.expensesFormService.createExpensesFormGroup();

  constructor(
    protected expensesService: ExpensesService,
    protected expensesFormService: ExpensesFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ expenses }) => {
      this.expenses = expenses;
      if (expenses) {
        this.updateForm(expenses);
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
    const expenses = this.expensesFormService.getExpenses(this.editForm);
    if (expenses.id !== null) {
      this.subscribeToSaveResponse(this.expensesService.update(expenses));
    } else {
      this.subscribeToSaveResponse(this.expensesService.create(expenses));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExpenses>>): void {
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

  protected updateForm(expenses: IExpenses): void {
    this.expenses = expenses;
    this.expensesFormService.resetForm(this.editForm, expenses);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, expenses.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.expenses?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
