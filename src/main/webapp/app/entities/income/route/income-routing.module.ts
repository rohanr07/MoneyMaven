import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IncomeComponent } from '../list/income.component';
import { IncomeDetailComponent } from '../detail/income-detail.component';
import { IncomeUpdateComponent } from '../update/income-update.component';
import { IncomeRoutingResolveService } from './income-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const incomeRoute: Routes = [
  {
    path: '',
    component: IncomeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IncomeDetailComponent,
    resolve: {
      income: IncomeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IncomeUpdateComponent,
    resolve: {
      income: IncomeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IncomeUpdateComponent,
    resolve: {
      income: IncomeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(incomeRoute)],
  exports: [RouterModule],
})
export class IncomeRoutingModule {}
