import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AnalyticsFormService, AnalyticsFormGroup } from './analytics-form.service';
import { IAnalytics } from '../analytics.model';
import { AnalyticsService } from '../service/analytics.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Transaction } from 'app/entities/enumerations/transaction.model';

@Component({
  selector: 'jhi-analytics-update',
  templateUrl: './analytics-update.component.html',
})
export class AnalyticsUpdateComponent implements OnInit {
  isSaving = false;
  analytics: IAnalytics | null = null;
  transactionValues = Object.keys(Transaction);

  usersSharedCollection: IUser[] = [];

  editForm: AnalyticsFormGroup = this.analyticsFormService.createAnalyticsFormGroup();

  constructor(
    protected analyticsService: AnalyticsService,
    protected analyticsFormService: AnalyticsFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ analytics }) => {
      this.analytics = analytics;
      if (analytics) {
        this.updateForm(analytics);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const analytics = this.analyticsFormService.getAnalytics(this.editForm);
    if (analytics.id !== null) {
      this.subscribeToSaveResponse(this.analyticsService.update(analytics));
    } else {
      this.subscribeToSaveResponse(this.analyticsService.create(analytics));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnalytics>>): void {
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

  protected updateForm(analytics: IAnalytics): void {
    this.analytics = analytics;
    this.analyticsFormService.resetForm(this.editForm, analytics);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, analytics.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.analytics?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
